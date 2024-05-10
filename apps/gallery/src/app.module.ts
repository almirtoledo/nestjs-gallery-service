import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { ImageService } from './image.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GALLERY_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gallery-producer',
            brokers: ['localhost:9092'],
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [ImageService, PrismaService],
})
export class AppModule {}
