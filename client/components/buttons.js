import React, {Component} from 'react'
import {connect} from 'react-redux'

import Pencil from 'mdi-material-ui/Pencil'
import PencilOff from 'mdi-material-ui/PencilOff'
import Hand from 'mdi-material-ui/Hand'
import {
  Switch,
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  withStyles,
  FormControlLabel
} from '@material-ui/core'
import {
  VoiceOverOff,
  RecordVoiceOver,
  Brush,
  Clear,
  Camera,
  Undo
} from '@material-ui/icons'

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

// const styles = theme => ({
//   colorBar: {},
//   colorChecked: {},
//   iOSSwitchBase: {
//     '&$iOSChecked': {
//       color: theme.palette.common.white,
//       '& + $iOSBar': {
//         backgroundColor: '#52d869',
//       },
//     },
//     transition: theme.transitions.create('transform', {
//       duration: theme.transitions.duration.shortest,
//       easing: theme.transitions.easing.sharp,
//     }),
//   },
//   iOSChecked: {
//     transform: 'translateX(15px)',
//     '& + $iOSBar': {
//       opacity: 1,
//       border: 'none',
//     },
//   },
//   iOSBar: {
//     borderRadius: 13,
//     width: 42,
//     height: 26,
//     marginTop: -13,
//     marginLeft: -21,
//     border: 'solid 1px',
//     borderColor: theme.palette.grey[400],
//     backgroundColor: theme.palette.grey[50],
//     opacity: 1,
//     transition: theme.transitions.create(['background-color', 'border']),
//   },
//   iOSIcon: {
//     width: 24,
//     height: 24,
//   },
//   iOSIconChecked: {
//     boxShadow: theme.shadows[1],
//   },
// });

class Buttons extends Component {
  constructor() {
    super()
    this.state = {
      voiceDialogOpen: false
      //checkedButton: false
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
  // handleChange = name => event => {
  //   this.setState({ [name]: event.target.checked });
  // }

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
      bodyPartOpen
      //classes
    } = this.props

    // let canvas = document.getElementById('output')
    // let domRect = canvas.getBoundingClientRect();
    // let {bottom, right} = domRect
    // console.log('bottom', bottom)
    // console.log('right', right)

    return (
      <div>
        <div id="navbar">
          {!isChrome ? (
            <>
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
              className={bodyPartOpen ? 'active' : ''}
              id="body-part-option"
              onClick={toggleBodyPart}
            >
              <Hand />
              currently drawing with {this.props.chosenBodyPart}
              {/* <Drawer anchor="left" open={this.state.bodyPartOpen}> */}
              {/* </Drawer> */}
            </Button>
            <CustomPopUp
              id="bodypart-options"
              className={bodyPartOpen ? 'open' : 'closed'}
            >
              <BodyPartOptions />
            </CustomPopUp>
          </div>
          <Button
            className={drawModeOn ? 'active' : ''}
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
            className={eraseModeOn ? 'active' : ''}
            id="erase-button"
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
        {/* <div id='OnOffButton' >
        <FormControlLabel
          control={
            <Switch
              classes={{
                switchBase: classes.iOSSwitchBase,
                bar: classes.iOSBar,
                icon: classes.iOSIcon,
                iconChecked: classes.iOSIconChecked,
                checked: classes.iOSChecked,
              }}
              disableRipple
              checked={this.state.checkedButton}
              onChange={this.handleChange('checkedButton')}
              value="checkedButton"
            />
          }
          label="On"
        />
        </div> */}
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

//export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Buttons))
export default connect(mapStateToProps, mapDispatchToProps)(Buttons)
