// Copyright 2014 Mark Cavage, Inc.  All rights reserved.
// Copyright 2014 Patrick Mooney.  All rights reserved.

var test = require('tape').test;


///--- Globals

var ExtensibleFilter;
var parse;


///--- Tests

test('load library', function (t) {
  var lib = require('../lib/index');
  t.ok(lib);
  ExtensibleFilter = lib.ExtensibleFilter;
  parse = lib.parse;
  t.end();
});


test('Construct no args', function (t) {
  var f = new ExtensibleFilter();
  t.ok(f);
  t.end();
});


test('Construct args', function (t) {
  var f = new ExtensibleFilter({
    matchType: 'foo',
    value: 'bar'
  });
  t.ok(f);
  t.equal(f.matchType, 'foo');
  t.equal(f.value, 'bar');
  t.equal(f.toString(), '(foo:=bar)');
  f = new ExtensibleFilter({
    matchType: 'foo',
    rule: '1.2',
    dnAttributes: true,
    value: 'baz'
  });
  t.equal(f.toString(), '(foo:dn:1.2:=baz)');
  f = new ExtensibleFilter({
    attribute: 'test',
    value: 'bar'
  });
  t.equal(f.matchType, 'test');
  t.end();
});


test('attribute synonym', function (t) {
  var f = parse('foo:=bar');
  t.equal(f.matchType, 'foo');
  t.equal(f.attribute, 'foo');
  f.attribute = 'baz';
  t.equal(f.matchType, 'baz');
  t.equal(f.attribute, 'baz');
  t.end();
});


test('parse RFC example 1', function (t) {
  var f = parse('(cn:caseExactMatch:=Fred Flintstone)');
  t.ok(f);
  t.equal(f.type, 'ext');
  t.equal(f.matchType, 'cn');
  t.equal(f.matchingRule, 'caseExactMatch');
  t.equal(f.matchValue, 'Fred Flintstone');
  t.notOk(f.dnAttributes);
  t.end();
});


test('parse RFC example 2', function (t) {
  var f = parse('(cn:=Betty Rubble)');
  t.ok(f);
  t.equal(f.matchType, 'cn');
  t.equal(f.matchValue, 'Betty Rubble');
  t.notOk(f.dnAttributes);
  t.notOk(f.matchingRule);
  t.end();
});


test('parse RFC example 3', function (t) {
  var f = parse('(sn:dn:2.4.6.8.10:=Barney Rubble)');
  t.ok(f);
  t.equal(f.matchType, 'sn');
  t.equal(f.matchingRule, '2.4.6.8.10');
  t.equal(f.matchValue, 'Barney Rubble');
  t.ok(f.dnAttributes);
  t.end();
});


test('parse RFC example 3', function (t) {
  var f = parse('(o:dn:=Ace Industry)');
  t.ok(f);
  t.equal(f.matchType, 'o');
  t.notOk(f.matchingRule);
  t.equal(f.matchValue, 'Ace Industry');
  t.ok(f.dnAttributes);
  t.end();
});


test('parse RFC example 4', function (t) {
  var f = parse('(:1.2.3:=Wilma Flintstone)');
  t.ok(f);
  t.notOk(f.matchType);
  t.equal(f.matchingRule, '1.2.3');
  t.equal(f.matchValue, 'Wilma Flintstone');
  t.notOk(f.dnAttributes);
  t.end();
});


test('parse RFC example 5', function (t) {
  var f = parse('(:DN:2.4.6.8.10:=Dino)');
  t.ok(f);
  t.notOk(f.matchType);
  t.equal(f.matchingRule, '2.4.6.8.10');
  t.equal(f.matchValue, 'Dino');
  t.ok(f.dnAttributes);
  t.end();
});


test('matches throws', function (t) {
  t.plan(1);
  var f = new ExtensibleFilter();
  try {
    f.matches({});
  } catch (err) {
    t.ok(err);
  }
});
