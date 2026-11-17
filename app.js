const STORAGE_KEY = 'saved_hotels_v1';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then((reg) => reg.update()).catch(console.error);
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

const AIRPORTS = [
  { iata: 'AYT', name: 'Antalya', lat: 36.8987, lon: 30.8005 },
  { iata: 'GZP', name: 'Gazipaşa-Alanya', lat: 36.2992, lon: 32.3006 },
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
  { iata: 'TFN', name: 'Teneriffa Nord', lat: 28.4827, lon: -16.3415 },
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

async function geocodeHotel(hotelName, location) {
  const headers = { 'Accept-Language': 'de', 'User-Agent': 'HotelSammlerPWA/1.0' };
  const cleanLocation = location.normalize('NFC');
  const cleanName = hotelName.normalize('NFC');
  
  for (const q of [`${cleanName}, ${cleanLocation}`, cleanLocation]) {
    try {
      await throttleNominatim();
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
      const data = await fetchJsonSafe(url, { headers }, 6000);
      if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), exact: q.includes(cleanName) };
    } catch (err) {}
  }
  throw new Error('Ort konnte auf OpenStreetMap nicht gefunden werden.');
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
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

async function fetchOceanTile(tileUrl, z, x, y) {
  const url = tileUrl.replace('{z}', z).replace('{x}', x).replace('{y}', y);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (res.status === 204 || res.status === 404) return { extent: 4096, rings: [] };
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return decodeOceanTile(new Uint8Array(await res.arrayBuffer()));
  } finally { clearTimeout(timer); }
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

function computeRankedHotels(list) {
  if (!list || list.length === 0) return [];
  const validPrices = list.map((h) => Number(h.price)).filter((p) => p > 0);
  const avgPrice = validPrices.length > 0 ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length : 0;

  const scored = list.map((h, origIndex) => {
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

    const bm = Number(h.beachMeters);
    if (h.beachMeters !== '' && h.beachMeters != null && !isNaN(bm) && bm >= 0) {
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

    let portalSource = 'Direkt';
    if (h.url) {
      if (h.url.includes('check24') || h.url.includes('c.24.de')) portalSource = 'Check24';
      else if (h.url.includes('tui')) portalSource = 'TUI';
      else if (h.url.includes('holidaycheck')) portalSource = 'HolidayCheck';
      else if (h.url.includes('booking')) portalSource = 'Booking';
    }

    return { ...h, origIndex, normalizedPortal10, totalQuality, premiumBonusPct: Math.round((premiumBonusFactor - 1) * 100), plScore, portalSource };
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
  const tui = document.getElementById('rateTUI'); if (tui) tui.value = h.rateTUI || '';
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
      h.rateTUI ? `TUI: ${h.rateTUI}/10` : null,
      h.rateGoogle ? `G: ${h.rateGoogle}/5` : null,
      hcDisplay,
      h.rateTA ? `TA: ${h.rateTA}/5` : null
    ].filter(Boolean).join(' · ');

    return `
      <div class="item ${isWinner ? 'winner' : ''}">
        <div class="item-head">
          <div>
            <span>${medal} · ${h.hotelName} (${h.price ? h.price + ' €' : 'k. A.'}) [${h.portalSource}]</span><br/>
            <span class="score-pill">P/L-Score: ${h.plScore} Pkt. · Quali: ${h.totalQuality}${h.normalizedPortal10 !== null ? ` · Portale: ${h.normalizedPortal10}/10` : ''}${h.premiumBonusPct > 0 ? ` (+${h.premiumBonusPct}% Bonus)` : ''}</span>
          </div>
          <div style="display:flex;gap:4px;">
            <button type="button" class="btn-small" onclick="editHotel(${h.origIndex})">✏️</button>
            <button type="button" class="btn-del" onclick="deleteHotel(${h.origIndex})">✕</button>
          </div>
        </div>
        <div class="meta">📍 ${h.location} · ✈️ ${h.airportIata || '?'} (${h.airportMinutes || '?'} Min.) · 🏖️ ${h.beachMeters !== '' && h.beachMeters != null ? h.beachMeters + ' m zum Meer' : 'kein Meer gefunden'}</div>
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
        rateC24: document.getElementById('rateC24')?.value.trim().replace(',', '.') || '',
        rateTUI: document.getElementById('rateTUI')?.value.trim().replace(',', '.') || '',
        rateGoogle: document.getElementById('rateGoogle')?.value.trim().replace(',', '.') || '',
        rateHC: document.getElementById('rateHC')?.value.trim().replace(',', '.') || '',
        rateTA: document.getElementById('rateTA')?.value.trim().replace(',', '.') || '',
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
    
    const headers = [
      'Rang', 'Portal_Quelle', 'PL_Score', 'Qualitaets_Punkte', 'Portal_Schnitt_10', 'Premium_Bonus_Pct',
      'Datum', 'Hotel', 'Ort', 'Preis_EUR', 'Verpflegung',
      'CHECK24_10', 'TUI_10', 'Google_5', 'HolidayCheck_Prozent', 'TripAdvisor_5', 'Eigene_Bewertung',
      'Strand_Art', 'Strand_Schatten', 'Entfernung_Strand_m', 'Flughafen', 'Fahrtdauer_Flughafen_Min',
      'Spielplatz', 'Reisezeitraum', 'Notiz', 'Hotel_Link'
    ];

    const rows = ranked.map((h, idx) => [
      idx + 1,
      h.portalSource,
      String(h.plScore ?? '').replace('.', ','),
      String(h.totalQuality ?? '').replace('.', ','),
      h.normalizedPortal10 !== null ? String(h.normalizedPortal10).replace('.', ',') : '',
      h.premiumBonusPct,
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
      h.url
    ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'));

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const file = new File([csvContent], 'hotel_ranking.csv', { type: 'text/csv;charset=utf-8;' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ title: 'Hotel Ranking', files: [file] }); return; } catch (e) {}
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = 'hotel_ranking.csv';
    a.click();
  });
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', renderList); }
else { renderList(); }