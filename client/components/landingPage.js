import React from 'react'
import {
  Link as ScrollLink,
  Events,
  animateScroll as scroll,
  scroller
} from 'react-scroll'
import About from './about'
import Fun from './fun'
import InstructionAccessibility from './instructionAccessibility'
import InstructionMotion from './instructionMotion'
import InstructionVoice from './instructionVoice'
import Footer from './footer'
import {Grid, Typography, Button, Fab, withStyles} from '@material-ui/core'
import {Link as RouterLink} from 'react-router-dom'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
    background: 'linear-gradient(45deg, #EFCF3E 30%, #EFCF3E 90%)'
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
    color: 'linear-gradient(45deg, #EFCF3E 30%, #EFCF3E 90%)'
  },
  button: {
    margin: theme.spacing.unit,
    right: 0,
    bottom: 0
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroUnit: {
    backgroundColor: 'EFCF3E'
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 14}px 0 ${theme.spacing.unit * 8}px`
  },

  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6
  }
})

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
    const {classes} = this.props
    return (
      <div>
        {/* <Fun /> */}
        <div id="logo-space">
          <img src="https://i.imgur.com/sY5Qeh2.png" />
        </div>
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            <Grid
              container
              spacing={24}
              direction="column"
              justify="center"
              alignItems="center"
              justify="space-between"
            >
              <Grid item xs={12} sm={6}>
                <RouterLink to="/camera">
                  <Fab
                    variant="extended"
                    size="medium"
                    color="primary"
                    aria-label="Add"
                    className={classes.margin}
                  >
                    Start Drawing
                  </Fab>
                </RouterLink>
              </Grid>
              <Grid>
                <ScrollLink
                  activeClass="active"
                  className="test6"
                  to="anchor"
                  spy={true}
                  smooth={true}
                  duration={500}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.button}
                  >
                    Learn More
                  </Button>
                </ScrollLink>
              </Grid>
            </Grid>
          </div>
        </div>

        <div id="anchor" className="element">
          <About />
        </div>

        <div id="anchor2" className="element">
          <InstructionAccessibility />
        </div>

        <div id="anchor3" className="element">
          <InstructionMotion />
        </div>

        <div id="anchor4" className="element">
          <InstructionVoice />
        </div>

        {/* <div className="button">
          <Github/>
        </div> */}

        <div className="element">
          <Footer />
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(LandingPage)
