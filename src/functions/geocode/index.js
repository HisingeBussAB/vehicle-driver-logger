import parseGoogleResponse from './parseGoogle'
import parseOpenResponse from './parseOpen'

async function getJson (url) {
  const response = await fetch(url).catch(() =>
    Promise.reject(new Error('Kunde inte ansluta till karttjänst.'))
  )

  const json = await response.json().catch(() => {
    return Promise.reject(new Error('Kunde inte läsa serversvar.'))
  })

  return json
}

export async function fromLatLng (_lat, _lng, _GoogleKey = false) {
  if (!_lat || !_lng) {
    return Promise.reject(new Error('Felformaterade koordinater.'))
  }
  const lat = `${_lat}`
  const lng = `${_lng}`
  const latLng = `${lat},${lng}`
  const GOOGLE_KEY = _GoogleKey ? `&key=${_GoogleKey}` : null

  const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURI(latLng)}${GOOGLE_KEY}`
  const openURL = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURI(lat)}&lon=${encodeURI(lng)}`

  const gjson = await getJson(googleUrl)
  if (typeof gjson === 'object' && gjson.status === 'OK') {
    return parseGoogleResponse(gjson)
  }

  // eslint-disable-next-line no-console
  console.info('Google GeocodeAPI failed, falling back to OpenStreetMaps')
  if (typeof gjson === 'object' && typeof gjson.error_message === 'string') {
    // eslint-disable-next-line no-console
    console.info(gjson.status)
    // eslint-disable-next-line no-console
    console.info(gjson.error_message)
  }

  const ojson = await getJson(openURL)
  if (typeof ojson === 'object' && typeof ojson.address === 'object') { 
    return parseOpenResponse(ojson)
  }
  return Promise.reject(new Error(`OpenStreetMap: ${ojson.error}. Google Maps: ${gjson.error_message}`))
}
