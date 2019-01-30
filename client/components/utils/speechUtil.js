import store from '../../store'
import {getCommand} from '../../store/speech'

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent

export default function testSpeech(voiceMode) {
  if (voiceMode === true) {
    var recognition = new SpeechRecognition()
    // var speechRecognitionList = new SpeechGrammarList()
    // speechRecognitionList.addFromString(grammar, 1)
    // recognition.grammars = speechRecognitionList
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
