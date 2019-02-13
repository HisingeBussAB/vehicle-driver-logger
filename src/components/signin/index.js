import React, { Component } from 'react'
import { connect } from 'react-redux'
import Signinform from './signin'
import IsSignedInDOM from './issignedin'
import PropTypes from 'prop-types'

class Signin extends Component {
  render () {
    const { isSignedin } = this.props
    return (
      <div className="signin text-center">
        {isSignedin ? (
          <IsSignedInDOM />
        ) : (
          <Signinform />
        )}
      </div>
    )
  }
}

Signin.propTypes = {
  isSignedin: PropTypes.bool
}

const mapStateToProps = state => ({
  isSignedin: state.user.signin
})

export default connect(
  mapStateToProps,
  null)(Signin)
