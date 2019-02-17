export default function parseGoogleResponse (json) {
  let result = ''
  if (typeof json.address.road === 'string' && json.address.road.length > 0) { result = json.address.road }
  if (typeof json.address.postcode === 'string' && json.address.postcode.length > 0) { result += ', ' + json.address.postcode }
  if (typeof json.address.city === 'string' && json.address.city.length > 0) { result += ' ' + json.address.city } else {
    if (typeof json.address.hamlet === 'string' && json.address.hamlet.length > 0) { result += ' ' + json.address.hamlet }
    if (typeof json.address.county === 'string' && json.address.county.length > 0) { result += ', ' + json.address.county.replace(' kommun', '') }
  }
  if (result.length > 4) {
    if (typeof json.address.country === 'string' && json.address.country !== 'Sweden') { result += ', ' + json.city.country }
    return result
  }
  return 'Kan inte tolka OK svar från OpenStreetMap.' 
}
