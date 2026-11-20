const STORAGE_KEY = 'saved_hotels_v1';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then((reg) => reg.update()).catch(console.error);
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

const AIRPORTS = [
  { iata: 'AYT', name: 'Antalya', lat: 36.8987, lon: 30.8005 },
  { iata: 'GZP', name: 'Gazipaşa-Alanya', lat: 36.2992, lon: 32.3006, minor: true },
  { iata: 'DLM', name: 'Dalaman', lat: 36.7131, lon: 28.7925 },
  { iata: 'BJV', name: 'Bodrum-Milas', lat: 37.2506, lon: 27.6643 },
  { iata: 'ADB', name: 'Izmir', lat: 38.2924, lon: 27.1570 },
  { iata: 'LCA', name: 'Larnaka', lat: 34.8751, lon: 33.6249 },
  { iata: 'PFO', name: 'Paphos', lat: 34.7180, lon: 32.4857 },
  { iata: 'HRG', name: 'Hurghada', lat: 27.1783, lon: 33.7994 },
  { iata: 'RMF', name: 'Marsa Alam', lat: 25.5571, lon: 34.5837 },
  { iata: 'SSH', name: 'Sharm El Sheikh', lat: 27.9773, lon: 34.3950 },
  { iata: 'DJE', name: 'Djerba-Zarzis', lat: 33.8750, lon: 10.7755 },
  { iata: 'MIR', name: 'Monastir', lat: 35.7581, lon: 10.7547 },
  { iata: 'NBE', name: 'Enfidha-Hammamet', lat: 36.0758, lon: 10.4386 },
  { iata: 'AGA', name: 'Agadir', lat: 30.3250, lon: -9.4131 },
  { iata: 'RAK', name: 'Marrakesch', lat: 31.6069, lon: -8.0363 },
  { iata: 'PMI', name: 'Palma de Mallorca', lat: 39.5517, lon: 2.7388 },
  { iata: 'IBZ', name: 'Ibiza', lat: 38.8729, lon: 1.3731 },
  { iata: 'MAH', name: 'Menorca', lat: 39.8626, lon: 4.2186 },
  { iata: 'LPA', name: 'Gran Canaria', lat: 27.9319, lon: -15.3866 },
  { iata: 'TFS', name: 'Teneriffa Süd', lat: 28.0445, lon: -16.5725 },
  { iata: 'TFN', name: 'Teneriffa Nord', lat: 28.4827, lon: -16.3415, minor: true },
  { iata: 'FUE', name: 'Fuerteventura', lat: 28.4527, lon: -13.8638 },
  { iata: 'ACE', name: 'Lanzarote', lat: 28.9455, lon: -13.6052 },
  { iata: 'SPC', name: 'La Palma', lat: 28.6265, lon: -17.7556 },
  { iata: 'AGP', name: 'Málaga', lat: 36.6749, lon: -4.4991 },
  { iata: 'ALC', name: 'Alicante', lat: 38.2822, lon: -0.5582 },
  { iata: 'BCN', name: 'Barcelona', lat: 41.2974, lon: 2.0833 },
  { iata: 'GRO', name: 'Girona', lat: 41.9010, lon: 2.7606 },
  { iata: 'XRY', name: 'Jerez de la Frontera', lat: 36.7446, lon: -6.0601 },
  { iata: 'FAO', name: 'Faro (Algarve)', lat: 37.0144, lon: -7.9659 },
  { iata: 'FNC', name: 'Funchal (Madeira)', lat: 32.6979, lon: -16.7745 },
  { iata: 'LIS', name: 'Lissabon', lat: 38.7742, lon: -9.1342 },
  { iata: 'OPO', name: 'Porto', lat: 41.2481, lon: -8.6814 },
  { iata: 'HER', name: 'Heraklion (Kreta)', lat: 35.3397, lon: 25.1803 },
  { iata: 'CHQ', name: 'Chania (Kreta)', lat: 35.5317, lon: 24.1497 },
  { iata: 'RHO', name: 'Rhodos', lat: 36.4054, lon: 28.0862 },
  { iata: 'KGS', name: 'Kos', lat: 36.7933, lon: 27.0917 },
  { iata: 'CFU', name: 'Korfu', lat: 39.6019, lon: 19.9117 },
  { iata: 'ZTH', name: 'Zakynthos', lat: 37.7509, lon: 20.8843 },
  { iata: 'SKG', name: 'Thessaloniki', lat: 40.5197, lon: 22.9709 },
  { iata: 'ATH', name: 'Athen', lat: 37.9364, lon: 23.9445 },
  { iata: 'JTR', name: 'Santorini', lat: 36.3992, lon: 25.4793 },
  { iata: 'JMK', name: 'Mykonos', lat: 37.4351, lon: 25.3481 },
  { iata: 'GPA', name: 'Araxos (Peloponnes)', lat: 38.1511, lon: 21.4256 },
  { iata: 'KLX', name: 'Kalamata', lat: 37.0683, lon: 22.0255 },
  { iata: 'VCE', name: 'Venedig', lat: 45.5053, lon: 12.3519 },
  { iata: 'VRN', name: 'Verona (Gardasee)', lat: 45.3957, lon: 10.8885 },
  { iata: 'BGY', name: 'Mailand-Bergamo', lat: 45.6739, lon: 9.7042 },
  { iata: 'OLB', name: 'Olbia (Sardinien)', lat: 40.8987, lon: 9.5176 },
  { iata: 'CAG', name: 'Cagliari (Sardinien)', lat: 39.2515, lon: 9.0543 },
  { iata: 'CTA', name: 'Catania (Sizilien)', lat: 37.4668, lon: 15.0664 },
  { iata: 'PMO', name: 'Palermo (Sizilien)', lat: 38.1760, lon: 13.0910 },
  { iata: 'SUF', name: 'Lamezia Terme', lat: 38.9054, lon: 16.2423 },
  { iata: 'BDS', name: 'Brindisi', lat: 40.6576, lon: 17.9470 },
  { iata: 'NAP', name: 'Neapel', lat: 40.8860, lon: 14.2908 },
  { iata: 'PUY', name: 'Pula (Istrien)', lat: 44.8935, lon: 13.9222 },
  { iata: 'ZAD', name: 'Zadar', lat: 44.1083, lon: 15.3467 },
  { iata: 'SPU', name: 'Split', lat: 43.5389, lon: 16.2980 },
  { iata: 'DBV', name: 'Dubrovnik', lat: 42.5614, lon: 18.2682 },
  { iata: 'BOJ', name: 'Burgas (Sonnenstrand)', lat: 42.5696, lon: 27.5152 },
  { iata: 'VAR', name: 'Varna (Goldstrand)', lat: 43.2321, lon: 27.8251 },
  { iata: 'DXB', name: 'Dubai', lat: 25.2532, lon: 55.3657 },
  { iata: 'AUH', name: 'Abu Dhabi', lat: 24.4330, lon: 54.6511 },
  { iata: 'MLE', name: 'Malé (Malediven)', lat: 4.1918, lon: 73.5291 },
  { iata: 'HKT', name: 'Phuket', lat: 8.1132, lon: 98.3169 },
  { iata: 'PUJ', name: 'Punta Cana', lat: 18.5674, lon: -68.3634 },
  { iata: 'CUN', name: 'Cancún', lat: 21.0365, lon: -86.8771 },
  { iata: 'MUC', name: 'München', lat: 48.3538, lon: 11.7861 },
  { iata: 'FRA', name: 'Frankfurt', lat: 50.0379, lon: 8.5622 },
  { iata: 'STR', name: 'Stuttgart', lat: 48.6899, lon: 9.2219 },
  { iata: 'NUE', name: 'Nürnberg', lat: 49.4987, lon: 11.0669 },
  { iata: 'FMM', name: 'Memmingen', lat: 47.9888, lon: 10.2395 },
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Nominatim-Nutzungsrichtlinie: max. 1 Anfrage pro Sekunde (https://operations.osmfoundation.org/policies/nominatim/)
let lastNominatimRequestAt = 0;
async function throttleNominatim() {
  const wait = lastNominatimRequestAt + 1100 - Date.now();
  if (wait > 0) await sleep(wait);
  lastNominatimRequestAt = Date.now();
}

async function nominatimSearch(params) {
  const query = new URLSearchParams({ format: 'jsonv2', addressdetails: '1', ...params });
  const headers = { 'Accept-Language': 'de', 'User-Agent': 'HotelSammlerPWA/1.0' };
  // Ein Netzwerkfehler wird einmal wiederholt, damit nicht unnötig auf die ungenauere Suche ausgewichen wird.
  for (let attempt = 0; attempt < 2; attempt++) {
    await throttleNominatim();
    try {
      const data = await fetchJsonSafe(`https://nominatim.openstreetmap.org/search?${query}`, { headers }, 6000);
      return Array.isArray(data) ? data : [];
    } catch (err) {}
  }
  return [];
}

// Hotels werden nur in dieser Umgebung des Zielorts gesucht (Portale fassen z. B. El Gouna oder Makadi unter "Hurghada" zusammen).
const REGION_MARGIN_DEG = 0.5;
const HOTEL_TYPES = ['hotel', 'resort', 'beach_resort', 'guest_house', 'apartment', 'hostel', 'motel', 'chalet'];

function regionBounds(place) {
  const lat = parseFloat(place.lat), lon = parseFloat(place.lon);
  const [s, n, w, e] = (place.boundingbox || [lat, lat, lon, lon]).map(Number);
  const m = REGION_MARGIN_DEG;
  return { west: Math.min(w, lon) - m, north: Math.max(n, lat) + m, east: Math.max(e, lon) + m, south: Math.min(s, lat) - m };
}

// Photon (OSM-Geocoder von Komoot) toleriert Tippfehler wie "Paradiso" statt "Paradisio"; Nominatim nicht.
const PHOTON_ACCOMMODATION_TAGS = ['tourism:hotel', 'tourism:resort', 'tourism:apartment', 'tourism:guest_house', 'tourism:motel', 'tourism:hostel', 'tourism:chalet', 'leisure:resort', 'leisure:beach_resort', 'building:hotel'];

async function photonSearch(q, bounds) {
  const params = new URLSearchParams({ q, limit: '8', lang: 'de', bbox: [bounds.west, bounds.south, bounds.east, bounds.north].join(',') });
  for (const tag of PHOTON_ACCOMMODATION_TAGS) params.append('osm_tag', tag);
  try {
    const data = await fetchJsonSafe(`https://photon.komoot.io/api/?${params}`, {}, 6000);
    return (data.features || []).filter((f) => f.properties?.name).map(({ properties: p, geometry }) => ({
      lat: geometry.coordinates[1], lon: geometry.coordinates[0], name: p.name, category: p.osm_key, type: p.osm_value,
      address: { city: p.city || p.locality || p.district, country: p.country }
    }));
  } catch (err) {
    return [];
  }
}

function toPlaceCandidate(r, center) {
  const lat = parseFloat(r.lat), lon = parseFloat(r.lon);
  const a = r.address || {};
  const name = r.name || r.display_name.split(',')[0].trim();
  const area = a.village || a.town || a.city || a.municipality || a.suburb || a.county || '';
  const label = [area, a.country].filter((part) => part && part !== name).join(', ');
  return {
    lat, lon, name, label,
    isHotel: r.category === 'tourism' || HOTEL_TYPES.includes(r.type),
    distKm: center ? haversineMeters(center.lat, center.lon, lat, lon) / 1000 : null
  };
}

// OSM führt Hotels oft doppelt (Gelände + Punkt); gleichnamige Treffer innerhalb 1 km gelten als ein Hotel.
function dedupeCandidates(candidates) {
  const result = [];
  for (const c of candidates) {
    const dupIdx = result.findIndex((o) => o.name.toLowerCase() === c.name.toLowerCase() && haversineMeters(o.lat, o.lon, c.lat, c.lon) < 1000);
    if (dupIdx === -1) result.push(c);
    else if (c.isHotel && !result[dupIdx].isHotel) result[dupIdx] = c;
  }
  return result.sort((x, y) => Number(y.isHotel) - Number(x.isHotel));
}

function shortenedHotelNames(name) {
  const words = name.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
  const out = [];
  for (let n = words.length - 1; n >= 2 && out.length < 5; n--) out.push(words.slice(0, n).join(' '));
  return out;
}

function getPlaceChooser() {
  let box = document.getElementById('placeChooser');
  if (!box) {
    box = document.createElement('div');
    box.id = 'placeChooser';
    box.className = 'chooser';
    document.getElementById('status')?.after(box);
  }
  return box;
}

// Liest Koordinaten aus Freitext oder einem langen Google-Maps-Link. Erkennt u. a.:
// "36.7712, 31.3894" · "36,7712, 31,3894" (deutsches Komma) · "36,7712 31,3894" · 36°46'16.3"N 31°23'21.8"E
function parseCoordinates(text) {
  const s = String(text || '').trim();
  const valid = (lat, lon) => (Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 ? { lat, lon } : null);

  const linkPatterns = [
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/, // genauer Ortspunkt in Google-Maps-Links
    /[?&](?:q|query|ll|destination)=(-?\d+(?:\.\d+)?)(?:,|%2C)\s*(-?\d+(?:\.\d+)?)/i,
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/ // Kartenmitte
  ];
  for (const re of linkPatterns) {
    const m = s.match(re);
    const c = m && valid(parseFloat(m[1]), parseFloat(m[2]));
    if (c) return c;
  }
  if (/https?:\/\//i.test(s)) return null;

  // Grad, Minuten, Sekunden
  const dms = s.match(/(\d+)°\s*(\d+)['′]\s*([\d.,]+)["″]?\s*([NS])[\s,;]*(\d+)°\s*(\d+)['′]\s*([\d.,]+)["″]?\s*([EOW])/i);
  if (dms) {
    const deg = (d, m, sec, hemi) => (Number(d) + Number(m) / 60 + parseFloat(sec.replace(',', '.')) / 3600) * (/[SW]/i.test(hemi) ? -1 : 1);
    return valid(deg(dms[1], dms[2], dms[3], dms[4]), deg(dms[5], dms[6], dms[7], dms[8]));
  }

  // Dezimalgrad mit Punkt oder Komma: genau zwei Zahlen im Text
  const nums = s.match(/-?\d+(?:[.,]\d+)?/g);
  if (nums && nums.length === 2) return valid(...nums.map((n) => parseFloat(n.replace(',', '.'))));
  return null;
}

function googleMapsSearchUrl(hotelName, location) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotelName} ${location}`.trim())}`;
}

// Zeigt eine Auswahl an und liefert den gewählten Kandidaten bzw. null bei Abbruch.
function choosePlace(message, candidates, center, locationLabel, hotelName = '') {
  return new Promise((resolve) => {
    const box = getPlaceChooser();
    box.replaceChildren();
    box.hidden = false;
    // Auch beim Ergänzen aus der Liste heraus sichtbar machen
    setTimeout(() => box.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
    const finish = (value) => { box.hidden = true; box.replaceChildren(); resolve(value); };

    const msg = document.createElement('div');
    msg.className = 'chooser-msg';
    msg.textContent = message;
    box.append(msg);

    const addButton = (title, subtitle, className, value) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = className;
      b.textContent = title;
      if (subtitle) {
        const sub = document.createElement('span');
        sub.className = 'chooser-sub';
        sub.textContent = subtitle;
        b.append(sub);
      }
      b.addEventListener('click', () => finish(value));
      box.append(b);
    };

    for (const c of candidates) {
      const dist = c.distKm !== null ? `${c.distKm.toFixed(1).replace('.', ',')} km von ${locationLabel}` : '';
      addButton(`${c.isHotel ? '🏨' : '📌'} ${c.name}`, [c.label, dist].filter(Boolean).join(' · '), 'btn-choice', c);
    }
    // Manuelle Koordinaten, z. B. aus Google Maps
    const manual = document.createElement('div');
    manual.className = 'chooser-manual';
    const hint = document.createElement('div');
    hint.className = 'chooser-sub';
    hint.textContent = 'Hotel nicht dabei? In Google Maps lange auf das Hotel drücken, die Koordinaten oben kopieren und hier einfügen.';
    const mapsBtn = document.createElement('button');
    mapsBtn.type = 'button';
    mapsBtn.className = 'btn-search';
    mapsBtn.textContent = '🗺️ In Google Maps suchen';
    mapsBtn.addEventListener('click', () => window.open(googleMapsSearchUrl(hotelName, locationLabel), '_blank'));
    const coordInput = document.createElement('input');
    coordInput.type = 'text';
    coordInput.placeholder = 'z. B. 36,7712, 31,3894 oder Google-Maps-Link';
    coordInput.autocomplete = 'off';
    coordInput.style.marginTop = '8px';
    const coordError = document.createElement('div');
    coordError.className = 'chooser-sub';
    const coordBtn = document.createElement('button');
    coordBtn.type = 'button';
    coordBtn.className = 'btn-choice';
    coordBtn.textContent = '📍 Diese Koordinaten verwenden';
    const fmtCoord = (n) => n.toFixed(5).replace('.', ',');
    // Sofortige Rückmeldung beim Einfügen/Tippen, was erkannt wurde
    coordInput.addEventListener('input', () => {
      const coords = parseCoordinates(coordInput.value);
      coordError.style.color = coords ? 'var(--ok)' : 'var(--muted)';
      coordError.textContent = !coordInput.value.trim() ? ''
        : coords ? `✓ Erkannt: Breite ${fmtCoord(coords.lat)}, Länge ${fmtCoord(coords.lon)}`
        : 'Noch nicht erkannt …';
    });
    coordBtn.addEventListener('click', () => {
      const coords = parseCoordinates(coordInput.value);
      if (!coords) {
        coordError.style.color = 'var(--danger)';
        coordError.textContent = 'Keine Koordinaten erkannt. Bitte Breite und Länge einfügen (z. B. 36,7712, 31,3894). Kurzlinks (maps.app.goo.gl) gehen nicht.';
        return;
      }
      finish({ ...coords, name: 'Manuelle Koordinaten', label: '', isManual: true });
    });
    manual.append(hint, mapsBtn, coordInput, coordError, coordBtn);
    box.append(manual);

    if (center) {
      addButton(`📍 Ortszentrum „${locationLabel}" verwenden`, 'Meeres- & Flughafenabstand werden dann ungenau', 'btn-choice btn-choice-warn', { ...center, isCenter: true });
    }
    addButton('Abbrechen', '', 'btn-clear', null);
  });
}

async function geocodeHotel(hotelName, location, onProgress = () => {}, alwaysConfirm = false) {
  const cleanLocation = location.normalize('NFC');
  const cleanName = hotelName.normalize('NFC');
  const asResult = (c) => ({
    lat: c.lat, lon: c.lon, exact: !c.isCenter, manual: !!c.isManual,
    matchName: c.isCenter || c.isManual ? '' : [c.name, c.label].filter(Boolean).join(', ')
  });
  const pick = async (message, candidates, center) => {
    const chosen = await choosePlace(message, candidates, center, cleanLocation, cleanName);
    if (!chosen) throw new Error('Speichern abgebrochen – Hotelname oder Ort anpassen.');
    return asResult(chosen);
  };

  onProgress('Suche Zielort...');
  const [locPlace] = await nominatimSearch({ q: cleanLocation, limit: '1' });

  if (!locPlace) {
    // Ohne Zielort-Koordinaten bleibt nur die kombinierte Freitextsuche.
    onProgress('Suche Hotel...');
    const found = dedupeCandidates((await nominatimSearch({ q: `${cleanName}, ${cleanLocation}`, limit: '8' })).map((r) => toPlaceCandidate(r, null)));
    if (found.length === 1 && !alwaysConfirm) return asResult(found[0]);
    if (found.length >= 1) return pick(`Treffer für „${cleanName}" – welches Hotel ist gemeint?`, found, null);
    return pick(`„${cleanLocation}" wurde auf OpenStreetMap nicht gefunden.`, [], null);
  }

  const center = { lat: parseFloat(locPlace.lat), lon: parseFloat(locPlace.lon) };
  const bounds = regionBounds(locPlace);
  const viewbox = [bounds.west, bounds.north, bounds.east, bounds.south].join(',');
  const searchRegion = async (q) => dedupeCandidates(
    (await nominatimSearch({ q, viewbox, bounded: '1', limit: '10' })).map((r) => toPlaceCandidate(r, center))
  );

  onProgress(`Suche Hotel in der Umgebung von ${cleanLocation}...`);
  const found = await searchRegion(cleanName);
  if (found.length === 1 && !alwaysConfirm) return asResult(found[0]);
  if (found.length >= 1) return pick(`Treffer für „${cleanName}" um ${cleanLocation} – welches Hotel ist gemeint?`, found, center);

  // Unscharfe Treffer (Tippfehler, andere Schreibweise) immer bestätigen lassen.
  onProgress('Suche ähnliche Schreibweisen...');
  const fuzzy = dedupeCandidates((await photonSearch(cleanName, bounds)).map((r) => toPlaceCandidate(r, center)));
  if (fuzzy.length > 0) return pick(`„${cleanName}" nicht exakt gefunden. Ist es einer dieser Treffer?`, fuzzy, center);

  // Portalnamen enthalten oft Zusätze ("... Resort & Spa", "... Adults Only"); gekürzte Treffer ebenfalls bestätigen lassen.
  for (const shortName of shortenedHotelNames(cleanName)) {
    onProgress(`Suche ähnliche Hotels („${shortName}")...`);
    const similar = await searchRegion(shortName);
    if (similar.length > 0) return pick(`„${cleanName}" nicht exakt gefunden. Ist es einer dieser Treffer?`, similar, center);
  }

  return pick(`„${cleanName}" wurde um ${cleanLocation} nicht auf OpenStreetMap gefunden.`, [], center);
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Kleine Flughäfen (minor) werden von Pauschalreisen selten angeflogen:
// Sie zählen nur, wenn sie weniger als halb so weit entfernt sind wie der nächste große.
const MINOR_AIRPORT_FACTOR = 2;
function findNearestAirport(lat, lon, forcedIata = '') {
  if (forcedIata) {
    const ap = AIRPORTS.find((a) => a.iata === forcedIata);
    if (ap) return { ...ap, airMeters: haversineMeters(lat, lon, ap.lat, ap.lon) };
  }
  let nearest = null, bestScore = Infinity;
  for (const ap of AIRPORTS) {
    const d = haversineMeters(lat, lon, ap.lat, ap.lon);
    if (d > 250000) continue;
    const score = d * (ap.minor ? MINOR_AIRPORT_FACTOR : 1);
    if (score < bestScore) { bestScore = score; nearest = { ...ap, airMeters: d }; }
  }
  return nearest;
}

// Auswahlliste im Formular füllen
(function fillAirportChoice() {
  const sel = document.getElementById('airportChoice');
  if (!sel) return;
  [...AIRPORTS].sort((a, b) => a.name.localeCompare(b.name, 'de')).forEach((ap) => {
    const opt = document.createElement('option');
    opt.value = ap.iata;
    opt.textContent = `${ap.name} (${ap.iata})`;
    sel.append(opt);
  });
})();

// Meeresabstand aus OSM-Vektorkacheln (OpenFreeMap, OpenMapTiles-Schema, Layer "water", class "ocean").
const OCEAN_TILEJSON_URL = 'https://tiles.openfreemap.org/planet';
const EARTH_CIRCUMFERENCE_M = 40075016.68;
let oceanTileUrlPromise = null;

function getOceanTileUrl() {
  if (!oceanTileUrlPromise) {
    // Die Kachel-URL enthält einen Versionsstempel und wird daher aus dem TileJSON gelesen.
    oceanTileUrlPromise = fetchJsonSafe(OCEAN_TILEJSON_URL, {}, 6000)
      .then((tj) => tj.tiles[0])
      .catch((err) => { oceanTileUrlPromise = null; throw err; });
  }
  return oceanTileUrlPromise;
}

// Minimaler Protobuf-Leser für Mapbox Vector Tiles
function pbfReadVarint(buf, state) {
  let result = 0, mul = 1, b;
  do {
    b = buf[state.pos++];
    result += (b & 0x7f) * mul;
    mul *= 128;
  } while (b & 0x80);
  return result;
}

function pbfReadFields(buf, start, end, onField) {
  const state = { pos: start };
  while (state.pos < end) {
    const tag = pbfReadVarint(buf, state);
    const field = Math.floor(tag / 8), wireType = tag & 7;
    if (wireType === 0) onField(field, pbfReadVarint(buf, state));
    else if (wireType === 2) {
      const len = pbfReadVarint(buf, state);
      onField(field, null, state.pos, state.pos + len);
      state.pos += len;
    } else if (wireType === 1) state.pos += 8;
    else if (wireType === 5) state.pos += 4;
    else throw new Error(`MVT: unbekannter Wire-Type ${wireType}`);
  }
}

function pbfReadPacked(buf, start, end) {
  const out = [], state = { pos: start };
  while (state.pos < end) out.push(pbfReadVarint(buf, state));
  return out;
}

function decodeMvtRings(cmds) {
  const rings = [];
  let x = 0, y = 0, ring = null;
  for (let i = 0; i < cmds.length;) {
    const id = cmds[i] & 7, count = cmds[i] >>> 3;
    i++;
    if (id === 7) {
      if (ring && ring.length) ring.push(ring[0]);
      continue;
    }
    for (let j = 0; j < count; j++) {
      x += (cmds[i] >>> 1) ^ -(cmds[i] & 1);
      y += (cmds[i + 1] >>> 1) ^ -(cmds[i + 1] & 1);
      i += 2;
      if (id === 1) { ring = [[x, y]]; rings.push(ring); }
      else ring.push([x, y]);
    }
  }
  return rings;
}

function decodeOceanTile(buf) {
  const decoder = new TextDecoder();
  const result = { extent: 4096, rings: [] };
  pbfReadFields(buf, 0, buf.length, (layerField, _v, ls, le) => {
    if (layerField !== 3) return;
    let name = '', extent = 4096;
    const keys = [], values = [], features = [];
    pbfReadFields(buf, ls, le, (f, v, s, e) => {
      if (f === 1) name = decoder.decode(buf.subarray(s, e));
      else if (f === 2) features.push([s, e]);
      else if (f === 3) keys.push(decoder.decode(buf.subarray(s, e)));
      else if (f === 4) {
        let str = null;
        pbfReadFields(buf, s, e, (vf, _vv, vs, ve) => { if (vf === 1) str = decoder.decode(buf.subarray(vs, ve)); });
        values.push(str);
      } else if (f === 5) extent = v;
    });
    if (name !== 'water') return;
    result.extent = extent;
    for (const [fs, fe] of features) {
      let tags = [], type = 0, geom = null;
      pbfReadFields(buf, fs, fe, (f, v, s, e) => {
        if (f === 2) tags = pbfReadPacked(buf, s, e);
        else if (f === 3) type = v;
        else if (f === 4) geom = pbfReadPacked(buf, s, e);
      });
      if (type !== 3 || !geom) continue;
      let isOcean = false;
      for (let t = 0; t < tags.length; t += 2) {
        if (keys[tags[t]] === 'class' && values[tags[t + 1]] === 'ocean') isOcean = true;
      }
      if (isOcean) result.rings.push(...decodeMvtRings(geom));
    }
  });
  return result;
}

// Kacheln werden kurz zwischengespeichert: Strand- und Umgebungsprüfung nutzen dieselben Zoom-14-Kacheln.
const tileBufferCache = new Map();
const TILE_CACHE_MAX = 40;
function fetchTileBuffer(tileUrl, z, x, y) {
  const url = tileUrl.replace('{z}', z).replace('{x}', x).replace('{y}', y);
  if (!tileBufferCache.has(url)) {
    const p = (async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (res.status === 204 || res.status === 404) return null;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return new Uint8Array(await res.arrayBuffer());
      } finally { clearTimeout(timer); }
    })();
    p.catch(() => tileBufferCache.delete(url));
    tileBufferCache.set(url, p);
    if (tileBufferCache.size > TILE_CACHE_MAX) tileBufferCache.delete(tileBufferCache.keys().next().value);
  }
  return tileBufferCache.get(url);
}

async function fetchOceanTile(tileUrl, z, x, y) {
  const buf = await fetchTileBuffer(tileUrl, z, x, y);
  return buf ? decodeOceanTile(buf) : { extent: 4096, rings: [] };
}

// Liest ausgewählte Layer einer Vektorkachel: Merkmale mit Typ (1 Punkt, 2 Linie, 3 Fläche), Tags und Geometrie.
function decodeTileFeatures(buf, wantedLayers) {
  const decoder = new TextDecoder();
  const out = {};
  pbfReadFields(buf, 0, buf.length, (layerField, _v, ls, le) => {
    if (layerField !== 3) return;
    let name = '', extent = 4096;
    const keys = [], values = [], features = [];
    pbfReadFields(buf, ls, le, (f, v, s, e) => {
      if (f === 1) name = decoder.decode(buf.subarray(s, e));
      else if (f === 2) features.push([s, e]);
      else if (f === 3) keys.push(decoder.decode(buf.subarray(s, e)));
      else if (f === 4) {
        let str = null;
        pbfReadFields(buf, s, e, (vf, _vv, vs, ve) => { if (vf === 1) str = decoder.decode(buf.subarray(vs, ve)); });
        values.push(str);
      } else if (f === 5) extent = v;
    });
    if (!wantedLayers.includes(name)) return;
    const layer = { extent, features: [] };
    for (const [fs, fe] of features) {
      let tagIdx = [], type = 0, geom = null;
      pbfReadFields(buf, fs, fe, (f, v, s, e) => {
        if (f === 2) tagIdx = pbfReadPacked(buf, s, e);
        else if (f === 3) type = v;
        else if (f === 4) geom = pbfReadPacked(buf, s, e);
      });
      if (!geom) continue;
      const tags = {};
      for (let t = 0; t < tagIdx.length; t += 2) tags[keys[tagIdx[t]]] = values[tagIdx[t + 1]];
      layer.features.push({ type, tags, geom: decodeMvtRings(geom) });
    }
    out[name] = layer;
  });
  return out;
}

function pointInRings(px, py, rings) {
  let inside = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}

// Liefert Meter bis zur Küste oder null, wenn innerhalb des sicher abgedeckten Radius kein Meer liegt.
async function oceanDistanceAtZoom(tileUrl, lat, lon, zoom) {
  const n = 2 ** zoom;
  const xf = ((lon + 180) / 360) * n;
  const yf = ((1 - Math.asinh(Math.tan(toRad(lat))) / Math.PI) / 2) * n;
  const cx = Math.floor(xf), cy = Math.floor(yf);

  const coords = [];
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) coords.push([cx + dx, cy + dy]);
  // OpenFreeMap-ToS: höchstens 4 parallele Anfragen
  const tiles = new Array(coords.length);
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < coords.length) {
      const i = next++;
      const [tx, ty] = coords[i];
      tiles[i] = { tx, ty, ...(await fetchOceanTile(tileUrl, zoom, ((tx % n) + n) % n, ty)) };
    }
  }));

  let best = Infinity; // in Kacheleinheiten
  for (const { tx, ty, extent: e, rings } of tiles) {
    const px = (xf - tx) * e, py = (yf - ty) * e;
    if (tx === cx && ty === cy && pointInRings(px, py, rings)) return 0;
    for (const ring of rings) {
      for (let i = 1; i < ring.length; i++) {
        const [ax0, ay0] = ring[i - 1], [bx0, by0] = ring[i];
        // Künstliche Kanten aus dem Kachel-Clipping sind keine Küste
        if ((ax0 <= 0 && bx0 <= 0) || (ax0 >= e && bx0 >= e) || (ay0 <= 0 && by0 <= 0) || (ay0 >= e && by0 >= e)) continue;
        const ax = ax0 - px, ay = ay0 - py, ddx = bx0 - ax0, ddy = by0 - ay0;
        const len2 = ddx * ddx + ddy * ddy;
        const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, -(ax * ddx + ay * ddy) / len2));
        const d = Math.hypot(ax + t * ddx, ay + t * ddy) / e;
        if (d < best) best = d;
      }
    }
  }

  const reach = Math.min(xf - (cx - 1), cx + 2 - xf, yf - (cy - 1), cy + 2 - yf);
  if (best > reach) return null;
  const metersPerTile = (EARTH_CIRCUMFERENCE_M * Math.cos(toRad(lat))) / n;
  return Math.round(best * metersPerTile);
}

