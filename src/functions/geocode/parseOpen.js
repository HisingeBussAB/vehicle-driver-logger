export default function parseGoogleResponse (json) {
  let result = ''
  console.log(json)
  if (typeof json.address.road_reference_intl === 'string' && json.address.road_reference_intl.length > 0) { result = json.address.road_reference_intl }
  if (typeof json.address.road_reference === 'string' && json.address.road_reference.length > 0) { result = json.address.road_reference }
  if (typeof json.address.residential === 'string' && json.address.residential.length > 0) { result = json.address.residential }
  if (typeof json.address.path === 'string' && json.address.path.length > 0) { result = json.address.path }
  if (typeof json.address.pedestrian === 'string' && json.address.pedestrian.length > 0) { result = json.address.pedestrian }
  if (typeof json.address.street_name === 'string' && json.address.street_name.length > 0) { result = json.address.street_name }
  if (typeof json.address.footway === 'string' && json.address.footway.length > 0) { result = json.address.footway }
  if (typeof json.address.street === 'string' && json.address.street.length > 0) { result = json.address.street }
  if (typeof json.address.road === 'string' && json.address.road.length > 0) { result = json.address.road }

  if (typeof json.address.street_number === 'string' && json.address.street_number.length > 0) { result += ', ' + json.address.street_number }
  if (typeof json.address.house_number === 'string' && json.address.house_number.length > 0) { result += ', ' + json.address.house_number }
  if (typeof json.address.postcode === 'string' && json.address.postcode.length > 0) { result += ', ' + json.address.postcode }
  let foundcity = false
  if (typeof json.address.city === 'string' && json.address.city.length > 0) { result += ' ' + json.address.city ; foundcity = true }
  if (typeof json.address.town === 'string' && json.address.town.length > 0) { result += ' ' + json.address.town ; foundcity = true }
  if (typeof json.address.municipality === 'string' && json.address.municipality.length > 0) { result += ' ' + json.address.municipality ; foundcity = true }
  if (foundcity === false) {
    if (typeof json.address.village === 'string' && json.address.village.length > 0) { result += ' ' + json.address.village }
    if (typeof json.address.hamlet === 'string' && json.address.hamlet.length > 0) { result += ' ' + json.address.hamlet }
    if (typeof json.address.locality === 'string' && json.address.locality.length > 0) { result += ' ' + json.address.locality }
    if (typeof json.address.croft === 'string' && json.address.croft.length > 0) { result += ' ' + json.address.croft }
    if (typeof json.address.county === 'string' && json.address.county.length > 0) { result += ', ' + json.address.county.replace(' kommun', '') }
    if (typeof json.address.country_name === 'string' && json.address.country_name.length > 0) { result += ', ' + json.address.country_name.replace(' kommun', '') }
  }
  if (result.length > 4) {
    if (typeof json.address.country === 'string' && !(json.address.country === 'Sweden' || json.address.country === 'Sverige')) { result += ', ' + json.address.country }
    return result
  }
  return 'Kan inte tolka OK svar från OpenStreetMap.'
}
