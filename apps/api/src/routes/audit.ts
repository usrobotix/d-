import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET / — list audit logs (requireAuth admin)
router.get('/', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  try {
    const { entity, userId, page = '1', limit = '50' } = req.query;
    const where: any = {};
    if (entity) where.entity = entity;
    if (userId) where.userId = parseInt(userId as string, 10);

    const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string, 10),
      }),
    ]);

    res.json({ total, logs });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
