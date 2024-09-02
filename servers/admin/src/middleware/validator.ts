import { RequestHandler } from 'express'
import j from 'joi'

const validator = (
  schema: j.Schema,
  property: 'query' | 'body' | 'params'
): RequestHandler => {
  return (request, response, next) => {
    try {
      schema.validate(request[property], { convert: true })
      next()
    } catch (error) {
      if (error instanceof j.ValidationError) {
        return response.status(400).json({
          errors: error.details.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        })
      }

      next(error)
    }
  }
}

export default validator