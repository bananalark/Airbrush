import React, {Component} from 'react'
import {connect} from 'react-redux'

import ColorPicker from './colorPicker'
import VoiceOverOff from '@material-ui/icons/VoiceOverOff'
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver'
import Brush from '@material-ui/icons/Brush'
import Pencil from 'mdi-material-ui/Pencil'
import Eraser from 'mdi-material-ui/Eraser'
import PencilOff from 'mdi-material-ui/PencilOff'
import Clear from '@material-ui/icons/Clear'
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText
} from '@material-ui/core/'
import Save from '@material-ui/icons/Save'
import Drawer from '@material-ui/core/Drawer'
import {saveCanvas, clearCanvas} from '../utils/draw'

import ButtonsNonChrome from './buttonsNonChrome'
import ButtonsChrome from './buttonsChrome'

import voiceRecognition, {isChrome} from '../utils/speechUtil'

import store, {getCommand, toggleDraw, toggleErase, toggleVoice} from '../store'

import BrushOptions from './brushOptions'

class Toolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      voiceDialogOpen: false
    }
    this.toggleOpen = this.toggleOpen.bind(this)
    this.handleSpeak = this.handleSpeak.bind(this)
    this.handleNonChrome = this.handleNonChrome.bind(this)
    this.handleDialogClose = this.handleDialogClose.bind(this)
  }

  async handleSpeak() {
    let {
      drawModeOn,
      eraseModeOn,
      voiceModeOn,
      currentCommand,
      toggleVoice
    } = this.props

    await toggleVoice()

    if (store.getState().paintTools.voiceModeOn === true) {
      voiceRecognition(store.getState().paintTools)
      setInterval(() => {
        if (store.getState().paintTools.voiceModeOn === true) {
          voiceRecognition(store.getState().paintTools)
        }
      }, 5000)
    }
  }

  handleNonChrome() {
    this.setState({voiceDialogOpen: true})
  }

  handleDialogClose() {
    this.setState({voiceDialogOpen: false})
  }

  toggleOpen() {
    this.setState(prevState => ({open: !prevState.open}))
  }

  render() {
    let {
      openLightbox,
      eraseModeOn,
      drawModeOn,
      voiceModeOn,
      toggleErase,
      toggleDraw
    } = this.props

    return (
      <div id="navbar">
        {isChrome ? (
          <ButtonsChrome openLightbox={openLightbox} />
        ) : (
          <ButtonsNonChrome openLightbox={openLightbox} />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentCommand: state.paintTools.currentCommand,
  eraseModeOn: state.paintTools.eraseModeOn,
  voiceModeOn: state.paintTools.voiceModeOn,
  drawModeOn: state.paintTools.drawModeOn
})
const mapDispatchToProps = dispatch => ({
  getCommand: command => dispatch(getCommand(command)),
  toggleErase: () => dispatch(toggleErase()),
  toggleVoice: () => dispatch(toggleVoice()),
  toggleDraw: () => dispatch(toggleDraw())
})

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
