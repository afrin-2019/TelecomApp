// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

var test = require('tape').test;


///--- Globals

var PresenceFilter;


///--- Tests

test('load library', function (t) {
  var filters = require('../lib/index');
  t.ok(filters);
  PresenceFilter = filters.PresenceFilter;
  t.ok(PresenceFilter);
  t.end();
});


test('Construct no args', function (t) {
  var f = new PresenceFilter();
  t.ok(f);
  t.ok(!f.attribute);
  t.end();
});


test('Construct args', function (t) {
  var f = new PresenceFilter({
    attribute: 'foo'
  });
  t.ok(f);
  t.equal(f.attribute, 'foo');
  t.equal(f.toString(), '(foo=*)');
  t.end();
});


test('escape value only in toString()', function (t) {
  var f = new PresenceFilter({
    attribute: 'fo)o'
  });
  t.ok(f);
  t.equal(f.attribute, 'fo)o');
  t.equal(f.toString(), '(fo\\29o=*)');
  t.end();
});


test('match true', function (t) {
  var f = new PresenceFilter({
    attribute: 'foo'
  });
  t.ok(f);
  t.ok(f.matches({ foo: 'bar' }));
  t.end();
});


test('match false', function (t) {
  var f = new PresenceFilter({
    attribute: 'foo'
  });
  t.ok(f);
  t.ok(!f.matches({ bar: 'foo' }));
  t.end();
});
