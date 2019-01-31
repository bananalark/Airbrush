const passport = require('passport')
const router = require('express').Router()
const InstagramStrategy = require('passport-instagram').OAuth2Strategy
const {User} = require('../db')
module.exports = router

require('../../secrets')

if (!process.env.INSTAGRAM_CLIENT_ID || !process.env.INSTAGRAM_CLIENT_SECRET) {
  console.log(
    'Instagram client ID / secret not found. Skipping Instagram OAuth.'
  )
} else {
  const instagramConfig = {
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: process.env.INSTAGRAM_CALLBACK
  }

  passport.use(
    new InstagramStrategy(
      instagramConfig,
      async (accessToken, refreshToken, profile, done) => {
        await User.findOrCreate({instagramId: profile.id}, function(err, user) {
          return done(err, user)
        })
      }
    )
  )

  passport.use(strategy)

  router.get('/', passport.authenticate('instagram', {scope: 'email'}))

  router.get(
    '/callback',
    passport.authenticate('instagram', {
      successRedirect: '/home',
      failureRedirect: '/login'
    })
  )
}
