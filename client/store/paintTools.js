/**
 * ACTION TYPES
 */
const GET_COMMAND = 'GET_COMMAND'
const TOGGLE_ERASE = 'TOGGLE_ERASE'
const TOGGLE_VOICE = 'TOGGLE_VOICE'
const TOGGLE_DRAW = 'TOGGLE_DRAW'
const CHOOSE_BRUSH = 'CHOOSE_BRUSH'
const CHOOSE_BODY_PART = 'CHOOSE_BODY_PART'
const DRAW_ON = 'DRAW_ON'
const DRAW_OFF = 'DRAW_OFF'
const CHOOSE_SIZE = 'CHOOSE_SIZE'

/**
 * INITIAL STATE
 */
const initialState = localStorage.getItem('paintTools')
  ? JSON.parse(localStorage.getItem('paintTools'))
  : {
      currentCommand: '',
      eraseModeOn: false,
      voiceModeOn: false,
      drawModeOn: false,
      chosenBrush: 'defaultLine',
      chosenBodyPart: 'leftHand',
      size: 'small'
    }

/**
 * ACTION CREATORS
 */
export const getCommand = command => ({type: GET_COMMAND, command})
export const toggleErase = () => ({type: TOGGLE_ERASE})
export const toggleVoice = () => ({type: TOGGLE_VOICE})
export const toggleDraw = () => ({type: TOGGLE_DRAW})
export const drawOn = () => ({type: DRAW_ON})
export const drawOff = () => ({type: DRAW_OFF})
export const chooseBrush = brush => ({type: CHOOSE_BRUSH, brush})
export const chooseBodyPart = part => ({type: CHOOSE_BODY_PART, part})
export const chooseSize = size => ({type: CHOOSE_SIZE, size})

/**
 * REDUCER
 */
const paintTools = (state = initialState, action) => {
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
    case DRAW_ON:
      return {...state, drawModeOn: true}
    case DRAW_OFF:
      return {...state, drawModeOn: false}
    case TOGGLE_DRAW:
      newState.drawModeOn = !state.drawModeOn
      return newState
    case CHOOSE_BRUSH:
      newState.chosenBrush = action.brush
      return newState
    case CHOOSE_BODY_PART:
      newState.chosenBodyPart = action.part
      return newState
    case CHOOSE_SIZE:
      newState.size = action.size
      return newState
    default:
      return state
  }
}

export default paintTools