async function findNearestBeachMeters(lat, lon) {
  try {
    const tileUrl = await getOceanTileUrl();
    // Zoom 14: genau, ca. ±2 km Reichweite; Zoom 12: gröber, ca. ±7 km Reichweite
    for (const zoom of [14, 12]) {
      const meters = await oceanDistanceAtZoom(tileUrl, lat, lon, zoom);
      if (meters !== null) return meters;
    }
  } catch (err) {
    console.warn('Meeresabstand konnte nicht ermittelt werden:', err);
  }
  return null;
}

async function fetchDriveMinutes(fromLat, fromLon, toLat, toLon) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=false`;
    const data = await fetchJsonSafe(url, {}, 6000);
    if (data.routes && data.routes.length > 0) return Math.round(data.routes[0].duration / 60);
  } catch (err) {}
  return null;
}

// ---------- Umgebung (aus denselben OpenFreeMap-Kacheln wie der Meeresabstand) ----------
// Früher Overpass API: deren öffentliche Server sind oft überlastet und lehnen Anfragen ab.
const ROAD_RADIUS_M = 300, SHOP_RADIUS_M = 1500, AIRPORT_NOISE_RADIUS_M = 8000;
const ROAD_CLASSES = { motorway: 'Autobahn', trunk: 'Schnellstraße', primary: 'Hauptstraße' };
const SHOP_SUBCLASSES = ['supermarket', 'convenience', 'mall', 'department_store'];

// Sucht Einkaufsmöglichkeiten, große Straßen und Flughäfen rund um das Hotel.
async function fetchSurroundings(lat, lon) {
  const tileUrl = await getOceanTileUrl();
  const zoom = 14, n = 2 ** zoom;
  const xf = ((lon + 180) / 360) * n;
  const yf = ((1 - Math.asinh(Math.tan(toRad(lat))) / Math.PI) / 2) * n;
  const cx = Math.floor(xf), cy = Math.floor(yf);
  const metersPerTile = (EARTH_CIRCUMFERENCE_M * Math.cos(toRad(lat))) / n;

  const coords = [];
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) coords.push([cx + dx, cy + dy]);
  const tiles = new Array(coords.length);
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => { // OpenFreeMap-ToS: max. 4 parallel
    while (next < coords.length) {
      const i = next++;
      const [tx, ty] = coords[i];
      const buf = await fetchTileBuffer(tileUrl, zoom, ((tx % n) + n) % n, ty);
      tiles[i] = { tx, ty, layers: buf ? decodeTileFeatures(buf, ['transportation', 'poi']) : {} };
    }
  }));

  let road = null, shop = null;
  for (const { tx, ty, layers } of tiles) {
    for (const [layerName, layer] of Object.entries(layers)) {
      const unit = metersPerTile / layer.extent;
      const px = (xf - tx) * layer.extent, py = (yf - ty) * layer.extent;
      for (const f of layer.features) {
        if (layerName === 'transportation') {
          if (f.type !== 2 || !ROAD_CLASSES[f.tags.class]) continue;
          for (const line of f.geom) {
            for (let i = 1; i < line.length; i++) {
              const [ax0, ay0] = line[i - 1], [bx0, by0] = line[i];
              const ax = ax0 - px, ay = ay0 - py, ddx = bx0 - ax0, ddy = by0 - ay0;
              const len2 = ddx * ddx + ddy * ddy;
              const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, -(ax * ddx + ay * ddy) / len2));
              const m = Math.hypot(ax + t * ddx, ay + t * ddy) * unit;
              if (!road || m < road.m) road = { m, name: ROAD_CLASSES[f.tags.class] };
            }
          }
        } else if (layerName === 'poi') {
          if (!SHOP_SUBCLASSES.includes(f.tags.subclass)) continue;
          for (const ring of f.geom) {
            for (const [x, y] of ring) {
              const m = Math.hypot(x - px, y - py) * unit;
              if (!shop || m < shop.m) shop = { m, name: f.tags.name || f.tags['name:de'] || f.tags['name:en'] || 'Geschäft' };
            }
          }
        }
      }
    }
  }

  // Fluglärm: Abstand zum nächsten Flughafen der eigenen Liste (keine Netzabfrage nötig)
  let air = null;
  for (const ap of AIRPORTS) {
    const m = haversineMeters(lat, lon, ap.lat, ap.lon);
    if (m <= AIRPORT_NOISE_RADIUS_M && (!air || m < air.m)) air = { m, name: ap.iata };
  }

  const nearRoad = road && road.m <= ROAD_RADIUS_M ? road : null;
  const nearShop = shop && shop.m <= SHOP_RADIUS_M ? shop : null;
  return {
    envChecked: '1',
    shopM: nearShop ? Math.round(nearShop.m) : '', shopName: nearShop ? nearShop.name : '',
    roadM: nearRoad ? Math.round(nearRoad.m) : '', roadName: nearRoad ? nearRoad.name : '',
    airKm: air ? Math.round(air.m / 100) / 10 : '', airName: air ? air.name : ''
  };
}

const ENV_FIELDS = ['envChecked', 'shopM', 'shopName', 'roadM', 'roadName', 'airKm', 'airName'];

const num = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));

// Punkte für die Umgebung: Einkauf in der Nähe hilft, große Straßen und Flughafennähe kosten Punkte.
function surroundingsPoints(h) {
  if (h.envChecked !== '1') return { points: 0, notes: [] };
  let points = 0;
  const notes = [];
  const shopM = num(h.shopM), roadM = num(h.roadM), airKm = num(h.airKm);
  if (shopM !== null && shopM <= 500) { points += 2; notes.push(`🛒 Einkauf ${shopM} m`); }
  else if (shopM !== null && shopM <= 1000) { points += 1; notes.push(`🛒 Einkauf ${shopM} m`); }
  else notes.push('🛒 kein Einkauf < 1 km');
  if (roadM !== null) {
    const p = roadM <= 100 ? -3 : roadM <= 200 ? -2 : -1;
    points += p;
    notes.push(`🚗 ${h.roadName} ${roadM} m`);
  }
  if (airKm !== null) { points += airKm <= 4 ? -3 : -1; notes.push(`🛬 Flughafen ${h.airName} ${String(airKm).replace('.', ',')} km – Fluglärm möglich`); }
  return { points: Math.max(-6, Math.min(2, points)), notes };
}

// Transfer mit kleinen Kindern: bis 45 Min. kein Abzug, danach −1 Punkt je 10 Min., höchstens −6.
const TRANSFER_FREE_MIN = 45, TRANSFER_POINTS_PER_10MIN = 1, TRANSFER_MAX_MALUS = 6;
function transferMalus(minutes) {
  const m = num(minutes);
  if (m === null || m <= TRANSFER_FREE_MIN) return 0;
  return -Math.min(TRANSFER_MAX_MALUS, Math.round(((m - TRANSFER_FREE_MIN) / 10) * TRANSFER_POINTS_PER_10MIN * 10) / 10);
}

function parseRatingInput(val) {
  if (!val) return null;
  const normalizedStr = String(val).replace(',', '.');
  const num = Number(normalizedStr);
  return isNaN(num) || num <= 0 ? null : num;
}

function normalizeRating(val, minEffective, maxScale) {
  const num = parseRatingInput(val);
  if (num === null) return null;
  const clamped = Math.min(maxScale, Math.max(minEffective, num));
  return (clamped - minEffective) / (maxScale - minEffective);
}

function normalizeHolidayCheck(val) {
  const num = parseRatingInput(val);
  if (num === null) return null;
  if (num <= 6) return normalizeRating(num, 4.5, 6.0);
  return normalizeRating(num, 75, 100);
}

// Wertung: Qualität (max. ~73 Punkte) plus Preisanpassung relativ zum mittleren Preis der Liste.
const PRICE_POINTS_PER_LOG = 25;      // 10 % Preisunterschied ≈ 2,5 Punkte
const PORTAL_BONUS_PER_10PCT = 0.5;
const PORTAL_BONUS_MAX = 3;
const TIE_POINTS = 1.5;

const fmtPoints = (n) => `${n > 0 ? '+' : ''}${String(n).replace('.', ',')}`;

const DEAL_THRESHOLD = 0.15; // günstigster Preis mehr als 15 % unter dem zweiten → Schnäppchen-Hinweis

// Mit zwei Veranstalterpreisen zählt der Mittelwert, damit ein einzelnes Lockangebot nur halb wirkt.
function effectivePrice(h) {
  const prices = [Number(h.price), Number(h.price2)].filter((p) => p > 0);
  return prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
}

function isDeal(h) {
  const p1 = Number(h.price), p2 = Number(h.price2);
  if (!(p1 > 0 && p2 > 0)) return false;
  return Math.min(p1, p2) < Math.max(p1, p2) * (1 - DEAL_THRESHOLD);
}

// Strandentfernung: bis 200 m +4, bis 400 m gleitend auf 0,
// danach Abzug: 600 m = −6 (zu weit), darüber weiter bis höchstens −10.
function beachDistancePoints(meters) {
  const m = num(meters);
  if (m === null || m < 0) return 0;
  let p;
  if (m <= 200) p = 4;
  else if (m <= 400) p = 4 - ((m - 200) / 200) * 4;
  else p = -((m - 400) / 200) * 6;
  return Math.round(Math.max(-10, p) * 10) / 10;
}

// Verpflegung relativ zu All Inclusive. Grobe Umrechnung: 2,5 Punkte ≈ 10 % Reisepreis.
// Halbpension: Mittagessen und Getränke kommen mit Kindern schnell auf ~25–30 % des Reisepreises.
const BOARD_POINTS = {
  'Ultra All Inclusive': 2,
  'All Inclusive': 0,
  'Vollpension': -4,
  'Halbpension': -7,
  'Frühstück': -10,
  'Ohne Verpflegung': -12
};
function boardPoints(board) {
  return BOARD_POINTS[board] ?? 0;
}

// Kinderpool und Spielplatz: sehr wichtig für Familien mit kleinen Kindern.
const KIDS_POINTS = { Ja: 3, Unbekannt: 0, Nein: -6 };
function kidsPoints(h) {
  return (KIDS_POINTS[h.kidsPool] ?? 0) + (KIDS_POINTS[h.playground] ?? 0);
}

function computeRankedHotels(list, sortBy = 'score') {
  if (!list || list.length === 0) return [];
  const validPrices = list.map(effectivePrice).filter((p) => p > 0).sort((a, b) => a - b);
  const mid = Math.floor(validPrices.length / 2);
  const medianPrice = validPrices.length === 0 ? 0
    : validPrices.length % 2 ? validPrices[mid] : (validPrices[mid - 1] + validPrices[mid]) / 2;

  const scored = list.map((h, i) => {
    const origIndex = h.__origIndex ?? i; // bei gefilterter Liste: Index in der Gesamtliste
    const portalNorms = [
      normalizeRating(h.rateC24, 7.0, 10.0),
      normalizeRating(h.rateTUI, 3.5, 5.0),
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

    const beachDist = beachDistancePoints(h.beachMeters);
    beachPoints += beachDist;

    const price = effectivePrice(h);
    const priceRatio = price > 0 && medianPrice > 0 ? price / medianPrice : 1;

    // Teure Hotels werden auf Portalen strenger bewertet (höhere Erwartungen):
    // +0,5 Punkte je 10 % über dem mittleren Listenpreis, höchstens +3 – nur wenn Portalnoten vorhanden sind.
    const portalBonus = portalNorms.length > 0 ? Math.min(PORTAL_BONUS_MAX, Math.max(0, PORTAL_BONUS_PER_10PCT * 10 * (priceRatio - 1))) : 0;
    const env = surroundingsPoints(h);
    const transfer = transferMalus(h.airportMinutes);
    const board = boardPoints(h.board);
    const kids = kidsPoints(h);
    const totalQuality = Math.round((portalPoints + ownPoints + beachPoints + portalBonus + env.points + transfer + board + kids) * 10) / 10;

    // Preis relativ zum mittleren Listenpreis: 10 % teurer ≈ −2,5 Punkte, 10 % günstiger ≈ +2,5 Punkte.
    // Durch den Logarithmus zählt derselbe prozentuale Aufpreis immer gleich viel.
    const priceAdj = Math.round(-PRICE_POINTS_PER_LOG * Math.log(priceRatio) * 10) / 10 || 0;
    const plScore = Math.round((totalQuality + priceAdj) * 10) / 10;

    let portalSource = 'Direkt';
    if (h.url) {
      if (h.url.includes('check24') || h.url.includes('c.24.de')) portalSource = 'Check24';
      else if (h.url.includes('tui')) portalSource = 'TUI';
      else if (h.url.includes('holidaycheck')) portalSource = 'HolidayCheck';
      else if (h.url.includes('booking')) portalSource = 'Booking';
    }

    return { ...h, origIndex, effPrice: Math.round(price), isDeal: isDeal(h), normalizedPortal10, totalQuality, portalBonus: Math.round(portalBonus * 10) / 10, beachDistPoints: beachDist, boardPoints: board, kidsPoints: kids, envPoints: env.points, envNotes: env.notes, transferPoints: transfer, priceAdj, plScore, portalSource };
  });

  const metric = sortBy === 'quality' ? 'totalQuality' : 'plScore';
  scored.sort((a, b) => b[metric] - a[metric]);
  // Hotels mit weniger als 1,5 Punkten Abstand zum Vorgänger gelten als praktisch gleichauf.
  scored.forEach((h, i) => { h.tiedWithPrev = i > 0 && scored[i - 1][metric] - h[metric] < TIE_POINTS; });
  return scored;
}

// ---------- Gleiches Hotel erkennen ----------
function normName(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}
function normUrl(u) {
  try { const x = new URL(u); return (x.hostname.replace(/^www\./, '') + x.pathname).replace(/\/$/, '').toLowerCase(); } catch { return ''; }
}
// Gleicher Name (und kein widersprüchlicher Ort) oder gleicher Link
function isSameHotel(a, b) {
  const na = normName(a.hotelName), nb = normName(b.hotelName);
  const la = normName(a.location), lb = normName(b.location);
  if (na && na === nb && (!la || !lb || la === lb)) return true;
  const ua = normUrl(a.url), ub = normUrl(b.url);
  return !!ua && ua === ub;
}
function findSameHotelIndex(list, h, skipIndex = -1) {
  return list.findIndex((x, i) => i !== skipIndex && isSameHotel(x, h));
}

function getHotels() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
function saveHotels(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); renderList(); }
function deleteHotel(origIndex) { const list = getHotels(); list.splice(origIndex, 1); saveHotels(list); }

// Beim Bearbeiten kann der Standort (z. B. falscher OSM-Treffer) neu bestimmt werden.
function setRelocateVisible(visible) {
  const wrap = document.getElementById('relocateWrap');
  const box = document.getElementById('relocate');
  if (wrap) wrap.hidden = !visible;
  if (box) box.checked = false;
}

// Setzt einen Auswahlwert; fehlt er (z. B. alter Freitext „Sep 2026“), wird er als Option ergänzt.
function setSelectValue(sel, value) {
  if (!sel) return;
  if (value && ![...sel.options].some((o) => o.value === value)) {
    const opt = document.createElement('option');
    opt.value = value; opt.textContent = value;
    sel.append(opt);
  }
  sel.value = value;
}

function editHotel(origIndex) {
  const h = getHotels()[origIndex];
  if (!h) return;
  const editEl = document.getElementById('editIndex');
  if (editEl) editEl.value = origIndex;
  document.getElementById('url').value = h.url || '';
  document.getElementById('hotelName').value = h.hotelName || '';
  document.getElementById('location').value = h.location || '';
  document.getElementById('price').value = h.price || '';
  const p2 = document.getElementById('price2'); if (p2) p2.value = h.price2 || '';
  document.getElementById('board').value = h.board || 'All Inclusive';
  const c24 = document.getElementById('rateC24'); if (c24) c24.value = h.rateC24 || '';
  const tui = document.getElementById('rateTUI'); if (tui) tui.value = h.rateTUI || '';
  const g = document.getElementById('rateGoogle'); if (g) g.value = h.rateGoogle || '';
  const hc = document.getElementById('rateHC'); if (hc) hc.value = h.rateHC || '';
  const ta = document.getElementById('rateTA'); if (ta) ta.value = h.rateTA || '';
  document.getElementById('rating').value = h.rating || '4';
  document.getElementById('playground').value = h.playground || 'Unbekannt';
  const kp = document.getElementById('kidsPool'); if (kp) kp.value = h.kidsPool || 'Unbekannt';
  document.getElementById('beachType').value = h.beachType || 'Unbekannt';
  document.getElementById('beachShade').value = h.beachShade || 'Keine/Unbekannt';
  setSelectValue(document.getElementById('travelDate'), h.travelDate || '');
  const ac = document.getElementById('airportChoice'); if (ac) ac.value = h.airportChoice || '';
  document.getElementById('notes').value = h.notes || '';
  setRelocateVisible(true);
  const btn = document.getElementById('saveBtn'); if (btn) btn.textContent = '💾 Änderungen & Ranking aktualisieren';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

const VIEW_KEY = 'hotel_view_v1';
function getView() {
  try { return { sortBy: 'score', period: '', ...JSON.parse(localStorage.getItem(VIEW_KEY) || '{}') }; } catch { return { sortBy: 'score', period: '' }; }
}
function setView(patch) {
  try { localStorage.setItem(VIEW_KEY, JSON.stringify({ ...getView(), ...patch })); } catch {}
  renderList();
}

function renderList() {
  const all = getHotels();
  const view = getView();
  const badge = document.getElementById('countBadge');
  if (badge) badge.textContent = all.length;

  // Zeitraum-Filter: nur Zeiträume anbieten, die in der Liste vorkommen
  const periodSel = document.getElementById('periodFilter');
  const periods = [...new Set(all.map((h) => h.travelDate).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'de'));
  if (view.period && !periods.includes(view.period)) view.period = '';
  if (periodSel) {
    periodSel.innerHTML = '<option value="">Alle</option>' + periods.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
    periodSel.value = view.period;
  }
  const sortSel = document.getElementById('sortBy');
  if (sortSel) sortSel.value = view.sortBy;

  const filtered = all.map((h, i) => ({ ...h, __origIndex: i })).filter((h) => !view.period || h.travelDate === view.period);
  const ranked = computeRankedHotels(filtered, view.sortBy);
  const container = document.getElementById('hotelList');
  if (!container) return;

  if (ranked.length === 0) {
    container.innerHTML = '<p style="color:#94a3b8;font-size:0.85rem;">Noch keine Hotels gespeichert.</p>';
    return;
  }
  renderBackupNotice(all);
  const cards = ranked.map((raw, rankIdx) => {
    // Alle Textfelder escapen: Hotelname & Co. können aus geteilten Seitentiteln stammen.
    const h = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, typeof v === 'string' ? escapeHtml(v) : v]));
    const isWinner = rankIdx === 0;
    const envParts = [];
    const kidsMark = (v) => (v === 'Ja' ? '✓' : v === 'Nein' ? '✗' : '?');
    envParts.push(`👶 Kinderpool ${kidsMark(h.kidsPool)} · Spielplatz ${kidsMark(h.playground)}${h.kidsPoints ? `: ${fmtPoints(h.kidsPoints)}` : ''}`);
    if (h.boardPoints !== 0) envParts.push(`🍽️ ${h.board}: ${fmtPoints(h.boardPoints)}`);
    if (h.beachDistPoints < 0) envParts.push(`🏖️ Strand ${h.beachMeters} m entfernt: ${fmtPoints(h.beachDistPoints)}`);
    if (h.transferPoints < 0) envParts.push(`🚐 Transfer ${h.airportMinutes} Min.: ${fmtPoints(h.transferPoints)}`);
    if (h.envChecked === '1') envParts.push(`🏘️ Umgebung ${fmtPoints(h.envPoints)}: ${raw.envNotes.map(escapeHtml).join(' · ')}`);
    else envParts.push('🏘️ Umgebung nicht geprüft (Hotel bearbeiten → „Standort neu suchen“)');
    const envLine = envParts.join('<br/>');
    const medal = rankIdx === 0 ? '🏆 #1 SIEGER' : rankIdx === 1 ? '🥈 #2' : rankIdx === 2 ? '🥉 #3' : `#${rankIdx + 1}`;
    const hcDisplay = h.rateHC ? (Number(h.rateHC) <= 6 ? `HC: ${h.rateHC}/6` : `HC: ${h.rateHC}%`) : null;
    const portals = [
      h.rateC24 ? `C24: ${h.rateC24}/10` : null,
      h.rateTUI ? `TUI: ${h.rateTUI}/5` : null,
      h.rateGoogle ? `G: ${h.rateGoogle}/5` : null,
      hcDisplay,
      h.rateTA ? `TA: ${h.rateTA}/5` : null
    ].filter(Boolean).join(' · ');

    return `
      <div class="item ${isWinner ? 'winner' : ''}">
        <div class="item-head">
          <div>
            <span>${medal} · ${h.hotelName} (${h.price ? h.price + ' €' : 'k. A.'}${h.prevPrice ? ` <s style="opacity:.6">${h.prevPrice} €</s>` : ''}${h.price2 ? ` / ${h.price2} € → Ø ${h.effPrice} €` : ''}) [${h.portalSource}]</span><br/>
            <span class="score-pill">Score: ${String(h.plScore).replace('.', ',')} · Quali: ${String(h.totalQuality).replace('.', ',')}${h.portalBonus > 0 ? ` (inkl. ${fmtPoints(h.portalBonus)} Portal-Bonus)` : ''} · Preis: ${fmtPoints(h.priceAdj)}${h.normalizedPortal10 !== null ? ` · Portale: ${String(h.normalizedPortal10).replace('.', ',')}/10` : ''}</span>${h.isDeal ? '<br/><span class="deal-pill">⚡ Schnäppchen – Bedingungen prüfen (Flugzeiten, Transfer, Storno)</span>' : ''}${h.tiedWithPrev ? '<br/><span class="tie-pill">≈ praktisch gleichauf mit dem Hotel darüber</span>' : ''}
          </div>
          <div style="display:flex;gap:4px;">
            <button type="button" class="btn-small" onclick="editHotel(${h.origIndex})">✏️</button>
            <button type="button" class="btn-del" onclick="deleteHotel(${h.origIndex})">✕</button>
          </div>
        </div>
        <div class="meta">📍 ${h.location}${h.exactMatch === 'Ortszentrum' ? ' (⚠️ nur Ortszentrum)' : h.exactMatch === 'Manuell' ? ' (📍 manuelle Koordinaten)' : h.osmMatch ? ` (OSM: ${h.osmMatch})` : ''} · ✈️ ${h.airportIata || '?'} (${h.airportMinutes || '?'} Min.) · 🏖️ ${h.beachMeters !== '' && h.beachMeters != null ? h.beachMeters + ' m zum Meer' : 'kein Meer gefunden'}</div>
        <div class="meta">${h.board} · ⭐ ${h.rating} ${portals ? `· 📊 ${portals}` : ''}</div>
        <div class="meta">🏖️ ${h.beachType || '?'} (${h.beachShade || '?'})</div>
        <div class="meta">${envLine}</div>
      </div>`;
  });
  // Nur die besten 10 direkt zeigen, den Rest einklappen
  const TOP_N = 10;
  container.innerHTML = cards.slice(0, TOP_N).join('') + (cards.length > TOP_N
    ? `<details class="more-list"${view.showMore ? ' open' : ''}><summary>Weitere ${cards.length - TOP_N} Hotel(s) anzeigen</summary>${cards.slice(TOP_N).join('')}</details>`
    : '');
  container.querySelector('.more-list')?.addEventListener('toggle', (ev) => {
    try { localStorage.setItem(VIEW_KEY, JSON.stringify({ ...getView(), showMore: ev.target.open })); } catch {}
  });
}

