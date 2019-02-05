import React from 'react'
import {ParallaxProvider, Parallax} from 'react-scroll-parallax'
import TweenLite from 'gsap/TweenLite'

//need to import style
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/*eslint-disable */

const A1 = {
  bounds: [167, 281],
  forms: [
    <svg viewBox="0 0 167 281" version="1.1">
      <polygon className="fill-4" points="0,226 83.5,0.1 167,226 " />
    </svg>,
    <svg viewBox="0 0 167 281" version="1.1">
      <polygon className="fill-1" points="48.5,160  83.5,60  118.5,160" />
    </svg>

    // <svg viewBox="0 0 167 281" version="1.1">
    //   <path
    //     className="fill-1"
    //     d="M112.8,211.8v29.5c0,16.3-13.2,29.5-29.5,29.5s-29.5-13.2-29.5-29.5v-29.5 c0-16.3,13.2-29.5,29.5-29.5S112.8,195.5,112.8,211.8z"
    //   />
    // </svg>
  ]
}

const I2 = {
  bounds: [110, 281],
  forms: [
    <svg viewBox="0 0 110 281" version="1.1">
      <rect className="fill-1" y="22" width="55" height="204" />
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

const B4 = {
  bounds: [167, 281],
  forms: [
    // <svg viewBox="0 0 167 281" version="1.1">
    //   <polygon className="fill-5" points="0,226 83.5,0.1 167,226 " />
    // </svg>,
    // <svg viewBox="0 0 167 281" version="1.1">
    //   <path
    //     className="fill-1"
    //     d="M112.8,211.8v29.5c0,16.3-13.2,29.5-29.5,29.5s-29.5-13.2-29.5-29.5v-29.5 c0-16.3,13.2-29.5,29.5-29.5S112.8,195.5,112.8,211.8z"
    //   />
    // </svg>
    <svg viewBox="0 0 135 281" version="1.1">
      {/* <path
        className="fill-2"
        d="M67,22H0v134h67c37,0,67-30,67-67S104,22,67,22z"
      /> */}
      <path
        className="fill-2"
        d="M1,1.28515625 C55.6469208,3.59099636 90.2137872,8.2692749 104.700599,15.3199919 C131.842837,28.5300918 133,67.9501253 133,76.458649 C133,84.2041136 127.192811,117.297978 104.700599,128.939541 C90.0357476,136.529804 55.4688812,141.978343 1,145.285156 L1,1.28515625 Z"
      />
    </svg>,
    //   <svg viewBox="0 0 135 281" version="1.1">
    //   <path
    //     className="fill-2"
    //     d="M67,22H0v134h67c37,0,67-30,67-67S104,12,37,22z"
    //   />
    // </svg>,
    // <svg viewBox="0 0 135 281" version="1.1">
    //   <polygon className="fill-6" points="55,226 55,92 135,226 " />
    // </svg>,
    <svg viewBox="0 0 135 281" version="1.1">
      <rect className="fill-1" y="22" width="55" height="204" />
    </svg>
  ]
}

const R5 = {
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

const word = [A1, I2, R3, B4, R5]

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

export const Github = () => (
  <a
    href="https://github.com/bananalark/Airbrush"
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

  const tween = TweenLite.to(scrollAnimation, 2, {
    scrollTop: scrollTop,
    ease: Power2.easeInOut,
    onUpdate: () => {
      window.scrollTo(0, scrollAnimation.scrollTop)
    }
  })

  window.addEventListener(
    'mousewheel',
    function mouseHandler() {
      tween.kill()
      window.removeEventListener('mousewheel', mouseHandler, false)
    },
    false
  )
}

run()

export default Fun
