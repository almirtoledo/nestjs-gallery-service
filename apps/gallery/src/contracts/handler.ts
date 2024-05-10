import { DomainEvent } from '../domain-event';

export interface Handler<T = any> {
  execute(event: DomainEvent<T>): Promise<void>;
}
