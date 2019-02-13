import React, { Component } from 'react'
import { Route, Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Home from './components/Home'
import Signin from './components/signin/'
import firebase from './config/firebase'
import { authStateChange } from './actions/'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import './App.css'

function checkLoginStatus (auth) {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount () {
    this.checkLoginStatusReactSide()
  }

  checkLoginStatusReactSide = async () => {
    const { authStateChange } = this.props
    try {
      const user = await checkLoginStatus(firebase.auth())
      if (user && user.email) {
        firebase.database().ref('users').once('value', (snapshot) => {
          if (snapshot.hasChild(firebase.auth().currentUser.uid)) {
            firebase.database().ref('admin').once('value', (snapshot) => {
              if (snapshot.hasChild(firebase.auth().currentUser.uid)) {
                authStateChange(true, firebase.auth().currentUser, true)
              } else {
                authStateChange(true, firebase.auth().currentUser, false)
              }
            }).catch(function () {
              authStateChange(true, firebase.auth().currentUser, false)
            })
          } else {
            authStateChange(false, null, false)
            firebase.auth().signOut()
            alert('Kontakta Hisinge Buss för ett riktigt konto.')
          }
        }).catch(function () {
          authStateChange(false, null, false)
        })
      } else {
        authStateChange(false, null, false)
      }      
    } catch (err) {
      alert('Firebase connection failed. Kontrollera nätverksanslutningen och starta om.')
      authStateChange(false, null, false)
    }
  }

  render () {
    const { isSignedin, isActive = false } = this.props
    return (
      <div className="application p-1 m-0">
        { isActive ? (
          <div className="p-0 m-0">
            <header className="main-header fixed-top container zindex-sticky bg-white mt-1 mb-1 p-2">
              <nav className="nav nav-pills nav-fill d-flex align-items-baseline">
                <Link to={'/'} className="nav-item nav-link font-weight-bold h5 align-left hb-red">Inmatning</Link>
                <Link to={'/history'} className="nav-item nav-link font-weight-bold h5 align-middle hb-red">Historik</Link>
                <Link to={'/signin/'} className="nav-item nav-link font-weight-bold h5 align-right hb-red">
                  { isSignedin ? (
                    <span>Logga ut</span>
                  ) : (
                    <span>Logga in</span>
                  )}

                </Link>
              </nav>
            </header>

            <main className="main-content mt-5 pt-5 pb-5 mb-5 pl-2 pr-2 container text-center">
              <Route exact path={'/'} render={() => <Home />} />
              <Route exact path={'/history/'} render={() => <Signin />} />
              <Route exact path={'/signin/'} render={() => <Signin />} />
            </main>
          </div>
        ) : (
          <div className="font-weight-bold mx-2 py-5 my-5 text-center">
            <h2 className="my-3">Ansluter till databas</h2>
            <h5 className="my-3 py-3">Google Firebase</h5>
            <h1 className="my-5 hb-red"><FontAwesomeIcon icon={faSpinner} spin size="4x" /></h1>
          </div>
        )}
      </div>
    )
  }
}

App.propTypes = {
  authStateChange: PropTypes.func,
  isSignedin     : PropTypes.bool,
  isActive       : PropTypes.bool
}

const mapDispatchToProps = dispatch => bindActionCreators({
  authStateChange
}, dispatch)

const mapStateToProps = state => ({
  isSignedin: state.user.signin,
  isActive: state.user.fbresponded
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
