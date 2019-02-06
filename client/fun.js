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
    <svg viewBox="0 -10 135 281" version="1.1">
      <path
        className="fill-2"
        d="M-0.5,1.5 L0,171.97727"
        d="M3.53036051e-16,2.89601638 C56.9088542,-4.06321276 85.3632813,8.13517356 85.3632813,39.4911753 C85.3632813,44.1897202 77.9923346,69.129929 59.203125,74.8004394 C44.9159649,79.1122488 31.8949253,81.5237142 19.3515625,81.174133 C45.5410187,81.174133 67.6757932,92.3012982 77.4257813,98.2929755 C102.336923,113.601663 87.9215783,143.341601 77.4257813,153.81545 C65.2773438,165.938483 39.46875,172 0,172"
      />
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

const U6 = {
  bounds: [167, 281],
  forms: [
    <svg viewBox="0 0 135 281" version="1.1">
      <path
        className="fill-2"
        d="M1,1 C6.69314108,76.2319016 14.6684015,123.701954 24.9257812,143.410156 C41.1136526,174.513016 71.0588295,174.460938 82.265625,174.460938 C93.1399518,174.460938 125.271695,172.694952 140.835937,143.410156 C151.31692,123.689734 157.884628,76.2196821 160.539062,1 L1,1 Z"
        d="M1,1 L32,1"
        d="M129,1 L160.539062,1"
        d="M32,1 C35.4614387,58.2498404 40.3104095,94.3735173 46.5469125,109.371031 C56.3891637,133.039631 74.5958781,133 81.4096273,133 C88.0212351,133 107.557385,131.656123 117.020469,109.371031 C123.392923,94.3642186 127.3861,58.2405417 129,1 L32,1 Z"
      />
    </svg>,
    <svg viewBox="0 0 135 281" version="1.1">
      <path
        className="fill-6"
        d="M1,1 C6.69314108,76.2319016 14.6684015,123.701954 24.9257812,143.410156 C41.1136526,174.513016 71.0588295,174.460938 82.265625,174.460938 C93.1399518,174.460938 125.271695,172.694952 140.835937,143.410156 C151.31692,123.689734 157.884628,76.2196821 160.539062,1 L1,1 Z"
        d="M2,1 L32,1"
        d="M129,1 L160.539062,1"
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

const word = [A1, I2, R3, B4, R5, U6]

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
