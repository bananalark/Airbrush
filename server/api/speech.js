const router = require('express').Router()
module.exports = router

console.log(process.env.PWD)

router.get('/', (req, res, next) => {
  try {
    const recordMe = () => {
      const record = require('node-record-lpcm16')
      const speech = require('@google-cloud/speech')

      const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US'
      }

      const request = {
        config,
        singleUtterance: true,
        interimResults: false //Get interim results from stream
      }

      // Creates a client
      const client = new speech.SpeechClient({
        projectId: 'airbrush-1548453310071',
        keyFilename: `${process.env.PWD}/Airbrush-0520a40964a5.json`
      })

      // Start recording and send the microphone input to the Speech API

      // Create a recognize stream
      const recognizeStream = client
        .streamingRecognize(request)
        .on('error', () => record.stop())
        .on('data', data => {
          if (data.results[0] && data.results[0].alternatives[0].transcript) {
            console.log(
              `Transcription: ${data.results[0].alternatives[0].transcript}`
            )

            setTimeout(() => {
              record.stop()
            }, 1000)
            res.json(data.results[0].alternatives[0].transcript)
          }
        })

      record
        .start({
          sampleRateHertz: 16000,
          // threshold: 0, //silence threshold
          thresholdStart: 0,
          recordProgram: 'rec', // Try also "arecord" or "sox"
          silence: '2.0' //seconds of silence before ending
        })

        .on('error', () => record.stop())
        .pipe(recognizeStream)
      console.log('Listening, press Ctrl+C to stop.')
    }
    recordMe()
  } catch (err) {
    next(err)
    res.end()
  }
})
