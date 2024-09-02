import { readFileSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'

// process.env.KEY = readFileSync(join(cwd(), 'real_estate_agent.key'))

const options = {
  rejectUnauthorized: true,
  requestCert: true,
  // key: ,
  cert: readFileSync(join(cwd(), 'real_estate_agent.cert')),
};

const certifier = () => {

}

export default certifier