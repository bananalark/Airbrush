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
        <div>
          {this.state.size.map(size => (
            <div id={'button-size-' + size} key={size}>
              <Button
                size="large"
                className={size === this.props.size ? 'active' : ''}
                onClick={() => this.handleClick(size)}
              >
                {size}
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
    size: state.paintTools.size
  }
}

function mapDispatchToProps(dispatch) {
  return {
    chooseSize: size => dispatch(chooseSize(size)),
    toggleBrush: () => dispatch(toggleBrush())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineThickness)
