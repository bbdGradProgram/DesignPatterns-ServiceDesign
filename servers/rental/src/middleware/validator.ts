import { RequestHandler } from 'express'
import { ZodError, ZodSchema } from 'zod'

const validator = (
  schema: ZodSchema,
  property: 'query' | 'body'
): RequestHandler => {
  return (request, response, next) => {
    try {
      schema.parse(request[property])
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).json({
          errors: error.errors.map(e => ({
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