import { AnyFunction, Aspect } from './types';

export abstract class Transaction {
  private aspects: Array<Aspect>;

  private beforeAll: AnyFunction;

  private afterAll: AnyFunction;

  protected performing: boolean;

  constructor() {
    this.performing = false;
    this.aspects = [];
    this.beforeAll = function () {};
    this.afterAll = function () {};
  }

  public install(aspect: Aspect): void {
    this.aspects.push(aspect);
  }

  public purge(): void {
    this.aspects = [];
  }

  public setBeforeAll(beforeAll: AnyFunction): void {
    this.beforeAll = beforeAll;
  }

  public setAfterAll(afterAll: AnyFunction): void {
    this.afterAll = afterAll;
  }

  public perform<T extends AnyFunction>(fn: T, scope: unknown, ...args: Array<unknown>) {
    this.performing = true;
    this.beforeAll();
    const befores = this.aspects.map(({ before }) => before);
    const afters = this.aspects.map(({ after }) => after);
    for (const before of befores) {
      before();
    }
    fn.apply(scope, args);
    for (const after of afters) {
      after();
    }
    this.afterAll();
    this.performing = false;
  }
}
