import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Signinform from './signin'
import PropTypes from 'prop-types'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {

  }

  render () {
    const { isSignedin = false } = this.props
    return (
      <div className="Home mx-auto w-75">

        {isSignedin ? (
          <div>
            <h1>Lägg till körning</h1>
            <form>
            Förare: <input value="hi" />

            </form>
          </div>
        ) : (
          <Signinform />
        )
        }

      </div>
    )
  }
}

Home.propTypes = {
  isSignedin: PropTypes.bool,
  userId    : PropTypes.string
}

const mapStateToProps = state => ({
  isSignedin: state.user.signin,
  user      : state.user.user,
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps)(Home)
