import React, {Component} from 'react'
import ColorPicker from './colorPicker'

class CameraComponent extends Component {
  constructor() {
    super()
    this.state = {eraseModeOn: false}
    this.handleEraseModeClick = this.handleEraseModeClick.bind(this)
  }
  handleEraseModeClick() {
    if (this.state.eraseModeOn === true) {
      this.setState({eraseModeOn: false})
    } else {
      this.setState({eraseModeOn: true})
    }
  }
  render() {
    let eraserModeOn = this.state.eraseModeOn
    return (
      <div>
        <div id="info" />
        <div id="main">
          <video
            id="video"
            plays-inline="true"
            style={{display: 'none'}}
            // style={{
            //   '-moz-transform': scaleX(-1),
            //   '-o-transform': scaleX(-1),
            //   '-webkit-transform': scaleX(-1),
            //   transform: scaleX(-1),
            //   display: none
            // }}
          />
          <div id="buttons">
            <input type="button" id="clear-button" value="Clear Canvas" />
            <p>
              Erase Mode:{' '}
              <input
                type="button"
                id="erase-button"
                value={eraserModeOn}
                onClick={this.handleEraseModeClick}
              />
            </p>
          </div>

          <div style={{position: 'relative'}}>
            <canvas
              id="background"
              style={{position: 'absolute', left: 0, top: 0, zIndex: 0}}
            />
            <canvas
              id="output"
              style={{position: 'absolute', left: 0, top: 0, zIndex: 1}}
            />
          </div>
        </div>
        <ColorPicker />
      </div>
    )
  }
}

export default CameraComponent
require('./camera')
