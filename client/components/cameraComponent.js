import React from 'react'
const CameraComponent = () => {
  return (
    <div>
      <div id="info" />
      <div id="main">
        <video
          id="video"
          plays-inline="true"
          //     style=" -moz-transform: scaleX(-1);
          // -o-transform: scaleX(-1);
          // -webkit-transform: scaleX(-1);
          // transform: scaleX(-1);
          // display: none;
          // "
        />

        <canvas id="output" />
      </div>
    </div>
  )
}

export default CameraComponent
require('./camera')
