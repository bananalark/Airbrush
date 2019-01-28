import React, {Component} from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {withStyles} from '@material-ui/core/styles'
import ColorPicker from './colorPicker'
import VoiceOverOff from '@material-ui/icons/VoiceOverOff'
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver'
import Pencil from 'mdi-material-ui/Pencil'
import Eraser from 'mdi-material-ui/Eraser'
import PencilOff from 'mdi-material-ui/PencilOff'
import Clear from '@material-ui/icons/Clear'
import Toolbar from './toolbar'

//to make sure that camera is required even without refresh (ie, navigating from the landing page) - called on componentDidMount

const styles = {}

class CameraComponent extends Component {
  constructor() {
    super()
    this.state = {eraseModeOn: false, voiceModeOn: false}
    this.toggleEraseMode = this.toggleEraseMode.bind(this)
    this.toggleVoiceMode = this.toggleVoiceMode.bind(this)
  }
  componentDidMount() {
    require('./camera')
  }
  toggleEraseMode() {
    console.log(this.state.eraseModeOn)
    if (this.state.eraseModeOn === true) {
      this.setState({eraseModeOn: false})
    } else {
      this.setState({eraseModeOn: true})
    }
  }
  toggleVoiceMode() {
    if (this.state.voiceModeOn === true) {
      this.setState({voiceModeOn: false})
    } else {
      this.setState({voiceModeOn: true})
    }
  }

  render() {
    let eraserModeOn = this.state.eraseModeOn
    return (
      <div>
        <Toolbar />
        <Grid
          container
          direction="column"
          alignContent="center"
          alignItems="center"
          id="buttons"
        >
          <div id="buttons">
            <h5>Erase Tools!</h5>
            <p>
              Erase Mode:{' '}
              <input
                type="button"
                id="erase-button"
                value={eraserModeOn}
                onClick={this.toggleEraseMode}
              />{' '}
              ...or...
              <input type="button" id="clear-button" value="Clear Canvas" />
            </p>
          </div>
        </Grid>

        <Grid container>
          <div id="speech-recognition">
            <h4>Turn Voice Recognition On/Off.</h4>
            <p>
              When voice recognition is ON, say "START" to start painting and
              "STOP" to... well, stop!
            </p>
            {this.state.voiceModeOn === true ? (
              <button onClick={this.toggleVoiceMode}>Voice Currently ON</button>
            ) : (
              <button onClick={this.toggleVoiceMode}>
                Voice Currently OFF
              </button>
            )}
          </div>
          {/* <div id="info" />  */}
          <Grid
            container
            direction="column"
            justify="center"
            alignContent="center"
            id="main"
          >
            <Grid item>
              <video
                id="video"
                // plays-inline="true"
                style={{display: 'none'}}
                // style={{
                //   '-moz-transform': scaleX(-1),
                //   '-o-transform': scaleX(-1),
                //   '-webkit-transform': scaleX(-1),
                //   transform: scaleX(-1),
                //   display: none
                // }}
              />
            </Grid>

            <Grid
              container
              direction="column"
              // alignContent="center"
              // alignItems="center"
            >
              <div style={{position: 'relative'}} id="display">
                <canvas
                  id="background"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 1
                  }}
                />
                <canvas
                  id="output"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 2
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default CameraComponent

//require('./camera')
