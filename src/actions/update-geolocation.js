import Geocode from 'react-geocode'
import config from '../config/config'

export function updateGeolocation (_coords = false, isGeolocationAvailable = false, isGeolocationEnabled = false, positionError = false) {

  const coords = {
    accuracy        : typeof _coords.accuracy === 'undefined' ? null : _coords.accuracy,
    altitude        : typeof _coords.altitude === 'undefined' ? null : _coords.altitude,
    altitudeAccuracy: typeof _coords.altitudeAccuracy === 'undefined' ? null : _coords.altitudeAccuracy,
    heading         : typeof _coords.heading === 'undefined' ? null : _coords.heading,
    latitude        : typeof _coords.latitude === 'undefined' ? null : _coords.latitude,
    longitude       : typeof _coords.longitude === 'undefined' ? null : _coords.longitude,
    speed           : typeof _coords.speed === 'undefined' ? null : _coords.speed
  }

  return async (dispatch) => {
    const isActive = isGeolocationAvailable && isGeolocationEnabled && !positionError
    const error = isActive ? null
      : isGeolocationEnabled ? 'Appen måste ges behörighet till GPS'
        : isGeolocationAvailable ? 'Laddar position...'
          : typeof positionError.message === 'undefined' ? 'Okänt fel' : positionError.message
    let temp = ''
    if (isActive) {
      Geocode.setApiKey(config.MapsKey)
      temp = await Geocode.fromLatLng(coords.latitude, coords.longitude).then(
        response => {
          return response.results[0].formatted_address
        },
        error => {
          return error
        })
    }
    const address = temp

    dispatch({
      type   : 'GET_LOCATION',
      payload: {
        error  : error,
        active : isActive,
        coords : coords,
        address: address
      }
    })
  }
}
