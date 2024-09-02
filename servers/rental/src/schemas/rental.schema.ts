import { z } from 'zod'

export namespace Request {

  export namespace Query {

    export const FetchRentals = z
      .object({
        limit: z.number().nonnegative().finite(),
        page: z.number().nonnegative().finite(),
        sortBy: z.string(),
        order: z.enum(['asc', 'desc']),
        status: z.enum(['vacant', 'occupied'])
      })
      .partial()
  }

  export namespace Body {

    export const CreateRental = z
      .object({
        persona: z.object({
          id: z.string()
        })
          .required({ id: true }),
        property: z.object({
          capacity: z.number().nonnegative().max(8),
        })
          .required({ capacity: true })
      })
      .required({ persona: true, property: true })

    export const PatchRental = z
      .object({
        id: z.string(),
        status: z.string(),
      })
      .required({ id: true, status: true })
  }
}