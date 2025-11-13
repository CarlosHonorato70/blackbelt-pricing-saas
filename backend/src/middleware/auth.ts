import { Request, Response, NextFunction } from 'express';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'] as string | undefined;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Attach a lightweight user object to the request for downstream handlers
  (req as any).user = {
    id: userId,
    tenantId: req.headers['x-tenant-id'] as string | undefined
  };

  next();
}

export function getContextFromHeaders(req: Request) {
  return {
    userId: req.headers['x-user-id'] as string | undefined,
    tenantId: req.headers['x-tenant-id'] as string | undefined,
  };
}