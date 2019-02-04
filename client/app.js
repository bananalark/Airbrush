import React from 'react'
import {Link, Events, animateScroll as scroll, scroller} from 'react-scroll'
import About from './components/about'
import {Grid, Typography, Button} from '@material-ui/core'
import Routes from './routes'
//import {Link} from 'react-router-dom'

class App extends React.Component {
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
      <div>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item>
            <Typography variant="h1">Airbrush</Typography>
          </Grid>
          <Grid item>
            <Link to="/camera">
              <Button>
                <Typography variant="h5">Start Drawing</Typography>
              </Button>
            </Link>
          </Grid>
        </Grid>

        <Link
          activeClass="active"
          className="test6"
          to="anchor"
          spy={true}
          smooth={true}
          duration={500}
        >
          <Button>
            <Typography variant="h5">Learn More</Typography>
          </Button>
        </Link>

        <div id="anchor" className="element">
          <About />
        </div>

        <a onClick={this.scrollToTop}>To the top!</a>
        <Routes />
      </div>
    )
  }
}

export default App

// import React from 'react'
// import Routes from './routes'

// const App = () => {
//   return (
//     <div>
//       <Routes />
//     </div>
//   )
// }

// export default App
