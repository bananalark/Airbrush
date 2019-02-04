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
import {Button} from '@material-ui/core/'
import Drawer from '@material-ui/core/Drawer'
import {saveCanvas, clearCanvas} from '../utils/draw'
import Camera from '@material-ui/icons/Camera'

import {voiceModeStartStop} from '../utils/speechUtil'

import {getCommand, toggleDraw, toggleErase, toggleVoice} from '../store'

import ColorPicker from './colorPicker'
import BrushOptions from './brushOptions'
import BodyPartOptions from './bodyPartOptions'
import CustomPopUp from './customPopUp'

class ButtonsChrome extends Component {
  constructor() {
    super()
    this.state = {
      brushOpen: false,
      bodyPartOpen: false
    }
    this.toggleBrushOpen = this.toggleBrushOpen.bind(this)
    this.toggleBodyPartOpen = this.toggleBodyPartOpen.bind(this)

    this.handleSpeak = this.handleSpeak.bind(this)
  }

  async handleSpeak() {
    let {toggleVoice} = this.props
    await toggleVoice()
    voiceModeStartStop()
  }

  // toggleBrushOpen() {
  //   let brushOptionsPopUp = document.getElementById("brush-options")
  //   brushOptionsPopUp.className = 'open';
  // }

  toggleBrushOpen() {
    this.setState(prevState => ({brushOpen: !prevState.brushOpen}))
  }

  // toggleBodyPartOpen() {
  //   let bodyPartOptionsPopUp = document.getElementById('bodypart-options')
  //   bodyPartOptionsPopUp.className = 'open';
  // }

  toggleBodyPartOpen() {
    this.setState(prevState => ({bodyPartOpen: !prevState.bodyPartOpen}))
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
        <Button id="voice-button" onClick={() => this.handleSpeak()}>
          {voiceModeOn ? (
            <div>
              <RecordVoiceOver />
              Voice Currently On
            </div>
          ) : (
            <div>
              <VoiceOverOff />
              Voice Currently OFF
            </div>
          )}
        </Button>
        <Button id="body-part-option" onClick={this.toggleBodyPartOpen}>
          <Hand />
          currently drawing with {this.props.chosenBodyPart}
          {/* <Drawer anchor="left" open={this.state.bodyPartOpen}> */}
          <CustomPopUp id="bodypart-options" className="open">
            <BodyPartOptions />
          </CustomPopUp>
          {/* </Drawer> */}
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
          {/* <Drawer anchor="left" open={this.state.brushOpen}> */}
          <CustomPopUp id="brush-options" className="">
            <BrushOptions />
          </CustomPopUp>
          {/* </Drawer> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(ButtonsChrome)
