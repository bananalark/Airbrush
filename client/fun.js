import React from 'react'
import {ParallaxProvider, Parallax} from 'react-scroll-parallax'

//need to import style
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/*eslint-disable */
const P1 = {
  bounds: [134, 281],
  forms: [
    <svg viewBox="0 0 134 281">
      <rect className="fill-1" y="22" width="67" height="204" />
    </svg>,
    <svg viewBox="0 0 134 281">
      <ellipse className="fill-2" cx="67" cy="89" rx="67" ry="67" />
    </svg>,
    <svg viewBox="0 0 134 281">
      <circle className="fill-1" cx="67" cy="89" r="25" />
    </svg>
  ]
}

const A2 = {
  bounds: [167, 281],
  forms: [
    <svg viewBox="0 0 167 281" version="1.1">
      <polygon className="fill-4" points="0,226 83.5,0.1 167,226 " />
    </svg>,
    <svg viewBox="0 0 167 281" version="1.1">
      <path
        className="fill-1"
        d="M112.8,211.8v29.5c0,16.3-13.2,29.5-29.5,29.5s-29.5-13.2-29.5-29.5v-29.5 c0-16.3,13.2-29.5,29.5-29.5S112.8,195.5,112.8,211.8z"
      />
    </svg>
  ]
}

const R3 = {
  bounds: [135, 281],
  forms: [
    <svg viewBox="0 0 135 281" version="1.1">
      <path
        className="fill-2"
        d="M67,22H0v134h67c37,0,67-30,67-67S104,22,67,22z"
      />
    </svg>,
    <svg viewBox="0 0 135 281" version="1.1">
      <polygon className="fill-6" points="55,226 55,92 135,226 " />
    </svg>,
    <svg viewBox="0 0 135 281" version="1.1">
      <rect className="fill-1" y="22" width="55" height="204" />
    </svg>
  ]
}

const A4 = {
  bounds: [167, 281],
  forms: [
    <svg viewBox="0 0 167 281" version="1.1">
      <polygon className="fill-5" points="0,226 83.5,0.1 167,226 " />
    </svg>,
    <svg viewBox="0 0 167 281" version="1.1">
      <path
        className="fill-1"
        d="M112.8,211.8v29.5c0,16.3-13.2,29.5-29.5,29.5s-29.5-13.2-29.5-29.5v-29.5 c0-16.3,13.2-29.5,29.5-29.5S112.8,195.5,112.8,211.8z"
      />
    </svg>
  ]
}

const L5 = {
  bounds: [110, 281],
  forms: [
    <svg viewBox="0 0 110 281" version="1.1">
      <rect className="fill-1" y="22" width="55" height="204" />
    </svg>,
    <svg viewBox="0 0 110 281" version="1.1">
      <path
        className="fill-4"
        d="M0,226c0,30.4,24.6,55,55,55s55-24.6,55-55H0z"
      />
    </svg>
  ]
}

const L6 = {
  bounds: [110, 281],
  forms: [
    <svg viewBox="0 0 110 281" version="1.1">
      <rect className="fill-1" y="22" width="55" height="204" />
    </svg>,
    <svg viewBox="0 0 110 281" version="1.1">
      <path
        className="fill-2"
        d="M0,226c0,30.4,24.6,55,55,55s55-24.6,55-55H0z"
      />
    </svg>
  ]
}

const A7 = {
  bounds: [167, 281],
  forms: [
    <svg viewBox="0 0 167 281" version="1.1">
      <polygon className="fill-3" points="0,226 83.5,0.1 167,226 " />
    </svg>,
    <svg viewBox="0 0 167 281" version="1.1">
      <path
        className="fill-1"
        d="M112.8,211.8v29.5c0,16.3-13.2,29.5-29.5,29.5s-29.5-13.2-29.5-29.5v-29.5 c0-16.3,13.2-29.5,29.5-29.5S112.8,195.5,112.8,211.8z"
      />
    </svg>
  ]
}

const X8 = {
  bounds: [204, 281],
  forms: [
    <svg viewBox="0 0 204 281" version="1.1">
      <polygon
        className="fill-2"
        points="0.2,192 34.1,226 203.5,56 169.6,22 "
      />
    </svg>,
    <svg viewBox="0 0 204 281" version="1.1">
      <polygon
        className="fill-1"
        points="0.2,56 34.1,22 203.5,192 169.6,226 "
      />
    </svg>
  ]
}

