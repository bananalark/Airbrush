import React from 'react'
import About from './about'
import {Link as RouterLink} from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'
import ModalFooter from 'react-bootstrap/ModalFooter'

class LandingPage extends React.Component {
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
          <RouterLink to="/camera">
            <Button className="landing-page-button" id="learn-more-button">
              learn more
            </Button>
          </RouterLink>
        </Row>
        <ModalFooter>
          <RouterLink to="/privacy">
            <h5>privacy policy</h5>
          </RouterLink>
        </ModalFooter>
      </Container>
    )
  }
}

export default LandingPage
