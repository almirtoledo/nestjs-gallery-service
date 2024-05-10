import { Handler } from './contracts/handler';
import { DomainEvent } from './domain-event';

export class Mediator {
  private handlers: Map<string, Handler> = new Map([]);

  register(eventName: string, handler: Handler) {
    this.handlers.set(eventName, handler);
  }

  async handle(eventName: string, event: DomainEvent) {
    const handler = this.handlers.get(eventName);
    if (handler) await handler.execute(event);
  }
}
