const router = require('express').Router()
module.exports = router

const encoding = 'LINEAR16'
const sampleRateHertz = 16000
const languageCode = 'en-US'
var currentCommand

router.get('/', (req, res, next) => {
  try {
    console.log(`I'M LISTENING TO YOU!!!!!!!!!`)
    // [START micStreamRecognize]

    // Node-Record-lpcm16
    const record = require('node-record-lpcm16')

    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech')

    const config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode
    }
    const audio = {}

    const request = {
      config,
      audio,
      interimResults: false //Get interim results from stream
    }

    // Creates a client
    const client = new speech.SpeechClient({
      projectId: 'airbrush-1548453310071',
      keyFilename:
        '/Users/amberrodriguez/Documents/Grace-Hopper/capstone/Airbrush/Airbrush-0520a40964a5.json'
    })

    // Create a recognize stream
    const recognizeStream = client
      .streamingRecognize(request)
      .on('error', console.error)
      .on('data', data => {
        currentCommand = data.results[0].alternatives[0].transcript
        process.stdout.write(
          data.results[0] && data.results[0].alternatives[0]
            ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
            : `\n\nReached transcription time limit, press Ctrl+C\n`
        )
        // setTimeout(() => {
        //   record.stop()
        //   console.log('STOPPED RECORDING')
        // }, 2000)

        res.json(currentCommand)
        console.log('THIS SHOULDNT PRINT TO THE CONSOLE ')
        // res.removeHeader()
      })

    // Start recording and send the microphone input to the Speech API
    record
      .start({
        sampleRateHertz: sampleRateHertz,
        threshold: 0, //silence threshold
        recordProgram: 'rec', // Try also "arecord" or "sox"
        silence: '5.0' //seconds of silence before ending
      })
      .on('error', console.error)

      .pipe(recognizeStream)

    console.log('Listening, press Ctrl+C to stop.')

    // [END micStreamRecognize]
  } catch (err) {
    next(err)
    res.end()
  }
})
