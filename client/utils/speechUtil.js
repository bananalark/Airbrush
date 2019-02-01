import store, {toggleDraw, toggleErase} from '../store'
import {getCommand} from '../store/paintTools'

export var isChrome =
  !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)

var SpeechRecognition
var SpeechGrammarList
var SpeechRecognitionEvent

if (isChrome) {
  SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
  SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
  SpeechRecognitionEvent =
    SpeechRecognitionEvent || webkitSpeechRecognitionEvent
}

/*eslint-disable*/
export const evaluateCommand = (command, state) => {
  try {
    if (state.voiceModeOn === true) {
      if (command === 'start') {
        //If drawMode is off, turn it on.
        if (state.drawModeOn === false) {
          store.dispatch(toggleDraw())
        }

        //If eraseMode is on, turn it off.
        if (state.eraseModeOn === true) {
          store.dispatch(toggleErase())
        }
      } else if (command === 'stop') {
        if (state.drawModeOn === true) {
          store.dispatch(toggleDraw())
        }
        if (state.eraseModeOn === true) {
          store.dispatch(toggleErase())
        }
      } else if (command === 'erase') {
        if (state.eraseModeOn === false) {
          store.dispatch(toggleErase())
        }
        if (state.drawModeOn === false && command === 'erase') {
          store.dispatch(toggleDraw())
        }
      } else {
        console.log(`I'm confused.`)
      }
    }
  } catch (err) {
    console.error(err)
  }
}
/*eslint-enable*/

export default function voiceRecognition(state) {
  if (store.getState().paintTools.voiceModeOn === true) {
    var recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.start()
    recognition.onresult = function(event) {
      let speechResult = event.results[0][0].transcript.toLowerCase()
      console.log(
        'You said:',
        speechResult,
        '||||',
        'Confidence:',
        event.results[0][0].confidence
      )
      store.dispatch(getCommand(speechResult))
      evaluateCommand(speechResult, state)
    }

    recognition.onspeechend = function() {
      console.log(`You've stopped speaking. Recog stopped.`)
      recognition.stop()
    }

    recognition.onerror = function(event) {
      console.log('Error occurred in recognition: ' + event.error)
    }

    recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
    }

    recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('Sorry, no match found :(')
    }
    recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('Recog booting up!')
    }
  } else {
    console.log('Voice mode is currently OFF')
  }
}
