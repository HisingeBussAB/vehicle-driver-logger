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
import normalizeTripData from '../functions/normalizeTripData'
import LastTripsList from './list/lasttripslist'
import Autosuggest from 'react-autosuggest'

const getSuggestionValue = suggestion => suggestion.regno;

const renderSuggestion = suggestion => (
  <div>
    {suggestion.regno}
  </div>
);

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type         : 'end',
      date         : moment(),
      time         : moment(),
      datetimeerror: false,
      counter      : '',
      countererror : false,
      regno        : '',
      regnoerror   : false,
      note         : '',
      lastRegnos   : [{regno: '-'}],
      lastCounter  : [],
      fbtrips      : {},
      suggestions  : [],
      autoc        : ''
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
      if (result !== null && typeof result === 'object') {
        const lastRegnos = Object.values(result).map(item => {
          return { reg: item.regno }
        })
        console.log(lastRegnos)
        this.setState({ lastRegno: lastRegnos })
      }
    })
  }

  writeNewPost = (e) => {
    e.preventDefault()
    if (this.validateForm()) {
      const { user, coords } = this.props
      const { type, date, time, counter, regno, note, address } = this.state
      const datetime = moment(date.format('YYYY-MM-DD') + ' ' + time.format('HH:mm'))
      const uid = user.uid
      const postData = {
        uid     : uid,
        name    : user.displayName,
        type    : type,
        counter : counter,
        regno   : regno,
        note    : note,
        address : this.inputAddress.value,
        coords  : coords,
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
          updates['/userData/' + uid + '/trips/' + newTripKey + '/start/' + newItemKey] = postData
          return firebase.database().ref().update(updates)
        } else {
          const newItemKey = firebase.database().ref('userData/' + uid).child('list').push().key
          firebase.database().ref('userData/' + uid + '/trips/').orderByKey().limitToLast(1).once('child_added').then(snapshot => {
            if (type === 'start') {
              const newTripKey = firebase.database().ref('userData/' + uid).child('trips').push().key
              postData.tripkey = newTripKey
              updates['/userData/' + uid + '/list/' + newItemKey] = postData
              updates['/userData/' + uid + '/trips/' + newTripKey + '/start/' + newItemKey] = postData
            } else {
              updates['/userData/' + uid + '/list/' + newItemKey] = postData
              updates['/userData/' + uid + '/trips/' + snapshot.key + '/end/' + newItemKey] = postData
            }
            return firebase.database().ref().update(updates)
          })
        }
      })
    }
  }

  validateForm = () => {
    if (this.validateRegNo() && this.validateDateTime() && this.validateCounter()) { return true } else { return false }
  }

  validateRegNo = () => {
    return true
  }

  validateCounter = () => {
    return true
  }

  validateDateTime = () => {
    const { date } = this.state
    const { time } = this.state
    if (!date.isValid()) {
      this.setState({ datetimeerror: 'Felformaterat datum. Använd YYYY-MM-DD' })
      return false
    }
    if (!time.isValid()) {
      this.setState({ datetimeerror: 'Felformaterad tid. Använd HH:mm' })
      return false
    }
    const datetime = moment(date.format('YYYY-MM-DD') + ' ' + time.format('HH:mm'))
    if (!datetime.isAfter(moment().subtract(26, 'hours'))) {
      this.setState({ datetimeerror: 'Datum och tid måste vara mindre än 24 timmar sedan.' })
      return false
    }
    this.setState({ datetimeerror: false })
    return true
  }

  errorClass = (test) => {
    if (test !== false) {
      return ' text-danger border-danger '
    } else {
      return ''
    }
  }

  onDateChange = e => {
    const { date } = this.state
    console.log(date)
    this.setState({ date: moment(e.target.value + ' ' + moment().format('HH:mm')) }, () => this.validateDateTime())
  }

  onTimeChange = e => {
    const { time } = this.state
    this.setState({ time: moment(moment().format('YYYY-MM-DD') + ' ' + e.target.value) })
  }

  _onSelect = (e) => this.setState({ type: e.value })

  handleChange = e => {
    if (e.target.name === 'counter') {

    }
    if (e.target.name === 'vehicle') {

    }
    if (e.target.name === 'date') {

    }
    if (e.target.name === 'date') {

    }
    this.setState({ [e.target.name]: e.target.value })
  }

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const { lastRegnos } = this.state
  
    return inputLength === 0 ? [] : lastRegnos.filter(regno =>
      regno.regno.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onChange = (event, { newValue }) => {
    this.setState({
      autoc: newValue
    });
  };

  render () {
    const { isSignedin = false, user, address, locError } = this.props
    const { autoc, ...state } = this.state

    const options = [
      { value: 'start', label: 'Start för körning' },
      { value: 'end', label: 'Avslut av körning' }
    ]
    
    const defaultOption = state.type

    const inputProps = {
      placeholder: 'Skriv reg. nummer',
      autoc,
      onChange: this.onChange
    };

    return (
      <div className="Home mx-auto w-100 text-center">

        {isSignedin ? (
          <div>
            <h1><i>TEST</i></h1>
            <h4>Förare: {user.displayName}</h4>
            <form className="w-100 py-2 my-1 mx-auto" style={{ width: '100%', maxWidth: '650px' }}>

              <Dropdown id="start-slut" name="start-slut" className="text-center p-0 my-2 btn btn-lg mx-auto w-100" options={options} onChange={this._onSelect} value={defaultOption} placeholder="Välj start eller slut på uppdrag" title="Anger om uppgifterna nedan för start eller slut på uppdrag." />

              <div className="input-group mt-2 pt-1 w-100 mx-auto">
                <div className="input-group-prepend">
                  <span className={'input-group-text' + this.errorClass(state.datetimeerror)} id="inputGroup-sizing-default">Datum:</span>
                </div>
                <input className={'form-control ' + this.errorClass(state.datetimeerror)} id="datum" name="datum" value={state.date.format('YYYY-MM-DD')} placeholder="YYYY-MM-DD" type="date" onChange={this.onDateChange} title="Anger datum" />
                <div className="input-group-append">
                  <span className={'input-group-text' + this.errorClass(state.datetimeerror)} id="inputGroup-sizing-default">Tid:</span>

                  <input style={{ borderRadius: '0 .25rem .25rem 0', borderLeft: '0' }} className={'form-control ' + this.errorClass(state.datetimeerror)} name="tid" value={state.time.format('HH:mm')} placeholder="HH:mm" type="time" onChange={this.onTimeChange} title="Anger klockslag" />
                </div>

              </div>
              <footer className="text-center text-danger p-0 m-0 mx-auto w-75" style={{ height: '16px', fontSize: '.7rem' }}>{state.datetimeerror}</footer>

              <div className="input-group mt-2 p-0 w-100 mx-auto">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroup-sizing-default">RegNr:</span>
                </div>
                <Autosuggest 
                  className="form-control" 
                  suggestions={state.suggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps}
                />
                <input className="form-control" id="fordon" name="regno" value={state.regno} placeholder="Regnr" type="text" onChange={this.handleChange} title="Anger regnr XXX111" pattern="[A-Z]{3}[0-9]{3}" />

              </div>
              <footer className="text-center text-danger p-0 m-0 mx-auto w-75" style={{ height: '16px', fontSize: '.7rem' }}>{state.regnoerror}</footer>

              <div className="input-group mt-2 p-0 w-100 mx-auto">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroup-sizing-default">Mätarställning:</span>
                </div>
                <input className="form-control" id="matarstalling" name="counter" value={state.counter} placeholder="Mätarställning" type="number" onChange={this.handleChange} title="Anger mätarställning" />

              </div>
              <footer className="text-center text-danger p-0 m-0 mx-auto w-75" style={{ height: '16px', fontSize: '.7rem' }}>{state.countererror}</footer>
              <div className="input-group mt-2 p-0 w-100 mx-auto">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroup-sizing-default">Adress:</span>
                </div>
                <AddressInput id="address" name="address" defaultAddress={address} key={address} onChange={this.handleAddressChange} addressRef={el => this.inputAddress = el} />

              </div>
              <footer className="text-center text-danger p-0 m-0 mx-auto w-75" style={{ height: '16px', fontSize: '.7rem' }}>{locError}</footer>

              <div className="input-group my-2 pb-2 w-100 mx-auto">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroup-sizing-default">Notering:</span>
                </div>
                <textarea className="form-control" id="anteckning" name="note" value={state.note} placeholder="Frivillig anteckning" type="text" onChange={this.handleChange} title="Anteckning. Frivllig uppgift" />

              </div>

              <button className="my-3 btn btn-danger btn-lg w-75 mx-auto" onClick={this.writeNewPost}>Spara uppgifter</button>
            </form>
            <div className="small my-3 p-1 w-100 mx-auto text-center">
              <LastTripsList tripData={normalizeTripData(state.fbtrips)} />

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
  address   : PropTypes.string,
  coords    : PropTypes.object,
  locError  : PropTypes.string
}

const mapStateToProps = state => ({
  isSignedin: state.user.signin,
  user      : state.user.user,
  address   : state.location.address,
  coords    : state.location.coords,
  locError  : state.location.error
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps)(Home)
