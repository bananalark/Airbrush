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
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText
} from '@material-ui/core/'
import Save from '@material-ui/icons/Save'
import Drawer from '@material-ui/core/Drawer'
import {saveCanvas, clearCanvas} from '../utils/draw'

import voiceRecognition, {isChrome} from '../utils/speechUtil'

import store, {getCommand, toggleDraw, toggleErase, toggleVoice} from '../store'

import BrushOptions from './brushOptions'

class Toolbar extends Component {
  constructor() {
    super()
    this.state = {
      open: false,
      voiceDialogOpen: false
    }
    this.toggleOpen = this.toggleOpen.bind(this)
    this.handleSpeak = this.handleSpeak.bind(this)
    this.handleNonChrome = this.handleNonChrome.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
  }

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

  handleNonChrome() {
    this.setState({voiceDialogOpen: true})
  }

  handleDialogClose() {
    this.setState({voiceDialogOpen: false})
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
        {isChrome ? (
          <div>
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
            <Button
              id="clear-button"
              value="Clear Canvas"
              onClick={() => clearCanvas()}
            >
              <Clear />Clear Canvas
            </Button>
            <Button
              id="save-canvas"
              value="Save Canvas"
              onClick={() => saveCanvas()}
            >
              <Save />Save Canvas
            </Button>
          </div>
        ) : (
          /*vvvv NON-CHROME BROWSERS vvvv*/
          <div>
            <Button onClick={() => this.handleNonChrome()}>
              <div>
                <VoiceOverOff />
                Voice Disabled
              </div>
            </Button>
            <Dialog
              maxWidth="sm"
              open={this.state.voiceDialogOpen}
              onClose={this.handleDialogClose}
              aria-labelledby="max-width-dialog-title"
            >
              <DialogContent>
                <DialogContentText>
                  Voice Mode is not compatible with this browser. Please use
                  Chrome for the best experience!
                </DialogContentText>
              </DialogContent>
            </Dialog>
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
            <Button
              id="clear-button"
              value="Clear Canvas"
              onClick={() => clearCanvas()}
            >
              <Clear />Clear Canvas
            </Button>
            <Button
              id="save-canvas"
              value="Save Canvas"
              onClick={() => saveCanvas()}
            >
              <Save />Save Canvas
            </Button>
          </div>
        )}
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
