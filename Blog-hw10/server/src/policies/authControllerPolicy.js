const Joi = require('joi')

module.exports = {
  register (req, res, next) {
    const schema = {
      username: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().regex(
        new RegExp('^.{8,32}$')
      )
    }

    const {error, value} = Joi.validate(req.body, schema)

    if (error) {
      switch (error.details[0].context.key) {
        case 'username':
          res.status(400).send({
            error: 'A valid username should be provided!'
          })
          break
        case 'email':
          res.status(400).send({
            error: 'A valid email should be provided!'
          })
          break
        case 'password':
          res.status(400).send({
            error: 'The length of password should be 8-32!'
          })
        default:
          res.status(400).send({
            error: 'Invalid registration information!'
          })
      }
    } else {
      next()
    }
  }
}