import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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
    console.log(year)
    console.log(typeof year)
    console.log(typeof year.toString())
    console.log(typeof String(year))
    const ref = firebase.database().ref('userData/' + user.uid + '/list/')
    ref.once('value').then(snapshot => {
    //ref.orderByChild('year').equalTo(year).once('value').then(snapshot => {
      console.log(snapshot.val())
      if (typeof snapshot.val() === 'object' && snapshot.val() !== null) {
        console.log(snapshot.val())
        const tripKeyList = [...new Set(Object.values(snapshot.val()).map(item => item.tripkey))]
        console.log(tripKeyList)
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

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps)(History)
