const colorReducer = (state = {color: {r: 255, g: 255, b: 255}}, action) => {
  switch (action.type) {
    case 'GET_COLOR':
      return {
        ...state,
        displayColorPicker: false,
        color: action.color
      }
    default:
      return state
  }
}

export default colorReducer
