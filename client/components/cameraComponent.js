import React, {Component} from 'react'
import ColorPicker from './colorPicker'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Toolbar from './toolbar'

class CameraComponent extends Component {
  componentDidMount() {
    require('./utils/camera')
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
        <canvas id="saved-image" display="none" />
      </div>
    )
  }
}

export default CameraComponent
