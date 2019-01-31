import axios from 'axios'
import store from './'

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

//Util
/*eslint-disable*/
export const evaluateCommand = (command, state) => {
  try {
    console.log('evaluating your command!')
    if (state.voiceModeOn === true) {
      if (command === 'start' && state.drawModeOn === false) {
        speechReducer.dispatch(toggleDraw())
      } else if (command === 'stop' && state.drawModeOn === true) {
        speechReducer.dispatch(toggleDraw())
      } else if (command === 'erase' && state.eraseModeOn === false) {
        speechReducer.dispatch(toggleErase())
      } else {
        console.log('No command fired...?')
      }
    }
  } catch (err) {
    console.error(err)
  }
}
/*eslint-enable*/

/**
 * REDUCER
 */
export default function speechReducer(state = initialState, action) {
  let newState = {...state}
  switch (action.type) {
    case GET_COMMAND:
      newState.currentCommand = action.command
      evaluateCommand(newState.currentCommand, newState)
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

// analyzeCurrentCommand() {
//   let {currentCommand} = this.props
//   if (currentCommand === 'start') {
//     this.setState({drawModeOn: true})
//   } else if (currentCommand === 'stop') {
//     this.setState({drawModeOn: false})
//   } else if (currentCommand === 'erase') {
//     this.setState({eraseModeOn: true})
//     this.setState({drawModeOn: true})
//   } else if (currentCommand === 'erase off') {
//     this.setState({eraseModeOn: false})
//   }
// }
