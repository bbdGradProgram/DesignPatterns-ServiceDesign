import { ErrorRequestHandler } from 'express'
import { ResponseError } from '../types/error'

const catcher: ErrorRequestHandler = (error, request, response, next) => {
  if (error instanceof ResponseError) {
    return response.status(error.status).json(error.serialize())
  }

  return response.status(400).json({ message: error.message })
}

export default catcher