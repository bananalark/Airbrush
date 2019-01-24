import React from 'react'
const CameraComponent = () => {
  return (
    <div>
      <div id="info" />
      <div id="main">
        <video
          id="video"
          plays-inline="true"
          style={{display: 'none'}}
          // style={{
          //   '-moz-transform': scaleX(-1),
          //   '-o-transform': scaleX(-1),
          //   '-webkit-transform': scaleX(-1),
          //   transform: scaleX(-1),
          //   display: none
          // }}
        />

        <div style={{position: 'relative'}}>
          <canvas
            id="background"
            style={{position: 'absolute', left: 0, top: 0, zIndex: 0}}
          />
          <canvas
            id="output"
            style={{position: 'absolute', left: 0, top: 0, zIndex: 1}}
          />
        </div>
      </div>
    </div>
  )
}

export default CameraComponent
require('./camera')
