export type AnyFunction = (...args: Array<any>) => any;

export type AnyAsyncFunction = (...args: Array<any>) => any;

export interface Aspect<T extends AnyFunction = AnyFunction> {
  before: T;
  after: T;
}
