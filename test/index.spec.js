import { expect } from 'chai';
import 'mocha-sinon';

import { BatchingTransaction } from '../bin';

const sleep = async (time = 1e3) => new Promise(res => setTimeout(res, time));

describe('task-batching test cases', () => {
  beforeEach(function () {
    this.sinon.stub(console, 'info');
  });

  it('basic functionality', done => {
    const result = [];

    const TaskBatching = new BatchingTransaction();
    TaskBatching.batching(() => {
      TaskBatching.pushSideEffect(() => {
        result.push('after 1 1');
      });
      TaskBatching.pushSideEffect(() => {
        result.push('after 1 2');
      });
      result.push('fn 1');

      TaskBatching.batching(() => {
        result.push('fn 2');
        TaskBatching.pushSideEffect(() => {
          result.push('after 2 1');
        });

        TaskBatching.batching(() => {
          TaskBatching.pushSideEffect(() => {
            result.push('after 3 1');
          });
          result.push('fn 3');
        });
      });
    });

    // expect(console.info.calledThrice).to.be.true;
    // expect(console.info.calledWith('fn 1')).to.be.true;
    expect(result.length).to.equal(7);
    expect(result[0]).to.equal('fn 1');
    expect(result[1]).to.equal('fn 2');
    expect(result[2]).to.equal('fn 3');
    expect(result[3]).to.equal('after 1 1');
    expect(result[4]).to.equal('after 1 2');
    expect(result[5]).to.equal('after 2 1');
    expect(result[6]).to.equal('after 3 1');
    done();
  });

  it('async scene', done => {
    (async function () {
      const result = [];

      const TaskBatching = new BatchingTransaction();
      await TaskBatching.batchingAsync(async () => {
        TaskBatching.pushSideEffect(async () => {
          result.push('after 1 1');
        });
        TaskBatching.pushSideEffect(async () => {
          result.push('after 1 2');
        });
        result.push('fn 1');

        TaskBatching.batchingAsync(async () => {
          result.push('fn 2');
          TaskBatching.pushSideEffect(async () => {
            result.push('after 2 1');
          });

          TaskBatching.batchingAsync(async () => {
            TaskBatching.pushSideEffect(async () => {
              result.push('after 3 1');
            });
            result.push('fn 3');
          });
        });
      });

      expect(result.length).to.equal(7);
      expect(result[0]).to.equal('fn 1');
      expect(result[1]).to.equal('fn 2');
      expect(result[2]).to.equal('fn 3');
      expect(result[3]).to.equal('after 1 1');
      expect(result[4]).to.equal('after 1 2');
      expect(result[5]).to.equal('after 2 1');
      expect(result[6]).to.equal('after 3 1');
      done();
    })()
  });
});
