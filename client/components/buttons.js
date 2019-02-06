import React, {Component} from 'react'
import {connect} from 'react-redux'

import {
  Dialog,
  DialogContent,
  DialogContentText,
  Button
} from '@material-ui/core'

import {
  VoiceOverOff,
  RecordVoiceOver,
  Brush,
  Clear,
  Camera,
  Undo
} from '@material-ui/icons'

import Pencil from 'mdi-material-ui/Pencil'
import PencilOff from 'mdi-material-ui/PencilOff'
import Hand from 'mdi-material-ui/Hand'

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

  handleNonChrome() {
    this.setState({voiceDialogOpen: true})
  }

  handleDialogClose() {
    this.setState({voiceDialogOpen: false})
  }

  /*eslint-disable*/
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
      bodyPartOpen,
      chosenBodyPart
    } = this.props

    return (
      <div>
        <div
          id="navbar"
          className={chosenBodyPart === 'rightHand' ? 'right' : ''}
        >
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
            <Button
              id="voice-button"
              className={voiceModeOn ? 'active' : ''}
              onClick={() => this.handleSpeak()}
            >
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
            <Button
              onClick={toggleBodyPart}
              className={bodyPartOpen ? 'active' : ''}
            >
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
            className={drawModeOn ? 'active' : ''}
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
            <Button
              id="brush-button"
              className={brushOpen ? 'active' : ''}
              onClick={toggleBrush}
            >
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
            className={eraseModeOn ? 'active' : ''}
            value={eraseModeOn}
            onClick={() => toggleErase()}
          >
            {eraseModeOn ? (
              <div>
                <Undo />
                Undo Mode ON
              </div>
            ) : (
              <div>
                <Undo />
                Undo Mode OFF
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
/*eslint-enable*/

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