const formEl = document.getElementById('hotelForm');
if (formEl) {
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveBtn'), status = document.getElementById('status');
    if (btn) btn.disabled = true;

    const editIndexEl = document.getElementById('editIndex');
    let editIndex = editIndexEl ? Number(editIndexEl.value) : -1;
    const hotelName = document.getElementById('hotelName').value.trim();
    const location = document.getElementById('location').value.trim();
    const list = getHotels();
    // Neues Hotel, das schon in der Liste steht → bestehenden Eintrag aktualisieren statt doppelt anlegen
    let mergedDuplicate = false;
    if (editIndex < 0) {
      const dup = findSameHotelIndex(list, { hotelName, location, url: document.getElementById('url').value.trim() });
      if (dup >= 0) { editIndex = dup; mergedDuplicate = true; }
    }
    const existing = editIndex >= 0 ? list[editIndex] : null;

    try {
      let airportIata = existing?.airportIata || '', airportMinutes = existing?.airportMinutes ?? '', beachMeters = existing?.beachMeters ?? '', exactMatch = existing?.exactMatch || '', osmMatch = existing?.osmMatch || '';
      let lat = existing?.lat ?? '', lon = existing?.lon ?? '';
      let env = existing?.envChecked === '1' ? Object.fromEntries(ENV_FIELDS.map((k) => [k, existing[k] ?? ''])) : {};
      let locationChanged = false;
      const airportChoice = document.getElementById('airportChoice')?.value || '';
      const airportChanged = !!existing && (existing.airportChoice || '') !== airportChoice;

      const relocateEl = document.getElementById('relocate');
      const hasCoords = lat !== '' && lat != null && lon !== '' && lon != null;
      if (!existing || existing.hotelName !== hotelName || existing.location !== location || relocateEl?.checked || (airportChanged && !hasCoords)) {
        if (status) status.textContent = '1/4 Suche Koordinaten...';
        const coords = await geocodeHotel(hotelName, location, (msg) => { if (status) status.textContent = `1/4 ${msg}`; }, !!relocateEl?.checked);
        lat = Math.round(coords.lat * 1e6) / 1e6; lon = Math.round(coords.lon * 1e6) / 1e6;
        locationChanged = true;
        if (status) status.textContent = '2/4 Suche Strand & Flughafen...';
        const airport = findNearestAirport(coords.lat, coords.lon, airportChoice);
        beachMeters = (await findNearestBeachMeters(coords.lat, coords.lon)) ?? '';
        exactMatch = coords.manual ? 'Manuell' : coords.exact ? 'Exakt' : 'Ortszentrum';
        osmMatch = coords.matchName;

        if (airport) {
          if (status) status.textContent = `3/4 Berechne Fahrtdauer nach ${airport.iata}...`;
          let mins = await fetchDriveMinutes(coords.lat, coords.lon, airport.lat, airport.lon);
          if (mins === null) mins = Math.max(5, Math.round((airport.airMeters / 1000) * 1.1));
          airportIata = `${airport.name} (${airport.iata})`;
          airportMinutes = mins;
        }
      }

      // Nur der Flughafen wurde geändert: Fahrtdauer mit gespeicherten Koordinaten neu berechnen
      // … oder die Automatik würde heute einen anderen Flughafen wählen (z. B. AYT statt GZP)
      const autoNow = hasCoords && !airportChoice ? findNearestAirport(Number(lat), Number(lon)) : null;
      const autoDiffers = !!autoNow && !String(existing?.airportIata || '').includes(`(${autoNow.iata})`);
      if ((airportChanged || autoDiffers) && !locationChanged && hasCoords) {
        const airport = findNearestAirport(Number(lat), Number(lon), airportChoice);
        if (airport) {
          if (status) status.textContent = `Berechne Fahrtdauer nach ${airport.iata}...`;
          let mins = await fetchDriveMinutes(Number(lat), Number(lon), airport.lat, airport.lon);
          if (mins === null) mins = Math.max(5, Math.round((airport.airMeters / 1000) * 1.1));
          airportIata = `${airport.name} (${airport.iata})`;
          airportMinutes = mins;
        }
      }

      // Umgebung prüfen: nach neuer Standortsuche oder wenn sie noch fehlt (Koordinaten bekannt)
      let envWarning = '';
      if (lat !== '' && lon !== '' && (locationChanged || env.envChecked !== '1')) {
        if (status) status.textContent = '4/4 Prüfe Umgebung (Einkauf, Straßen, Flughafen)...';
        try {
          env = await fetchSurroundings(Number(lat), Number(lon));
        } catch {
          env = {};
          envWarning = ' (Umgebung konnte gerade nicht geprüft werden – später erneut speichern)';
        }
      }

      const entry = {
        datum: existing?.datum || new Date().toLocaleDateString('de-DE'),
        hotelName, location,
        price: document.getElementById('price').value.trim(),
        price2: document.getElementById('price2')?.value.trim() || '',
        board: document.getElementById('board').value,
        rateC24: document.getElementById('rateC24')?.value.trim().replace(',', '.') || '',
        rateTUI: document.getElementById('rateTUI')?.value.trim().replace(',', '.') || '',
        rateGoogle: document.getElementById('rateGoogle')?.value.trim().replace(',', '.') || '',
        rateHC: document.getElementById('rateHC')?.value.trim().replace(',', '.') || '',
        rateTA: document.getElementById('rateTA')?.value.trim().replace(',', '.') || '',
        rating: document.getElementById('rating').value,
        playground: document.getElementById('playground').value,
        kidsPool: document.getElementById('kidsPool')?.value || 'Unbekannt',
        beachType: document.getElementById('beachType').value,
        beachShade: document.getElementById('beachShade').value,
        travelDate: document.getElementById('travelDate').value,
        airportIata, airportMinutes, airportChoice, beachMeters, exactMatch, osmMatch, lat, lon,
        ...Object.fromEntries(ENV_FIELDS.map((k) => [k, env[k] ?? ''])),
        notes: document.getElementById('notes').value.trim(),
        url: document.getElementById('url').value.trim() || existing?.url || '',
        updatedAt: new Date().toISOString()
      };
      // Preisänderung merken
      const oldPrice = existing?.price || '';
      entry.prevPrice = oldPrice && oldPrice !== entry.price ? oldPrice : existing?.prevPrice || '';
      // Beim Zusammenführen leer gelassene Felder nicht überschreiben
      if (mergedDuplicate) {
        for (const k of ['location', 'price2', 'rateC24', 'rateTUI', 'rateGoogle', 'rateHC', 'rateTA', 'notes']) {
          if (!entry[k] && existing[k]) entry[k] = existing[k];
        }
        for (const k of ['kidsPool', 'playground', 'beachType', 'beachShade']) {
          if (/^(Unbekannt|Keine\/Unbekannt)$/.test(entry[k]) && existing[k]) entry[k] = existing[k];
        }
        if (!entry.travelDate && existing.travelDate) entry.travelDate = existing.travelDate;
      }

      if (editIndex >= 0 && existing) list[editIndex] = entry;
      else list.unshift(entry);

      saveHotels(list);
      if (status) status.textContent = `✅ ${mergedDuplicate ? 'Bereits vorhandenes Hotel aktualisiert' : 'Gespeichert'} & Ranking berechnet!${envWarning}`;
      hideDuplicateNotice();
      e.target.reset();
      if (editIndexEl) editIndexEl.value = '-1';
      setRelocateVisible(false);
      if (btn) btn.textContent = 'OSM prüfen & im Ranking speichern';
    } catch (err) {
      if (status) status.textContent = `❌ Fehler: ${err.message}`;
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}

// ---------- Erinnerung an die Datensicherung ----------
const BACKUP_KEY = 'hotel_backup_v1';
const BACKUP_REMIND_DAYS = 14, BACKUP_SNOOZE_DAYS = 3, DAY_MS = 86400000;
function getBackupState() {
  try { return JSON.parse(localStorage.getItem(BACKUP_KEY) || '{}'); } catch { return {}; }
}
function setBackupState(patch) {
  try { localStorage.setItem(BACKUP_KEY, JSON.stringify({ ...getBackupState(), ...patch })); } catch {}
}
function markBackupDone() {
  setBackupState({ lastAt: new Date().toISOString(), snoozeUntil: '' });
  renderList();
}
// Erinnert nur, wenn es seit der letzten Sicherung Änderungen gibt und sie länger her ist.
function renderBackupNotice(all) {
  const el = document.getElementById('backupNotice');
  if (!el) return;
  const { lastAt = '', snoozeUntil = '' } = getBackupState();
  const now = Date.now();
  const changedSince = !lastAt || all.some((h) => (h.updatedAt || '') > lastAt);
  const days = lastAt ? Math.floor((now - Date.parse(lastAt)) / DAY_MS) : null;
  const due = lastAt ? days >= BACKUP_REMIND_DAYS : all.length >= 3;
  const snoozed = snoozeUntil && now < Date.parse(snoozeUntil);
  if (!all.length || !changedSince || !due || snoozed) { el.hidden = true; return; }
  el.hidden = false;
  el.innerHTML = `💾 ${lastAt ? `Letzte Sicherung vor ${days} Tagen, seitdem gab es Änderungen.` : 'Deine Liste wurde noch nie gesichert.'}
    Ohne Sicherung geht sie verloren, wenn Browserdaten gelöscht werden.
    <div class="row" style="margin-top:6px;">
      <button type="button" class="btn-small" style="width:100%;padding:8px;" id="backupNowBtn">Jetzt sichern</button>
      <button type="button" class="btn-small" style="width:100%;padding:8px;background:transparent;border:1px solid #475569;" id="backupLaterBtn">In ${BACKUP_SNOOZE_DAYS} Tagen erinnern</button>
    </div>`;
  document.getElementById('backupNowBtn')?.addEventListener('click', () => document.getElementById('exportBtn')?.click());
  document.getElementById('backupLaterBtn')?.addEventListener('click', () => {
    setBackupState({ snoozeUntil: new Date(now + BACKUP_SNOOZE_DAYS * DAY_MS).toISOString() });
    el.hidden = true;
  });
}

const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
  exportBtn.addEventListener('click', async () => {
    const ranked = computeRankedHotels(getHotels());
    if (ranked.length === 0) { alert('Keine Hotels vorhanden.'); return; }
    
    const headers = [
      'Rang', 'Portal_Quelle', 'Score', 'Qualitaets_Punkte', 'Portal_Schnitt_10', 'Portal_Bonus_Pkt',
      'Datum', 'Hotel', 'Ort', 'Preis_EUR', 'Verpflegung',
      'CHECK24_10', 'TUI_5', 'Google_5', 'HolidayCheck_Prozent', 'TripAdvisor_5', 'Eigene_Bewertung',
      'Strand_Art', 'Strand_Schatten', 'Entfernung_Strand_m', 'Flughafen', 'Fahrtdauer_Flughafen_Min',
      'Spielplatz', 'Reisezeitraum', 'Notiz', 'Hotel_Link', 'Standort_Genauigkeit', 'OSM_Treffer', 'Preis2_EUR',
      'Breite', 'Laenge', 'Umgebung_geprueft', 'Einkauf_m', 'Einkauf_Name', 'Hauptstrasse_m', 'Hauptstrasse_Name',
      'Flughafen_Naehe_km', 'Flughafen_Naehe_Name', 'Umgebung_Pkt', 'Transfer_Pkt', 'Flughafen_Wahl', 'Kinderpool', 'Vorpreis_EUR', 'Geaendert_am'
    ];

    const rows = ranked.map((h, idx) => [
      idx + 1,
      h.portalSource,
      String(h.plScore ?? '').replace('.', ','),
      String(h.totalQuality ?? '').replace('.', ','),
      h.normalizedPortal10 !== null ? String(h.normalizedPortal10).replace('.', ',') : '',
      String(h.portalBonus).replace('.', ','),
      h.datum,
      h.hotelName,
      h.location,
      h.price,
      h.board,
      String(h.rateC24 ?? '').replace('.', ','),
      String(h.rateTUI ?? '').replace('.', ','),
      String(h.rateGoogle ?? '').replace('.', ','),
      String(h.rateHC ?? '').replace('.', ','),
      String(h.rateTA ?? '').replace('.', ','),
      String(h.rating ?? '').replace('.', ','),
      h.beachType,
      h.beachShade,
      h.beachMeters,
      h.airportIata,
      h.airportMinutes,
      h.playground,
      h.travelDate,
      h.notes,
      h.url,
      h.exactMatch,
      h.osmMatch,
      h.price2,
      h.lat, h.lon, h.envChecked, h.shopM, h.shopName, h.roadM, h.roadName,
      String(h.airKm ?? '').replace('.', ','), h.airName,
      String(h.envPoints).replace('.', ','), String(h.transferPoints).replace('.', ','),
      h.airportChoice,
      h.kidsPool,
      h.prevPrice,
      h.updatedAt
    ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'));

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const file = new File([csvContent], 'hotel_ranking.csv', { type: 'text/csv;charset=utf-8;' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ title: 'Hotel Ranking', files: [file] }); markBackupDone(); return; }
      catch (e) { if (e?.name === 'AbortError') return; } // Teilen abgebrochen: nichts gesichert
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = 'hotel_ranking.csv';
    a.click();
    markBackupDone();
  });
}

// CSV-Import (Format des eigenen Exports): stellt eine Liste nach Datenverlust oder auf einem neuen Gerät wieder her.
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  text = text.replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ';') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim() !== ''));
}

