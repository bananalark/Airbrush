import React, {Component} from 'react'
import {Intro} from './Intro'
//import style from './parallax.scss';

export default class Parallax extends Component {
  render() {
    return (
      <div>
        <Intro />
        {/* * Shared SVG patterns
              <div className="visually-hidden">
                  <Svg svg={noisePattern} />
                  <Svg svg={dotPattern} />
              </div> */}
      </div>
    )
  }
}
