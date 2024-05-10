export class DomainEvent<T = any> {
  constructor(readonly payload: T) {}
}
