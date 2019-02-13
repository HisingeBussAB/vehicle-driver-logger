import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import store from './store'
import App from './App'
import * as serviceWorker from './serviceWorker'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/react-dropdown/style.css'
import './index.css'

const target = document.querySelector('#root')

render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route component={App} />
      </div>
    </BrowserRouter>
  </Provider>,
  target
)

serviceWorker.register()
