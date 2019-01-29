import React, {Component} from 'react'

import ColorPicker from './colorPicker'
import VoiceOverOff from '@material-ui/icons/VoiceOverOff'
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver'
import Pencil from 'mdi-material-ui/Pencil'
import Eraser from 'mdi-material-ui/Eraser'
import PencilOff from 'mdi-material-ui/PencilOff'
import Clear from '@material-ui/icons/Clear'
import Button from '@material-ui/core/Button'

class Toolbar extends Component {
  constructor() {
    super()
    this.state = {eraseModeOn: false, voiceModeOn: false, drawModeOn: false}
    this.toggleEraseMode = this.toggleEraseMode.bind(this)
    this.toggleVoiceMode = this.toggleVoiceMode.bind(this)
    this.toggleDrawMode = this.toggleDrawMode.bind(this)
  }

  toggleEraseMode() {
    console.log(this.state.eraseModeOn)
    if (this.state.eraseModeOn === true) {
      this.setState({eraseModeOn: false})
    } else {
      this.setState({eraseModeOn: true})
    }
  }
  toggleVoiceMode() {
    if (this.state.voiceModeOn === true) {
      this.setState({voiceModeOn: false})
    } else {
      this.setState({voiceModeOn: true})
    }
  }

  toggleDrawMode() {
    this.setState(prevState => ({drawModeOn: !prevState.drawModeOn}))
  }
  // componentDidMount() {
  //   const output = document.getElementById('output')
  //   console.log('OUTPUT COORDS', output.style.left, output.style.top)
  // }

  render() {
    let eraserModeOn = this.state.eraseModeOn

    return (
      <div className="navbar" style={{position: 'absolute'}}>
        <Button id="draw-button">
          <Pencil />
          draw mode button
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
        <Button onClick={this.toggleVoiceMode}>
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

export default Toolbar
