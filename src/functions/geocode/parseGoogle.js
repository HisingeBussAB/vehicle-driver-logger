export default function parseGoogleResponse (json) {
  let result = ''
  if (typeof json.results[0].formatted_address === 'string') {
    result = json.results[0].formatted_address.replace(', Sweden', '')
    result = result.replace(', Sverige', '')
  } else {
    result = 'Kan inte tolka OK svar från Google Maps.'
  }
  return result
}
