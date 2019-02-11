import React, {Component} from 'react'
import {withRouter, Route, Switch} from 'react-router-dom'
import {CameraComponent, LandingPage, Privacy} from './components'
import posed, {PoseGroup} from 'react-pose'

class Routes extends Component {
  render() {
    const RouteContainer = posed.div({
      enter: {opacity: 1, delay: 300, beforeChildren: true},
      exit: {opacity: 0}
    })

    return (
      <PoseGroup>
        <RouteContainer key={location.pathname}>
          <Switch location={location}>
            <Route exact path="/" component={LandingPage} key="landingPage" />
            <Route path="/camera" component={CameraComponent} key="camera" />
            <Route path="/privacy" component={Privacy} key="privacy" />
          </Switch>
        </RouteContainer>
      </PoseGroup>
    )
  }
}

export default withRouter(Routes)
