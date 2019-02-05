import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
//import Fun from './fun'
// ReactDOM.render(
//   <Provider store={store}>
//     <Router history={history}>
//       <Fun />
//     </Router>
//   </Provider>,
//   document.getElementById('app')
// )

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)
