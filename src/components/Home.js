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
import firebase from '../config/firebase'
import { normalize, changeExt } from 'upath';

class Home extends Component {
  constructor (props) {
    super(props)
    const { address } = this.props
    console.log(address)
    this.state = {
      type    : 'end',
      datetime: moment(),
      counter : '',
      vehicle : '',
      note    : '',
      fblist  :  {empty: {empty: ''}},
      fbtrips : null
    }
  }

  componentDidMount () {
    const { user = { uid: '' } } = this.props
    const trips = firebase.database().ref('/userData/' + user.uid + '/trips/').orderByKey().limitToLast(10)
    trips.on('value', (snapshot) => {
      const result = snapshot.val()
      this.setState({ fbtrips: result })
    })

    const list = firebase.database().ref('/userData/' + user.uid + '/list/').orderByKey().limitToLast(30)
    list.on('value', (snapshot) => {
      const result = snapshot.val()
      this.setState({ fblist: result })
    })
  }

  writeNewPost = (e) => {
    e.preventDefault()
    this.normalizeTrips()
    const { user } = this.props
    const { type, datetime, counter, vehicle, note } = this.state
    const uid = user.uid
    const postData = {
      uid     : uid,
      type    : type,
      counter : counter,
      vehicle : vehicle,
      note    : note,
      timefull: datetime.format(),
      timeunix: datetime.format('X'),
      year    : datetime.format('YYYY')
    }

    const updates = {}
    firebase.database().ref('userData/' + uid).once('value').then(snapshot => {
      if (snapshot.exists() === false) {
        const newItemKey = firebase.database().ref('userData/' + uid).child('list').push().key
        const newTripKey = firebase.database().ref('userData/' + uid).child('trips').push().key
        postData.tripkey = newTripKey
        updates['/userData/' + uid + '/list/' + newItemKey] = postData
        updates['/userData/' + uid + '/trips/' + newTripKey + '/start/' + newItemKey] = { timestap: datetime.format('X') }
        return firebase.database().ref().update(updates)
      } else {
        const newItemKey = firebase.database().ref('userData/' + uid).child('list').push().key
        firebase.database().ref('userData/' + uid + '/trips/').orderByKey().limitToLast(1).once('child_added').then(snapshot => {
          if (type === 'start') {
            const newTripKey = firebase.database().ref('userData/' + uid).child('trips').push().key
            postData.tripkey = newTripKey
            updates['/userData/' + uid + '/list/' + newItemKey] = postData
            updates['/userData/' + uid + '/trips/' + newTripKey + '/start/' + newItemKey] = { timestap: datetime.format('X'), year: datetime.format('YYYY') }
          } else {
            updates['/userData/' + uid + '/list/' + newItemKey] = postData
            updates['/userData/' + uid + '/trips/' + snapshot.key + '/end/' + newItemKey] = { timestap: datetime.format('X'), year: datetime.format('YYYY') }
          }
          return firebase.database().ref().update(updates)
        })
      }
    })
  }

  normalizeTrips = () => {
    const {fbtrips, fblist} = this.state
    const normalized = []
    Object.keys(fbtrips).forEach(item => {
      console.log(item)
      console.log(fbtrips[item])
    })
    Object.keys(fblist).forEach(item => {
      console.log(item)
      console.log(fblist[item])
    })
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
                <ul><AddressInput defaultAddress={address} key={address}/></ul>
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
