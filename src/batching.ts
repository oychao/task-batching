import { Aspect, AnyFunction } from './types';
import { Transaction } from './transaction';

export class BatchingAspect implements Aspect {
  private sideEffects: Array<AnyFunction>;

  constructor() {
    this.sideEffects = [];
    this.before = this.before.bind(this);
    this.after = this.after.bind(this);
  }

  public pushSideEffect(sideEffect: AnyFunction): void {
    this.sideEffects.push(sideEffect);
  }

  public async before(): Promise<void> {}

  public async after(): Promise<void> {
    for (const effect of this.sideEffects) {
      effect();
    }
    this.sideEffects = [];
  }
}

export class BatchingTransaction<
  T extends AnyFunction = AnyFunction
> extends Transaction<T> {
  private batchingAspect: BatchingAspect;

  constructor() {
    super();
    this.batchingAspect = new BatchingAspect();
    this.install(this.batchingAspect);
  }

  public pushSideEffect(sideEffect: AnyFunction): void {
    this.batchingAspect.pushSideEffect(sideEffect);
  }

  public batching(fn: T, scope: unknown, ...args: Array<unknown>): void {
    const { performing } = this;
    this.performing = true;
    if (performing) {
      return fn.apply(scope, args);
    } else {
      this.perform(fn, scope, ...args);
    }
  }

  public async batchingAsync(
    fn: T,
    scope: unknown,
    ...args: Array<unknown>
  ): Promise<void> {
    const { performing } = this;
    this.performing = true;
    if (performing) {
      return await fn.apply(scope, args);
    } else {
      await this.performAsync(fn, scope, ...args);
    }
  }
}
