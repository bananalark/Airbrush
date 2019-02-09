import store, {toggleDraw, toggleErase} from '../store'
import {getCommand} from '../store/paintTools'
import {clearCanvas} from './draw'

export var isChrome =
  !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)

var SpeechRecognition

if (isChrome) {
  SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
}

const wordsThatSoundLikeStart = [
  'smart',
  'starred',
  'stored',
  'star',
  'starts',
  'starch',
  'Stuart',
  'sort',
  'store'
]
const wordsThatSoundLikeStop = [
  'step',
  'steep',
  'stoop',
  'stope',
  'swap',
  'stopped',
  'stops',
  'stab',
  'stub',
  'sop',
  'stomp',
  'stump'
]
const wordsThatSoundLikeUndo = [
  'unto',
  'indu',
  'into',
  'anew',
  'and',
  'ado',
  'two',
  'to',
  'too',
  'new',
  'untrue',
  'hindu'
]
const wordsThatSoundLikeClear = [
  'claire',
  'queer',
  'cleared',
  'clearer',
  'clears',
  'cleary',
  'kir',
  'kyr',
  'keer',
  'care',
  'clay',
  'clean'
]

/*eslint-disable*/
export const evaluateCommand = (command, state) => {
  try {
    if (state.voiceModeOn === true) {
      if (
        command === 'start' ||
        wordsThatSoundLikeStart.indexOf(command) > -1
      ) {
        //If drawMode is off, turn it on.
        if (state.drawModeOn === false) {
          store.dispatch(toggleDraw())
        }

        //If eraseMode is on, turn it off.
        if (state.eraseModeOn === true) {
          store.dispatch(toggleErase())
        }
      } else if (
        command === 'stop' ||
        wordsThatSoundLikeStop.indexOf(command) > -1
      ) {
        if (state.drawModeOn === true) {
          store.dispatch(toggleDraw())
        }
        if (state.eraseModeOn === true) {
          store.dispatch(toggleErase())
        }
      } else if (
        command === 'undo' ||
        wordsThatSoundLikeUndo.indexOf(command) > -1
      ) {
        if (state.eraseModeOn === false) {
          store.dispatch(toggleErase())
        }
        if (
          state.drawModeOn === false &&
          (command === 'undo' || wordsThatSoundLikeUndo.indexOf(command) > -1)
        ) {
          store.dispatch(toggleDraw())
        }
      } else if (
        command === 'clear' ||
        wordsThatSoundLikeClear.indexOf(command) > -1
      ) {
        clearCanvas()
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
      console.log(event.results)
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

export const voiceModeStartStop = () => {
  if (store.getState().paintTools.voiceModeOn === true) {
    voiceRecognition(store.getState().paintTools)
    setInterval(() => {
      if (store.getState().paintTools.voiceModeOn === true) {
        voiceRecognition(store.getState().paintTools)
      }
    }, 5000)
  }
}
