import React, {Component} from 'react'
import {connect} from 'react-redux'

import ColorPicker from './colorPicker'
import VoiceOverOff from '@material-ui/icons/VoiceOverOff'
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver'
import Brush from '@material-ui/icons/Brush'
import Pencil from 'mdi-material-ui/Pencil'
import Eraser from 'mdi-material-ui/Eraser'
import PencilOff from 'mdi-material-ui/PencilOff'
import Clear from '@material-ui/icons/Clear'
import Button from '@material-ui/core/Button'

import testSpeech, {evaluateCommand} from './utils/speechUtil'

import {getCommand, toggleErase, toggleVoice, toggleDraw} from '../store'

import BrushOptions from './brushOptions'
import {Drawer} from '@material-ui/core'

class Toolbar extends Component {
  constructor() {
    super()
    this.state = {
      open: false
    }
    this.toggleOpen = this.toggleOpen.bind(this)
  }

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
      testSpeech(!isVoiceModeOn, this.props.state)
    }
  }

  toggleOpen() {
    this.setState(prevState => ({open: !prevState.open}))
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
        <Button id="brush-button" onClick={this.toggleOpen}>
          <Brush />
          Brush option
          <Drawer anchor="left" open={this.state.open}>
            <BrushOptions />
          </Drawer>
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
        <ColorPicker />
        <Button id="clear-button" value="Clear Canvas">
          <Clear />Clear Canvas
        </Button>
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
