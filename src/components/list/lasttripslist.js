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
      <div className="LastTripsList">

        {
          JSON.stringify(Object.assign({}, Object.assign([], tripData).reverse()))
        }

      </div>
    )
  }
}

LastTripsList.propTypes = {
  tripData: PropTypes.object
}

export default connect(null, null)(LastTripsList)
