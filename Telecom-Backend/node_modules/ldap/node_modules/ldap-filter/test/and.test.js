// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

var test = require('tape').test;


///--- Globals

var EqualityFilter;
var AndFilter;


///--- Tests

test('load library', function (t) {
  var filters = require('../lib/index');
  EqualityFilter = filters.EqualityFilter;
  AndFilter = filters.AndFilter;
  t.ok(EqualityFilter);
  t.ok(AndFilter);
  t.end();
});


test('Construct no args', function (t) {
  t.ok(new AndFilter());
  t.end();
});


test('Construct args', function (t) {
  var f = new AndFilter({
    filters: [
      new EqualityFilter({attribute: 'foo', value: 'bar'}),
      new EqualityFilter({attribute: 'zig', value: 'zag'})
    ]
  });
  t.ok(f);
  t.equal(f.toString(), '(&(foo=bar)(zig=zag))');
  t.end();
});


test('match true', function (t) {
  var f = new AndFilter();
  f.addFilter(new EqualityFilter({
    attribute: 'foo',
    value: 'bar'
  }));
  f.addFilter(new EqualityFilter({
    attribute: 'zig',
    value: 'zag'
  }));
  t.ok(f);
  t.ok(f.matches({ foo: 'bar', zig: 'zag' }));
  t.end();
});


test('match false', function (t) {
  var f = new AndFilter();
  f.addFilter(new EqualityFilter({
    attribute: 'foo',
    value: 'bar'
  }));
  f.addFilter(new EqualityFilter({
    attribute: 'zig',
    value: 'zag'
  }));
  t.ok(f);
  t.ok(!f.matches({ foo: 'bar', zig: 'zonk' }));
  t.end();
});


test('RFC-4526 - empty AND', function (t) {
  var f = new AndFilter();
  t.ok(f.matches({}));
  t.end();
});
