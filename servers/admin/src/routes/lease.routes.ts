import { Router } from 'express'

import {
  fetchLeases,
} from '../controllers/lease.controllers'
import { Request } from '../schemas/lease.schemas'
import validator from '../middleware/validator'
import authenticateToken from "../middleware/auth";
import parser from '../middleware/parser';
import { thrower } from '../helpers/thrower';

const router = Router()

router.route('/')
  .get(authenticateToken, parser, validator(Request.Query.FetchLeases, 'query'), thrower(fetchLeases))

export default router