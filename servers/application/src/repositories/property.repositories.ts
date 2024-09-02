import { Agent } from 'https'


export const fetchProperty = capacity => fetch(
  '',
  {
    // agent: new Agent({
    //   key: process.env.,
    //   cert: ,
    //   rejectUnauthorized: true,
    //   requestCert: true,
    // }),
    method: 'PUT',
    body: JSON.stringify({
      size: capacity,
      toRent: true,
    }),
  }
)