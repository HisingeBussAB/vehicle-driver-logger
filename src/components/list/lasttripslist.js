import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/sv'
import firebase from '../../config/firebase'

class LastTripsList extends Component {
  render () {
    const { tripData } = this.props
    return (
      <div className="LastTripsList w-100">
      <h5>Sensate inlaggda</h5>
      <ul className="c-ul text-center mx-auto" style={{width: '98%', maxWidth:'650px'}}>
      {tripData.map(trip => {
        
        return <li className="w-100 c-ul text-left"><h6 className="w-100 text-left mt-4">{moment(Object.keys(trip)[0]).format('LLLL')}</h6>
        <ul className="w-100 text-left c-ul">
        {
          JSON.stringify(trip[Object.keys(trip)[0]].end) === '{}' ? 
        <li className="w-100 c-ul text-left mt-3 p-1"><p><b>Slut: Inte angiven</b></p></li> : 
        trip[Object.keys(trip)[0]].end.map(end => {
          return <li className="w-100 c-ul text-left mt-3 p-1"><p><b>Slut:</b></p><ul className="w-100 c-ul">
          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Regnr:</span><span className="w-75 d-inline-block">{end.regno}</span></li>
          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Odo:</span><span className="w-75 d-inline-block">{end.counter}</span></li>
          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Ankomst:</span><span className="w-75 d-inline-block">{moment(end.timefull).format('HH:mm [den] D/M' )}</span></li>
          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Adress:</span><span className="w-75 d-inline-block">{end.address}</span></li>
          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Anteckning:</span><span className="w-75 d-inline-block">{end.note}</span></li>
          </ul></li>
        })
        }
       
        
           
        </ul>
        <ul className="w-100 c-ul text-left">
        
        {
          JSON.stringify(trip[Object.keys(trip)[0]].start) === '{}' ? 
        <li className="w-100 c-ul text-left mt-3 p-1"><p><b>Start: Inte angiven</b></p></li> : 
        trip[Object.keys(trip)[0]].start.map(start => {
          return <li className="w-100 c-ul text-left mt-3 p-1"><p><b>Start:</b></p><ul className="w-100 c-ul">
          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Regnr:</span><span className="w-75 d-inline-block">{start.regno}</span></li>
          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Odo:</span><span className="w-75 d-inline-block">{start.counter}</span></li>
          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Avgång:</span><span className="w-75 d-inline-block">{moment(start.timefull).format('HH:mm [den] D/M' )}</span></li>
          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Adress:</span><span className="w-75 d-inline-block">{start.address}</span></li>
          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Anteckning:</span><span className="w-75 d-inline-block">{start.note}</span></li>
          </ul></li>
        })
        }
        
        </ul>
        </li>
      })

        
      }
      </ul>
      </div>
    )
  }
}

LastTripsList.propTypes = {
  tripData: PropTypes.array
}

export default connect(null, null)(LastTripsList)
