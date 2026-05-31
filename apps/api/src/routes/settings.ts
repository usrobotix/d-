import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET / — list all settings (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.settings.findMany();
    // Return as key-value object for convenience
    const obj: Record<string, string> = {};
    settings.forEach((s: { id: string; value: string }) => { obj[s.id] = s.value; });
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST / — create setting (requireAuth admin)
router.post('/', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  try {
    const { id, value } = req.body;
    const setting = await prisma.settings.create({ data: { id, value } });
    res.status(201).json(setting);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /:id — update setting value (requireAuth admin)
router.put('/:id', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  try {
    const { value } = req.body;
    const setting = await prisma.settings.upsert({
      where: { id: req.params.id as string },
      update: { value },
      create: { id: req.params.id as string, value },
    });
    res.json(setting);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
