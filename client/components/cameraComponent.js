import React from 'react'
import ColorPicker from './ColorPicker'

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
            style={{position: 'absolute', left: 50, top: 50, zIndex: 0}}
          />
          <canvas
            id="output"
            style={{position: 'absolute', left: 50, top: 50, zIndex: 1}}
          />
          <div id="buttons">
            <h5>Erase Tools!</h5>
            <p>
              Erase Mode:{' '}
              <input
                type="button"
                id="erase-button"
                value={eraserModeOn}
                onClick={this.toggleEraseMode}
              />{' '}
              ...or...
              <input type="button" id="clear-button" value="Clear Canvas" />
            </p>
          </div>

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
        <ColorPicker />
      </div>
    </div>
  )
}

export default CameraComponent

require('./camera')
