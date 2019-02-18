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
import { Typeahead } from 'react-bootstrap-typeahead'


class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type         : 'start',
      lastType     : false,
      typeWarning  : false,
      date         : moment(),
      time         : moment(),
      datetimeerror: false,
      counter      : '',
      countererror : false,
      counterwarn  : false,
      regno        : '',
      regnoerror   : false,
      note         : '',
      regnos       : [{ label: '' }],
      fbtrips      : {},
      selected     : [],
      lastCounter  : false,
      sendMsg      : '',
      sendStatus   : true
    }
  }

  componentDidMount () {
    const { user = { uid: '' } } = this.props
    const trips = firebase.database().ref('/userData/' + user.uid + '/trips/').orderByKey().limitToLast(10)
    trips.on('value', (snapshot) => {
      const result = snapshot.val()
      this.setState({ fbtrips: result })
    })

    const ref = firebase.database().ref('/userData/' + user.uid + '/list/').orderByKey()
    const list = ref.limitToLast(30)
    list.on('value', (snapshot) => {
      const result = snapshot.val()
      if (result !== null && typeof result === 'object') {
        const lastRegnos = [...new Set(Object.values(result).map(item => item.regno))].sort()
        const lastRegnoLabelled = lastRegnos.reduce((filtered, item) => {
          if (item.length === 6) { filtered.push({ label: item }) }
          return filtered
        }, [])
        this.setState({ regnos: lastRegnoLabelled })
      }
    })

    const lastList = ref.limitToLast(1)
    lastList.on('value', (snapshot) => {
      const result = snapshot.val()
      if (result !== null && typeof result === 'object') {
        const types = Object.values(result).map(item => item.type)
        const reversedType = types[0] === 'end' ? 'start' : 'end'
        this.setState({ lastType: reversedType, type: reversedType }, () => this.setLastRegno())
      }
    })

    this.typeahead.getInstance().getInput().addEventListener('blur', () => this.validateRegNo(true), false)

    this.getLastCounter(true)
  }

  setLastRegno = () => { 
    const { type, lastType } = this.state
    if (type === 'start' && lastType === 'end') {

    }
    /*
    const ref = firebase.database().ref('userData/' + user.uid + '/list/')
    ref.orderByChild('type').equalTo('start').limitToLast(1).once('value').then(snapshot => {
      if (snapshot.val() !== null && typeof snapshot.val() === 'object') {
        snapshot.forEach((childSnapshot) => {
          const value = childSnapshot.val()

*/
        //const value = this.typeahead.getInstance().getInput().value
  }

  writeNewPost = (e) => {
    e.preventDefault()
    if (this.validateForm()) {
      const { user, coords } = this.props
      const { type, date, time, counter, regno, note } = this.state
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
          const newListKey = firebase.database().ref('userData/' + uid).child('list').push().key
          const newTripKey = firebase.database().ref('userData/' + uid).child('trips').push().key
          postData.tripkey = newTripKey
          postData.listkey = newListKey
          updates['/userData/' + uid + '/list/' + newListKey] = postData
          updates['/userData/' + uid + '/trips/' + newTripKey + '/start/' + newListKey] = postData
          return firebase.database().ref().update(updates)
        } else {
          const newListKey = firebase.database().ref('userData/' + uid).child('list').push().key
          postData.listkey = newListKey
          firebase.database().ref('userData/' + uid + '/trips/').orderByKey().limitToLast(1).once('child_added').then(snapshot => {
            if (type === 'start') {
              const newTripKey = firebase.database().ref('userData/' + uid).child('trips').push().key
              postData.tripkey = newTripKey
              updates['/userData/' + uid + '/list/' + newListKey] = postData
              updates['/userData/' + uid + '/trips/' + newTripKey + '/start/' + newListKey] = postData
            } else {
              postData.tripkey = snapshot.key
              updates['/userData/' + uid + '/list/' + newListKey] = postData
              updates['/userData/' + uid + '/trips/' + snapshot.key + '/end/' + newListKey] = postData
            }
            return firebase.database().ref().update(updates)
          })
        }
        this.setState({
          sendMsg      : 'Uppgifterna sparades.',
          sendStatus   : true,
          date         : moment(),
          time         : moment(),
          datetimeerror: false,
          counter      : '',
          countererror : false,
          regno        : '',
          regnoerror   : false,
          note         : ''
        })
      })
    } else {
      this.setState({ sendMsg: 'Sparades inte, åtgärda markerade fält.', sendStatus: false })
    }
  }

  validateForm = () => {
    this.resetSendMsg()
    if (this.validateRegNo() && this.validateDateTime() && this.validateCounter()) { return true } else { return false }
  }

  resetSendMsg = () => {
    this.setState({ sendMsg: '' })
  }

  validateRegNo = (resetFlag) => {
    const check = this.typeahead.getInstance().getInput().value
    if (!(check !== null && typeof check === 'string' && check.length > 0)) {
      this.setState({ regno: '', regnoerror: 'Ange registrerings nummer.' }, () => this.getLastCounter(false))
      this.typeahead.getInstance().getInput().classList.add('test-danger')
      this.typeahead.getInstance().getInput().classList.add('border-danger')
      return false
    }

    if (!/^\D{3}\d{3}$/.exec(check)) {
      this.setState({ regno: '', regnoerror: 'Felformaterat reg nr. XXX888' }, () => this.getLastCounter(false))
      this.typeahead.getInstance().getInput().classList.add('test-danger')
      this.typeahead.getInstance().getInput().classList.add('border-danger')
      return false
    }

    this.setState({ regno: check.substring(0, 3).toUpperCase() + check.substring(3, 6), regnoerror: false }, () => this.getLastCounter(resetFlag))
    this.typeahead.getInstance().getInput().classList.remove('test-danger')
    this.typeahead.getInstance().getInput().classList.remove('border-danger')
    return true
  }

  getLastCounter = (doReset) => {
    const { regnoerror, countererror, counterwarn, counter } = this.state
    const { user } = this.props
    const regno = this.typeahead.getInstance().getInput().value
    if (!regnoerror && regno.length === 6) {
      const ref = firebase.database().ref('userData/' + user.uid + '/list/')
      ref.orderByChild('regno').equalTo(regno).limitToLast(1).once('value').then(snapshot => {
        if (snapshot.val() !== null && typeof snapshot.val() === 'object') {
          snapshot.forEach((childSnapshot) => {
            const value = childSnapshot.val()
            if (Number.isInteger(Number(value.counter)) && !(value.counter < 100 || value.counter > 50000000)) { this.setState({ sendMsg: '', lastCounter: value.counter }, () => {if (counter !== '') this.validateCounter()}) }
            if (doReset && (countererror !== false || counterwarn !== false || typeof counter === 'undefined' || counter === 0 || counter === null || counter === '')) {
              this.setState({ counter: value.counter }, () =>  {if (counter !== '') this.validateCounter()})
            } else if (typeof counter === 'undefined' || counter === 0 || counter === null || counter === '') {
              this.setState({ counter: '' }, () =>  {if (counter !== '') this.validateCounter()})
            }
            return true
          })
        } else {
          this.setState({lastCounter: false}, () =>  {if (counter !== '') this.validateCounter()})
        }
      })
    } else {
      this.setState({lastCounter: false}, () =>  {if (counter !== '') this.validateCounter()})
    }
  }

  validateCounter = () => {
    const { counter, lastCounter } = this.state
    const regno = this.typeahead.getInstance().getInput().value
    if (!Number.isInteger(Number(counter))) {
      this.setState({ counterwarn: false, countererror: 'Får bara innehålla siffror. Inga decimaltecken eller tusendelare.' })
      return false
    }

    if (counter < 100 || counter > 50000000) {
      this.setState({ counterwarn: false, countererror: 'Siffran verkar orimligt stor eller liten.' })
      return false
    }
    if (regno.length === 6 && lastCounter !== false && lastCounter > 100 && lastCounter < 50000000) {
      if ((lastCounter - counter) > 0) {
        this.setState({ counterwarn: false, countererror: 'Får inte vara lägre än förra på detta fordon.' })
        return false
      }
    }
    if (counter < 99999) {
      this.setState({ counterwarn: 'Saknas det siffror?', countererror: false })
    } else if (counter > 999999) {
      this.setState({ counterwarn: 'För många siffror?', countererror: false })
    } else {
      this.setState({ counterwarn: false, countererror: false })
    }

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
    if (!datetime.isAfter(moment().subtract(7, 'days'))) {
      this.setState({ datetimeerror: 'Datum och tid måste vara mindre än 7 dagar sedan.' })
      return false
    }
    if (!datetime.isBefore(moment().add(49, 'hours'))) {
      this.setState({ datetimeerror: 'Datum och tid kan inte vara mer än 48 timmar framåt.' })
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

  warningClass = (test) => {
    if (test !== false) {
      return ' text-warning border-warning '
    } else {
      return ''
    }
  }

  onDateChange = e => {
    const { time } = this.state
    this.setState({ sendMsg: '', date: moment(e.target.value + ' ' + time.format('HH:mm')) }, () => this.validateDateTime())
  }

  onTimeChange = e => {
    const { date } = this.state
    this.setState({ sendMsg: '', time: moment(date.format('YYYY-MM-DD') + ' ' + e.target.value) })
  }

  _onSelect = (e) => this.setState({ sendMsg: '', type: e.value }, () => this.validateStart())

  handleChange = e => {
    this.setState({ sendMsg: '', [e.target.name]: e.target.value }, () => { this.validateCounter(); this.validateForm() })
  }

  validateStart = () => {
    const { type, lastType } = this.state
    if (type !== lastType) {
      this.setState({ sendMsg: '', typeWarning: true })
    } else {
      this.setState({ sendMsg: '', typeWarning: false })
    }
  }

  render () {
    const { isSignedin = false, user, address, locError, adrSrc } = this.props
    const { ...state } = this.state

    const options = [
      { value: 'start', label: 'Start för körning' },
      { value: 'end', label: 'Avslut av körning' }
    ]

    const defaultOption = state.type

    return (
      <div className="Home mx-auto w-100 text-center">

        {isSignedin ? (
          <div>
            <h4>Förare: {user.displayName}</h4>
            <form className="w-100 py-2 my-1 mx-auto" style={{ width: '100%', maxWidth: '650px' }}>

              <Dropdown id="start-slut" name="start-slut" className={'text-center p-0 my-2 btn btn-lg mx-auto w-100 ' + this.errorClass(state.typeWarning)} options={options} onChange={this._onSelect} value={defaultOption} placeholder="Välj start eller slut på uppdrag" title="Anger om uppgifterna nedan för start eller slut på uppdrag." />
              <footer className="text-center text-info p-0 m-0 mx-auto w-75" style={{ height: '16px', fontSize: '.7rem' }}>{state.typeWarning ? 'Matchar inte start/avslut på föregående inmatning' : null}</footer>
              <div className="input-group mt-2 pt-1 w-100 mx-auto">

                <input className={'text-center form-control ' + this.errorClass(state.datetimeerror)} id="datum" name="datum" value={state.date.format('YYYY-MM-DD')} placeholder="YYYY-MM-DD" type="date" onChange={this.onDateChange} title="Anger datum" />
                <div className="input-group-append">

                  <input style={{ borderRadius: '0 .25rem .25rem 0', borderLeft: '0' }} className={'text-center form-control ' + this.errorClass(state.datetimeerror)} name="tid" value={state.time.format('HH:mm')} placeholder="HH:mm" type="time" onChange={this.onTimeChange} title="Anger klockslag" />
                </div>

              </div>
              <footer className="text-center text-danger p-0 m-0 mx-auto w-75" style={{ height: '16px', fontSize: '.7rem' }}>{state.datetimeerror}</footer>
              <div className={'input-group mt-2 pt-1 w-100 mx-auto flex-nowrap' + this.errorClass(state.regnoerror)}>
                <div className="input-group-prepend">
                  <span className={'input-group-text ' + this.errorClass(state.regnoerror)}>RegNr:</span>
                </div>

                <Typeahead className="border-left-0 rounded-0 rounded-right d-flex align-self-stretch flex-nowrap w-100"
                  name="regnr"
                  onChange={(selected) => {
                    this.setState({ selected }, () => this.validateRegNo(true))
                  }}
                  options={state.regnos}
                  selected={state.selected}
                  placeholder="Skriv reg. nummer"
                  // eslint-disable-next-line no-return-assign
                  ref={(typeahead) => this.typeahead = typeahead}
                />
              </div>
              <footer className="text-center text-danger p-0 m-0 mx-auto w-75" style={{ height: '16px', fontSize: '.7rem' }}>{state.regnoerror}</footer>

              <div className="input-group mt-2 p-0 w-100 mx-auto">
                <div className="input-group-prepend">
                  <span className={'input-group-text ' + this.warningClass(state.counterwarn) + this.errorClass(state.countererror)} id="inputGroup-sizing-default">Odo:</span>
                </div>
                <input step="1" className={'form-control ' + this.warningClass(state.counterwarn) + this.errorClass(state.countererror)} id="matarstalling" name="counter" value={state.counter} placeholder="Mätarställning" type="number" onChange={this.handleChange} title="Anger mätarställning" />
                <div className="input-group-append">
                  <span className={'input-group-text p-0 ' + this.warningClass(state.counterwarn) + this.errorClass(state.countererror)}><button type="button" style={{ padding: '2px', paddingBottom: '6px' }} className="close" aria-label="Close" onClick={() => this.setState({ counter: '' })}>
                    <span aria-hidden="true">&times;</span>
                  </button></span>
                </div>
              </div>
              <footer className="text-center text-danger p-0 m-0 mx-auto w-75" style={{ height: '16px', fontSize: '.7rem' }}>{state.countererror ? state.countererror : state.counterwarn }</footer>
              <div className="input-group mt-2 p-0 w-100 mx-auto">
                <div className="input-group-prepend">
                  <span className={'input-group-text ' + (adrSrc ? 'text-success' : '')} id="inputGroup-sizing-default">Adress:</span>
                </div>
                <AddressInput id="address" name="address" defaultAddress={address} key={address} onChange={this.handleAddressChange} addressRef={el => this.inputAddress = el} />
                <div className="input-group-append">
                  <span className="input-group-text p-0"><button type="button" className="close" onClick={() => { this.inputAddress.value = '' }} style={{ padding: '2px', paddingBottom: '6px' }} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button></span>
                </div>
              </div>
              <footer className="text-center text-danger p-0 m-0 mx-auto w-75" style={{ height: '16px', fontSize: '.7rem' }}>{locError}</footer>

              <div className="input-group my-2 pb-2 w-100 mx-auto">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroup-sizing-default">Notering:</span>
                </div>
                <textarea className="form-control" id="anteckning" name="note" value={state.note} placeholder="Frivillig anteckning" type="text" onChange={this.handleChange} title="Anteckning. Frivllig uppgift" />

              </div>

              <button className="my-3 btn btn-danger btn-lg w-75 mx-auto" onClick={this.writeNewPost}>Spara uppgifter</button>
              <footer className={'text-center p-1 m-1 mx-auto w-75 ' + (state.sendStatus ? 'text-success' : 'text-danger')} style={{ fontWeight: 'bold', fontSize: '1rem' }}>{state.sendMsg === '' ? null : state.sendMsg}</footer>
            </form>
            <div className="small my-3 p-1 w-100 mx-auto text-center">
              <LastTripsList tripData={normalizeTripData(state.fbtrips)} isHistory={false}/>

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
  locError  : state.location.error,
  adrSrc: state.location.srcIsGoogle
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps)(Home)