const CSV_FIELD_MAP = {
  Datum: 'datum', Hotel: 'hotelName', Ort: 'location', Preis_EUR: 'price', Preis2_EUR: 'price2', Breite: 'lat', Laenge: 'lon', Umgebung_geprueft: 'envChecked',
  Einkauf_m: 'shopM', Einkauf_Name: 'shopName', Hauptstrasse_m: 'roadM', Hauptstrasse_Name: 'roadName',
  Flughafen_Naehe_km: 'airKm', Flughafen_Naehe_Name: 'airName', Flughafen_Wahl: 'airportChoice', Kinderpool: 'kidsPool', Vorpreis_EUR: 'prevPrice', Geaendert_am: 'updatedAt', Verpflegung: 'board',
  CHECK24_10: 'rateC24', TUI_5: 'rateTUI', TUI_10: 'rateTUI', Google_5: 'rateGoogle', HolidayCheck_Prozent: 'rateHC',
  TripAdvisor_5: 'rateTA', Eigene_Bewertung: 'rating', Strand_Art: 'beachType', Strand_Schatten: 'beachShade',
  Entfernung_Strand_m: 'beachMeters', Flughafen: 'airportIata', Fahrtdauer_Flughafen_Min: 'airportMinutes',
  Spielplatz: 'playground', Reisezeitraum: 'travelDate', Notiz: 'notes', Hotel_Link: 'url',
  Standort_Genauigkeit: 'exactMatch', OSM_Treffer: 'osmMatch'
};
const DECIMAL_FIELDS = ['airKm', 'rateC24', 'rateTUI', 'rateGoogle', 'rateHC', 'rateTA', 'rating'];

