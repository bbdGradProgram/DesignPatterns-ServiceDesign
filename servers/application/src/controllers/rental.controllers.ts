import { z } from 'zod'
import { RequestHandler } from 'express'

import { Request } from "../schemas/rental.schemas"
import * as rentalServices from '../services/rental.services'

export const createRental: RequestHandler<
  any,
  any,
  z.infer<typeof Request.Body.CreateRental>
> = (request, response) => {
  const { personaId, numUnits } = request.body

  return rentalServices
    .createRental({ id: personaId }, { capacity: numUnits })
    .then(() => response.sendStatus(201))
}