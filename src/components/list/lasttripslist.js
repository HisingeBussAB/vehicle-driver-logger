import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/sv'
import Confirm from '../confirm'
import firebase from '../../config/firebase'

class LastTripsList extends Component {
  state = { open        : false,
            deleteQueue : false,
            delete      : {}
          }


  handleConfirm = () => {
    const {...state} = this.state
    const {user} =this.props
    const ref = firebase.database().ref('userData/' + user.uid + '/trips/' + state.deleteQueue + '/')
    ref.child('start').once('value').then(snapshot => {
      if (snapshot.val() !== null && typeof snapshot.val() !== undefined) {
          Object.keys(snapshot.val()).forEach(item => {
            firebase.database().ref('userData/' + user.uid + '/list/' + item +'/').remove()
          })

          
      }
     
    }

    )
    ref.child('end').once('value').then(snapshot => {
      if (snapshot.val() !== null && typeof snapshot.val() !== undefined) {
        Object.keys(snapshot.val()).forEach(item => {
          firebase.database().ref('userData/' + user.uid + '/list/' + item +'/').remove()
        })
      }
      
    })

    ref.remove().then(() => {
      this.setState({open: false, deleteQueue: false, delete: {}})
    })

  }

  handleCancel = () => {
    this.setState({open: false, deleteQueue: false, delete: {}})
  }

  onClick = (key,reg,dat) => { 
    this.setState({ open: true, deleteQueue: key, delete: { reg: reg, dat: dat } }) }

  

  render () {
    const { tripData, isHistory = false } = this.props
    const { ...state } = this.state

    return (<div className="LastTripsList w-100">
      {tripData === false || typeof tripData !== 'object' ? null
        : <div>
          <h5>Sensate inlaggda</h5>
          <ul className="c-ul text-center mx-auto" style={{ width: '98%', maxWidth: '650px' }}>
            {tripData.map(trip => {
              return <li className="w-100 c-ul text-left" key={moment(Object.keys(trip)[0]).format('YYYYMMDDHHmm') + '-' + Object.values(trip)[0].start[0].tripkey}><h6 className="w-100 text-left mt-4">{moment(Object.keys(trip)[0]).format('LLLL')}</h6>
                <ul className="w-100 text-left c-ul">
                  {
                    JSON.stringify(trip[Object.keys(trip)[0]].end) === '{}'
                      ? <li className="w-100 c-ul text-left mt-3 p-1"><p><b>Slut: Inte angiven</b></p></li>
                      : trip[Object.keys(trip)[0]].end.map(end => {
                        return <li className="w-100 c-ul text-left mt-3 p-1" key={end.listkey}><p><b>Slut:</b></p><ul className="w-100 c-ul">
                          <li className="w-100 c-ul p-1"><span className="w-25 d-inline-block">Regnr:</span><span className="w-75 d-inline-block">{end.regno}</span></li>
                          <li className="w-100 c-ul p-1"><span className="w-25 d-inline-block">Odo:</span><span className="w-75 d-inline-block">{end.counter}</span></li>
                          <li className="w-100 c-ul p-1"><span className="w-25 d-inline-block">Ankomst:</span><span className="w-75 d-inline-block">{moment(end.timefull).format('HH:mm [den] D/M')}</span></li>
                          <li className="w-100 c-ul p-1"><span className="w-25 d-inline-block">Adress:</span><span className="w-75 d-inline-block">{end.address}</span></li>
                          <li className="w-100 c-ul p-1"><span className="w-25 d-inline-block">Anteckning:</span><span className="w-75 d-inline-block">{end.note}</span></li>
                        </ul></li>
                      })
                  }

                </ul>
                <ul className="w-100 c-ul text-left">

                  {
                    JSON.stringify(trip[Object.keys(trip)[0]].start) === '{}'
                      ? <li className="w-100 c-ul text-left mt-3 p-1"><p><b>Start: Inte angiven</b></p></li>
                      : trip[Object.keys(trip)[0]].start.map(start => {
                        return <li className="w-100 c-ul text-left mt-3 p-1" key={start.listkey}><p><b>Start:</b></p><ul className="w-100 c-ul">
                          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Regnr:</span><span className="w-75 d-inline-block">{start.regno}</span></li>
                          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Odo:</span><span className="w-75 d-inline-block">{start.counter}</span></li>
                          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Avgång:</span><span className="w-75 d-inline-block">{moment(start.timefull).format('HH:mm') + ' den ' + moment(start.timefull).format('D/M')}</span></li>
                          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Adress:</span><span className="w-75 d-inline-block">{start.address}</span></li>
                          <li className="w-100 c-ul p-1"><span className="w-25 text-nowrap d-inline-block">Anteckning:</span><span className="w-75 d-inline-block">{start.note}</span></li>
                        </ul></li>
                      })
                  }
                  <button id={trip[Object.keys(trip)[0]].start[0].tripkey} className={'btn btn-danger m-2 ml-5 mb-3' + (isHistory ? ' d-none' : '')} onClick={() => this.onClick(trip[Object.keys(trip)[0]].start[0].tripkey,trip[Object.keys(trip)[0]].start[0].regno,trip[Object.keys(trip)[0]].start[0].timefull)}>TA BORT RESAN OVAN<br /><span className="small">(Start och Slut raderas. Skapa ersättningspost först.)</span></button>
                </ul>
              </li>
            })

            }
          </ul>
        </div>
      }
      <Confirm open={state.open} item={state.delete} onCancel={this.handleCancel} onConfirm={this.handleConfirm} />
    </div>
    )
  }
}

LastTripsList.propTypes = {
  tripData: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  user      : PropTypes.object,
  isHistory: PropTypes.bool
}

const mapStateToProps = state => ({
  user      : state.user.user
})

export default connect(mapStateToProps, null)(LastTripsList)
