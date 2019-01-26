import React, {Component} from 'react'

const VoiceComponent = () => {
  return (
    <div>
      <h1>Phrase matcher</h1>
      <p>Press the button then say the phrase to test the recognition.</p>

      <button type="button">Start new test</button>

      <div id="phrase">
        <p>Phrase...</p>
        <p id="result">Right or wrong?</p>
        <p id="output">...diagnostic messages</p>
      </div>
    </div>
  )
}

// class VoiceComponent extends Component {
//   render() {
//     return (
//       <div>
//         <h1>Phrase matcher</h1>
//         <p>Press the button then say the phrase to test the recognition.</p>

//         <button type="button">Start new test</button>

//         <div id="phrase">
//           <p>Phrase...</p>
//           <p id="result">Right or wrong?</p>
//           <p id="output">...diagnostic messages</p>
//         </div>
//       </div>
//     )
//   }
// }

export default VoiceComponent
// require('../../web-speech-api/phrase-matcher/script.js')
require('./voice')
