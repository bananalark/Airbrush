const passport = require('passport')
const router = require('express').Router()
const FacebookStrategy = require('passport-facebook')
const {User} = require('../db')
module.exports = router

require('../../secrets')

if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
  console.log('FACEBOOK client ID / secret not found. Skipping FACEBOOK OAuth.')
} else {
  const FacebookConfig = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK
  }

  const strategy = new FacebookStrategy(
    FacebookConfig,
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('PROFILE', profile)
        const FacebookId = profile.id
        const user = await User.findOrCreate({
          where: {FacebookId}
        })
        done(null, user[0])
      } catch (err) {
        console.error('heres the problemo:', err.message)
        done(err)
      }
    }
  )

  router.get('/', passport.authenticate('FACEBOOK'))

  router.get(
    '/callback',
    passport.authenticate('FACEBOOK', {
      successRedirect: '/camera',
      failureRedirect: '/auth'
    })
  )

  passport.use(strategy)

  passport.serializeUser(function(user, done) {
    console.log('serializing user.')
    done(null, user.id)
  })

  passport.deserializeUser(async function(id, done) {
    console.log('deserialize user.')
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (error) {
      console.log('did not deserialize.')
      done(error)
    }
  })
}
