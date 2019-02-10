import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NotSignedIn from './notsignedin'
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
    return (
      <div className="Home mx-auto w-75">

        {this.props.signedin ? (
          <div>
          <h1>Lägg till körning</h1>
          <form>
            Förare: <input value="hi"></input>

          </form>
          </div>
        ) : (
          <NotSignedIn />
        )
        }

      </div>
    )
  }
}

Home.propTypes = {
  signedin: PropTypes.bool,
  userId  : PropTypes.string,
  isAdmin : PropTypes.bool
}

const mapStateToProps = state => ({
  signedin: state.user.signin,
  user  : state.user.user,
  isAdmin : state.user.isAdmin

})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps)(Home)