function importCsvText(text) {
  const [header, ...rows] = parseCsv(text);
  if (!header || !header.includes('Hotel')) throw new Error('Keine Hotel-Sammler-CSV erkannt.');
  const list = getHotels();
  let added = 0, updated = 0, skipped = 0;
  for (const r of rows) {
    const entry = {};
    header.forEach((col, i) => {
      const field = CSV_FIELD_MAP[col.trim()];
      if (!field) return;
      let v = (r[i] ?? '').trim();
      if (DECIMAL_FIELDS.includes(field)) v = v.replace(',', '.');
      entry[field] = v;
    });
    if (!entry.hotelName) continue;
    const idx = findSameHotelIndex(list, entry);
    if (idx < 0) { list.push(entry); added++; continue; }
    // Gleiches Hotel: die zuletzt geänderte Version gewinnt (z. B. neuer Preis vom Partner)
    const mine = list[idx].updatedAt || '', theirs = entry.updatedAt || '';
    if (theirs && theirs > mine) { list[idx] = { ...list[idx], ...entry }; updated++; }
    else skipped++;
  }
  saveHotels(list);
  return { added, updated, skipped };
}

// Ergänzt Koordinaten und Umgebung für Hotels, die vor dieser Funktion gespeichert wurden.
document.getElementById('envAllBtn')?.addEventListener('click', async (ev) => {
  const btn = ev.currentTarget, out = document.getElementById('envAllStatus');
  const say = (t) => { if (out) out.textContent = t; };
  const todo = getHotels().map((h, i) => ({ h, i })).filter(({ h }) => h.envChecked !== '1');
  if (!todo.length) { say('✅ Alle Hotels haben bereits Umgebungsdaten.'); return; }
  btn.disabled = true;
  let done = 0, failed = 0;
  for (const { h, i } of todo) {
    try {
      let { lat, lon } = h;
      if (lat === '' || lat == null || lon === '' || lon == null) {
        say(`${done + failed + 1}/${todo.length}: Suche Standort von „${h.hotelName}“ …`);
        const coords = await geocodeHotel(h.hotelName, h.location, (msg) => say(`${done + failed + 1}/${todo.length}: ${msg}`));
        lat = Math.round(coords.lat * 1e6) / 1e6; lon = Math.round(coords.lon * 1e6) / 1e6;
      }
      say(`${done + failed + 1}/${todo.length}: Prüfe Umgebung von „${h.hotelName}“ …`);
      const env = await fetchSurroundings(Number(lat), Number(lon));
      const airportUpdate = {};
      const ap = findNearestAirport(Number(lat), Number(lon), h.airportChoice || '');
      if (ap && !String(h.airportIata || '').includes(`(${ap.iata})`)) {
        let mins = await fetchDriveMinutes(Number(lat), Number(lon), ap.lat, ap.lon);
        if (mins === null) mins = Math.max(5, Math.round((ap.airMeters / 1000) * 1.1));
        airportUpdate.airportIata = `${ap.name} (${ap.iata})`;
        airportUpdate.airportMinutes = mins;
      }
      const list = getHotels();
      // Liste könnte sich zwischenzeitlich geändert haben: nur aktualisieren, wenn derselbe Eintrag noch an der Stelle steht
      if (list[i] && list[i].hotelName === h.hotelName && list[i].location === h.location) {
        list[i] = { ...list[i], lat, lon, ...env, ...airportUpdate };
        saveHotels(list);
      }
      done++;
    } catch {
      failed++; // Abbruch in der Trefferauswahl oder Server nicht erreichbar
    }
  }
  btn.disabled = false;
  say(`✅ ${done} Hotel(s) ergänzt${failed ? `, ${failed} übersprungen (abgebrochen oder Server nicht erreichbar – später erneut versuchen)` : ''}.`);
});

