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
  }

  render() {
    return (
      <>
        {this.state.brushes.map(brush => {
          return (
            <Button onClick={() => this.props.chooseBrush(brush)} key={brush}>
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
