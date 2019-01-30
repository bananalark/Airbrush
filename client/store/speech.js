import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_COMMAND = 'GET_COMMAND'

/**
 * INITIAL STATE
 */
const initialState = {
  currentCommand: ''
}

/**
 * ACTION CREATORS
 */
export const getCommand = command => ({type: GET_COMMAND, command})

/**
 * THUNK CREATORS
 */
// export const fetchCommand = () => async dispatch => {
//   try {
//     const res = await axios.get('/api/speech')
//     dispatch(getCommand(res.data))
//   } catch (err) {
//     console.error(err)
//   }
// }

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  let newState = {...initialState}
  switch (action.type) {
    case GET_COMMAND:
      newState.currentCommand = action.command
      return newState
    default:
      return state
  }
}
