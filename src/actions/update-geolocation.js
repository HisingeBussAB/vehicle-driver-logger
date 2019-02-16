import Geocode from 'react-geocode'
import config from '../config/config'

export function updateGeolocation (_coords = false, isGeolocationAvailable = false, isGeolocationEnabled = false, positionError = false) {

  const isActive = isGeolocationAvailable && isGeolocationEnabled && !positionError && typeof _coords.accuracy !== 'undefined' && _coords.accuracy < 1000
  const coords = {
    accuracy        : typeof _coords.accuracy === 'undefined' ? null : _coords.accuracy,
    latitude        : typeof _coords.latitude === 'undefined' ? null : _coords.latitude,
    longitude       : typeof _coords.longitude === 'undefined' ? null : _coords.longitude,
    isActive : isActive
  }

  return async (dispatch) => {
    
    const error = isActive ? null
      : !isGeolocationEnabled ? 'Appen måste ges behörighet till GPS'
        : !isGeolocationAvailable ? 'Laddar position...'
          : typeof _coords.accuracy === 'undefined' || _coords.accuracy > 1000 ? 'För dålig positionsdata, aktivera GPS eller ange manuellt.'
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
