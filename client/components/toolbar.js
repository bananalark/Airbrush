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

import {getCommand, toggleErase, toggleVoice, toggleDraw} from '../store'

class Toolbar extends Component {
  async handleSpeak() {
    let {
      toggleVoice,
      drawModeOn,
      eraseModeOn,
      voiceModeOn,
      getCommand
    } = this.props

    let isVoiceModeOn = voiceModeOn
    let isDrawModeOn = drawModeOn
    let isEraseModeOn = eraseModeOn
    await toggleVoice()

    if (!isVoiceModeOn) {
      testSpeech(!isVoiceModeOn)
    }
  }

  render() {
    let {
      eraseModeOn,
      drawModeOn,
      voiceModeOn,
      toggleErase,
      toggleDraw
    } = this.props

    return (
      <div id="navbar">
        <Button
          id="draw-button"
          value={drawModeOn}
          onClick={() => toggleDraw()}
        >
          {drawModeOn ? (
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
          value={eraseModeOn}
          onClick={() => toggleErase()}
        >
          {eraseModeOn ? (
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
        <Button id="voice-button" onClick={() => this.handleSpeak()}>
          {voiceModeOn ? (
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
  currentCommand: state.speech.currentCommand,
  eraseModeOn: state.speech.eraseModeOn,
  voiceModeOn: state.speech.voiceModeOn,
  drawModeOn: state.speech.drawModeOn
})
const mapDispatchToProps = dispatch => ({
  getCommand: command => dispatch(getCommand(command)),
  toggleErase: () => dispatch(toggleErase()),
  toggleVoice: () => dispatch(toggleVoice()),
  toggleDraw: () => dispatch(toggleDraw())
})

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
