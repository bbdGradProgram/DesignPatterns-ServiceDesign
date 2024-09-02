import { z } from 'zod'

export namespace Request {

  export namespace Body {

    export const CreateRental = z
      .object({
        personaId: z.bigint(),
        numUnits: z.number(),
      })
      .required({ personaId: true, numUnits: true })
  }
}