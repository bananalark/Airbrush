const TAKE_SNAPSHOT = 'TAKE_SNAPSHOT'

export const takeSnapshot = (imageStr) => {
  return {
    type: TAKE_SNAPSHOT,
    imageStr
  }
}

export default function(state = {showLightbox: false, imageStr: ''}, action) {
  switch (action.type) {
    case TAKE_SNAPSHOT:
      return {showLightbox: true, imageStr: action.imageStr}
    default:
      return state
  }
}
