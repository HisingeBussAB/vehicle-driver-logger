import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import firebase from '../../config/firebase'
import firebaseui from 'firebaseui'

class Signinform extends Component {
  componentDidMount () {
    const uiConfig = {
      signInSuccessUrl: '/',
      signInOptions   : [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    }
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  }

  render () {
    return (
      <div className="signin-field">
        <Helmet link={[
          { rel: 'stylesheet', href: 'https://cdn.firebase.com/libs/firebaseui/2.5.1/firebaseui.css' }
        ]} />
        <div id="firebaseui-auth-container" />
      </div>
    )
  }
}

export default Signinform
