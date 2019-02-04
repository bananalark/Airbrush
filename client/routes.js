import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Login,
  Signup,
  UserHome,
  CameraComponent,
  About,
  LandingPage,
  Privacy
} from './components'
import {me} from './store'
import posed, {PoseGroup} from 'react-pose'

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const RouteContainer = posed.div({
      enter: {opacity: 1, delay: 300, beforeChildren: true},
      exit: {opacity: 0}
    })

    const {isLoggedIn} = this.props

    return (
      <PoseGroup>
        <RouteContainer key={location.pathname}>
          <Switch location={location}>
            <Route exact path="/" component={LandingPage} key="landingPage" />
            <Route path="/login" component={Login} key="login" />
            <Route path="/camera" component={CameraComponent} key="camera" />
            <Route exact path="/about" component={About} key="about" />
            <Route path="/privacy" component={Privacy} key="privacy" />
          </Switch>
        </RouteContainer>
      </PoseGroup>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
