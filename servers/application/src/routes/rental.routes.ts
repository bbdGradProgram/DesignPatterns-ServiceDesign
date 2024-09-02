import { Router } from 'express'

import {
  createRental,
} from '../controllers/rental.controllers'
import { Request } from '../schemas/rental.schemas'
import validator from '../middleware/validator'
import parser from '../middleware/parser'

const router = Router()

router.route('/')
  .post(validator(Request.Body.CreateRental, 'body'), createRental)

export default router