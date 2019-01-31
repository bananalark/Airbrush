import React, {Component} from 'react'

import ColorPicker from './colorPicker'
import VoiceOverOff from '@material-ui/icons/VoiceOverOff'
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver'
import Pencil from 'mdi-material-ui/Pencil'
import Eraser from 'mdi-material-ui/Eraser'
import PencilOff from 'mdi-material-ui/PencilOff'
import Clear from '@material-ui/icons/Clear'
import Save from '@material-ui/icons/Save'
import Button from '@material-ui/core/Button'

import {saveCanvas, clearCanvas} from './utils'

import {connect} from 'react-redux'

import {fetchCommand} from '../store'

class Toolbar extends Component {
  constructor() {
    super()
    this.state = {eraseModeOn: false, voiceModeOn: false, drawModeOn: false}
    this.toggleEraseMode = this.toggleEraseMode.bind(this)
    this.toggleDrawMode = this.toggleDrawMode.bind(this)
    this.toggleVoiceMode = this.toggleVoiceMode.bind(this)
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

  toggleVoiceMode() {
    this.setState({voiceModeOn: !this.state.voiceModeOn})
  }

  async handleSpeak() {
    if (this.state.voiceModeOn === false) {
      console.log(`TURNING SPEAK MODE ON`)
      this.toggleVoiceMode()
      await this.props.fetchCommand()

      setInterval(async () => {
        if (this.state.voiceModeOn === true) {
          await this.props.fetchCommand()
        }
      }, 6000)
    } else {
      console.log(`TURNING SPEAK MODE OFF`)
      this.toggleVoiceMode()
    }
  }

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
        <Button
          id="clear-button"
          value="Clear Canvas"
          onClick={() => clearCanvas()}
        >
          <Clear />Clear Canvas
        </Button>
        <Button
          id="save-sanvas"
          value="Save Canvas"
          onClick={() => saveCanvas()}
        >
          <Save />Save Canvas
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
