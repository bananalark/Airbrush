import React from 'react'
import {
  Link as ScrollLink,
  Events,
  animateScroll as scroll,
  scroller
} from 'react-scroll'
import About from './about'
import {Grid, Typography, Button, Fab, withStyles} from '@material-ui/core'
import {Link as RouterLink} from 'react-router-dom'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
    color: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
  },
  button: {
    margin: theme.spacing.unit
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 28}px 0 ${theme.spacing.unit * 16}px`
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
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            <Grid
              container
              spacing={24}
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} sm={6}>
                <Typography variant="h1">Airbrush</Typography>
              </Grid>
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
              <Grid item xs={12} sm={6}>
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

        <a onClick={this.scrollToTop}>To the top!</a>
      </div>
    )
  }
}

export default withStyles(styles)(LandingPage)
