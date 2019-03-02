import React from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {Link as ScrollLink, animateScroll as scroll} from 'react-scroll'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'
import Paper from '@material-ui/core/Paper'

class LandingPage extends React.Component {
  constructor(props) {
    super(props)
    this.scrollToTop = scroll.scrollToTop.bind(this)
  }

  render() {
    return (
      <Container>
        <Jumbotron className="text-center" id="header">
          <Image src="airbrush-logo-new.png" id="logo" />
        </Jumbotron>

        {/* buttons */}
        <Container id="buttons">
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
        </Container>

        {/* tutorial cards */}
        <div id="anchor" className="element" />
        <Row className="show-grid text-center">
          <Col className="subheader">GETTING STARTED</Col>
        </Row>
        <Row className="show-grid text-center" id="tutorial">
          <Col sm={4} className="landing-card-col">
            <Paper style={{minHeight: '23em', padding: '1em'}}>
              <Image src="tutorial-hand-mode.jpg" className="landing-card" />
              <h4>hand mode</h4>
              <div className="landing-card-description">
                <p>
                  Enable the front-facing camera, find a blank, well-lit
                  backdrop, and put your upper body in the camera frame. Raise a
                  fist and open it to start drawing!
                </p>
              </div>
            </Paper>
          </Col>
          <Col sm={4} className="landing-card-col">
            <Paper style={{minHeight: '23em', padding: '1em'}}>
              <Image src="tutorial-select.jpg" className="landing-card" />
              <h4>select tools</h4>
              <div className="landing-card-description">
                <p>
                  hover over (or click) menu items to change brush or color. You
                  can also select voice mode to 'start', 'stop' or 'undo' a line
                  with a verbal command.
                </p>
              </div>
            </Paper>
          </Col>
          <Col sm={4} className="landing-card-col">
            <Paper style={{minHeight: '23em', padding: '1em'}}>
              <Image src="tutorial-nose-mode.jpg" className="landing-card" />
              <h4>at your desk</h4>
              <div className="landing-card-description">
                <p>
                  ...or if your background is visually noisy, using your nose to
                  draw works best. Make sure there's only one person in the
                  frame at a time!
                </p>
              </div>
            </Paper>
          </Col>
        </Row>

        {/* learn more section */}
        <Row className="show-grid text-center scroll-link">
          <ScrollLink
            activeClass="active"
            className="test6"
            to="anchor2"
            spy={true}
            smooth={true}
            duration={500}
          />
        </Row>
        <Row className="show-grid text-center" id="button-row">
          <Button
            className="landing-page-button"
            id="back-to-top"
            onClick={this.scrollToTop}
          >
            back to top
          </Button>
        </Row>
      </Container>
    )
  }
}

export default LandingPage
