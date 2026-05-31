import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET / — list cases
router.get('/', async (req: Request, res: Response) => {
  try {
    const isAdmin = req.query.all as string === '1';
    // requireAuth check for ?all=1
    if (isAdmin) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
    }

    const where: any = {};
    if (!isAdmin) {
      where.status = 'published';
    }
    if (req.query.direction as string) {
      where.direction = req.query.direction as string as string;
    }

    const cases = await prisma.case.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /by-id/:id — get one by id (admin)
router.get("/by-id/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const c = await prisma.case.findUnique({ where: { id: parseInt(req.params.id as string, 10) } });
    if (!c) { res.status(404).json({ error: "Not found" }); return; }
    res.json(c);
  } catch (err) { res.status(500).json({ error: "Internal server error" }); }
});

// GET /:slug — get one by slug (public)
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const c = await prisma.case.findUnique({ where: { slug: req.params.slug as string } });
    if (!c) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST / — create (auth)
router.post('/', requireAuth, requireRole(['admin', 'editor']), async (req: Request, res: Response) => {
  try {
    const c = await prisma.case.create({ data: req.body });
    res.status(201).json(c);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /:id — update (auth)
router.put('/:id', requireAuth, requireRole(['admin', 'editor']), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { id: _id, ...data } = req.body;
    const c = await prisma.case.update({ where: { id }, data });
    res.json(c);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /:id — delete (auth admin)
router.delete('/:id', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await prisma.case.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
