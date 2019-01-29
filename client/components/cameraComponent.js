import React, {Component} from 'react'
import Grid from '@material-ui/core/Grid'
import Toolbar from './toolbar'

//to make sure that camera is required even without refresh (ie, navigating from the landing page) - called on componentDidMount

class CameraComponent extends Component {
  componentDidMount() {
    require('./camera')
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
              <canvas id="output" />
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default CameraComponent

//require('./camera')
