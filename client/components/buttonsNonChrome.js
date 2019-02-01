import React, {Component} from 'react'
import {connect} from 'react-redux'

import VoiceOverOff from '@material-ui/icons/VoiceOverOff'
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver'
import Brush from '@material-ui/icons/Brush'
import Pencil from 'mdi-material-ui/Pencil'
import Eraser from 'mdi-material-ui/Eraser'
import PencilOff from 'mdi-material-ui/PencilOff'
import Hand from 'mdi-material-ui/Hand'
import Clear from '@material-ui/icons/Clear'
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText
} from '@material-ui/core/'
import Save from '@material-ui/icons/Save'
import Camera from '@material-ui/icons/Camera'
import Drawer from '@material-ui/core/Drawer'
import {saveCanvas, clearCanvas} from '../utils/draw'

import voiceRecognition, {isChrome} from '../utils/speechUtil'

import store, {getCommand, toggleDraw, toggleErase, toggleVoice} from '../store'

import ColorPicker from './colorPicker'
import BrushOptions from './brushOptions'
import BodyPartOptions from './bodyPartOptions'

class ButtonsNonChrome extends Component {
  constructor() {
    super()
    this.state = {
      brushOpen: false,
      bodyPartOpen: false,
      voiceDialogOpen: false
    }
    this.toggleBrushOpen = this.toggleBrushOpen.bind(this)
    this.toggleBodyPartOpen = this.toggleBodyPartOpen.bind(this)

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

  toggleBrushOpen() {
    this.setState(prevState => ({brushOpen: !prevState.brushOpen}))
  }

  toggleBodyPartOpen() {
    this.setState(prevState => ({bodyPartOpen: !prevState.bodyPartOpen}))
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
      openLightbox,
      eraseModeOn,
      drawModeOn,
      voiceModeOn,
      toggleErase,
      toggleDraw
    } = this.props
    return (
      <div id="navbar">
        <Button onClick={() => this.handleNonChrome()}>
          <div>
            <VoiceOverOff />
            Voice Disabled
          </div>
        </Button>
        <Dialog
          maxWidth="xs"
          open={this.state.voiceDialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogContent>
            <DialogContentText align="center">
              Voice Mode is not compatible with this browser. Please use Chrome
              for the best experience!
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Button id="body-part-option" onClick={this.toggleBodyPartOpen}>
          <Hand />
          currently drawing with {this.props.chosenBodyPart}
          <Drawer anchor="left" open={this.state.bodyPartOpen}>
            <BodyPartOptions />
          </Drawer>
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
        <Button id="brush-button" onClick={this.toggleBrushOpen}>
          <Brush />
          Brush option
          <Drawer anchor="left" open={this.state.brushOpen}>
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
        <Button
          id="take-snapshot"
          value="Take Snapshot"
          onClick={() => {
            openLightbox(saveCanvas())
          }}
        >
          <Camera />Take Snapshot
        </Button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentCommand: state.paintTools.currentCommand,
  eraseModeOn: state.paintTools.eraseModeOn,
  voiceModeOn: state.paintTools.voiceModeOn,
  drawModeOn: state.paintTools.drawModeOn,
  chosenBrush: state.paintTools.chosenBrush,
  chosenBodyPart: state.paintTools.chosenBodyPart
})
const mapDispatchToProps = dispatch => ({
  getCommand: command => dispatch(getCommand(command)),
  toggleErase: () => dispatch(toggleErase()),
  toggleVoice: () => dispatch(toggleVoice()),
  toggleDraw: () => dispatch(toggleDraw())
})

export default connect(mapStateToProps, mapDispatchToProps)(ButtonsNonChrome)
