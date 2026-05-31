import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { antispam } from '../middleware/antispam';

const router = Router();

async function sendEmailNotification(lead: {
  name: string;
  contact: string;
  service?: string | null;
  message?: string | null;
  sourcePage?: string | null;
}): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, NOTIFY_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL) return;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '465', 10),
    secure: parseInt(SMTP_PORT || '465', 10) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to: NOTIFY_EMAIL,
    subject: `Новая заявка от ${lead.name}`,
    text: [
      `Имя: ${lead.name}`,
      `Контакт: ${lead.contact}`,
      lead.service ? `Услуга: ${lead.service}` : '',
      lead.message ? `Сообщение: ${lead.message}` : '',
      lead.sourcePage ? `Страница: ${lead.sourcePage}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  });
}

// POST / — create lead
router.post('/', antispam, async (req: Request, res: Response) => {
  try {
    const { name, contact, service, message, sourcePage, utm } = req.body;

    if (!name || !contact) {
      res.status(400).json({ error: 'name and contact are required' });
      return;
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        contact,
        service: service || null,
        message: message || null,
        sourcePage: sourcePage || null,
        utm: utm || null,
        status: 'new',
      },
    });

    // Fire-and-forget email
    sendEmailNotification(lead).catch((err) =>
      console.error('Email notification failed:', err)
    );

    res.status(201).json({ ok: true, id: lead.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET / — list leads (requireAuth)
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { status, page = '1', limit = '50' } = req.query;
    const where: any = {};
    if (status) where.status = status;

    const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string, 10),
      }),
    ]);

    res.json({ total, leads });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /export — export CSV (requireAuth) — must be before /:id
router.get('/export', requireAuth, async (_req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });

    const header = 'id,name,contact,service,message,sourcePage,status,createdAt\n';
    const rows = leads
      .map((l: { id: number; name: string; contact: string; service: string | null; message: string | null; sourcePage: string | null; status: string; createdAt: Date }) =>
        [
          l.id,
          `"${l.name.replace(/"/g, '""')}"`,
          `"${l.contact.replace(/"/g, '""')}"`,
          `"${(l.service || '').replace(/"/g, '""')}"`,
          `"${(l.message || '').replace(/"/g, '""')}"`,
          `"${(l.sourcePage || '').replace(/"/g, '""')}"`,
          l.status,
          l.createdAt.toISOString(),
        ].join(',')
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send('﻿' + header + rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /:id — update status/notes (requireAuth)
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { status, notes } = req.body;
    const lead = await prisma.lead.update({
      where: { id },
      data: { status, notes },
    });
    res.json(lead);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
