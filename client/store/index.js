import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import lightbox from './lightbox'
import color from './color'
import paintTools from './paintTools'
import expansionPanels from './expansionPanels'
const reducer = combineReducers({
  user,
  color,
  paintTools,
  expansionPanels,
  lightbox
})

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './lightbox'
export * from './color'
export * from './paintTools'
export * from './expansionPanels'
