export default function location (state = null, action) {
  switch (action.type) {
    case 'GET_LOCATION':

      return { ...state, ...action.payload }
 
  default:
      return state

  }
}
