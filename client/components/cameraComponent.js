import React, {Component} from 'react'
import ColorPicker from './colorPicker'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Toolbar from './toolbar'

import {fetchCommand} from '../store'

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

const mapStateToProps = state => ({
  currentCommand: state.speech.currentCommand
})
const mapDispatchToProps = dispatch => ({
  fetchCommand: () => dispatch(fetchCommand())
})

export default connect(mapStateToProps, mapDispatchToProps)(CameraComponent)
