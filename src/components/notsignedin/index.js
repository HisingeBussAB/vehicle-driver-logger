import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class NotSignedIn extends Component {
  render () {
    return (
      <div>
        <h5>Inte inloggad</h5>
        <Link to={'/signin/'}>
          <button className="btn btn-dark bg-primary">Clicka här för att logga in</button>
        </Link>
      </div>
    )
  }
}

export default NotSignedIn
