export default function user(state = {
  signin: false,
  user: {
    uid: null,
    displayName: null
  },
  isAdmin: false,
}, action) {
  switch(action.type){
  
  case 'AUTH_STATE_CHANGED':

    return {...state, ...action.payload};
 
  default:
    return state;

  }
}