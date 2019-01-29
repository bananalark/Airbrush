import React, {Component} from 'react'

import ColorPicker from './colorPicker'
import VoiceOverOff from '@material-ui/icons/VoiceOverOff'
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver'
import Pencil from 'mdi-material-ui/Pencil'
import Eraser from 'mdi-material-ui/Eraser'
import PencilOff from 'mdi-material-ui/PencilOff'
import Clear from '@material-ui/icons/Clear'
import Button from '@material-ui/core/Button'

import {connect} from 'react-redux'

import {fetchCommand} from '../store'

class Toolbar extends Component {
  constructor() {
    super()
    this.state = {eraseModeOn: false, voiceModeOn: false, drawModeOn: false}
    this.toggleEraseMode = this.toggleEraseMode.bind(this)
    this.toggleDrawMode = this.toggleDrawMode.bind(this)
  }

  toggleEraseMode() {
    console.log('ERASE MODE IS...', this.state.eraseModeOn)
    if (this.state.eraseModeOn === true) {
      this.setState({eraseModeOn: false})
    } else {
      this.setState({eraseModeOn: true})
    }
  }

  toggleDrawMode() {
    this.setState(prevState => ({drawModeOn: !prevState.drawModeOn}))
  }

  async handleSpeak() {
    if (this.state.voiceModeOn === true) {
      console.log('Not recording - voice mode is off!')
    } else {
      console.log('SPEAK MODE TURNED ON')
      await this.props.fetchCommand()
      setInterval(async () => {
        await this.props.fetchCommand()
      }, 6000)
    }
    this.setState({voiceModeOn: !this.state.voiceModeOn})
  }

  // componentDidMount() {
  //   const navbar = document.getElementById('navbar')
  //   navbar.height = document.getElementById('output').height
  // }

  render() {
    let eraserModeOn = this.state.eraseModeOn
    let {drawModeOn} = this.state

    return (
      <div id="navbar">
        <Button
          id="draw-button"
          value={drawModeOn}
          onClick={this.toggleDrawMode}
        >
          {this.state.drawModeOn ? (
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
        <Button
          id="erase-button"
          value={eraserModeOn}
          onClick={this.toggleEraseMode}
        >
          {eraserModeOn === true ? (
            <div>
              <Eraser />
              Eraser Mode ON
            </div>
          ) : (
            <div>
              <Eraser />
              Eraser Mode OFF
            </div>
          )}
        </Button>{' '}
        <Button id="clear-button" value="Clear Canvas">
          <Clear />Clear Canvas
        </Button>
        <Button onClick={() => this.handleSpeak()}>
          {this.state.voiceModeOn === true ? (
            <div>
              <RecordVoiceOver />
              Voice Currently ON
            </div>
          ) : (
            <div>
              <VoiceOverOff />
              Voice Currently OFF
            </div>
          )}
        </Button>
        <ColorPicker />
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

// export default Toolbar
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
