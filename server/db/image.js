const Sequelize = require('sequelize')
const db = require('../db')

const Image = db.define('image', {
  background: {
    type: Sequelize.TEXT
  },
  canvas: {
    type: Sequelize.TEXT
  },
  paperSvg: {
    type: Sequelize.TEXT
  }
})

module.exports = Image
