import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  async download(
    galleryId: string,
    imageId: string,
    url: string,
  ): Promise<string | null> {
    try {
      const res = await fetch(url);
      const data = await res.arrayBuffer();

      const optimizedImageBuffer = await sharp(data)
        .webp({ quality: 50 })
        .toBuffer();

      const storagePath = join(cwd(), 'storage', galleryId);

      if (!existsSync(storagePath)) {
        mkdirSync(storagePath, { recursive: true });
      }

      const imagePath = join(storagePath, `${imageId}.webp`);

      writeFileSync(imagePath, optimizedImageBuffer);
      return `${galleryId}/${imageId}.webp`;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao baixar e processar a imagem:', error.message);
      }
      return null;
    }
  }
}
