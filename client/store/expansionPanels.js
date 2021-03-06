import store from './index'

/**
 * ACTION TYPES
 */
const TOGGLE_BODYPART = 'TOGGLE_BODYPART'
const TOGGLE_BRUSH = 'TOGGLE_BRUSH'
const TOGGLE_COLORPICKER = 'TOGGLE_COLORPICKER'

/**
 * INITIAL STATE
 */
const initialState = {
  bodyPart: false,
  brush: false,
  colorPicker: false
}

/**
 * ACTION CREATORS
 */
export const toggleBodyPart = () => ({type: TOGGLE_BODYPART})
export const toggleBrush = () => ({type: TOGGLE_BRUSH})

export const toggleColorPicker = () => ({type: TOGGLE_COLORPICKER})

/**
 * REDUCER
 */
const expansionPanels = (state = initialState, action) => {
  let newState = {...state}
  switch (action.type) {
    case TOGGLE_BODYPART:
      if (state.brush) {
        newState.brush = false
      }
      newState.bodyPart = !state.bodyPart
      return newState
    case TOGGLE_BRUSH:
      if (state.bodyPart) {
        newState.bodyPart = false
      }
      newState.brush = !state.brush
      return newState
    case TOGGLE_COLORPICKER:
      newState.colorPicker = !state.colorPicker
      return newState
    default:
      return state
  }
}

export default expansionPanels
