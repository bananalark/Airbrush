import React, {Component} from 'react'
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button'
import {chooseBrush} from '../store'

class BrushOptions extends Component {
  constructor() {
    super()
    this.state = {
      brushes: [
        'defaultLine',
        'circleLine',
        'circleShape',
        'rectangle',
        'ellipse',
        'triangleLine',
        'triangleShape'
      ]
    }
    this.clickHandler = this.clickHandler.bind(this)
  }

  clickHandler(brush) {
    let brushOptionsPopUp = document.getElementById('brush-options')
    brushOptionsPopUp.className = 'closed'
    this.props.chooseBrush(brush)
  }

  render() {
    return (
      <>
        {this.state.brushes.map(brush => {
          return (
            <Button onClick={() => this.clickHandler(brush)} key={brush}>
              {brush}
            </Button>
          )
        })}
      </>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    chooseBrush: brush => dispatch(chooseBrush(brush))
  }
}

const connectedBrushOptions = connect(null, mapDispatchToProps)(BrushOptions)
export default connectedBrushOptions
