'use strict';

const expect = require('chai').expect;
const sinon  = require('sinon');
const Config = require('./Config');

require('chai').use(require('sinon-chai'));

describe('Config', () => {
  describe('get', () => {
    it('should return a simple value', () => {
      expect(config({ a: 1 }).get('a')).to.equal(1);
    });

    it('should return a nested value', () => {
      const cfg = { a: { b: { c: 2 } } };
      expect(config(cfg).get('a.b.c')).to.equal(2);
    });

    it('should process not existed value', () => {
      expect(config().get('a.b.c', 'not found')).to.equal('not found');
    });
  });

  describe('set', () => {
    it('should set normal value', () => {
      expect(config().set('a', 1).all()).to.deep.equal({ a: 1 });
    });

    it('should set hierarchy value', () => {
      expect(config().set('a.b.c', 11).all()).to.deep.equal(
        { a: { b: { c: 11 } } }
      );
    });

    it('should override a scalar value', () => {
      const cfg = config()
        .set('a.b', 1)
        .set('a.b', 2);

      expect(cfg.all()).to.deep.equal({ a: { b: 2 } });
    });

    it('should override a scalar value by nested', () => {
      const cfg = config()
        .set('a.b', 1)
        .set('a.b.c', 2);

      expect(cfg.all()).to.deep.equal({ a: { b: { c: 2 } } });
    });
  });

  describe('has', () => {
    it('should return false if not exists', () => {
      expect(config().has('a')).to.be.false;
    });

    it('should return false if undefined', () => {
      expect(config({ a: undefined }).has('a')).to.be.false;
    });

    it('should return true if exists', () => {
      expect(config({ a: 1 }).has('a')).to.be.true;
    });

    it('should return true if null', () => {
      expect(config({ a: null }).has('a')).to.be.true;
    });

    it('should check a nested values', () => {
      const data = { a: { b: 1 } };
      expect(config(data).has('a')).to.be.true;
      expect(config(data).has('a.b')).to.be.true;
      expect(config(data).has('a.c')).to.be.false;
    });
  });

  describe('delete', () => {
    it('should delete a simple values', () => {
      const cfg = config({ a: 1 });
      cfg.delete('a');
      expect(cfg.all()).to.deep.equal({});
    });

    it('should delete a nested value', () => {
      const cfg = config({ a: 1, b: { c: 2 } });
      cfg.delete('b');
      expect(cfg.all()).to.deep.equal(
        { a: 1 }
      );
    });

    it('should do nothing when deleting not existed value', () => {
      const cfg = config();
      cfg.delete('a');
      expect(cfg.all()).to.deep.equal({});
    });
  });

  describe('observe', () => {
    it('should observe a simple value', () => {
      const callback = sinon.spy();

      config()
        .observe('a', callback)
        .set('a', 1)
        .delete('a');

      expect(callback).to.be.calledTwice;
      expect(callback).to.be.calledWith(undefined, 1, 'a');
      expect(callback).to.be.calledWith(1, undefined, 'a');
    });
  });
});

/**
 * @param {Object} data
 * @returns {Config}
 */
function config(data = {}) {
  const store = {
    read() {
      return this.data || data;
    },

    write(values) {
      this.data = values;
    },
  };

  return new Config(store);
}
