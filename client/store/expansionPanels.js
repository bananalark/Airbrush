import store from './index'

/**
 * ACTION TYPES
 */
const TOGGLE_BODYPART = 'TOGGLE_BODYPART'
const TOGGLE_BRUSH = 'TOGGLE_BRUSH'

/**
 * INITIAL STATE
 */
const initialState = {
  bodyPart: false,
  brush: false
}

/**
 * ACTION CREATORS
 */
export const toggleBodypart = () => ({type: TOGGLE_BODYPART})
export const toggleBrush = () => ({type: TOGGLE_BRUSH})

/**
 * REDUCER
 */
const expansionPanels = (state = initialState, action) => {
  let newState = {...state}
  switch (action.type) {
    case TOGGLE_BODYPART:
      newState.bodyPart = !state.bodyPart
      return newState
    case TOGGLE_BRUSH:
      newState.brush = !state.brush
      return newState
    default:
      return state
  }
}

export default expansionPanels
