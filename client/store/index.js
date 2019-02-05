import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import color from './color'
import paintTools from './paintTools'
import expansionPanels from './expansionPanels'
const reducer = combineReducers({user, color, paintTools, expansionPanels})

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './color'
export * from './paintTools'
export * from './expansionPanels'
