import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';

import authRouter from './routes/auth';
import servicesRouter from './routes/services';
import casesRouter from './routes/cases';
import faqRouter from './routes/faq';
import testimonialsRouter from './routes/testimonials';
import leadsRouter from './routes/leads';
import mediaRouter from './routes/media';
import settingsRouter from './routes/settings';
import redirectsRouter from './routes/redirects';
import auditRouter from './routes/audit';

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads statically
const uploadsDir = path.resolve(process.env.UPLOADS_DIR || './uploads');
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/services', servicesRouter);
app.use('/api/cases', casesRouter);
app.use('/api/faq', faqRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/redirects', redirectsRouter);
app.use('/api/audit', auditRouter);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = parseInt(process.env.PORT || '4000', 10);
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`CORS origin: ${corsOrigin}`);
});

export default app;
