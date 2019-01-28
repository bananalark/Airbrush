import React, {Component} from 'react'

import ColorPicker from './colorPicker'
import VoiceOverOff from '@material-ui/icons/VoiceOverOff'
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver'
import Pencil from 'mdi-material-ui/Pencil'
import Eraser from 'mdi-material-ui/Eraser'
import PencilOff from 'mdi-material-ui/PencilOff'
import Clear from '@material-ui/icons/Clear'

class Toolbar extends Component {
  constructor() {
    super()
    this.state = {
      left: 0,
      top: 0
    }
  }

  componentDidMount() {
    const output = document.getElementById('output')
    console.log('OUTPUT COORDS', output.style.left, output.style.top)
  }

  render() {
    return (
      <div
        style={{
          position: 'absolute',
          top: 'this.state.top',
          left: 'this.state.top'
        }}
      >
        {/* conditionally render RecordVoiceOver / VoiceOverOff */}
        <RecordVoiceOver alttext="voice recognition ON" />
        <VoiceOverOff alttext="voice recognition OFF" />
        {/* conditionally render Pencil / PencilOff */}
        <Pencil />
        <PencilOff />
        {/* always render these three */}
        <Eraser />
        <Clear />
        <ColorPicker />
      </div>
    )
  }
}

export default Toolbar
