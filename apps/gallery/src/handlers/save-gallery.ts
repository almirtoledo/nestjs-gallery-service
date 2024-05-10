import { ClientKafka } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { lastValueFrom } from 'rxjs';
import { Handler } from '../contracts/handler';
import { DomainEvent } from '../domain-event';
import { PrismaService } from '../prisma.service';

export class SaveGallery
  implements Handler<{ listingId: string; images: string[] }>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaClient: ClientKafka,
  ) {}

  async execute({
    payload,
  }: DomainEvent<{ listingId: string; images: string[] }>): Promise<void> {
    const { id: galleryId, Image: images } = await this.prisma.gallery.create({
      data: {
        id: randomUUID(),
        listingId: payload.listingId,
        createdAt: new Date(),
        updatedAt: new Date(),
        Image: {
          createMany: {
            data: payload.images.map((remoteUrl, i) => {
              return { id: randomUUID(), isRemote: true, order: i, remoteUrl };
            }),
          },
        },
      },
      include: { Image: true },
    });

    for await (const image of images) {
      if (image.isRemote) {
        const payload = {
          galleryId,
          imageId: image.id,
          remoteUrl: image.remoteUrl,
        };
        await lastValueFrom(
          this.kafkaClient.emit('remote-download', JSON.stringify(payload)),
        );
      }
      continue;
    }
  }
}
