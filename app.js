const STORAGE_KEY = 'saved_hotels_v1';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then((reg) => reg.update()).catch(console.error);
}

const AIRPORTS = [
  { iata: 'AYT', name: 'Antalya', lat: 36.8987, lon: 30.8005 },
  { iata: 'GZP', name: 'Gazipaşa-Alanya', lat: 36.2992, lon: 32.3006 },
  { iata: 'DLM', name: 'Dalaman', lat: 36.7131, lon: 28.7925 },
  { iata: 'BJV', name: 'Bodrum-Milas', lat: 37.2506, lon: 27.6643 },
  { iata: 'HRG', name: 'Hurghada', lat: 27.1783, lon: 33.7994 },
  { iata: 'PMI', name: 'Palma de Mallorca', lat: 39.5517, lon: 2.7388 },
  { iata: 'LPA', name: 'Gran Canaria', lat: 27.9319, lon: -15.3866 },
  { iata: 'TFS', name: 'Teneriffa Süd', lat: 28.0445, lon: -16.5725 },
  { iata: 'FAO', name: 'Faro (Algarve)', lat: 37.0144, lon: -7.9659 },
  { iata: 'HER', name: 'Heraklion (Kreta)', lat: 35.3397, lon: 25.1803 },
  { iata: 'RHO', name: 'Rhodos', lat: 36.4054, lon: 28.0862 },
  { iata: 'MUC', name: 'München', lat: 48.3538, lon: 11.7861 },
  { iata: 'FRA', name: 'Frankfurt', lat: 50.0379, lon: 8.5622 },
  { iata: 'STR', name: 'Stuttgart', lat: 48.6899, lon: 9.2219 },
  { iata: 'ZRH', name: 'Zürich', lat: 47.4647, lon: 8.5492 },
  { iata: 'VIE', name: 'Wien', lat: 48.1103, lon: 16.5697 }
];

async function fetchJsonSafe(url, options = {}, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return JSON.parse(text);
  } finally { clearTimeout(timer); }
}

