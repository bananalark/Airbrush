var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var diagnosticPara = document.querySelector('.output')

var testBtn = document.querySelector('button')

export var speechResult = 'Nothing yet'
var speechResultConfidence

function startStopPainting() {
  var recognition = new SpeechRecognition()
  var speechRecognitionList = new SpeechGrammarList()
  recognition.grammars = speechRecognitionList
  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.start()

  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    speechResult = event.results[0][0].transcript.toLowerCase()
    speechResultConfidence = event.results[0][0].confidence
  }
  recognition.terminate = function() {
    recognition.stop()
    
  }

  recognition.onerror = function(event) {
    recognition.terminate()
    if (event.error) {
      console.log('Error occurred in recognition: ' + event.error)
    }
  }

  //THE FOLLOWING TOOLS ARE USEFUL FOR DEBUGGING. I've commented them out, so as not to clog the console. But I may need them later. Please leave them as we continue tinkering with voice commands. Thanks! -AR

  // recognition.onaudiostart = function(event) {
  //   //Fired when the user agent has started to capture audio.
  //   console.log('SpeechRecognition.onaudiostart')
  // }

  // recognition.onaudioend = function(event) {
  //   //Fired when the user agent has finished capturing audio.
  //   console.log('SpeechRecognition.onaudioend')
  // }

  // recognition.onnomatch = function(event) {
  //   //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
  //   console.log('SpeechRecognition.onnomatch')
  // }

  // recognition.onsoundstart = function(event) {
  //   //Fired when any sound — recognisable speech or not — has been detected.
  //   console.log('SpeechRecognition.onsoundstart')
  // }

  // recognition.onsoundend = function(event) {
  //   //Fired when any sound — recognisable speech or not — has stopped being detected.
  //   console.log('SpeechRecognition.onsoundend')
  // }

  // recognition.onspeechstart = function(event) {
  //   //Fired when sound that is recognised by the speech recognition service as speech has been detected.
  //   console.log('SpeechRecognition.onspeechstart')
  // }
  // recognition.onstart = function(event) {
  //   //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
  //   console.log('SpeechRecognition.onstart')
  // }
  recognition.onend = function(event) {
    //Fired when the speech recognition service has disconnected.
    recognition.stop()
    if (testBtn.textContent === 'Voice Currently ON') {
      console.log('SpeechRecognition.onend... SPEECH HAS ENDED, RESTARTING')
      setTimeout(() => recognition.start(), 1000)
    } else {
      console.log('SpeechRecognition.onend... SPEECH HAS ENDED, TERMINATING')
      recognition.terminate()
    }
  }
}

if (testBtn.textContent === 'Voice Currently OFF') {
  testBtn.addEventListener('click', startStopPainting)
}
