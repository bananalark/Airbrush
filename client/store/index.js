import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import lightbox from './lightbox'
import color from './color'
import paintTools from './paintTools'
import expansionPanels from './expansionPanels'
const reducer = combineReducers({
  color,
  paintTools,
  expansionPanels,
  lightbox
})

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

store.subscribe(() => {
  localStorage.setItem('color', JSON.stringify(store.getState().color))
  localStorage.setItem(
    'paintTools',
    JSON.stringify(store.getState().paintTools)
  )
})

export default store
export * from './lightbox'
export * from './color'
export * from './paintTools'
export * from './expansionPanels'
