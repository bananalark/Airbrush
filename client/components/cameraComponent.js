import React, {Component} from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import ColorPicker from './colorPicker'
import VoiceOverOff from '@material-ui/icons/VoiceOverOff'
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver'
import Pencil from 'mdi-material-ui/Pencil'
import Eraser from 'mdi-material-ui/Eraser'
import PencilOff from 'mdi-material-ui/PencilOff'
import Clear from '@material-ui/icons/Clear'
import Toolbar from './toolbar'

//to make sure that camera is required even without refresh (ie, navigating from the landing page) - called on componentDidMount

class CameraComponent extends Component {
  componentDidMount() {
    require('./camera')
  }

  render() {
    return (
      <div>
        {/* <div id="info" />  */}
        <Grid
          container
          direction="column"
          justify="center"
          alignContent="center"
          id="main"
        >
          <Grid
            container
            direction="column"
            // alignContent="center"
            // alignItems="center"
          >
            <div style={{position: 'relative'}} id="display">
              <Grid item>
                <video
                  id="video"
                  plays-inline="true"
                  // style={{display: 'none'}}
                />
              </Grid>
              <Toolbar />
              {/* <canvas
                id="background"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  zIndex: 0
                }}
              /> */}
              <canvas
                id="output"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  zIndex: 4
                }}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default CameraComponent

//require('./camera')
