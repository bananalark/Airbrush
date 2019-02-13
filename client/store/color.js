let initialState = localStorage.getItem('color')
  ? JSON.parse(localStorage.getItem('color'))
  : {color: {r: 255, g: 255, b: 255}}

const colorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_COLOR':
      return {
        ...state,
        color: action.color
      }
    default:
      return state
  }
}

export default colorReducer
