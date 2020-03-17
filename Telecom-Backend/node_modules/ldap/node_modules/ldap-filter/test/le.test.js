// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

var test = require('tape').test;


///--- Globals

var LessThanEqualsFilter;


///--- Tests

test('load library', function (t) {
  var filters = require('../lib/index');
  t.ok(filters);
  LessThanEqualsFilter = filters.LessThanEqualsFilter;
  t.ok(LessThanEqualsFilter);
  t.end();
});


test('Construct no args', function (t) {
  var f = new LessThanEqualsFilter();
  t.ok(f);
  t.ok(!f.attribute);
  t.ok(!f.value);
  t.end();
});


test('Construct args', function (t) {
  var f = new LessThanEqualsFilter({
    attribute: 'foo',
    value: 'bar'
  });
  t.ok(f);
  t.equal(f.attribute, 'foo');
  t.equal(f.value, 'bar');
  t.equal(f.toString(), '(foo<=bar)');
  t.end();
});


test('escape value only in toString()', function (t) {
  var f = new LessThanEqualsFilter({
    attribute: 'foo',
    value: 'ba(r)'
  });
  t.ok(f);
  t.equal(f.attribute, 'foo');
  t.equal(f.value, 'ba(r)');
  t.equal(f.toString(), '(foo<=ba\\28r\\29)');
  t.end();
});


test('match true', function (t) {
  var f = new LessThanEqualsFilter({
    attribute: 'foo',
    value: 'bar'
  });
  t.ok(f);
  t.ok(f.matches({ foo: 'abc' }));
  t.end();
});


test('match multiple', function (t) {
  var f = new LessThanEqualsFilter({
    attribute: 'foo',
    value: 'bar'
  });
  t.ok(f);
  t.ok(f.matches({ foo: ['abc', 'beuha'] }));
  t.end();
});


test('match false', function (t) {
  var f = new LessThanEqualsFilter({
    attribute: 'foo',
    value: 'bar'
  });
  t.ok(f);
  t.ok(!f.matches({ foo: 'baz' }));
  t.end();
});