export const Gradients = () => (
  <svg width="50" height="50" version="1.1" className="hidden">
    <defs>
      <linearGradient id="gradient-1" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#6ED0DD" />
        <stop offset="100%" stopColor="#70E2B9" />
      </linearGradient>
      <linearGradient id="gradient-2" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#405D86" />
        <stop offset="100%" stopColor="#384257" />
      </linearGradient>
      <linearGradient id="gradient-3" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#ED6088" />
        <stop offset="100%" stopColor="#C86FA3" />
      </linearGradient>
      <linearGradient id="gradient-4" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#F07F6B" />
        <stop offset="100%" stopColor="#EFC15C" />
      </linearGradient>
      <linearGradient id="gradient-5" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#8D63B1" />
        <stop offset="100%" stopColor="#8179CB" />
      </linearGradient>
      <linearGradient id="gradient-6" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#EDD460" />
        <stop offset="100%" stopColor="#EDBC39" />
      </linearGradient>
    </defs>
  </svg>
)

const word = [P1, A2, R3, A4, L5, L6, A7, X8]

class Letter extends React.Component {
  render() {
    const {letter} = this.props
    const offset = getRandomInt(50, 150)
    const isSlower = getRandomInt(0, 1) ? true : false
    return (
      <div
        className="letter"
        style={{
          width: letter.bounds[0] / 10 + 'rem',
          height: letter.bounds[1] / 10 + 'rem'
        }}
      >
        {letter.forms.map((X, i) => (
          <Parallax
            className="form"
            key={i}
            offsetYMin={-offset * (i + 1) + 'px'}
            offsetYMax={offset * (i + 1) + 'px'}
            slowerScrollRate={isSlower}
          >
            {X}
          </Parallax>
        ))}
      </div>
    )
  }
}

export const Scroll = () => (
  <div className="scroll">
    <p>Scroll</p>
    <svg version="1.1" x="0px" y="0px" viewBox="0 0 167 299">
      <polygon className="fill-3" points="167,73 83.5,298.9 0,73 " />
      <polygon className="fill-1" points="137.4,0 83.5,145.9 29.6,0 " />
    </svg>
  </div>
)

export const Github = () => (
  <a
    href="https://github.com/jscottsmith/react-scroll-parallax"
    rel="noopener"
    target="_blank"
    className="button"
  >
    GitHub
  </a>
)

export const Fullscreen = () => (
  <a
    href="https://codepen.io/jscottsmith/full/eREbwz/"
    rel="noopener"
    target="_blank"
    className="fullscreen"
  >
    <svg version="1.1" x="0px" y="0px" viewBox="0 0 30 30">
      <polygon points="16.5,15 23.1,8.3 26,11.2 26,4 18.8,4 21.7,6.9 15,13.5 8.3,6.9 11.2,4 4,4 4,11.2 6.9,8.3 13.5,15  6.9,21.7 4,18.8 4,26 11.2,26 8.3,23.1 15,16.5 21.7,23.1 18.8,26 26,26 26,18.8 23.1,21.7 	" />
    </svg>
  </a>
)

export const ParallaxWord = () => (
  <div className="word">
    {word.map((X, i) => <Letter key={i} letter={X} />)}
  </div>
)

const Fun = () => (
  <ParallaxProvider>
    <main>
      <Scroll />
      <Gradients />
      <ParallaxWord />
      <Github />
      <Fullscreen />
    </main>
  </ParallaxProvider>
)

const run = () => {
  const root = document.createElement('div')
  document.body.appendChild(root)

  const scrollAnimation = {scrollTop: 0}
  const scrollTop = document.body.clientHeight / 2 - window.innerHeight / 2

  // const tween = TweenLite.to(scrollAnimation, 2, {
  //     scrollTop: scrollTop,
  //     ease: Power2.easeInOut,
  //     onUpdate: () => {
  //         window.scrollTo(0, scrollAnimation.scrollTop);
  //     }
  // });

  // window.addEventListener('mousewheel', function mouseHandler() {
  //     tween.kill();
  //     window.removeEventListener('mousewheel', mouseHandler, false);
  // }, false);

  // ReactDOM.render(
  //     <App />,
  //     root
  // );
}

run()

export default Fun