// Google-Suche nach Kinderpool und Spielplatz für das Hotel im Formular
document.getElementById('kidsSearchBtn')?.addEventListener('click', () => {
  const name = document.getElementById('hotelName')?.value.trim();
  const loc = document.getElementById('location')?.value.trim();
  if (!name) { alert('Bitte zuerst den Hotelnamen eintragen.'); return; }
  const q = `"${name}" ${loc || ''} Kinderbecken Kinderpool Spielplatz`.replace(/\s+/g, ' ').trim();
  window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank');
});

const importInput = document.getElementById('importFile');
document.getElementById('importBtn')?.addEventListener('click', () => importInput?.click());
importInput?.addEventListener('change', async () => {
  const file = importInput.files?.[0];
  if (!file) return;
  try {
    const { added, updated, skipped } = importCsvText(await file.text());
    alert(`${added} neu, ${updated} aktualisiert${skipped ? `, ${skipped} unverändert (eigene Version ist aktueller oder gleich)` : ''}.`);
  } catch (err) {
    alert(`Import fehlgeschlagen: ${err.message}`);
  } finally {
    importInput.value = '';
  }
});

document.getElementById('sortBy')?.addEventListener('change', (e) => setView({ sortBy: e.target.value }));
document.getElementById('periodFilter')?.addEventListener('change', (e) => setView({ period: e.target.value }));

