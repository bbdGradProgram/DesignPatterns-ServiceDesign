import { Router } from 'express'

import {
  fetchLease,
  fetchLeases,
  patchLease,
} from '../controllers/lease.controllers'
import { Request } from '../schemas/lease.schemas'
import validator from '../middleware/validator'
import parser from '../middleware/parser'
import authenticateToken from "../middleware/auth";

const router = Router()

router.route('/')
  .get(authenticateToken, parser, validator(Request.Query.FetchLeases, 'query'), fetchLeases)

router.route('/:id')
  .get(authenticateToken, fetchLease)
  .patch(authenticateToken, validator(Request.Body.PatchLease, 'body'), patchLease)

export default router