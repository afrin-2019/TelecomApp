// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

var test = require('tape').test;


///--- Globals

var SubstringFilter;


///--- Tests

test('load library', function (t) {
  var filters = require('../lib/index');
  t.ok(filters);
  SubstringFilter = filters.SubstringFilter;
  t.ok(SubstringFilter);
  t.end();
});


test('Construct no args', function (t) {
  var f = new SubstringFilter();
  t.ok(f);
  t.ok(!f.attribute);
  t.ok(!f.value);
  t.end();
});


test('Construct args', function (t) {
  var f = new SubstringFilter({
    attribute: 'foo',
    initial: 'bar',
    any: ['zig', 'zag'],
    'final': 'baz'
  });
  t.ok(f);
  t.equal(f.attribute, 'foo');
  t.equal(f.initial, 'bar');
  t.equal(f.any.length, 2);
  t.equal(f.any[0], 'zig');
  t.equal(f.any[1], 'zag');
  t.equal(f.final, 'baz');
  t.equal(f.toString(), '(foo=bar*zig*zag*baz)');
  t.end();
});


test('escape value only in toString()', function (t) {
  var f = new SubstringFilter({
    attribute: 'fo(o',
    initial: 'ba(r)',
    any: ['zi)g', 'z(ag'],
    'final': '(baz)'
  });
  t.ok(f);
  t.equal(f.attribute, 'fo(o');
  t.equal(f.initial, 'ba(r)');
  t.equal(f.any.length, 2);
  t.equal(f.any[0], 'zi)g');
  t.equal(f.any[1], 'z(ag');
  t.equal(f.final, '(baz)');
  t.equal(f.toString(), '(fo\\28o=ba\\28r\\29*zi\\29g*z\\28ag*\\28baz\\29)');
  t.end();
});


test('match true', function (t) {
  var f = new SubstringFilter({
    attribute: 'foo',
    initial: 'bar',
    any: ['zig', 'zag'],
    'final': 'baz'
  });
  t.ok(f);
  t.ok(f.matches({ foo: 'barmoozigbarzagblahbaz' }));
  t.end();
});


test('match false', function (t) {
  var f = new SubstringFilter({
    attribute: 'foo',
    initial: 'bar',
    foo: ['zig', 'zag'],
    'final': 'baz'
  });
  t.ok(f);
  t.ok(!f.matches({ foo: 'bafmoozigbarzagblahbaz' }));
  t.end();
});


test('match any', function (t) {
  var f = new SubstringFilter({
    attribute: 'foo',
    initial: 'bar'
  });
  t.ok(f);
  t.ok(f.matches({ foo: ['beuha', 'barista']}));
  t.end();
});


test('match no-initial', function (t) {
  var f = new SubstringFilter({
    attribute: 'foo',
    any: ['foo']
  });
  t.ok(f);
  t.equal(f.toString(), '(foo=*foo*)');
  t.ok(f.matches({foo: 'foobar'}));
  t.ok(f.matches({foo: 'barfoo'}));
  t.ok(!f.matches({foo: 'bar'}));
  t.end();
});


test('escape for regex in matches', function (t) {
  var f = new SubstringFilter({
    attribute: 'fo(o',
    initial: 'ba(r)',
    any: ['zi)g', 'z(ag'],
    'final': '(baz)'
  });
  t.ok(f);
  t.ok(f.matches({ 'fo(o': ['ba(r)_zi)g-z(ag~(baz)']}));
  t.end();
});
