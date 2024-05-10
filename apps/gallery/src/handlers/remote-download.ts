import { Handler } from '../contracts/handler';
import { DomainEvent } from '../domain-event';
import { ImageService } from '../image.service';
import { PrismaService } from '../prisma.service';

type Props = { galleryId: string; imageId: string; remoteUrl: string };

export class RemoteDownload implements Handler<Props> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService,
  ) {}

  async execute({ payload }: DomainEvent<Props>): Promise<void> {
    const pathName = await this.imageService.download(
      payload.galleryId,
      payload.imageId,
      payload.remoteUrl,
    );

    if (pathName) {
      await this.prisma.gallery.update({
        where: { id: payload.galleryId },
        data: {
          Image: {
            update: {
              where: { id: payload.imageId },
              data: {
                pathName,
                isRemote: false,
              },
            },
          },
        },
      });
    }
  }
}
