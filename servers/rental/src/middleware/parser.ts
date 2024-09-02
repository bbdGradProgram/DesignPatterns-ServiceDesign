import { RequestHandler } from "express"

const parser: RequestHandler<any, any, any, any> = (request, response, next) => {
  const modifier = {
    ...request.query,
    limit: request.query.limit !== undefined
      ? Number(request.query.limit)
      : undefined,
    page: request.query.page !== undefined
      ? Number(request.query.page)
      : undefined,
  }

  request.query = modifier

  next()
}

export default parser