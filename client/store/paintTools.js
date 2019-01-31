import axios from 'axios'
import store from './index'

/**
 * ACTION TYPES
 */
const GET_COMMAND = 'GET_COMMAND'
const TOGGLE_ERASE = 'TOGGLE_ERASE'
const TOGGLE_VOICE = 'TOGGLE_VOICE'
const TOGGLE_DRAW = 'TOGGLE_DRAW'

/**
 * INITIAL STATE
 */
const initialState = {
  currentCommand: '',
  eraseModeOn: false,
  voiceModeOn: false,
  drawModeOn: false
}

/**
 * ACTION CREATORS
 */
export const getCommand = command => ({type: GET_COMMAND, command})
export const toggleErase = () => ({type: TOGGLE_ERASE})
export const toggleVoice = () => ({type: TOGGLE_VOICE})
export const toggleDraw = () => ({type: TOGGLE_DRAW})

/**
 * REDUCER
 */
export default function speechReducer(state = initialState, action) {
  let newState = {...state}
  switch (action.type) {
    case GET_COMMAND:
      newState.currentCommand = action.command
      return newState
    case TOGGLE_VOICE:
      newState.voiceModeOn = !state.voiceModeOn

      return newState
    case TOGGLE_ERASE:
      newState.eraseModeOn = !state.eraseModeOn
      return newState
    case TOGGLE_DRAW:
      newState.drawModeOn = !state.drawModeOn
      return newState
    default:
      return state
  }
}
