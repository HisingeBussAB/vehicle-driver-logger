import { isMobile } from 'react-device-detect'
import { fromLatLng } from '../functions/geocode'
import firebase from '../config/firebase'

export function updateGeolocation (_coords = false, isGeolocationAvailable = false, isGeolocationEnabled = false, positionError = false) {
  const isActive = isGeolocationAvailable && isGeolocationEnabled && !positionError && typeof _coords.accuracy !== 'undefined' && _coords.accuracy < 1000 && isMobile
  const coords = {
    accuracy : typeof _coords.accuracy === 'undefined' ? null : _coords.accuracy,
    latitude : typeof _coords.latitude === 'undefined' ? null : _coords.latitude,
    longitude: typeof _coords.longitude === 'undefined' ? null : _coords.longitude,
    isActive : isActive
  }

  return async (dispatch) => {
    const error = isActive ? null
    : !isMobile ? 'Autoadress är bara tillgängligt på mobil.'
      : !isGeolocationEnabled ? 'Ge behörighet till GPS'
        : !isGeolocationAvailable ? 'Laddar position...'
          : typeof _coords.accuracy === 'undefined' || _coords.accuracy > 1000 ? 'Dålig positionsdata, aktivera GPS.'
            : typeof positionError.message === 'undefined' ? 'Okänt GPS-fel' : positionError.message
    let temp = ''
    if (isActive) {
      const googleApiKey = await firebase.database().ref('/MapsKey/').once('value')
      temp = await fromLatLng(coords.latitude, coords.longitude, googleApiKey.val()).then(
        response => {
          return response
        },
        error => {
          return error
        })
    }

    if (typeof temp !== 'string') {
      temp = 'error!'
    }

    const src = !!temp.search('GOOGLE:')
    const address = temp.replace('GOOGLE:', '')

    dispatch({
      type   : 'GET_LOCATION',
      payload: {
        error       : error,
        active      : isActive,
        coords      : coords,
        address     : address,
        srcIsGooogle: src
      }
    })
  }
}
