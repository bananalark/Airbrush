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
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import Camera from '@material-ui/icons/Camera'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

import {saveCanvas, clearCanvas} from '../utils/draw'
import {voiceModeStartStop} from '../utils/speechUtil'

import {
  getCommand,
  toggleDraw,
  toggleErase,
  toggleVoice,
  toggleBrush,
  toggleBodyPart
} from '../store'

import {isChrome} from '../utils/speechUtil'

import ColorPicker from './colorPicker'
import BrushOptions from './brushOptions'
import BodyPartOptions from './bodyPartOptions'
import CustomPopUp from './customPopUp'
import LineThickness from './LineThickness'

class Buttons extends Component {
  constructor() {
    super()
    this.state = {
      voiceDialogOpen: false
    }
    this.handleSpeak = this.handleSpeak.bind(this)
    this.handleNonChrome = this.handleNonChrome.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
  }

  async handleSpeak() {
    let {toggleVoice} = this.props
    await toggleVoice()
    voiceModeStartStop()
  }

  // toggleBodyPartOpen() {
  //   this.setState(prevState => ({bodyPartOpen: !prevState.bodyPartOpen}))
  // }

  handleNonChrome() {
    this.setState({voiceDialogOpen: true})
  }

  handleDialogClose() {
    this.setState({voiceDialogOpen: false})
  }

  render() {
    let {
      openLightbox,
      eraseModeOn,
      drawModeOn,
      voiceModeOn,
      toggleErase,
      toggleDraw,
      toggleBrush,
      toggleBodyPart,
      brushOpen,
      bodyPartOpen
    } = this.props

    return (
      <div>
        <div id="navbar">
          {!isChrome ? (
            <>
              <Button onClick={() => this.handleNonChrome()}>
                <div id="voice-button">
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
                    Voice Mode is not compatible with this browser. Please use
                    Chrome for the best experience!
                  </DialogContentText>
                </DialogContent>
              </Dialog>
            </>
          ) : (
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
          )}
          <div>
            <Button onClick={toggleBodyPart}>
              <span id="body-part-option">
                <Hand />
                currently drawing with {this.props.chosenBodyPart}
                {/* <Drawer anchor="left" open={this.state.bodyPartOpen}> */}
                {/* </Drawer> */}
              </span>
            </Button>
            <CustomPopUp
              id="bodypart-options"
              className={bodyPartOpen ? 'open' : 'closed'}
            >
              <BodyPartOptions />
            </CustomPopUp>
          </div>
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
          <div>
            <Button id="brush-button" onClick={toggleBrush}>
              <Brush />
              Brush option
            </Button>
            <CustomPopUp
              id="brush-options-popup"
              className={brushOpen ? 'open' : 'closed'}
            >
              <BrushOptions />
              <LineThickness />
            </CustomPopUp>
          </div>
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
  chosenBodyPart: state.paintTools.chosenBodyPart,
  bodyPartOpen: state.expansionPanels.bodyPart,
  brushOpen: state.expansionPanels.brush
})
const mapDispatchToProps = dispatch => ({
  getCommand: command => dispatch(getCommand(command)),
  toggleErase: () => dispatch(toggleErase()),
  toggleVoice: () => dispatch(toggleVoice()),
  toggleDraw: () => dispatch(toggleDraw()),
  toggleBrush: () => dispatch(toggleBrush()),
  toggleBodyPart: () => dispatch(toggleBodyPart())
})

export default connect(mapStateToProps, mapDispatchToProps)(Buttons)
