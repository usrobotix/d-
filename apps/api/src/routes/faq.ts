import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET / — list all categories with items (published)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.faqCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          where: { published: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /categories — create category (auth)
router.post('/categories', requireAuth, async (req: Request, res: Response) => {
  try {
    const cat = await prisma.faqCategory.create({ data: req.body });
    res.status(201).json(cat);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /categories/:id — update (auth)
router.put('/categories/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const cat = await prisma.faqCategory.update({ where: { id }, data: req.body });
    res.json(cat);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /items — create item (auth)
router.post('/items', requireAuth, async (req: Request, res: Response) => {
  try {
    const item = await prisma.faqItem.create({ data: req.body });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /items/:id — update (auth)
router.put('/items/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const item = await prisma.faqItem.update({ where: { id }, data: req.body });
    res.json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /items/:id — delete (auth)
router.delete('/items/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await prisma.faqItem.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
