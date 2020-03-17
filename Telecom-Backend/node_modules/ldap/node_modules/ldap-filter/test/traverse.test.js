// Copyright 2014 Patrick Mooney.  All rights reserved.

var test = require('tape').test;

var filters = require('../lib/index');


test('foreach single', function (t) {
  var f = filters.parse('(foo=bar)');
  var count = 0;
  f.forEach(function (item) {
    t.equal(item.attribute, 'foo');
    t.equal(item.value, 'bar');
    count++;
  });
  t.equal(count, 1);
  t.end();
});


test('foreach not', function (t) {
  var f = filters.parse('(!(foo=bar))');
  var order = [];
  var count = 0;

  f.forEach(function (item) {
    order.push(item.type);
    if (item.type === 'equal') {
      t.equal(item.attribute, 'foo');
      t.equal(item.value, 'bar');
    }
    count++;
  });
  t.equal(count, 2);
  t.deepEqual(order, ['equal', 'not']);
  t.end();
});


test('foreach multiple', function (t) {
  var f = filters.parse('(|(foo=bar)(baz>=bip))');
  var order = [];
  var count = 0;

  f.forEach(function (item) {
    order.push(item.type);
    switch (item.type) {
    case 'equal':
      t.equal(item.attribute, 'foo');
      t.equal(item.value, 'bar');
      break;
    case 'ge':
      t.equal(item.attribute, 'baz');
      t.equal(item.value, 'bip');
      break;
    case 'or':
      t.equal(item.filters.length, 2);
      break;
    default:
      break;
    }
    count++;
  });
  t.equal(count, 3);
  t.deepEqual(order, ['equal', 'ge', 'or']);
  t.end();
});


test('foreach complex', function (t) {
  var f = filters.parse('(|(!(&(foo=bar)(num<=5)))(baz>=bip))');
  var correct = ['equal', 'le', 'and', 'not', 'ge', 'or'];
  var order = [];
  var count = 0;

  f.forEach(function (item) {
    order.push(item.type);
    count++;
  });
  t.deepEqual(order, correct);
  t.equal(count, correct.length);
  t.end();
});


test('map single valid', function (t) {
  var f = filters.parse('(foo=bar)');
  var n = f.map(function (item) {
    item.value = 'new';
    return item;
  });
  t.ok(n);
  t.equal(n.value, 'new');
  t.end();
});


test('map single null', function (t) {
  var f = filters.parse('(foo=bar)');
  var n = f.map(function (item) {
    return null;
  });
  t.equal(n, null);
  t.end();
});


test('map not valid', function (t) {
  var f = filters.parse('(!(foo=bar))');
  f.map(function (item) {
    if (item.attribute) {
      item.value = 'new';
    }
    return item;
  });
  t.equal(f.toString(), '(!(foo=new))');
  t.end();
});


test('map not null', function (t) {
  var f = filters.parse('(!(foo=bar))');
  var n = f.map(function (item) {
    if (item.attribute) {
      return null;
    }
    return item;
  });
  t.equal(n, null);
  t.end();
});


test('map multiple', function (t) {
  var f = filters.parse('(|(foo=1)(bar=2))');
  var n = f.map(function (item) {
    if (item.attribute) {
      item.value = '' + (parseInt(item.value, 10) + 1);
    }
    return item;
  });
  t.equal(n.toString(), '(|(foo=2)(bar=3))');
  t.end();
});


test('map multiple some-null', function (t) {
  var f = filters.parse('(|(foo=1)(bar=2))');
  var n = f.map(function (item) {
    if (item.attribute && item.attribute === 'foo') {
      return null;
    }
    return item;
  });
  t.equal(n.toString(), '(|(bar=2))');
  t.end();
});


test('map multiple all-null', function (t) {
  var f = filters.parse('(|(foo=1)(bar=2))');
  var n = f.map(function (item) {
    if (item.attribute) {
      return null;
    }
    return item;
  });
  t.equal(n, null);
  t.end();
});

test('map complex', function (t) {
  /* JSSTYLED */
  var f = filters.parse('(|(bad=foo)(num>=1)(!(bad=bar))(&(ok=foo)(good=bar)))');
  var n = f.map(function (item) {
    if (item.attribute && item.attribute === 'bad') {
      return null;
    } else if (item.type === 'ge') {
      item.value = '' + (parseInt(item.value, 10) + 1);
    }
    return item;
  });
  t.equal(n.toString(), '(|(num>=2)(&(ok=foo)(good=bar)))');
  t.end();
});