// Nachschlagen: wie die Punkte zustande kommen (aus denselben Konstanten wie die Rechnung)
function renderScoringHelp() {
  const el = document.getElementById('scoringHelpBody');
  if (!el) return;
  const row = (a, b) => `<tr><td>${a}</td><td>${b}</td></tr>`;
  const boards = Object.entries(BOARD_POINTS).map(([k, v]) => row(k, fmtPoints(v))).join('');
  el.innerHTML = `
    <p>Score = <b>Qualität</b> + <b>Preisanpassung</b>. Bei „Nur Qualität“ entfällt die Preisanpassung.</p>
    <h4>Qualität</h4>
    <table>
      ${row('Portalnoten (Durchschnitt aller eingetragenen Portale)', 'bis 35')}
      ${row('Eigene Bewertung (2,5–5 Sterne)', 'bis 20')}
      ${row('Strand-Schatten: Überdachung / beides / Schirme', '+6 / +5 / +2')}
      ${row('Strand-Art: Sand / Sand-Kies', '+5 / +2')}
      ${row('Strandentfernung: bis 200 m / 400 m / 500 m / 600 m', '+4 / 0 / −3 / −6')}
      ${row('… ab ca. 735 m', '−10')}
      ${row('Kinderpool, Spielplatz: je Ja / Unbekannt / Nein', '+3 / 0 / −6')}
      ${row(`Transfer: bis ${TRANSFER_FREE_MIN} Min. frei, dann je 10 Min.`, `−${TRANSFER_POINTS_PER_10MIN} (max. −${TRANSFER_MAX_MALUS})`)}
      ${row('Einkauf bis 500 m / bis 1 km', '+2 / +1')}
      ${row('Hauptstraße bis 100 / 200 / 300 m', '−3 / −2 / −1')}
      ${row('Flughafen bis 4 / 8 km (Fluglärm)', '−3 / −1')}
      ${row('Portal-Bonus für teure Hotels: je 10 % über mittlerem Preis', `+${String(PORTAL_BONUS_PER_10PCT).replace('.', ',')} (max. +${PORTAL_BONUS_MAX})`)}
    </table>
    <h4>Verpflegung</h4>
    <table>${boards}</table>
    <h4>Preis</h4>
    <p>Verglichen mit dem mittleren Preis der angezeigten Hotels: je 10 % teurer ca. −2,5, je 10 % günstiger ca. +2,5 Punkte. Mit zweitem Veranstalterpreis zählt der Mittelwert beider Preise; liegt einer über 15 % darunter, erscheint „⚡ Schnäppchen“.</p>
    <h4>Gleichauf</h4>
    <p>Weniger als ${String(TIE_POINTS).replace('.', ',')} Punkte Abstand gelten als „praktisch gleichauf“.</p>`;
}
renderScoringHelp();

// Geteiltes Hotel schon in der Liste? Dann Eintrag zum Aktualisieren öffnen.
function hideDuplicateNotice() {
  const n = document.getElementById('dupNotice');
  if (n) n.hidden = true;
}
(function checkSharedDuplicate() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get('title') && !params.get('text') && !params.get('url')) return;
  const shared = { hotelName: document.getElementById('hotelName')?.value.trim(), location: '', url: document.getElementById('url')?.value.trim() };
  if (!shared.hotelName && !shared.url) return;
  const list = getHotels();
  const idx = findSameHotelIndex(list, shared);
  if (idx < 0) return;
  const old = list[idx];
  editHotel(idx);
  if (shared.url) document.getElementById('url').value = shared.url; // neuester Link
  const n = document.getElementById('dupNotice');
  if (n) {
    n.hidden = false;
    n.textContent = `🔁 „${old.hotelName}“ ist schon gespeichert${old.price ? ` (bisher ${old.price} €)` : ''}. Neuen Preis eintragen und speichern – der alte Preis wird mit angezeigt.`;
  }
})();

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', renderList); }
else { renderList(); }