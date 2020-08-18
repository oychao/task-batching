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

  public before(): void {}

  public after(): void {
    for (const effect of this.sideEffects) {
      effect();
    }
    this.sideEffects = [];
  }
}

export class BatchingTransaction extends Transaction {
  private batchingAspect: BatchingAspect;

  constructor() {
    super();
    this.batchingAspect = new BatchingAspect();
    this.install(this.batchingAspect);
  }

  public pushSideEffect(sideEffect: AnyFunction): void {
    this.batchingAspect.pushSideEffect(sideEffect);
  }

  public batching<T extends AnyFunction>(fn: T, scope: unknown, ...args: Array<unknown>): void {
    const { performing } = this;
    this.performing = true;
    if (performing) {
      return fn.apply(scope, args);
    } else {
      this.perform(fn, scope, ...args);
    }
  }
}
