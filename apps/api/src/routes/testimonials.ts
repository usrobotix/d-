import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET / — list published testimonials (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const t = await prisma.testimonial.findUnique({ where: { id } });
    if (!t) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(t);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST / — create (requireAuth, requireRole)
router.post('/', requireAuth, requireRole(['admin', 'editor']), async (req: Request, res: Response) => {
  try {
    const t = await prisma.testimonial.create({ data: req.body });
    res.status(201).json(t);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /:id — update (requireAuth, requireRole)
router.put('/:id', requireAuth, requireRole(['admin', 'editor']), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const t = await prisma.testimonial.update({ where: { id }, data: req.body });
    res.json(t);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /:id — delete (requireAuth admin)
router.delete('/:id', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.testimonial.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
