import React, {Component} from 'react'
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button'
import {chooseSize, toggleBrush} from '../store'

class LineThickness extends Component {
  constructor() {
    super()
    this.state = {
      size: ['small', 'medium', 'large']
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(size) {
    this.props.chooseSize(size)
    this.props.toggleBrush()
  }

  render() {
    return (
      <div id="line-thickness">
        <p>Line Thickness Options</p>
        {this.state.size.map(size => (
          <Button onClick={() => this.handleClick(size)} key={size}>
            {size}
          </Button>
        ))}
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    chooseSize: size => dispatch(chooseSize(size)),
    toggleBrush: () => dispatch(toggleBrush())
  }
}

export default connect(null, mapDispatchToProps)(LineThickness)
