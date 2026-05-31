import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

const uploadsDir = process.env.UPLOADS_DIR || './uploads';
const thumbsDir = path.join(uploadsDir, 'thumbs');

// Ensure directories exist
[uploadsDir, thumbsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (_req: Express.Request, _file: Express.Multer.File, cb: (err: Error | null, dest: string) => void) => cb(null, uploadsDir),
  filename: (_req: Express.Request, file: Express.Multer.File, cb: (err: Error | null, name: string) => void) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_');
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// POST /upload — upload file
router.post('/upload', requireAuth, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const file = req.file;
    const fileUrl = `/uploads/${file.filename}`;
    let thumbUrl: string | null = null;
    let width: number | null = null;
    let height: number | null = null;

    // Generate webp thumbnail for images
    if (file.mimetype.startsWith('image/')) {
      const thumbName = `${path.basename(file.filename, path.extname(file.filename))}.webp`;
      const thumbPath = path.join(thumbsDir, thumbName);

      const meta = await sharp(file.path)
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(thumbPath);

      thumbUrl = `/uploads/thumbs/${thumbName}`;

      // Get original dimensions
      const origMeta = await sharp(file.path).metadata();
      width = origMeta.width || null;
      height = origMeta.height || null;
    }

    const media = await prisma.media.create({
      data: {
        filename: file.filename,
        url: fileUrl,
        thumbUrl,
        mimeType: file.mimetype,
        size: file.size,
        width,
        height,
      },
    });

    res.status(201).json({
      id: media.id,
      url: media.url,
      thumbUrl: media.thumbUrl,
      filename: media.filename,
      mimeType: media.mimeType,
      width: media.width,
      height: media.height,
      size: media.size,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET / — list media (requireAuth)
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '50' } = req.query;
    const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
    const [total, items] = await Promise.all([
      prisma.media.count(),
      prisma.media.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string, 10),
      }),
    ]);
    res.json({ total, items });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /:id — delete (requireAuth)
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    // Delete files from disk
    const filePath = path.join(uploadsDir, media.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (media.thumbUrl) {
      const thumbName = path.basename(media.thumbUrl);
      const thumbPath = path.join(thumbsDir, thumbName);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }

    await prisma.media.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
