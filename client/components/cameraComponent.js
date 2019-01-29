import React, {Component} from 'react'
import ColorPicker from './colorPicker'
import axios from 'axios'
import {connect} from 'react-redux'

import {fetchCommand} from '../store'

class CameraComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eraseModeOn: false,
      voiceModeOn: false
    }
    this.toggleEraseMode = this.toggleEraseMode.bind(this)
    this.toggleVoiceMode = this.toggleVoiceMode.bind(this)
    this.handleSpeak = this.handleSpeak.bind(this)
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
    this.setState({voiceModeOn: !this.state.voiceModeOn})
  }
  handleSpeak() {
    this.setState({voiceModeOn: !this.state.voiceModeOn})
    this.props.fetchCommand()
    setInterval(() => this.props.fetchCommand(), 7000)
  }
  render() {
    let eraserModeOn = this.state.eraseModeOn
    return (
      <div>
        <h1>You said {this.props.currentCommand}</h1>
        <div id="speech-recognition">
          <h4>Turn Voice Recognition On/Off.</h4>
          <p>
            When voice recognition is ON, say "START" to start painting and
            "STOP" to... well, stop!
          </p>
          {this.state.voiceModeOn ? (
            <button onClick={this.toggleVoiceMode}>Voice Currently ON</button>
          ) : (
            <button onClick={() => this.handleSpeak()}>
              Voice Currently OFF
            </button>
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
              style={{position: 'absolute', left: 50, top: 50, zIndex: 0}}
            />
            <canvas
              id="output"
              style={{position: 'absolute', left: 50, top: 50, zIndex: 1}}
            />
          </div>
        </div>
        <ColorPicker />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentCommand: state.speech.currentCommand
})
const mapDispatchToProps = dispatch => ({
  fetchCommand: () => dispatch(fetchCommand())
})

export default connect(mapStateToProps, mapDispatchToProps)(CameraComponent)

// export default CameraComponent

//require('./camera')
