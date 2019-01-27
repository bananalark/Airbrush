import React, {Component} from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {withStyles} from '@material-ui/core/styles'

//to make sure that camera is required even without refresh (ie, navigating from the landing page) - called on componentDidMount
const setUpCamera = () => {
  require('./camera')
}

const styles = {}

class CameraComponent extends Component {
  constructor() {
    super()
    this.state = {eraseModeOn: false}
    this.handleEraseModeClick = this.handleEraseModeClick.bind(this)
  }

  handleEraseModeClick() {
    if (this.state.eraseModeOn === true) {
      this.setState({eraseModeOn: false})
    } else {
      this.setState({eraseModeOn: true})
    }
  }

  componentDidMount() {
    setUpCamera()
  }

  render() {
    let eraserModeOn = this.state.eraseModeOn
    return (
      <Grid container>
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
            alignContent="center"
            alignItems="center"
          >
            <div style={{position: 'relative'}} id="display">
              <canvas
                id="background"
                style={{
                  position: 'absolute',
                  left: -300,
                  top: '50vh',
                  marginTop: -250,
                  zIndex: 1
                }}
              />
              <canvas
                id="output"
                style={{
                  position: 'absolute',
                  left: -300,
                  top: '50vh',
                  marginTop: -250,
                  zIndex: 2
                }}
              />
            </div>
          </Grid>

          <Grid
            container
            direction="column"
            alignContent="center"
            alignItems="center"
            id="buttons"
          >
            <input type="button" id="clear-button" value="Clear Canvas" />
            <p>
              Erase Mode:{' '}
              <input
                type="button"
                id="erase-button"
                value={eraserModeOn}
                onClick={this.handleEraseModeClick}
              />
            </p>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

require('./camera')

export default CameraComponent
