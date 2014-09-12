"use strict"

var test = require('tape')
var around = require('../')

test('around can control calling', function(t) {
  t.plan(3)
  var context = {}
  var newContext = {}
  var result = around(function(a) {
    t.equal(a, 6)
    t.equal(this, newContext)
    return a * 2
  }, function(f) {
    return f.call(newContext, f.args.reduce(function(a, b) {
      return a + b
    }))
  }).call(context, 1,2,3)
  t.equal(result, 12)
})

test('fn.call executes fn as-is', function(t) {
  t.plan(1)
  var fn = around(function(a, b, c) {
    return [a,b,c]
  }, function(f) {
    return f.call()
  })

  t.deepEqual(fn(1,2,3), [1,2,3])
})

test('multiple arounds can pass values to each other', function(t) {
  t.plan(1)
  function doubleFn(a) {
    return a * 2
  }
  var fn = around(doubleFn, function(f) {
    return f.call(this, f.args.reduce(function(a, b) {return a + b}))
  })
  fn = around(fn, function(f) {
    return f.apply(this, f.args.map(function(a) {return a * 10}))
  })


  t.equal(fn(1,2,3), 120)
})
