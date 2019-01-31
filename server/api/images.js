const router = require('express').Router()
const {Image, User} = require('../db')
module.exports = router

function isAuthenticated(req, res, next) {
  if (process.env.NODE_ENV === 'test' || req.user) {
    return next()
  } else {
    res.redirect('/')
  }
}

router.post('/', isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findOne({where: {id: req.user.id}})
    const newImage = await Image.create({
      where: {dataString: req.body.dataString}
    })

    await user.addImage(newImage)
    res.status(201).send()
  } catch (err) {
    next(err)
  }
})
