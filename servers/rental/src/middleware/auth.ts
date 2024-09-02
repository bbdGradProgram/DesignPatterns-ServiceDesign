import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client('11695021444-gb72qvk190v3bda0gunhqpg4sn3sueaq.apps.googleusercontent.com');

async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: '11695021444-gb72qvk190v3bda0gunhqpg4sn3sueaq.apps.googleusercontent.com',
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token verification failed' });
    }
}

export default authenticateToken;