async function geocodeHotel(hotelName, location) {
  const headers = { 'Accept-Language': 'de' };
  for (const q of [`${hotelName}, ${location}`, location]) {
    try {
      const data = await fetchJsonSafe(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`, { headers }, 6000);
      if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), exact: q.includes(hotelName) };
    } catch (err) {}
  }
  throw new Error('Ort konnte auf OpenStreetMap nicht gefunden werden.');
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000, toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function findNearestAirport(lat, lon) {
  let nearest = null, minDist = Infinity;
  for (const ap of AIRPORTS) {
    const d = haversineMeters(lat, lon, ap.lat, ap.lon);
    if (d < minDist) { minDist = d; nearest = { ...ap, airMeters: d }; }
  }
  return minDist <= 250000 ? nearest : null;
}

async function findNearestBeachMeters(lat, lon) {
  try {
    const d = 0.04;
    const data = await fetchJsonSafe(`https://nominatim.openstreetmap.org/search?format=json&limit=5&bounded=1&viewbox=${lon - d},${lat + d},${lon + d},${lat - d}&q=beach`, { headers: { 'Accept-Language': 'de' } }, 5000);
    if (data && data.length > 0) {
      let minMeters = Infinity;
      for (const item of data) {
        const m = haversineMeters(lat, lon, parseFloat(item.lat), parseFloat(item.lon));
        if (m < minMeters) minMeters = m;
      }
      return minMeters;
    }
  } catch (err) {}
  return null;
}

async function fetchDriveMinutes(fromLat, fromLon, toLat, toLon) {
  try {
    const data = await fetchJsonSafe(`https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=false`, {}, 6000);
    if (data.routes && data.routes.length > 0) return Math.round(data.routes[0].duration / 60);
  } catch (err) {}
  return null;
}

function normalizeRating(val, minEffective, maxScale) {
  const num = Number(val);
  if (!val || isNaN(num) || num <= 0) return null;
  return (Math.min(maxScale, Math.max(minEffective, num)) - minEffective) / (maxScale - minEffective);
}

function normalizeHolidayCheck(val) {
  const num = Number(val);
  if (!val || isNaN(num) || num <= 0) return null;
  if (num <= 6) return normalizeRating(num, 4.5, 6.0);
  return normalizeRating(num, 75, 100);
}

function computeRankedHotels(list) {
  if (!list || list.length === 0) return [];
  const validPrices = list.map((h) => Number(h.price)).filter((p) => p > 0);
  const avgPrice = validPrices.length > 0 ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length : 0;

  const scored = list.map((h, origIndex) => {
    const portalNorms = [
      normalizeRating(h.rateC24, 7.0, 10.0),
      normalizeRating(h.rateGoogle, 3.5, 5.0),
      normalizeHolidayCheck(h.rateHC),
      normalizeRating(h.rateTA, 3.5, 5.0)
    ].filter((n) => n !== null);

    const portalAvgNorm = portalNorms.length > 0 ? portalNorms.reduce((a, b) => a + b, 0) / portalNorms.length : 0.5;
    const portalPoints = portalAvgNorm * 35;
    const normalizedPortal10 = portalNorms.length > 0 ? Math.round(portalAvgNorm * 100) / 10 : null;

    const ownNorm = normalizeRating(h.rating || 4, 2.5, 5.0) ?? 0.6;
    const ownPoints = ownNorm * 20;

    let beachPoints = 0;
    if (h.beachShade === 'Überdachung') beachPoints += 6;
    else if (h.beachShade === 'Beides') beachPoints += 5;
    else if (h.beachShade === 'Schirme') beachPoints += 2;

    if (h.beachType === 'Sand') beachPoints += 5;
    else if (h.beachType === 'Sand/Kies') beachPoints += 2;

    const bm = Number(h.beachMeters);
    if (!isNaN(bm) && bm > 0) {
      if (bm <= 200) beachPoints += 4;
      else if (bm <= 500) beachPoints += 2;
    }

    const rawQuality = portalPoints + ownPoints + beachPoints;
    const price = Number(h.price);
    let premiumBonusFactor = 1.0;
    if (price > 0 && avgPrice > 0 && price > avgPrice && rawQuality >= 45) {
      const priceRatio = Math.min(1.5, price / avgPrice);
      const qualityStrength = Math.min(1, (rawQuality - 45) / 25);
      premiumBonusFactor = 1 + 0.15 * ((priceRatio - 1) / 0.5) * qualityStrength;
    }

    const totalQuality = Math.round(rawQuality * premiumBonusFactor * 10) / 10;
    let plScore = totalQuality;
    if (price > 0) plScore = totalQuality / Math.pow(price / 1000, 0.65);
    plScore = Math.round(plScore * 10) / 10;

    return { ...h, origIndex, normalizedPortal10, totalQuality, premiumBonusPct: Math.round((premiumBonusFactor - 1) * 100), plScore };
  });

  scored.sort((a, b) => b.plScore - a.plScore);
  return scored;
}

function getHotels() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
function saveHotels(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); renderList(); }
function deleteHotel(origIndex) { const list = getHotels(); list.splice(origIndex, 1); saveHotels(list); }

function editHotel(origIndex) {
  const h = getHotels()[origIndex];
  if (!h) return;
  const editEl = document.getElementById('editIndex');
  if (editEl) editEl.value = origIndex;
  document.getElementById('url').value = h.url || '';
  document.getElementById('hotelName').value = h.hotelName || '';
  document.getElementById('location').value = h.location || '';
  document.getElementById('price').value = h.price || '';
  document.getElementById('board').value = h.board || 'All Inclusive';
  const c24 = document.getElementById('rateC24'); if (c24) c24.value = h.rateC24 || '';
  const g = document.getElementById('rateGoogle'); if (g) g.value = h.rateGoogle || '';
  const hc = document.getElementById('rateHC'); if (hc) hc.value = h.rateHC || '';
  const ta = document.getElementById('rateTA'); if (ta) ta.value = h.rateTA || '';
  document.getElementById('rating').value = h.rating || '4';
  document.getElementById('playground').value = h.playground || 'Unbekannt';
  document.getElementById('beachType').value = h.beachType || 'Unbekannt';
  document.getElementById('beachShade').value = h.beachShade || 'Keine/Unbekannt';
  document.getElementById('travelDate').value = h.travelDate || '';
  document.getElementById('notes').value = h.notes || '';
  const btn = document.getElementById('saveBtn'); if (btn) btn.textContent = '💾 Änderungen & Ranking aktualisieren';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderList() {
  const ranked = computeRankedHotels(getHotels());
  const badge = document.getElementById('countBadge');
  if (badge) badge.textContent = ranked.length;
  const container = document.getElementById('hotelList');
  if (!container) return;

  if (ranked.length === 0) {
    container.innerHTML = '<p style="color:#94a3b8;font-size:0.85rem;">Noch keine Hotels gespeichert.</p>';
    return;
  }
  container.innerHTML = ranked.map((h, rankIdx) => {
    const isWinner = rankIdx === 0;
    const medal = rankIdx === 0 ? '🏆 #1 SIEGER' : rankIdx === 1 ? '🥈 #2' : rankIdx === 2 ? '🥉 #3' : `#${rankIdx + 1}`;
    const hcDisplay = h.rateHC ? (Number(h.rateHC) <= 6 ? `HC: ${h.rateHC}/6` : `HC: ${h.rateHC}%`) : null;
    const portals = [
      h.rateC24 ? `C24: ${h.rateC24}/10` : null,
      h.rateGoogle ? `G: ${h.rateGoogle}/5` : null,
      hcDisplay,
      h.rateTA ? `TA: ${h.rateTA}/5` : null
    ].filter(Boolean).join(' · ');

    return `
      <div class="item ${isWinner ? 'winner' : ''}">
        <div class="item-head">
          <div>
            <span>${medal} · ${h.hotelName} (${h.price ? h.price + ' €' : 'k. A.'})</span><br/>
            <span class="score-pill">P/L-Score: ${h.plScore} Pkt. · Quali: ${h.totalQuality}${h.normalizedPortal10 !== null ? ` · Portale: ${h.normalizedPortal10}/10` : ''}${h.premiumBonusPct > 0 ? ` (+${h.premiumBonusPct}% Bonus)` : ''}</span>
          </div>
          <div style="display:flex;gap:4px;">
            <button type="button" class="btn-small" onclick="editHotel(${h.origIndex})">✏️</button>
            <button type="button" class="btn-del" onclick="deleteHotel(${h.origIndex})">✕</button>
          </div>
        </div>
        <div class="meta">📍 ${h.location} · ✈️ ${h.airportIata || '?'} (${h.airportMinutes || '?'} Min.) · 🏖️ ${h.beachMeters !== null ? h.beachMeters + ' m' : '> 4 km'}</div>
        <div class="meta">${h.board} · ⭐ ${h.rating} ${portals ? `· 📊 ${portals}` : ''}</div>
        <div class="meta">🏖️ ${h.beachType || '?'} (${h.beachShade || '?'})</div>
      </div>`;
  }).join('');
}

const formEl = document.getElementById('hotelForm');
if (formEl) {
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveBtn'), status = document.getElementById('status');
    if (btn) btn.disabled = true;

    const editIndexEl = document.getElementById('editIndex');
    const editIndex = editIndexEl ? Number(editIndexEl.value) : -1;
    const hotelName = document.getElementById('hotelName').value.trim();
    const location = document.getElementById('location').value.trim();
    const list = getHotels(), existing = editIndex >= 0 ? list[editIndex] : null;

    try {
      let airportIata = existing?.airportIata || '', airportMinutes = existing?.airportMinutes ?? '', beachMeters = existing?.beachMeters ?? '', exactMatch = existing?.exactMatch || '';

      if (!existing || existing.hotelName !== hotelName || existing.location !== location) {
        if (status) status.textContent = '1/3 Suche Koordinaten...';
        const coords = await geocodeHotel(hotelName, location);
        if (status) status.textContent = '2/3 Suche Strand & Flughafen...';
        const airport = findNearestAirport(coords.lat, coords.lon);
        beachMeters = (await findNearestBeachMeters(coords.lat, coords.lon)) ?? '';
        exactMatch = coords.exact ? 'Exakt' : 'Ortszentrum';

        if (airport) {
          if (status) status.textContent = `3/3 Berechne Fahrtdauer nach ${airport.iata}...`;
          let mins = await fetchDriveMinutes(coords.lat, coords.lon, airport.lat, airport.lon);
          if (mins === null) mins = Math.max(5, Math.round((airport.airMeters / 1000) * 1.1));
          airportIata = `${airport.name} (${airport.iata})`;
          airportMinutes = mins;
        }
      }

      const entry = {
        datum: existing?.datum || new Date().toLocaleDateString('de-DE'),
        hotelName, location,
        price: document.getElementById('price').value.trim(),
        board: document.getElementById('board').value,
        rateC24: document.getElementById('rateC24')?.value.trim() || '',
        rateGoogle: document.getElementById('rateGoogle')?.value.trim() || '',
        rateHC: document.getElementById('rateHC')?.value.trim() || '',
        rateTA: document.getElementById('rateTA')?.value.trim() || '',
        rating: document.getElementById('rating').value,
        playground: document.getElementById('playground').value,
        beachType: document.getElementById('beachType').value,
        beachShade: document.getElementById('beachShade').value,
        travelDate: document.getElementById('travelDate').value.trim(),
        airportIata, airportMinutes, beachMeters, exactMatch,
        notes: document.getElementById('notes').value.trim(),
        url: document.getElementById('url').value.trim()
      };

      if (editIndex >= 0 && existing) list[editIndex] = entry;
      else list.unshift(entry);

      saveHotels(list);
      if (status) status.textContent = '✅ Gespeichert & Ranking berechnet!';
      e.target.reset();
      if (editIndexEl) editIndexEl.value = '-1';
      if (btn) btn.textContent = 'OSM prüfen & im Ranking speichern';
    } catch (err) {
      if (status) status.textContent = `❌ Fehler: ${err.message}`;
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}

const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
  exportBtn.addEventListener('click', async () => {
    const ranked = computeRankedHotels(getHotels());
    if (ranked.length === 0) { alert('Keine Hotels vorhanden.'); return; }
    const headers = ['Rang', 'PL_Score', 'Qualitaets_Punkte', 'Hotel', 'Ort', 'Preis_EUR', 'CHECK24_10', 'Google_5', 'HolidayCheck_Prozent', 'TripAdvisor_5', 'Check24_Link'];
    const rows = ranked.map((h, idx) => [idx + 1, h.plScore, h.totalQuality, h.hotelName, h.location, h.price, h.rateC24, h.rateGoogle, h.rateHC, h.rateTA, h.url].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'));
    const file = new File(['\uFEFF' + [headers.join(';'), ...rows].join('\n')], 'ranking.csv', { type: 'text/csv;charset=utf-8;' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ title: 'Ranking', files: [file] }); return; } catch (e) {}
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = 'ranking.csv'; a.click();
  });
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', renderList); }
else { renderList(); }