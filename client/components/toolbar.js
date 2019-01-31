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
import Save from '@material-ui/icons/Save'
import {saveCanvas, clearCanvas} from './utils/draw'

import voiceRecognition from './utils/speechUtil'

import store, {getCommand, toggleDraw, toggleErase, toggleVoice} from '../store'

class Toolbar extends Component {
  async handleSpeak() {
    let {
      drawModeOn,
      eraseModeOn,
      voiceModeOn,
      currentCommand,
      toggleVoice
    } = this.props

    await toggleVoice()

    if (store.getState().paintTools.voiceModeOn === true) {
      voiceRecognition(store.getState().paintTools)
      setInterval(() => {
        if (store.getState().paintTools.voiceModeOn === true) {
          voiceRecognition(store.getState().paintTools)
        }
      }, 5000)
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
        <Button
          id="clear-button"
          value="Clear Canvas"
          onClick={() => clearCanvas()}
        >
          <Clear />Clear Canvas
        </Button>
        <Button
          id="save-sanvas"
          value="Save Canvas"
          onClick={() => saveCanvas()}
        >
          <Save />Save Canvas
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
  currentCommand: state.paintTools.currentCommand,
  eraseModeOn: state.paintTools.eraseModeOn,
  voiceModeOn: state.paintTools.voiceModeOn,
  drawModeOn: state.paintTools.drawModeOn
})
const mapDispatchToProps = dispatch => ({
  getCommand: command => dispatch(getCommand(command)),
  toggleErase: () => dispatch(toggleErase()),
  toggleVoice: () => dispatch(toggleVoice()),
  toggleDraw: () => dispatch(toggleDraw())
})

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
