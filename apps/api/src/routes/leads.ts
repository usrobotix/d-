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


async function sendTelegramNotification(lead: {
  name: string;
  contact: string;
  service?: string | null;
  message?: string | null;
  sourcePage?: string | null;
}): Promise<void> {
  const { TG_BOT_TOKEN, TG_CHAT_ID } = process.env;
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) return;

  const text = [
    '🔔 Новая заявка',
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    lead.service ? `Услуга: ${lead.service}` : '',
    lead.message ? `Сообщение: ${lead.message}` : '',
    lead.sourcePage ? `Страница: ${lead.sourcePage}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;
  const MAX_ATTEMPTS = 4;
  let lastErr: unknown = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!resp.ok) {
        throw new Error(`Telegram API responded ${resp.status}`);
      }
      return; // success
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, attempt * 200));
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Telegram send failed after retries');
}

async function verifyYandexCaptcha(token: string): Promise<boolean> {
  const secret = process.env.YANDEX_CAPTCHA_SERVER_KEY;
  if (!secret) return true; // если ключ не задан — не блокируем
  try {
    const resp = await fetch('https://smartcaptcha.yandexcloud.net/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&token=${token}`,
    });
    const data = await resp.json() as { status?: string };
    return data.status === 'ok';
  } catch (err) {
    console.error('Captcha verification failed:', err);
    return false;
  }
}

// POST / — create lead
router.post('/', antispam, async (req: Request, res: Response) => {
  try {
    const { name, contact, service, message, sourcePage, utm, captchaToken } = req.body;

    if (!name || !contact) {
      res.status(400).json({ error: 'name and contact are required' });
      return;
    }

    const captchaOk = await verifyYandexCaptcha(captchaToken || '');
    if (!captchaOk) {
      res.status(400).json({ error: 'Не пройдена проверка капчи' });
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
    sendEmailNotification(lead).then(() => console.log("Email sent OK")).catch((err) =>
      console.error('Email notification failed:', err)
    );

    sendTelegramNotification(lead).then(() => console.log("Telegram sent OK")).catch((err) =>
      console.error('Telegram notification failed:', err)
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
    res.send('\uFEFF' + header + rows);
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
