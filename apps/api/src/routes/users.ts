import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/', requireAuth, requireRole(['admin']), async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true }
  });
  res.json(users);
});

router.post('/', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  const { email, name, role, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, role, password: hash },
    select: { id: true, email: true, name: true, role: true, createdAt: true }
  });
  res.json(user);
});

router.put('/:id', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { name, role, password } = req.body;
    const data: any = {};
    if (name) data.name = name;
    if (role) data.role = role;
    if (password) { const bcrypt = require('bcryptjs'); data.password = await bcrypt.hash(password, 10); }
    const user = await prisma.user.update({ where: { id }, data, select: { id: true, email: true, name: true, role: true, createdAt: true } });
    res.json(user);
  } catch (err: any) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', requireAuth, requireRole(['admin']), async (req: Request, res: Response) => {
  await prisma.user.delete({ where: { id: parseInt(req.params.id as string, 10) } });
  res.json({ ok: true });
});

export default router;
