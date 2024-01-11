import { Request, Response, NextFunction } from 'express';

const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = process.env.API_KEY;
  const providedApiKey = req.headers['api-key'];

  if (apiKey && providedApiKey && apiKey === providedApiKey) {
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
};

export default apiKeyMiddleware;
