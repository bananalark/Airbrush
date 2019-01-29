// Imports the Google Cloud client library
const speech = require('@google-cloud/speech')
const fs = require('fs')
const record = require('node-record-lpcm16')

// Creates a client
const client = new speech.SpeechClient({
  projectId: 'airbrush-1548453310071',
  keyFilename:
    '/Users/amberrodriguez/Documents/Grace-Hopper/capstone/Airbrush/Airbrush-0520a40964a5.json'
})

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const encoding = 'LINEAR16'
const sampleRateHertz = 16000
const languageCode = 'en-US'

export let test = 'test'

var currentCommand
var commandConfidence

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode
  },
  interimResults: false // If you want interim results, set this to true
}

// Create a recognize stream
const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data => {
    commandConfidence = data.results[0].alternatives[0].confidence
    currentCommand = data.results[0].alternatives[0].transcript
  })

// Start recording and send the microphone input to the Speech API
record
  .start({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: false,
    recordProgram: 'rec', // Try also "arecord" or "sox"
    silence: '10.0'
  })
  .on('error', console.error)
  .pipe(recognizeStream)

console.log('Listening, press Ctrl+C to stop.')

// module.exports = {recognizeStream, commandConfidence, currentCommand}
