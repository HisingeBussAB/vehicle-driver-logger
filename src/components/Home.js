import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Signinform from './signin'
import PropTypes from 'prop-types'
import LocListener from './location-listener'
import moment from 'moment'
import 'moment/locale/sv'
import Dropdown from 'react-dropdown'
import AddressInput from './uncontrolled/address-input.js'

class Home extends Component {
  constructor (props) {
    super(props)
    const { address } = this.props
    console.log(address)
    this.state = {
      type    : 'start',
      datetime: moment(),
      counter : 0,
      vehicle : 'XXX111',
      note    : ''
    }
  }

  onDateChange = e => {
    const { datetime } = this.state
    this.setState({ datetime: moment(e.target.value + ' ' + datetime.format('HH:mm')) })
  }

  onTimeChange = e => {
    const { datetime } = this.state
    this.setState({ datetime: moment(datetime.format('YYYY-MM-DD') + ' ' + e.target.value) })
  }

  _onSelect = (e) => this.setState({ type: e.value })

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render () {
    const { isSignedin = false, user, address } = this.props
    const { ...state } = this.state

    
    const options = [
      { value: 'start', label: 'Starta resa' },
      { value: 'end', label: 'Avsluta resa' }
    ]
    const defaultOption = state.type

    return (
      <div className="Home mx-auto w-75">

        {isSignedin ? (
          <div>
            <h3>Hej {user.displayName}</h3>
            <form>
              <div className="d-flex align-items-baseline">
                <li>
                  <ul><Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" /></ul>
                  <ul><input value={state.datetime.format('YYYY-MM-DD')} placeholder="YYYY-MM-DD" type="date" onChange={this.onDateChange} /></ul>
                  <ul><input value={state.datetime.format('HH:mm')} placeholder="HH:mm" type="time" onChange={this.onTimeChange} /></ul>
                  <ul><input name="vehicle" value={state.vehicle} placeholder="Fordon" type="text" onChange={this.handleChange} /></ul>
                  <ul><input name="counter" value={state.counter} placeholder="Mätarställning" type="number" onChange={this.handleChange} /></ul>
                  <ul><AddressInput defaultAddress={address} key={address} /></ul>
                  <ul><input name="note" value={state.note} placeholder="Frivillig anteckning" type="text" onChange={this.handleChange} /></ul>
                </li>

              </div>
              <h5>Lista senast ifyllda</h5>
            </form>
            <LocListener />
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
  user      : PropTypes.object,
  address   : PropTypes.string
}

const mapStateToProps = state => ({
  isSignedin: state.user.signin,
  user      : state.user.user,
  address   : state.location.address
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps)(Home)
