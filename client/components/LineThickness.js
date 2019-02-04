import React, {Component} from 'react'
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button'
import {chooseSize} from '../store'

class LineThickness extends Component {
  constructor() {
    super()
    this.state = {
      size: ['small', 'medium', 'large']
    }
  }

  render() {
    return (
      <div id="line-thickness">
        <p>Line Thickness Options</p>
        {this.state.size.map(size => (
          <Button onClick={() => this.props.chooseSize(size)} key={size}>
            {size}
          </Button>
        ))}
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    chooseSize: size => dispatch(chooseSize(size))
  }
}

export default connect(null, mapDispatchToProps)(LineThickness)
