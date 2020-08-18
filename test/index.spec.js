import { expect } from 'chai';
import 'mocha-sinon';

import { BatchingTransaction } from '../bin';

describe('your test cases', () => {
  beforeEach(function () {
    this.sinon.stub(console, 'info');
  });

  it('should run correctly', done => {
    const TaskBatching = new BatchingTransaction();
    TaskBatching.perform(() => {
      TaskBatching.pushSideEffect(() => {
        console.info('after 1 1');
      });
      TaskBatching.pushSideEffect(() => {
        console.info('after 1 2');
      });
      console.info('fn 1');

      TaskBatching.perform(() => {
        console.info('fn 2');
        TaskBatching.pushSideEffect(() => {
          console.info('after 2 1');
        });

        TaskBatching.perform(() => {
          TaskBatching.pushSideEffect(() => {
            console.info('after 3 1');
          });
          console.info('fn 3');
        });
      });
    });
    // expect(console.info.calledThrice).to.be.true;
    expect(console.info.calledWith('fn 1')).to.be.true;
    expect(console.info.calledWith('fn 2')).to.be.true;
    expect(console.info.calledWith('fn 3')).to.be.true;
    expect(console.info.calledWith('after 1 1')).to.be.true;
    expect(console.info.calledWith('after 1 2')).to.be.true;
    expect(console.info.calledWith('after 2 1')).to.be.true;
    expect(console.info.calledWith('after 3 1')).to.be.true;
    done();
  });
});
