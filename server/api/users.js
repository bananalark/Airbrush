const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

const isAdmin = user => true

// function isAuthenticated(req, res, next) {
//   if (process.env.NODE_ENV === 'test' || req.user) {
//     return next()
//   } else {
//     res.redirect('/')
//   }
// }

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})
