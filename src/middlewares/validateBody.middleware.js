import Joi from 'joi'
/**
 * Middleware to validate request body against a Joi schema.
 * 
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @returns {Function} Middleware function that validates the request body.
 */

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      return res.status(400).json({
        errors: error.details.map(e => e.message),
      })
    }
    next()
  }
}

export default validateBody
