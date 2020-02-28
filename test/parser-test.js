var assert = require('assert');
var config = require('../config');
var parser = require('../lib/parser');

describe('Line format check', function () {
  it('is line format rescpeted', function () {
    assert.deepEqual(parser.checkLine('1462100403;R;105.23;97'.split(';')), []);
    assert.deepEqual(parser.checkLine(''), [config.errorMessages.length]);
    assert.deepEqual(parser.checkLine(null), [config.errorMessages.length]);
    assert.deepEqual(parser.checkLine('String'), [config.errorMessages.length]);
    assert.deepEqual(parser.checkLine(''.split(';')), [config.errorMessages.length]);
    assert.deepEqual(parser.checkLine('1462100403;R;105.23'.split(';')), [config.errorMessages.length]);
  });
});

describe('Line Ref check', function () {
  it('is ref format rescpeted', function () {
    assert.deepEqual(parser.checkLine('1462100403;R;100.1;9'.split(';')), []);
    assert.deepEqual(parser.checkLine('146210;R;100.1;9'.split(';')), [config.errorMessages.ref]);
    assert.deepEqual(parser.checkLine('146210a;R;100.1;9'.split(';')), [config.errorMessages.ref]);
    assert.deepEqual(parser.checkLine(';R;100.1;9'.split(';')), [config.errorMessages.ref]);
  });
});

describe('Line Color check', function () {
  it('is color legit', function () {
    assert.deepEqual(parser.checkLine('1462100403;R;100.1;9'.split(';')), []);
    assert.deepEqual(parser.checkLine('1462100403;A;100.1;9'.split(';')), [config.errorMessages.color]);
    assert.deepEqual(parser.checkLine('1462100403;;100.1;9'.split(';')), [config.errorMessages.color]);
    assert.deepEqual(parser.checkLine('1462100403;#fca000;100.1;9'.split(';')), [config.errorMessages.color]);
    assert.deepEqual(parser.checkLine('1462100403;rgb(1,1,1);100.1;9'.split(';')), [config.errorMessages.color]);
  });
});

describe('Line Price check', function () {
  it('is price legit', function () {
    assert.deepEqual(parser.checkLine('1462100403;R;100.1;9'.split(';')), []);
    assert.deepEqual(parser.checkLine('1462100403;R;100.1a;9'.split(';')), [config.errorMessages.price]);
    assert.deepEqual(parser.checkLine('1462100403;R;z;9'.split(';')), [config.errorMessages.price]);
    assert.deepEqual(parser.checkLine('1462100403;R;;9'.split(';')), [config.errorMessages.price]);
  });
});

describe('Line Size check', function () {
  it('is size legit', function () {
    assert.deepEqual(parser.checkLine('1462100403;R;100.1;9'.split(';')), []);
    assert.deepEqual(parser.checkLine('1462100403;R;100.1;a'.split(';')), [config.errorMessages.size]);
    assert.deepEqual(parser.checkLine('1462100403;R;100.1;9.A'.split(';')), [config.errorMessages.size]);
    assert.deepEqual(parser.checkLine('1462100403;R;76;9.1'.split(';')), [config.errorMessages.size]);
    assert.deepEqual(parser.checkLine('1462100403;G;123;'.split(';')), [config.errorMessages.size]);
  });
});
