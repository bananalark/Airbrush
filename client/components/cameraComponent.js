import React, {Component} from 'react'

class CameraComponent extends Component {
  constructor() {
    super()
    this.state = {eraseModeOn: false, voiceModeOn: false}
    this.toggleEraseMode = this.toggleEraseMode.bind(this)
    this.toggleVoiceMode = this.toggleVoiceMode.bind(this)
  }
  componentDidMount() {
    require('./camera')
  }
  toggleEraseMode() {
    if (this.state.eraseModeOn === true) {
      this.setState({eraseModeOn: false})
    } else {
      this.setState({eraseModeOn: true})
    }
  }
  toggleVoiceMode() {
    if (this.state.voiceModeOn === true) {
      this.setState({voiceModeOn: false})
    } else {
      this.setState({voiceModeOn: true})
    }
  }
  render() {
    let eraserModeOn = this.state.eraseModeOn
    return (
      <div>
        <div id="speech-recognition">
          <h4>Turn Voice Recognition On/Off.</h4>
          <p>
            When voice recognition is ON, say "START" to start painting and
            "STOP" to... well, stop!
          </p>
          {this.state.voiceModeOn === true ? (
            <button onClick={this.toggleVoiceMode}>Voice Currently ON</button>
          ) : (
            <button onClick={this.toggleVoiceMode}>Voice Currently OFF</button>
          )}
        </div>
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
            <h5>Erase Tools!</h5>
            <p>
              Erase Mode:{' '}
              <input
                type="button"
                id="erase-button"
                value={eraserModeOn}
                onClick={this.toggleEraseMode}
              />{' '}
              ...or...
              <input type="button" id="clear-button" value="Clear Canvas" />
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
      </div>
    )
  }
}

export default CameraComponent

// require('./camera')
