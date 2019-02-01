import React, {Component} from 'react'
import ColorPicker from './colorPicker'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Toolbar from './toolbar'
import {download} from './utils/draw'

class CameraComponent extends Component {
  componentDidMount() {
    require('../utils/camera')
  }

  render() {
    return (
      <div>
        <div id="info" />
        <Grid
          container
          direction="column"
          justify="center"
          alignContent="center"
          id="main"
        >
          <Grid container direction="column">
            <div id="display">
              <Grid item>
                <video id="video" plays-inline="true" />
              </Grid>
              <Toolbar />
              <div style={{position: 'relative'}}>
                <canvas id="background" />
                <canvas id="output" />
              </div>
            </div>
          </Grid>
        </Grid>
        {/* //this will be wrapped in a lightbox */}
        <canvas id="saved-image" display="none" />
        <button id="download" onClick={download}>
          download
        </button>
      </div>
    )
  }
}

export default CameraComponent
