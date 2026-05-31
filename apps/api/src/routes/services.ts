import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET / — list published services (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /by-id/:id
router.get("/by-id/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const s = await prisma.service.findUnique({ where: { id: parseInt(req.params.id as string, 10) } });
    if (!s) { res.status(404).json({ error: "Not found" }); return; }
    res.json(s);
  } catch (err) { res.status(500).json({ error: "Internal server error" }); }
});

// GET /:slug — get one by slug (public)
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: req.params.slug as string },
    });
    if (!service) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST / — create (requireAuth, requireRole)
router.post('/', requireAuth, requireRole(['admin', 'editor']), async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.create({ data: req.body });
    res.status(201).json(service);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /:id — update (requireAuth, requireRole)
router.put('/:id', requireAuth, requireRole(['admin', 'editor']), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const service = await prisma.service.update({
      where: { id },
      data: req.body,// TODO fix
    });
    res.json(service);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /:id — delete (requireAuth admin)
router.delete('/:id', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await prisma.service.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
