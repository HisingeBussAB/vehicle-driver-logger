import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../modules'

const initialState = {
  user: {
    signin: false,
    user  : {
      uid        : null,
      displayName: null
    },
    isAdmin: false
  }
}
const enhancers = []
const middleware = [
  thunk
]

if (process.env.NODE_ENV === 'development') {
  const freeze = require('redux-freeze')
  middleware.push(freeze)
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
