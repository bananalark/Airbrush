import React, {Component} from 'react'
import {connect} from 'react-redux'

class CustomPopUp extends Component {
  render() {
    console.log(this.props.part)

    const popUpClass =
      this.props.part === 'rightHand' ? 'custom-pop-up-right' : 'custom-pop-up'

    console.log(popUpClass)
    return (
      <div
        id={'child-' + this.props.id}
        className={popUpClass + ' ' + (this.props.className || 'closed')}
      >
        {this.props.children}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    part: state.paintTools.chosenBodyPart
  }
}

export default connect(mapStateToProps)(CustomPopUp)
