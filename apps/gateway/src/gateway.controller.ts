import { Controller, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Timeout } from '@nestjs/schedule';
import { exec } from 'node:child_process';
import { lastValueFrom } from 'rxjs';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('GATEWAY_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  @Timeout(1000)
  async execute() {
    const promises = [];

    for (let i = 0; i < 60000; i++) {
      const payload = JSON.stringify(this.gatewayService.execute());
      promises.push(
        lastValueFrom(this.kafkaClient.emit('create-gallery', payload)),
      );
    }

    await Promise.all(promises);

    for (let i = 0; i < 60000; i++) {
      process.stdout.write(`Mensagem ${i + 1} enviada.\r`);
    }

    await this.sleep();
    await this.clearTerminal();
  }

  private async clearTerminal() {
    if (process.platform === 'win32') {
      exec('cls');
    } else {
      exec('clear');
    }
  }

  private async sleep() {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }
}
