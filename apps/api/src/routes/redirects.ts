import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET / — list redirects (public, used by frontend middleware)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const redirects = await prisma.redirect.findMany({ orderBy: { id: 'asc' } });
    res.json(redirects);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const r = await prisma.redirect.findUnique({ where: { id } });
    if (!r) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(r);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST / — create (requireAuth)
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { from, to, code } = req.body;
    const r = await prisma.redirect.create({ data: { from, to, code: code || 301 } });
    res.status(201).json(r);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /:id — update (requireAuth)
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { from, to, code } = req.body;
    const r = await prisma.redirect.update({ where: { id }, data: { from, to, code } });
    res.json(r);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /:id — delete (requireAuth)
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await prisma.redirect.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
