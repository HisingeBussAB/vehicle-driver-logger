
export function authStateChange(loginstate, user, isadmin) {

  if (user == null) {
    user = {
      uid: null,
      displayName: null
    };
  }
  return {
    type: 'AUTH_STATE_CHANGED',
    payload: {
      signin: loginstate,
      user: user,
      isAdmin: isadmin
    }
  };

  
}


