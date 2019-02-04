import React from 'react'
import {
  Link,
  Element,
  Events,
  animateScroll as scroll,
  scroller
} from 'react-scroll'
import Routes from './routes'
import LandingPage from './components/landingPage'

// const App = () => {
//   return (
//     <div>
//       <Routes />
//     </div>
//   )
// }

class App extends React.Component {
  // constructor(props){
  //   super(props)
  //   this.scrollToTop = this.scrollToTop.bind(this);
  // }

  componentDidMount() {
    Events.scrollEvent.register('begin', function() {
      console.log('begin', arguments)
    })

    Events.scrollEvent.register('end', function() {
      console.log('end', arguments)
    })
  }

  // scrollToTop() {
  //   scroll.scrollToTop();
  // }

  // scrollTo() {
  //   scroller.scrollTo('scroll-to-element', {
  //     duration: 800,
  //     delay: 0,
  //     smooth: 'easeInOutQuart'
  //   })
  // }

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
        <LandingPage />
        <Link
          activeClass="active"
          to="firstInsideContainer"
          spy={true}
          smooth={true}
          duration={250}
          containerId="containerElement"
          style={{display: 'inline-block', margin: '20px'}}
        >
          Start Drawing
        </Link>

        <Link
          activeClass="active"
          to="secondInsideContainer"
          spy={true}
          smooth={true}
          duration={250}
          containerId="containerElement"
          style={{display: 'inline-block', margin: '20px'}}
        >
          Go to second element inside container
        </Link>

        <Element
          name="test7"
          className="element"
          id="containerElement"
          style={{
            position: 'relative',
            height: '1200px',
            overflow: 'scroll',
            marginBottom: '100px'
          }}
        >
          <Element
            name="firstInsideContainer"
            style={{
              marginBottom: '1200px'
            }}
          >
            first element inside container
          </Element>

          <Element
            name="secondInsideContainer"
            style={{
              marginBottom: '1200px'
            }}
          >
            second element inside container
          </Element>
        </Element>
      </div>
    )
  }
}

export default App
