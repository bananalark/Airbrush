import React, {Component} from 'react'
import {connect} from 'react-redux'

import ColorPicker from './colorPicker'
import VoiceOverOff from '@material-ui/icons/VoiceOverOff'
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver'
import Pencil from 'mdi-material-ui/Pencil'
import Eraser from 'mdi-material-ui/Eraser'
import PencilOff from 'mdi-material-ui/PencilOff'
import Clear from '@material-ui/icons/Clear'
import Button from '@material-ui/core/Button'

import testSpeech, {speechResult} from './utils/speechUtil'

// let startVoiceInterval = setInterval(testSpeech, 3000)
// function stopVoiceInterval() {
//   clearInterval(startVoiceInterval)
// }

class Toolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eraseModeOn: false,
      voiceModeOn: false,
      drawModeOn: false
    }
    this.toggleEraseMode = this.toggleEraseMode.bind(this)
    this.toggleDrawMode = this.toggleDrawMode.bind(this)
    this.toggleVoiceMode = this.toggleVoiceMode.bind(this)
    this.analyzeCurrentCommand = this.analyzeCurrentCommand.bind(this)
  }

  componentDidUpdate() {
    this.analyzeCurrentCommand()
  }

  toggleEraseMode() {
    if (this.state.eraseModeOn === true) {
      this.setState({eraseModeOn: false})
    } else {
      this.setState({eraseModeOn: true})
    }
  }

  toggleDrawMode() {
    this.setState(prevState => ({drawModeOn: !prevState.drawModeOn}))
  }

  toggleVoiceMode() {
    this.setState(prevState => ({voiceModeOn: !prevState.voiceModeOn}))
    // let newVoiceMode = !this.state.voiceModeOn
    // this.setState({voiceModeOn: newVoiceMode})
  }

  analyzeCurrentCommand() {
    let {currentCommand} = this.props
    if (currentCommand === 'start') {
      this.setState({drawModeOn: true})
    } else if (currentCommand === 'stop') {
      this.setState({drawModeOn: false})
    } else if (currentCommand === 'erase') {
      this.setState({eraseModeOn: true})
      this.setState({drawModeOn: true})
    } else if (currentCommand === 'erase off') {
      this.setState({eraseModeOn: false})
    }
  }
  /*eslint-disable*/
  async handleSpeak() {
    console.log('VOICE MODE BEFORE--->', this.state.voiceModeOn)
    await this.toggleVoiceMode()
    console.log('VOICE MODE AFTER--->', this.state.voiceModeOn)

    //   if (this.state.voiceModeOn === true) {
    //     testSpeech(true)
    //     setInterval(() => {
    //       testSpeech(this.state.voiceModeOn)
    //     }, 5000)
    //   } else {
    //     setInterval(() => {
    //       this.handleSpeak()
    //     }, 5000)
    //   }
  }

  /*eslint-enable*/

  render() {
    let eraserModeOn = this.state.eraseModeOn
    let {drawModeOn} = this.state
    // setInterval(() => {
    //   this.analyzeCurrentCommand()
    // }, 1000)

    return (
      <div id="navbar">
        <Button
          id="draw-button"
          value={drawModeOn}
          onClick={this.toggleDrawMode}
        >
          {this.state.drawModeOn ? (
            <div>
              <Pencil />
              Draw Mode ON
            </div>
          ) : (
            <div>
              <PencilOff />
              Draw Mode OFF
            </div>
          )}
        </Button>
        <Button
          id="erase-button"
          value={eraserModeOn}
          onClick={this.toggleEraseMode}
        >
          {eraserModeOn === true ? (
            <div>
              <Eraser />
              Eraser Mode ON
            </div>
          ) : (
            <div>
              <Eraser />
              Eraser Mode OFF
            </div>
          )}
        </Button>{' '}
        <Button id="clear-button" value="Clear Canvas">
          <Clear />Clear Canvas
        </Button>
        <Button
          id="voice-button"
          onClick={() => this.handleSpeak(this.state.voiceModeOn)}
        >
          {this.state.voiceModeOn === true ? (
            <div>
              <RecordVoiceOver />
              Voice Currently ON
            </div>
          ) : (
            <div>
              <VoiceOverOff />
              Voice Currently OFF
            </div>
          )}
        </Button>
        <ColorPicker />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentCommand: state.speech.currentCommand
})
const mapDispatchToProps = dispatch => ({
  // getCommand: () => dispatch(getCommand())
})

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
