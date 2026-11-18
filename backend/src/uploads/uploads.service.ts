import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

@Injectable()
export class UploadsService {
  private root() {
    return path.resolve(process.env.STORAGE_DIR ?? './storage');
  }

  async save(
    file: Express.Multer.File,
    kind: 'photo' | 'audio',
  ): Promise<{ key: string }> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Empty file');
    }

    const maxBytes = kind === 'photo' ? 8 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new BadRequestException('File too large');
    }

    const allowedPhoto = new Set([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ]);
    const allowedAudio = new Set([
      'audio/mpeg',
      'audio/mp4',
      'audio/wav',
      'audio/webm',
      'audio/ogg',
      'audio/x-m4a',
    ]);
    const allowed = kind === 'photo' ? allowedPhoto : allowedAudio;
    if (file.mimetype && !allowed.has(file.mimetype)) {
      throw new BadRequestException(`Unsupported ${kind} type: ${file.mimetype}`);
    }

    const ext =
      path.extname(file.originalname || '').toLowerCase() ||
      (kind === 'photo' ? '.jpg' : '.webm');
    const key = `${kind}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}${ext}`;
    const full = path.join(this.root(), key);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, file.buffer);
    return { key };
  }
}
