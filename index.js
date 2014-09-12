"use strict"

var slice = require('sliced')

module.exports = aroundQueue

function aroundQueue(originalFn, aroundFn) {
  if (originalFn.__aroundFns) {
    originalFn.__aroundFns.push(aroundFn)
    return originalFn
  }

  around.__aroundFns = around.__aroundFns || []
  around.__aroundFns.push(aroundFn)

  function around() {
    var fns = around.__aroundFns.slice().reverse()
    var context = this
    var args = slice(arguments)

    function step(context, fn, args) {
      function f() {
        var next = fns.pop()
        if (!arguments.length) return step(context, next, args)
        return step(this, next, slice(arguments))
      }
      if (!fn) return originalFn.apply(context, args)
      f.args = args
      return fn.call(context, f)
    }
    return step(context, fns.pop(), args)
  }
  return around
}
