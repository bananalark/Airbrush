import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from '@material-ui/core'
import {chooseBodyPart} from '../store'

class BodyPartOptions extends Component {
  constructor() {
    super()
    this.state = {
      parts: ['rightHand', 'leftHand', 'nose']
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(part) {
    let bodyPartOptionsPopUp = document.getElementById('bodypart-options')
    bodyPartOptionsPopUp.className = 'closed'
    this.props.chooseBodyPart(part)
  }

  render() {
    return (
      <>
        {this.state.parts.map(part => (
          <Button onClick={() => this.handleClick(part)} key={part}>
            {part}
          </Button>
        ))}
      </>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    chooseBodyPart: part => dispatch(chooseBodyPart(part))
  }
}

export default connect(null, mapDispatchToProps)(BodyPartOptions)
