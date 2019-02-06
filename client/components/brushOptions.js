import React, {Component} from 'react'
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button'
import {chooseBrush, toggleBrush} from '../store'

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
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(brush) {
    this.props.chooseBrush(brush)
    this.props.toggleBrush()
  }

  render() {
    return (
      <div id="brush-options">
        <p>Brush Options</p>
        <div>
          {this.state.brushes.map(brush => {
            return (
              <div id={'button-brush-' + brush} key={brush}>
                <Button
                  size="large"
                  className={this.props.brush === brush ? 'active' : ''}
                  onClick={() => this.handleClick(brush)}
                >
                  {brush}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    brush: state.paintTools.chosenBrush
  }
}

function mapDispatchToProps(dispatch) {
  return {
    chooseBrush: brush => dispatch(chooseBrush(brush)),
    toggleBrush: () => dispatch(toggleBrush())
  }
}

const connectedBrushOptions = connect(mapStateToProps, mapDispatchToProps)(
  BrushOptions
)
export default connectedBrushOptions
