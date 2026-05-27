const CITY_COORDS: Record<string, [number, number]> = {
  'london':           [51.5074, -0.1278],
  'greater london':   [51.5074, -0.1278],
  'cambridge':        [52.2053,  0.1218],
  'edinburgh':        [55.9533, -3.1883],
  'manchester':       [53.4808, -2.2426],
  'bristol':          [51.4545, -2.5879],
  'leeds':            [53.8008, -1.5491],
  'reading':          [51.4543, -0.9781],
  'birmingham':       [52.4862, -1.8904],
  'st albans':        [51.7526, -0.3360],
  'hemel hempstead':  [51.7526, -0.4477],
  'walton oaks':      [51.3097, -0.2376],
  'paris':            [48.8566,  2.3522],
  'geneva':           [46.2044,  6.1432],
  'zurich':           [47.3769,  8.5417],
  'newcastle':        [54.9783, -1.6178],
  'sheffield':        [53.3811, -1.4701],
  'nottingham':       [52.9548, -1.1581],
  'liverpool':        [53.4084, -2.9916],
  'glasgow':          [55.8642, -4.2518],
  'oxford':           [51.7520, -1.2577],
  'coventry':         [52.4068, -1.5197],
  'york':             [53.9590, -1.0815],
  'milton keynes':    [52.0406, -0.7594],
  'guildford':        [51.2362, -0.5704],
  'slough':           [51.5105, -0.5950],
  'watford':          [51.6565, -0.3903],
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function locationCoordsWithinRadius(
  location: string,
  originLat: number,
  originLng: number,
  radiusKm: number
): boolean {
  const parts = location.split(/[;,]/).map(p => p.trim().toLowerCase())
  for (const part of parts) {
    for (const [city, [lat, lng]] of Object.entries(CITY_COORDS)) {
      if (part.includes(city)) {
        if (haversineKm(originLat, originLng, lat, lng) <= radiusKm) return true
      }
    }
  }
  return false
}

export async function lookupPostcode(postcode: string): Promise<{ lat: number; lng: number } | null> {
  const clean = postcode.replace(/\s+/g, '').toUpperCase()
  const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}`)
  if (!res.ok) return null
  const json = await res.json()
  if (json.status !== 200 || !json.result) return null
  return { lat: json.result.latitude, lng: json.result.longitude }
}
