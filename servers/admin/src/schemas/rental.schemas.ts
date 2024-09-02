import j from 'joi'

export namespace Request {

  export namespace Params {

    export const Id = j.number().min(1)
  }

  export namespace Query {

    export const FetchRentals = j
      .object({
        limit: j.number().min(1).optional(),
        page: j.number().min(1).optional(),
        sortBy: j.string().optional(),
        order: j.allow('asc', 'desc').optional(),
        status: j.allow('vacant', 'occupied').optional(),
      })
  }

  export namespace Body {

    export const PostRental = j
      .object({
        propertyId: j.number().min(1).required(),
        cost: j.number().min(0).required(),
      })

    export const PatchRental = j
      .object({
        cost: j.string().required(),
        status: j.allow('vacant', 'occupied').optional(),
      })
  }
}