import React, { Component } from 'react'
import { Route, Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Home from './components/Home'
import Signin from './components/signin/'
import firebase from './config/firebase'
import { authStateChange } from './actions/'
import PropTypes from 'prop-types'

import './App.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {
    const { authStateChange } = this.props
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref('admin').once('value', (snapshot) => {
          if (snapshot.hasChild(firebase.auth().currentUser.uid)) {
            authStateChange(true, firebase.auth().currentUser, true)
            console.log('IS ADMIN')
          } else {
            authStateChange(true, firebase.auth().currentUser, false)
            console.log('IS NOT ADMIN')
          }
        })
          .catch(function () {
            authStateChange(true, firebase.auth().currentUser, false)
          })
      } else {
        authStateChange(false, null, false)
      }
    })
  }

  render () {
    const { isSignedin } = this.props
    return (
      <div className="application">
        <header className="main-header fixed-top container zindex-sticky bg-white mt-1 mb-1 p-2">
          <nav className="nav nav-pills nav-fill d-flex align-items-baseline">
            <Link to={'/'} className="nav-item nav-link font-weight-bold text-large align-left">Körjournal</Link>
            <Link to={'/history'} className="nav-item nav-link font-weight-bold text-large align-middle">Historik</Link>
            <Link to={'/signin/'} className="nav-item nav-link font-weight-bold text-large align-right">
              { isSignedin ? (
                <span>Mitt konto</span>
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
        <footer className="main-footer mt-1 mb-1 p-2 text-small text-center fixed-bottom bg-white zindex-sticky">
          Support: <a href="mailto:hakan@hisingebuss.se">hakan@hisingebuss.se</a>
        </footer>

      </div>
    )
  }
}

App.propTypes = {
  authStateChange: PropTypes.func,
  isSignedin     : PropTypes.bool
}

const mapDispatchToProps = dispatch => bindActionCreators({
  authStateChange
}, dispatch)

const mapStateToProps = state => ({
  isSignedin: state.user.signin
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
