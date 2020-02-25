'use strict';

const { describe, expect, it } = require('humile');
const Config = require('../Config');

describe('Config', () => {
  describe('get', () => {
    it('should return a simple value', () => {
      expect(config({ a: 1 }).get('a')).toBe(1);
    });

    it('should return a nested value', () => {
      const cfg = { a: { b: { c: 2 } } };
      expect(config(cfg).get('a.b.c')).toBe(2);
    });

    it('should process not existed value', () => {
      expect(config().get('a.b.c', 'not found')).toBe('not found');
    });
  });

  describe('set', () => {
    it('should set normal value', () => {
      expect(config().set('a', 1).all()).toEqual({ a: 1 });
    });

    it('should set hierarchy value', () => {
      expect(config().set('a.b.c', 11).all()).toEqual(
        { a: { b: { c: 11 } } }
      );
    });

    it('should override a scalar value', () => {
      const cfg = config()
        .set('a.b', 1)
        .set('a.b', 2);

      expect(cfg.all()).toEqual({ a: { b: 2 } });
    });

    it('should override a scalar value by nested', () => {
      const cfg = config()
        .set('a.b', 1)
        .set('a.b.c', 2);

      expect(cfg.all()).toEqual({ a: { b: { c: 2 } } });
    });
  });

  describe('has', () => {
    it('should return false if not exists', () => {
      expect(config().has('a')).toBe(false);
    });

    it('should return false if undefined', () => {
      expect(config({ a: undefined }).has('a')).toBe(false);
    });

    it('should return true if exists', () => {
      expect(config({ a: 1 }).has('a')).toBe(true);
    });

    it('should return true if null', () => {
      expect(config({ a: null }).has('a')).toBe(true);
    });

    it('should check a nested values', () => {
      const data = { a: { b: 1 } };
      expect(config(data).has('a')).toBe(true);
      expect(config(data).has('a.b')).toBe(true);
      expect(config(data).has('a.c')).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a simple values', () => {
      const cfg = config({ a: 1 });
      cfg.delete('a');
      expect(cfg.all()).toEqual({});
    });

    it('should delete a nested value', () => {
      const cfg = config({ a: 1, b: { c: 2 } });
      cfg.delete('b');
      expect(cfg.all()).toEqual(
        { a: 1 }
      );
    });

    it('should delete a nested value 2', () => {
      const cfg = config({ a: { b: 1, c: 2 } });
      cfg.delete('a.b');
      expect(cfg.all()).toEqual(
        { a: { c: 2 } }
      );
    });

    it('should do nothing when deleting not existed value', () => {
      const cfg = config();
      cfg.delete('a');
      expect(cfg.all()).toEqual({});
    });
  });

  describe('observe', () => {
    it('should observe a simple value', () => {
      const calledArgs = [];

      config()
        .observe('a', ((...args) => calledArgs.push(args)))
        .set('a', 1)
        .delete('a');

      expect(calledArgs).toEqual([
        [1, undefined, 'a'],
        [undefined, 1, 'a'],
      ]);
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
