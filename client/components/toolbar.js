import React, {Component} from 'react'
import {connect} from 'react-redux'

import VoiceOverOff from '@material-ui/icons/VoiceOverOff'
import RecordVoiceOver from '@material-ui/icons/RecordVoiceOver'
import Brush from '@material-ui/icons/Brush'
import Pencil from 'mdi-material-ui/Pencil'
import Eraser from 'mdi-material-ui/Eraser'
import Hand from 'mdi-material-ui/Hand'
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

import ButtonsNonChrome from './buttonsNonChrome'
import ButtonsChrome from './buttonsChrome'

import voiceRecognition, {isChrome} from '../utils/speechUtil'

import store, {getCommand, toggleDraw, toggleErase, toggleVoice} from '../store'

import BrushOptions from './brushOptions'
import ColorPicker from './colorPicker'
import BodyPartOptions from './bodyPartOptions'

class Toolbar extends Component {
  render() {
    return <div>{isChrome ? <ButtonsChrome /> : <ButtonsNonChrome />}</div>
  }
}

export default Toolbar
