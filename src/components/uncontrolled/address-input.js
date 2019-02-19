import React, { Component } from 'react'

class AddressInput extends Component

// eslint-disable-next-line
{ state = { address: this.props.defaultAddress }



  render () {
    // eslint-disable-next-line
    return <input className="form-control" ref={this.props.addressRef} defaultValue={this.props.defaultAddress} placeholder="Adress (frivillig)" type="text" title="Gatuadress. Frivillig uppgift" />
  }
}
export default AddressInput
