import express from 'express'
import { SecretsManager } from '@aws-sdk/client-secrets-manager'

import rentalRouter from './routes/rental.routes'
import leaseRouter from './routes/lease.routes'
import catcher from './middleware/catcher'
import cors from './middleware/cors'

// const manager = new SecretsManager({
//   region: 'eu-west-1',
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
//     sessionToken: process.env.AWS_SESSION_TOKEN || '',
//   }
// });

// manager
//   .getSecretValue({ SecretId: 'rap/mtls' })
//   .then(response => {
//     const json = JSON.parse(response.SecretString || '')

//     process.env.MTLS_CERT = json['cert.pem']
//     process.env.MTLS_KEY = json['key.pem']
//   })

const app = express()

app.use(cors)

app.use(express.json())
app.use(express.urlencoded({ limit: 100 * 1000, extended: true }))

app.use('/api/rentals', rentalRouter)
app.use('/api/leases', leaseRouter)

app.use(catcher)

export default app