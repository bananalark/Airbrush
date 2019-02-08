import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from '@material-ui/core'
import {chooseBodyPart, toggleBodyPart} from '../store'

class BodyPartOptions extends Component {
  constructor() {
    super()
    this.state = {
      parts: ['rightHand', 'leftHand', 'nose']
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(part) {
    this.props.chooseBodyPart(part)
    this.props.toggleBodyPart()
  }

  render() {
    return (
      <div id="bodypart-options">
        <p>Drawing Options</p>
        <div>
          {this.state.parts.map(part => (
            <div id={'button-bodypart-' + part} key={part}>
              <Button
                size="large"
                onClick={() => this.handleClick(part)}
                className={this.props.part === part ? 'active' : ''}
              >
                {part}
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    part: state.paintTools.chosenBodyPart
  }
}

function mapDispatchToProps(dispatch) {
  return {
    chooseBodyPart: part => dispatch(chooseBodyPart(part)),
    toggleBodyPart: () => dispatch(toggleBodyPart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BodyPartOptions)
