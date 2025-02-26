export abstract class MockModel<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_crateEntityData: T): void {}

  async findOne(): Promise<T> {
    return this.entityStub;
  }

  async find(): Promise<T[]> {
    return [this.entityStub];
  }

  async create(): Promise<T> {
    return this.entityStub;
  }
}
