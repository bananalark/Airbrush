import React, {Component} from 'react'
import {connect} from 'react-redux'

class CustomPopUp extends Component {
  render() {
    return (
      <div
        id={'child-' + this.props.id}
        className={'custom-pop-up ' + (this.props.className || 'closed')}
      >
        {this.props.children}
      </div>
    )
  }
}

export default CustomPopUp
