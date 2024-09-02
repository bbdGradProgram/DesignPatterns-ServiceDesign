import { Router } from 'express'

import {
  createRental,
  fetchRental,
  fetchRentals,
  patchRental,
} from '../controllers/rental.controllers'
import { Request } from '../schemas/rental.schema'
import validator from '../middleware/validator'
import parser from '../middleware/parser'
import authenticateToken from "../middleware/auth";

const router = Router()

router.route('/')
  .get(authenticateToken, parser, validator(Request.Query.FetchRentals, 'query'), fetchRentals)
  .post(authenticateToken, validator(Request.Body.CreateRental, 'body'), createRental)

router.route('/:id')
  .get(authenticateToken, fetchRental)
  .patch(authenticateToken, validator(Request.Body.PatchRental, 'body'), patchRental)

export default router