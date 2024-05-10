import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { DomainEvent } from './domain-event';
import { RemoteDownload } from './handlers/remote-download';
import { SaveGallery } from './handlers/save-gallery';
import { ImageService } from './image.service';
import { Mediator } from './mediator';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  private mediator = new Mediator();

  constructor(
    @Inject('GALLERY_SERVICE') private kafkaClient: ClientKafka,
    private readonly imageService: ImageService,
    private readonly prisma: PrismaService,
  ) {
    this.mediator.register(
      'save-gallery',
      new SaveGallery(this.prisma, this.kafkaClient),
    );
    this.mediator.register(
      'remote-download',
      new RemoteDownload(this.prisma, this.imageService),
    );
  }

  @MessagePattern('create-gallery')
  async gallery(@Payload() input: any) {
    const event = new DomainEvent(input);
    await this.mediator.handle('save-gallery', event);
  }

  @MessagePattern('remote-download')
  async remoteDownload(@Payload() input: any) {
    const event = new DomainEvent(input);
    await this.mediator.handle('remote-download', event);
  }
}
