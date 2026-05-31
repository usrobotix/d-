import { Request, Response, NextFunction } from 'express';

interface RateEntry {
  count: number;
  resetAt: number;
}

const ipMap = new Map<string, RateEntry>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 3;

export function antispam(req: Request, res: Response, next: NextFunction): void {
  // Honeypot check
  if (req.body && req.body.website) {
    res.status(200).json({ ok: true });
    return;
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (entry.count >= MAX_REQUESTS) {
    res.status(429).json({ error: 'Too many requests. Try again later.' });
    return;
  }

  entry.count += 1;
  next();
}
