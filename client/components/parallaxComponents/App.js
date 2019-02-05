import React, {Component} from 'react'
import {ParallaxProvider} from 'react-scroll-parallax'
import Intro from './Intro/Intro'

export default class App extends Component {
  render() {
    return (
      <ParallaxProvider>
        <Intro />
      </ParallaxProvider>
    )
  }
}
