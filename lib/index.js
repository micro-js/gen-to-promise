/**
 * Modules
 */

var isFunction = require('@micro-js/is-function')
var isPromise = require('@micro-js/is-promise')
var isGeneratorObject = require('@micro-js/is-generator-object')
var slice = require('@micro-js/slice')

/**
 * Expose genToPromise
 */

module.exports = toPromise['default'] = toPromise

/**
 * Generator to promise.
 * @param  {Generator} gen Generator.
 * @return {Promise}
 */

function toPromise (gen) {
  var self = this
  var args = slice(arguments, 1)
  return new Promise(function (resolve, reject) {
    if (isFunction(gen)) {
      gen = gen.apply(self, args)
    }

    if (!isGeneratorObject(gen)) {
      return resolve(gen)
    }

    var onFulfilled = iter('next')
    var onRejected = iter('throw')

    onFulfilled()

    function next (ret) {
      if (ret.done) return resolve(ret.value)
      if (isPromise(ret.value)) {
        ret.value.then(onFulfilled, onRejected)
      } else {
        onFulfilled(ret.value)
      }
    }

    function iter (attr) {
      return function (res) {
        var ret
        try {
          ret = gen[attr](res)
        } catch (e) {
          return reject(e)
        }
        next(ret)
      }
    }
  })
}
