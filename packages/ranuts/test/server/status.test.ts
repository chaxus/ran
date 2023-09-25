import http from 'node:http';
import assert from 'node:assert';
import { describe, it } from 'vitest';
import status, { getStatus } from '@/server/status';

describe('status', function () {
  describe('arguments', function () {
    describe('code', function () {
      it('should be required', function () {
        assert.throws(getStatus, /code must be/);
      });

      it('should accept a number', function () {
        assert.strictEqual(getStatus(200), 'OK');
      });

      it('should accept a string', function () {
        assert.strictEqual(getStatus('OK'), 200);
      });

      it('should accept a string number', function () {
        assert.strictEqual(getStatus('200'), 'OK');
      });

      // it('should reject an object', function () {
      //   assert.throws(getStatus.bind(null, {}), /code must be/)
      // })
    });
  });

  describe('when given a number', function () {
    it('should return message when a valid status code', function () {
      assert.strictEqual(getStatus(200), 'OK');
      assert.strictEqual(getStatus(404), 'Not Found');
      assert.strictEqual(getStatus(500), 'Internal Server Error');
    });

    it('should throw for invalid status code', function () {
      assert.throws(getStatus.bind(null, 0), /invalid status code/);
      assert.throws(getStatus.bind(null, 1000), /invalid status code/);
    });

    it('should throw for unknown status code', function () {
      assert.throws(
        getStatus.bind(null, 299),
        '[Error: invalid status message: "299"]',
      );
      assert.throws(getStatus.bind(null, 310), /invalid status code/);
    });

    it('should throw for discontinued status code', function () {
      assert.throws(getStatus.bind(null, 306), /invalid status code/);
    });
  });

  describe('when given a string', function () {
    it('should return message when a valid status code', function () {
      assert.strictEqual(getStatus('200'), 'OK');
      assert.strictEqual(getStatus('404'), 'Not Found');
      assert.strictEqual(getStatus('500'), 'Internal Server Error');
    });

    it('should be truthy when a valid status message', function () {
      assert.ok(getStatus('OK'));
      assert.ok(getStatus('Not Found'));
      assert.ok(getStatus('Internal Server Error'));
    });

    it('should be case insensitive', function () {
      assert.ok(getStatus('Ok'));
      assert.ok(getStatus('not found'));
      assert.ok(getStatus('INTERNAL SERVER ERROR'));
    });

    it('should throw for unknown status message', function () {
      assert.throws(
        getStatus.bind(null, 'too many bugs'),
        /invalid status message/,
      );
      assert.throws(
        getStatus.bind(null, 'constructor'),
        /invalid status message/,
      );
      assert.throws(
        getStatus.bind(null, '__proto__'),
        /invalid status message/,
      );
    });

    it('should throw for unknown status code', function () {
      assert.throws(
        getStatus.bind(null, '299'),
        '[Error: invalid status message: "299"]',
      );
    });
  });

  describe('.codes', function () {
    it('should include codes from Node.js', function () {
      Object.keys(http.STATUS_CODES).forEach(function forEachCode(code) {
        assert.notStrictEqual(
          status.codes.indexOf(Number(code)),
          -1,
          'contains ' + code,
        );
      });
    });
  });

  describe('.empty', function () {
    it('should be an object', function () {
      assert.ok(status.empty);
      assert.strictEqual(typeof status.empty, 'object');
    });

    it('should include 204', function () {
      assert(status.empty[204]);
    });
  });

  describe('.message', function () {
    it('should be a map of code to message', function () {
      assert.strictEqual(status.message.get(200), 'OK');
    });

    it('should include codes from Node.js', function () {
      Object.keys(http.STATUS_CODES).forEach(function forEachCode(code) {
        assert.ok(status.message.get(Number(code)), 'contains ' + code);
      });
    });
  });

  describe('.redirect', function () {
    it('should be an object', function () {
      assert.ok(status.redirect);
      assert.strictEqual(typeof status.redirect, 'object');
    });

    it('should include 308', function () {
      assert(status.redirect[308]);
    });
  });

  describe('.retry', function () {
    it('should be an object', function () {
      assert.ok(status.retry);
      assert.strictEqual(typeof status.retry, 'object');
    });

    it('should include 504', function () {
      assert(status.retry[504]);
    });
  });
});
