import j from 'joi'

export namespace Request {

  export namespace Query {

    export const FetchLeases = j
      .object({
        limit: j.number().min(1).optional(),
        page: j.number().min(1).optional(),
        sortBy: j.string().optional(),
        order: j.allow('asc', 'desc').optional(),
        status: j.allow('vacant', 'occupied').optional()
      })
      .optional()
  }

  export namespace Body {

    export const CreateLease = j
      .object({
        rentalId: j.string().required(),
        tenantId: j.string().required(),
        startDate: j.string().required(),
        endDate: j.string().required(),
        rentAmount: j.string().required(),
      })
  }
}