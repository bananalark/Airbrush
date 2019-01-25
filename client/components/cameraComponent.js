import React, {Component} from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

const setUpCamera = () => {
  require('./camera')
}

class CameraComponent extends Component {
  componentDidMount() {
    setUpCamera()
  }

  render() {
    return (
      <Grid container direction="column" justify="center">
        {/* <div id="info" />  */}
        <Grid container id="main">
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

          <Grid item>
            <Grid item style={{position: 'relative'}}>
              <canvas
                id="background"
                style={{position: 'absolute', left: 0, top: 0, zIndex: 0}}
              />
              <canvas
                id="output"
                style={{position: 'absolute', left: 0, top: 0, zIndex: 1}}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default CameraComponent
