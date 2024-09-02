import { RequestHandler } from "express"

const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const allowedOrigins = ['http://localhost:5173', 'rentals.projects.bbdgrad.com']

const configureOrigin = origin => {
  if (!origin) return null

  if (!allowedOrigins.includes(origin)) return null

  return origin
}

const configureMethods = (methods: string[]) => methods.join(', ')

const cors: RequestHandler = (request, response, next) => {
  response.setHeader(
    'access-control-allow-origin',
    configureOrigin(request.headers['origin'])
  )

  response.setHeader(
    'access-control-allow-methods',
    configureMethods(allowedMethods)
  )

  if (request.method === 'OPTIONS') return response.status(204)

  next()
}

export default cors