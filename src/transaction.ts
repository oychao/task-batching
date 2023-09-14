import { AnyFunction, Aspect, AnyAsyncFunction } from './types';

export abstract class Transaction<T extends AnyFunction = AnyFunction> {
  private aspects: Array<Aspect>;

  private beforeAll: T;

  private afterAll: T;

  protected performing: boolean;

  constructor() {
    this.performing = false;
    this.aspects = [];
    this.beforeAll = function () {} as T;
    this.afterAll = function () {} as T;
  }

  public install(aspect: Aspect): void {
    this.aspects.push(aspect);
  }

  public purge(): void {
    this.aspects = [];
  }

  public setBeforeAll(beforeAll: T): void {
    this.beforeAll = beforeAll;
  }

  public setAfterAll(afterAll: T): void {
    this.afterAll = afterAll;
  }

  public perform(fn: T, scope: unknown, ...args: Array<unknown>) {
    if (this.performing) {
      fn.apply(scope, args);
    }

    this.performing = true;
    this.beforeAll();
    for (const aspect of this.aspects) {
      aspect.before();
    }
    fn.apply(scope, args);
    for (const aspect of this.aspects) {
      aspect.after();
    }
    this.afterAll();
    this.performing = false;
  }

  public async performAsync<T extends AnyAsyncFunction>(
    fn: T,
    scope: unknown,
    ...args: Array<unknown>
  ) {
    if (this.performing) {
      await fn.apply(scope, args);
    }

    this.performing = true;
    this.beforeAll();
    for (const aspect of this.aspects) {
      await aspect.before();
    }
    await fn.apply(scope, args);
    for (const aspect of this.aspects) {
      await aspect.after();
    }
    await this.afterAll();
    this.performing = false;
  }
}
