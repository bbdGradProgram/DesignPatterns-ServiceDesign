import { z } from 'zod'

export namespace Request {

  export namespace Query {

    export const FetchLeases = z
      .object({
        limit: z.number().nonnegative().finite(),
        page: z.number().nonnegative().finite(),
        sortBy: z.array(z.string()),
        order: z.enum(['asc', 'desc']),
      })
      .partial()
  }

  export namespace Body {

    export const PatchLease = z
      .object({
        id: z.string(),
        status: z.string(),
      })
      .required({ id: true, status: true })
  }
}