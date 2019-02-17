export default function parseGoogleResponse (json) {
  return typeof json.results[0].formatted_address === 'string'
    ? json.results[0].formatted_address.replace(', Sweden', '')
    : 'Kan inte tolka OK svar från Google Maps.'
}
