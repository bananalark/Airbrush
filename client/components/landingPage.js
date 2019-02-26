import React from 'react'
import About from './about'
import {Link as RouterLink} from 'react-router-dom'
import {
  Link as ScrollLink,
  Events,
  animateScroll as scroll,
  scroller
} from 'react-scroll'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'
import ModalFooter from 'react-bootstrap/ModalFooter'

class LandingPage extends React.Component {
  constructor(props) {
    super(props)
    this.scrollToTop = this.scrollToTop.bind(this)
  }

  componentDidMount() {
    Events.scrollEvent.register('begin', function() {
      console.log('begin', arguments)
    })
    Events.scrollEvent.register('end', function() {
      console.log('end', arguments)
    })
  }

  scrollToTop() {
    scroll.scrollToTop()
  }

  scrollTo() {
    scroller.scrollTo('scroll-to-element', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    })
  }

  scrollToWithContainer() {
    let goToContainer = new Promise((resolve, reject) => {
      Events.scrollEvent.register('end', () => {
        resolve()
        Events.scrollEvent.remove('end')
      })

      scroller.scrollTo('scroll-container', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      })
    })

    goToContainer.then(() =>
      scroller.scrollTo('scroll-container-second-element', {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        containerId: 'scroll-container'
      })
    )
  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin')
    Events.scrollEvent.remove('end')
  }

  render() {
    return (
      <Container>
        <Jumbotron className="text-center">
          <Image src="airbrush-logo-new.png" id="logo" />
        </Jumbotron>
        <Row className="show-grid text-center">
          <Col sm={4}>
            <Image src="tutorial-hand-mode.jpg" className="landing-card" />
            <h4>hand mode</h4>
            <p>
              Find a neutral, well-lit background, and place your upper body in
              the camera frame. Raise a fist and open it to start drawing!
            </p>
          </Col>
          <Col sm={4}>
            <Image src="tutorial-select.jpg" className="landing-card" />
            <h4>select tools</h4>
            <p>
              hover over (or click) menu items to change brush or color. You can
              also select voice mode to 'start', 'stop' or 'undo' a line with a
              verbal command.
            </p>
          </Col>
          <Col sm={4}>
            <Image src="tutorial-nose-mode.jpg" className="landing-card" />
            <h4>stuck at your desk?TEST</h4>
            <p>
              ...or if your background is visually noisy, using your nose to
              draw works best. Make sure there's only one person in the frame at
              a time!
            </p>
          </Col>
        </Row>
        <Row className="show-grid text-center" id="button-row">
          <RouterLink to="/camera">
            <Button className="landing-page-button" id="start-draw-button">
              start drawing
            </Button>
          </RouterLink>
        </Row>
        <Row className="show-grid text-center" id="button-row">
          <ScrollLink
            activeClass="active"
            className="test6"
            to="anchor"
            spy={true}
            smooth={true}
            duration={500}
          >
            <Button className="landing-page-button" id="learn-more-button">
              Learn More
            </Button>
          </ScrollLink>
        </Row>

        <div id="anchor" className="element">
          <h1>ONE</h1>
        </div>

        <div id="anchor2" className="element">
          <h1>TWO</h1>
        </div>

        <div id="anchor3" className="element">
          <h1>THREE</h1>
        </div>

        <div id="anchor4" className="element">
          <h1>FOUR</h1>
        </div>
      </Container>
    )
  }
}

export default LandingPage
