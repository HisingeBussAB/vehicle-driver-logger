import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../modules'

const initialState = {
  user: {
    signin: false,
    user  : {
      uid        : null,
      displayName: null,
      fbresponded: false
    },
    isAdmin: false
  },
  location: {
    error : null,
    active: false,
    coords: {
      accuracy        : null,
      latitude        : null,
      longitude       : null,
      isActive        : false
    },
    address: ''
  }
}
const enhancers = []
const middleware = [
  thunk
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)

export default store
