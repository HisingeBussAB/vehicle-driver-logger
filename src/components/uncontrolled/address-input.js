import React, { Component } from 'react'

class AddressInput extends Component 

// eslint-disable-next-line
{ state = { address: this.props.defaultAddress }

  handleChange = event => {
    this.setState({ address: event.target.value })
  }

  render () {
    // eslint-disable-next-line
    return <input onChange={this.handleChange} value={this.state.address} placeholder="Adress (frivillig)" type="text" title="Gatuadress. Frivillig uppgift" />
  }
}
export default AddressInput
