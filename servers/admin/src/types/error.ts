export abstract class ResponseError extends Error {

  abstract status: number

  constructor (message: string) {
    super(message)
  }

  abstract serialize (): { message: string }
}