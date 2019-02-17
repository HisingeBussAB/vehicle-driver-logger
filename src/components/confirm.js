import React, { Component } from 'react'
import moment from 'moment'
import 'moment/locale/sv'

class Confirm extends Component {

  render () {
    const { ...props } = this.props

    return (

      <div className={'Confirm ' + (props.open ? 'd-block' : 'd-none')} style={{zIndex:'150000',position: 'fixed', width:'100%', height:'100%', top:'0', bottom: '0', left: '0', right: '0', backgroundColor: 'rgba(0,0,0,.6)'}}>

      <div className="rounded mx-auto" style={{zIndex:'150021', position: 'fixed', left:'0', right: '0', width:'90%', height:'200px', top:'25%', backgroundColor: 'white'}}>
      <h4 className="p-3 m-2 text-center">Är du säkker på att du vill ta bort resa med {props.item.reg} den {moment(props.item.dat).format('D/M')}?</h4>
      <button onClick={props.onConfirm} className="m-4 btn btn-lg btn-success">JA</button><button onClick={props.onCancel} className="m-4 btn-lg btn btn-danger">NEJ</button>
      </div>

      </div>
    )
  }
}

export default Confirm
