import { RequestHandler } from 'express';

const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
const allowedOrigins = ['http://localhost:5173', 'http://rentals.projects.bbdgrad.com'];

const configureOrigin = origin => {
  if (!origin) return '*';

  if (!allowedOrigins.includes(origin)) return null;

  return origin;
};

const configureMethods = (methods: string[]) => methods.join(', ');

const cors: RequestHandler = (request, response, next) => {
  const origin = configureOrigin(request.headers.origin);
  if (origin) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  }

  response.setHeader('Access-Control-Allow-Methods', configureMethods(allowedMethods));
  response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  response.setHeader('Access-Control-Allow-Credentials', 'true');

  if (request.method === 'OPTIONS') {
    return response.status(204).send();
  }

  next();
};

export default cors;