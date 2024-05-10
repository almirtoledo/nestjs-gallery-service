import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class GatewayService {
  execute() {
    const listingId = randomUUID();
    const images: string[] = [];
    for (let i = 0; i < 30; i++) {
      images.push('https://placedog.net/800x800?random');
    }
    return { listingId, images };
  }
}
