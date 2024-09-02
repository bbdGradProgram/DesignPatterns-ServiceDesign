import { Router } from 'express'

import {
  fetchRental,
  fetchRentals,
  patchRental,
  postRental,
} from '../controllers/rental.controllers'
import { Request } from '../schemas/rental.schemas'
import validator from '../middleware/validator'
import parser from '../middleware/parser'
import authenticateToken from "../middleware/auth";
import { thrower } from '../helpers/thrower'

const router = Router()

router.route('/')
  .get(authenticateToken, parser, validator(Request.Query.FetchRentals, 'query'), thrower(fetchRentals))
  // .post(authenticateToken, validator(Request.Body.PostRental, 'body'), thrower(postRental))
  .post(validator(Request.Body.PostRental, 'body'), thrower(postRental))

router.route('/:id')
  .get(authenticateToken, thrower(fetchRental))
  .patch(validator(Request.Body.PatchRental, 'body'), thrower(patchRental))

export default router