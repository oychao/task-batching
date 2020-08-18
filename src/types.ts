export type AnyFunction = (...args: Array<any>) => any;

export interface Aspect {
  before: AnyFunction;
  after: AnyFunction;
}
