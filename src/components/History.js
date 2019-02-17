import React, { Component } from 'react'
import { connect } from 'react-redux'
import Signinform from './signin'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/sv'
import firebase from '../config/firebase'
import normalizeTripData from '../functions/normalizeTripData'
import LastTripsList from './list/lasttripslist'

class History extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fbtrips      : {},
      year:    (Number(moment().format('YYYY')) - 1) === 2018 ? 2019 : (Number(moment().format('YYYY')) - 1)
    }
  }

  

  refreshData = () => {
    const { year } = this.state
    const { user } = this.props
    const ref = firebase.database().ref('userData/' + user.uid + '/list/')
    ref.orderByChild('year').equalTo(year.toString()).once('value').then(snapshot => {
      if (typeof snapshot.val() === 'object' && snapshot.val() !== null) {
        const tripKeyList = [...new Set(Object.values(snapshot.val()).map(item => item.tripkey))]
        if (tripKeyList.length > 0) {
          const refTrip = firebase.database().ref('userData/' + user.uid + '/trips/').orderByKey().startAt(tripKeyList[0]).endAt(tripKeyList[tripKeyList.length-1])
          refTrip.once('value').then(snapshot => {

            if (typeof snapshot.val() === 'object') {
              this.setState({fbtrips: snapshot.val()})
            }
          })
        }
      }
    })
    
  }

  render () {
    const { isSignedin } = this.props
   const { fbtrips, year } = this.state
    return (
      <div className="History small my-3 p-1 w-100 mx-auto text-center">
      <h1 className="m-2">{year}</h1>
      <button className='btn btn-danger m-3 mb-4' onClick={this.refreshData}>Starta dataladdning för året</button>
      {isSignedin ? (
        <div>
          <LastTripsList tripData={normalizeTripData(fbtrips)} isHistory={true} />

        </div>
        ) : (
        <Signinform />
        )
      }
      </div>
    )
  }
}

History.propTypes = {
  isSignedin: PropTypes.bool,
  user      : PropTypes.object,
}

const mapStateToProps = state => ({
  isSignedin: state.user.signin,
  user      : state.user.user
})

export default connect(
  mapStateToProps,
  null)(History)
