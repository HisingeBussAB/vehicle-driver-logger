import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/sv'
import AddressInput from './uncontrolled/address-input.js'
import firebase from '../config/firebase'


class TripList extends Component {
  constructor (props) {
    super(props)
     this.state = {
    }
  }

  componentDidMount () {
  }


  render () {
    const { isSignedin = false, user, address } = this.props
    const { fblist = {empty: {empty: ''}}, ...state } = this.state

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
              <li>
                <ul><Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" title="Anger om uppgifterna nedan för start eller slut på uppdrag." /></ul>
                <ul><input value={state.datetime.format('YYYY-MM-DD')} placeholder="YYYY-MM-DD" type="date" onChange={this.onDateChange} title="Anger datum" /></ul>
                <ul><input value={state.datetime.format('HH:mm')} placeholder="HH:mm" type="time" onChange={this.onTimeChange} title="Anger klockslag" /></ul>
                <ul><input name="vehicle" value={state.vehicle} placeholder="Regnr" type="text" onChange={this.handleChange} title="Anger regnr XXX111" pattern="[A-Z]{3}[0-9]{3}" /></ul>
                <ul><input name="counter" value={state.counter} placeholder="Mätarställning" type="number" onChange={this.handleChange} title="Anger mätarställning" /></ul>
                <ul><AddressInput defaultAddress={address} key={address} onChange={this.handleAddressChange}/></ul>
                <ul><input name="note" value={state.note} placeholder="Frivillig anteckning" type="text" onChange={this.handleChange} title="Anteckning. Frivllig uppgift" /></ul>
              </li>
              <button onClick={this.writeNewPost}>Save!</button>
            </form>
            <h5>Lista senast ifyllda</h5><div>
            {
              JSON.stringify(Object.assign({}, Object.assign([], fblist).reverse()))
            }

            </div>
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
