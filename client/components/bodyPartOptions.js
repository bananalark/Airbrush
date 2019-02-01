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
  }

  render() {
    return (
      <>
        {this.state.parts.map(part => (
          <Button onClick={() => this.props.chooseBodyPart(part)} key={part}>
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
