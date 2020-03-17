// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

var test = require('tape').test;


///--- Globals

var EqualityFilter;
var NotFilter;


///--- Tests

test('load library', function (t) {
  var filters = require('../lib/index');
  t.ok(filters);
  EqualityFilter = filters.EqualityFilter;
  NotFilter = filters.NotFilter;
  t.ok(EqualityFilter);
  t.ok(NotFilter);
  t.end();
});


test('Construct no args', function (t) {
  t.ok(new NotFilter());
  t.end();
});


test('Construct args', function (t) {
  var f = new NotFilter({
    filter: new EqualityFilter({
      attribute: 'foo',
      value: 'bar'
    })
  });
  t.ok(f);
  t.equal(f.toString(), '(!(foo=bar))');
  t.end();
});


test('match true', function (t) {
  var f = new NotFilter({
    filter: new EqualityFilter({
      attribute: 'foo',
      value: 'bar'
    })
  });
  t.ok(f);
  t.ok(f.matches({ foo: 'baz' }));
  t.end();
});


test('match false', function (t) {
  var f = new NotFilter({
    filter: new EqualityFilter({
      attribute: 'foo',
      value: 'bar'
    })
  });
  t.ok(f);
  t.ok(!f.matches({ foo: 'bar' }));
  t.end();
});
