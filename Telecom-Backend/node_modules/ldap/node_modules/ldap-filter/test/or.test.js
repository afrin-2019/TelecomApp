// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

var test = require('tape').test;


///--- Globals

var EqualityFilter;
var OrFilter;


///--- Tests

test('load library', function (t) {
  var filters = require('../lib/index');
  t.ok(filters);
  EqualityFilter = filters.EqualityFilter;
  OrFilter = filters.OrFilter;
  t.ok(EqualityFilter);
  t.ok(OrFilter);
  t.end();
});


test('Construct no args', function (t) {
  t.ok(new OrFilter());
  t.end();
});


test('Construct args', function (t) {
  var f = new OrFilter({
    filters: [
      new EqualityFilter({attribute: 'foo', value: 'bar'}),
      new EqualityFilter({attribute: 'zig', value: 'zag'})
    ]
  });
  t.ok(f);
  t.equal(f.toString(), '(|(foo=bar)(zig=zag))');
  t.end();
});


test('match true', function (t) {
  var f = new OrFilter();
  f.addFilter(new EqualityFilter({
    attribute: 'foo',
    value: 'bar'
  }));
  f.addFilter(new EqualityFilter({
    attribute: 'zig',
    value: 'zag'
  }));
  t.ok(f);
  t.ok(f.matches({ foo: 'bar', zig: 'zonk' }));
  t.end();
});


test('match false', function (t) {
  var f = new OrFilter();
  f.addFilter(new EqualityFilter({
    attribute: 'foo',
    value: 'bar'
  }));
  f.addFilter(new EqualityFilter({
    attribute: 'zig',
    value: 'zag'
  }));
  t.ok(f);
  t.ok(!f.matches({ foo: 'baz', zig: 'zonk' }));
  t.end();
});

test('RFC-4526 - empty OR', function (t) {
  var f = new OrFilter();
  t.notOk(f.matches({}));
  t.end();
});
