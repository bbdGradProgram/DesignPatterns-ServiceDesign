import express from 'express'

import rentalRouter from './routes/rental.routes'
import leaseRouter from './routes/lease.routes'
import catcher from './middleware/catcher'
// import cors from './middleware/cors'

const app = express()

// app.use(cors)

app.use(express.json())
app.use(express.urlencoded({ limit: 100 * 1000, extended: true }))

app.use('/api/rentals', rentalRouter)
app.use('/api/leases', leaseRouter)

app.use(catcher)

export default app