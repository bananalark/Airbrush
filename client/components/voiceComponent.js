import React, {Component} from 'react'

class VoiceComponent extends Component {
  render() {
    return (
      <div>
        <h1>Say Start/Stop to Paint!</h1>

        <button>Say something!</button>
        {/* <input type="button" id="start-button" value="Start New Test" /> */}

        <div>
          <p className="output">You said...</p>
        </div>
      </div>
    )
  }
}

export default VoiceComponent
// require('../../web-speech-api/phrase-matcher/script.js')
setTimeout(() => require('./voice'), 2000)
