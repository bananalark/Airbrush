import React, {Component} from 'react'
import ColorPicker from './colorPicker'
import axios from 'axios'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Toolbar from './toolbar'

import {fetchCommand} from '../store'

class CameraComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eraseModeOn: false,
      voiceModeOn: false
    }
    this.toggleEraseMode = this.toggleEraseMode.bind(this)
    this.toggleVoiceMode = this.toggleVoiceMode.bind(this)
    this.handleSpeak = this.handleSpeak.bind(this)
  }
  componentDidMount() {
    require('./camera')
  }
  toggleEraseMode() {
    if (this.state.eraseModeOn === true) {
      this.setState({eraseModeOn: false})
    } else {
      this.setState({eraseModeOn: true})
    }
  }
  toggleVoiceMode() {
    this.setState({voiceModeOn: !this.state.voiceModeOn})
  }
  handleSpeak() {
    this.setState({voiceModeOn: !this.state.voiceModeOn})
    this.props.fetchCommand()
    setInterval(() => this.props.fetchCommand(), 7000)
  }

  render() {
    return (
      <div>
        {/* <h1>You said {this.props.currentCommand}</h1>
        <div id="speech-recognition">
          <h4>Turn Voice Recognition On/Off.</h4>
          <p>
            When voice recognition is ON, say "START" to start painting and
            "STOP" to... well, stop!
          </p>
          {this.state.voiceModeOn ? (
            <button onClick={this.toggleVoiceMode}>Voice Currently ON</button>
          ) : (
            <button onClick={() => this.handleSpeak()}>
              Voice Currently OFF
            </button>
          )}
        </div> */}
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

// export default CameraComponent

//require('./camera')
