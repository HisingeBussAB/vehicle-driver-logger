import React from 'react'
import { geolocated } from 'react-geolocated'
import { updateGeolocation } from '../actions'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'underscore'

class LocationListener extends React.Component {

  componentDidMount () {
    const { ...props } = this.props
    this.updateLoc(props)
  }

  shouldComponentUpdate (nextProps) {
    return this.updateLoc(nextProps)
  }

  updateLoc = (nextProps) => {
    const { ...props } = this.props
    if (typeof nextProps.coords !== 'undefined' && nextProps.coords !== null && !_.isEqual(nextProps.coords, props.coords)) {
      nextProps.updateGeolocation(nextProps.coords, nextProps.isGeolocationAvailable,nextProps.isGeolocationEnabled, nextProps.positionError)
      return true
    }
    return false
  }

  render () {
    return null
  }
}

LocationListener.propTypes = {
  location              : PropTypes.object,
  coords                : PropTypes.object,
  isGeolocationAvailable: PropTypes.bool,
  isGeolocationEnabled  : PropTypes.bool,
  positionError         : PropTypes.object,
  updateGeolocation     : PropTypes.func
}

const mapStateToProps = state => ({
  location: state.location
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateGeolocation
}, dispatch)

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
    maximumAge        : 200000,
    timeout           : 20000
  },
  watchPosition      : true,
  userDecisionTimeout: 60000
})(connect(mapStateToProps, mapDispatchToProps)(LocationListener))
