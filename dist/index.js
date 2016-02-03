/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*
	Copyright 2016 SASAKI, Shunsuke. All rights reserved.

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	  http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
	*/

	"use strict"

	// const assert = require('power-assert')
	window.Rx = __webpack_require__(1)
	window.wx = __webpack_require__(4)

	__webpack_require__(5)
	__webpack_require__(9)
	__webpack_require__(14)

	const conf = __webpack_require__(22)
	console.dir(conf)

	wx.app.component('navi', {
		viewModel: __webpack_require__(23),
		template: __webpack_require__(24)
	})

	class MainViewModel {
		constructor() {
			this.title = wx.property("")
			this.panes = wx.list()
			this.panes.push({name: 'navi', klass: 'pane-sm'})
		}
	}

	wx.app.defaultExceptionHandler = new Rx.Subject()
	wx.app.defaultExceptionHandler.subscribe((err) => {
		console.error(err)
	})

	let mainViewModel = new MainViewModel()

	wx.applyBindings(mainViewModel)



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global, process) {// Copyright (c) Microsoft, All rights reserved. See License.txt in the project root for license information.

	;(function (undefined) {

	  var objectTypes = {
	    'function': true,
	    'object': true
	  };

	  function checkGlobal(value) {
	    return (value && value.Object === Object) ? value : null;
	  }

	  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;
	  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;
	  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global === 'object' && global);
	  var freeSelf = checkGlobal(objectTypes[typeof self] && self);
	  var freeWindow = checkGlobal(objectTypes[typeof window] && window);
	  var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : null;
	  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
	  var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();

	  var Rx = {
	    internals: {},
	    config: {
	      Promise: root.Promise
	    },
	    helpers: { }
	  };

	  // Defaults
	  var noop = Rx.helpers.noop = function () { },
	    identity = Rx.helpers.identity = function (x) { return x; },
	    defaultNow = Rx.helpers.defaultNow = Date.now,
	    defaultComparer = Rx.helpers.defaultComparer = function (x, y) { return isEqual(x, y); },
	    defaultSubComparer = Rx.helpers.defaultSubComparer = function (x, y) { return x > y ? 1 : (x < y ? -1 : 0); },
	    defaultKeySerializer = Rx.helpers.defaultKeySerializer = function (x) { return x.toString(); },
	    defaultError = Rx.helpers.defaultError = function (err) { throw err; },
	    isPromise = Rx.helpers.isPromise = function (p) { return !!p && typeof p.subscribe !== 'function' && typeof p.then === 'function'; },
	    isFunction = Rx.helpers.isFunction = (function () {

	      var isFn = function (value) {
	        return typeof value == 'function' || false;
	      };

	      // fallback for older versions of Chrome and Safari
	      if (isFn(/x/)) {
	        isFn = function(value) {
	          return typeof value == 'function' && toString.call(value) == '[object Function]';
	        };
	      }

	      return isFn;
	    }());

	  function cloneArray(arr) { for(var a = [], i = 0, len = arr.length; i < len; i++) { a.push(arr[i]); } return a;}

	  var errorObj = {e: {}};
	  
	  function tryCatcherGen(tryCatchTarget) {
	    return function tryCatcher() {
	      try {
	        return tryCatchTarget.apply(this, arguments);
	      } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	      }
	    };
	  }

	  var tryCatch = Rx.internals.tryCatch = function tryCatch(fn) {
	    if (!isFunction(fn)) { throw new TypeError('fn must be a function'); }
	    return tryCatcherGen(fn);
	  };

	  function thrower(e) {
	    throw e;
	  }

	  Rx.config.longStackSupport = false;
	  var hasStacks = false, stacks = tryCatch(function () { throw new Error(); })();
	  hasStacks = !!stacks.e && !!stacks.e.stack;

	  // All code after this point will be filtered from stack traces reported by RxJS
	  var rStartingLine = captureLine(), rFileName;

	  var STACK_JUMP_SEPARATOR = 'From previous event:';

	  function makeStackTraceLong(error, observable) {
	    // If possible, transform the error stack trace by removing Node and RxJS
	    // cruft, then concatenating with the stack trace of `observable`.
	    if (hasStacks &&
	        observable.stack &&
	        typeof error === 'object' &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	      var stacks = [];
	      for (var o = observable; !!o; o = o.source) {
	        if (o.stack) {
	          stacks.unshift(o.stack);
	        }
	      }
	      stacks.unshift(error.stack);

	      var concatedStacks = stacks.join('\n' + STACK_JUMP_SEPARATOR + '\n');
	      error.stack = filterStackString(concatedStacks);
	    }
	  }

	  function filterStackString(stackString) {
	    var lines = stackString.split('\n'), desiredLines = [];
	    for (var i = 0, len = lines.length; i < len; i++) {
	      var line = lines[i];

	      if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	        desiredLines.push(line);
	      }
	    }
	    return desiredLines.join('\n');
	  }

	  function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
	    if (!fileNameAndLineNumber) {
	      return false;
	    }
	    var fileName = fileNameAndLineNumber[0], lineNumber = fileNameAndLineNumber[1];

	    return fileName === rFileName &&
	      lineNumber >= rStartingLine &&
	      lineNumber <= rEndingLine;
	  }

	  function isNodeFrame(stackLine) {
	    return stackLine.indexOf('(module.js:') !== -1 ||
	      stackLine.indexOf('(node.js:') !== -1;
	  }

	  function captureLine() {
	    if (!hasStacks) { return; }

	    try {
	      throw new Error();
	    } catch (e) {
	      var lines = e.stack.split('\n');
	      var firstLine = lines[0].indexOf('@') > 0 ? lines[1] : lines[2];
	      var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	      if (!fileNameAndLineNumber) { return; }

	      rFileName = fileNameAndLineNumber[0];
	      return fileNameAndLineNumber[1];
	    }
	  }

	  function getFileNameAndLineNumber(stackLine) {
	    // Named functions: 'at functionName (filename:lineNumber:columnNumber)'
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) { return [attempt1[1], Number(attempt1[2])]; }

	    // Anonymous functions: 'at filename:lineNumber:columnNumber'
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) { return [attempt2[1], Number(attempt2[2])]; }

	    // Firefox style: 'function@filename:lineNumber or @filename:lineNumber'
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) { return [attempt3[1], Number(attempt3[2])]; }
	  }

	  var EmptyError = Rx.EmptyError = function() {
	    this.message = 'Sequence contains no elements.';
	    Error.call(this);
	  };
	  EmptyError.prototype = Object.create(Error.prototype);
	  EmptyError.prototype.name = 'EmptyError';

	  var ObjectDisposedError = Rx.ObjectDisposedError = function() {
	    this.message = 'Object has been disposed';
	    Error.call(this);
	  };
	  ObjectDisposedError.prototype = Object.create(Error.prototype);
	  ObjectDisposedError.prototype.name = 'ObjectDisposedError';

	  var ArgumentOutOfRangeError = Rx.ArgumentOutOfRangeError = function () {
	    this.message = 'Argument out of range';
	    Error.call(this);
	  };
	  ArgumentOutOfRangeError.prototype = Object.create(Error.prototype);
	  ArgumentOutOfRangeError.prototype.name = 'ArgumentOutOfRangeError';

	  var NotSupportedError = Rx.NotSupportedError = function (message) {
	    this.message = message || 'This operation is not supported';
	    Error.call(this);
	  };
	  NotSupportedError.prototype = Object.create(Error.prototype);
	  NotSupportedError.prototype.name = 'NotSupportedError';

	  var NotImplementedError = Rx.NotImplementedError = function (message) {
	    this.message = message || 'This operation is not implemented';
	    Error.call(this);
	  };
	  NotImplementedError.prototype = Object.create(Error.prototype);
	  NotImplementedError.prototype.name = 'NotImplementedError';

	  var notImplemented = Rx.helpers.notImplemented = function () {
	    throw new NotImplementedError();
	  };

	  var notSupported = Rx.helpers.notSupported = function () {
	    throw new NotSupportedError();
	  };

	  // Shim in iterator support
	  var $iterator$ = (typeof Symbol === 'function' && Symbol.iterator) ||
	    '_es6shim_iterator_';
	  // Bug for mozilla version
	  if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
	    $iterator$ = '@@iterator';
	  }

	  var doneEnumerator = Rx.doneEnumerator = { done: true, value: undefined };

	  var isIterable = Rx.helpers.isIterable = function (o) {
	    return o && o[$iterator$] !== undefined;
	  };

	  var isArrayLike = Rx.helpers.isArrayLike = function (o) {
	    return o && o.length !== undefined;
	  };

	  Rx.helpers.iterator = $iterator$;

	  var bindCallback = Rx.internals.bindCallback = function (func, thisArg, argCount) {
	    if (typeof thisArg === 'undefined') { return func; }
	    switch(argCount) {
	      case 0:
	        return function() {
	          return func.call(thisArg)
	        };
	      case 1:
	        return function(arg) {
	          return func.call(thisArg, arg);
	        };
	      case 2:
	        return function(value, index) {
	          return func.call(thisArg, value, index);
	        };
	      case 3:
	        return function(value, index, collection) {
	          return func.call(thisArg, value, index, collection);
	        };
	    }

	    return function() {
	      return func.apply(thisArg, arguments);
	    };
	  };

	  /** Used to determine if values are of the language type Object */
	  var dontEnums = ['toString',
	    'toLocaleString',
	    'valueOf',
	    'hasOwnProperty',
	    'isPrototypeOf',
	    'propertyIsEnumerable',
	    'constructor'],
	  dontEnumsLength = dontEnums.length;

	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

	var objectProto = Object.prototype,
	    hasOwnProperty = objectProto.hasOwnProperty,
	    objToString = objectProto.toString,
	    MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	var keys = Object.keys || (function() {
	    var hasOwnProperty = Object.prototype.hasOwnProperty,
	        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
	        dontEnums = [
	          'toString',
	          'toLocaleString',
	          'valueOf',
	          'hasOwnProperty',
	          'isPrototypeOf',
	          'propertyIsEnumerable',
	          'constructor'
	        ],
	        dontEnumsLength = dontEnums.length;

	    return function(obj) {
	      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
	        throw new TypeError('Object.keys called on non-object');
	      }

	      var result = [], prop, i;

	      for (prop in obj) {
	        if (hasOwnProperty.call(obj, prop)) {
	          result.push(prop);
	        }
	      }

	      if (hasDontEnumBug) {
	        for (i = 0; i < dontEnumsLength; i++) {
	          if (hasOwnProperty.call(obj, dontEnums[i])) {
	            result.push(dontEnums[i]);
	          }
	        }
	      }
	      return result;
	    };
	  }());

	function equalObjects(object, other, equalFunc, isLoose, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength !== othLength && !isLoose) {
	    return false;
	  }
	  var index = objLength, key;
	  while (index--) {
	    key = objProps[index];
	    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
	      return false;
	    }
	  }
	  var skipCtor = isLoose;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key],
	        result;

	    if (!(result === undefined ? equalFunc(objValue, othValue, isLoose, stackA, stackB) : result)) {
	      return false;
	    }
	    skipCtor || (skipCtor = key === 'constructor');
	  }
	  if (!skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    if (objCtor !== othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor === 'function' && objCtor instanceof objCtor &&
	          typeof othCtor === 'function' && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}

	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      return +object === +other;

	    case errorTag:
	      return object.name === other.name && object.message === other.message;

	    case numberTag:
	      return (object !== +object) ?
	        other !== +other :
	        object === +other;

	    case regexpTag:
	    case stringTag:
	      return object === (other + '');
	  }
	  return false;
	}

	var isObject = Rx.internals.isObject = function(value) {
	  var type = typeof value;
	  return !!value && (type === 'object' || type === 'function');
	};

	function isObjectLike(value) {
	  return !!value && typeof value === 'object';
	}

	function isLength(value) {
	  return typeof value === 'number' && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
	}

	var isHostObject = (function() {
	  try {
	    Object({ 'toString': 0 } + '');
	  } catch(e) {
	    return function() { return false; };
	  }
	  return function(value) {
	    return typeof value.toString !== 'function' && typeof (value + '') === 'string';
	  };
	}());

	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	}

	var isArray = Array.isArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) === arrayTag;
	};

	function arraySome (array, predicate) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	function equalArrays(array, other, equalFunc, isLoose, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength !== othLength && !(isLoose && othLength > arrLength)) {
	    return false;
	  }
	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index],
	        result;

	    if (result !== undefined) {
	      if (result) {
	        continue;
	      }
	      return false;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (isLoose) {
	      if (!arraySome(other, function(othValue) {
	            return arrValue === othValue || equalFunc(arrValue, othValue, isLoose, stackA, stackB);
	          })) {
	        return false;
	      }
	    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, isLoose, stackA, stackB))) {
	      return false;
	    }
	  }
	  return true;
	}

	function baseIsEqualDeep(object, other, equalFunc, isLoose, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag === argsTag) {
	      objTag = objectTag;
	    } else if (objTag !== objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag === argsTag) {
	      othTag = objectTag;
	    }
	  }
	  var objIsObj = objTag === objectTag && !isHostObject(object),
	      othIsObj = othTag === objectTag && !isHostObject(other),
	      isSameTag = objTag === othTag;

	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  if (!isLoose) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, isLoose, stackA, stackB);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);

	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] === object) {
	      return stackB[length] === other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);

	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, isLoose, stackA, stackB);

	  stackA.pop();
	  stackB.pop();

	  return result;
	}

	function baseIsEqual(value, other, isLoose, stackA, stackB) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, isLoose, stackA, stackB);
	}

	var isEqual = Rx.internals.isEqual = function (value, other) {
	  return baseIsEqual(value, other);
	};

	  var hasProp = {}.hasOwnProperty,
	      slice = Array.prototype.slice;

	  var inherits = Rx.internals.inherits = function (child, parent) {
	    function __() { this.constructor = child; }
	    __.prototype = parent.prototype;
	    child.prototype = new __();
	  };

	  var addProperties = Rx.internals.addProperties = function (obj) {
	    for(var sources = [], i = 1, len = arguments.length; i < len; i++) { sources.push(arguments[i]); }
	    for (var idx = 0, ln = sources.length; idx < ln; idx++) {
	      var source = sources[idx];
	      for (var prop in source) {
	        obj[prop] = source[prop];
	      }
	    }
	  };

	  // Rx Utils
	  var addRef = Rx.internals.addRef = function (xs, r) {
	    return new AnonymousObservable(function (observer) {
	      return new BinaryDisposable(r.getDisposable(), xs.subscribe(observer));
	    });
	  };

	  function arrayInitialize(count, factory) {
	    var a = new Array(count);
	    for (var i = 0; i < count; i++) {
	      a[i] = factory();
	    }
	    return a;
	  }

	  function IndexedItem(id, value) {
	    this.id = id;
	    this.value = value;
	  }

	  IndexedItem.prototype.compareTo = function (other) {
	    var c = this.value.compareTo(other.value);
	    c === 0 && (c = this.id - other.id);
	    return c;
	  };

	  var PriorityQueue = Rx.internals.PriorityQueue = function (capacity) {
	    this.items = new Array(capacity);
	    this.length = 0;
	  };

	  var priorityProto = PriorityQueue.prototype;
	  priorityProto.isHigherPriority = function (left, right) {
	    return this.items[left].compareTo(this.items[right]) < 0;
	  };

	  priorityProto.percolate = function (index) {
	    if (index >= this.length || index < 0) { return; }
	    var parent = index - 1 >> 1;
	    if (parent < 0 || parent === index) { return; }
	    if (this.isHigherPriority(index, parent)) {
	      var temp = this.items[index];
	      this.items[index] = this.items[parent];
	      this.items[parent] = temp;
	      this.percolate(parent);
	    }
	  };

	  priorityProto.heapify = function (index) {
	    +index || (index = 0);
	    if (index >= this.length || index < 0) { return; }
	    var left = 2 * index + 1,
	        right = 2 * index + 2,
	        first = index;
	    if (left < this.length && this.isHigherPriority(left, first)) {
	      first = left;
	    }
	    if (right < this.length && this.isHigherPriority(right, first)) {
	      first = right;
	    }
	    if (first !== index) {
	      var temp = this.items[index];
	      this.items[index] = this.items[first];
	      this.items[first] = temp;
	      this.heapify(first);
	    }
	  };

	  priorityProto.peek = function () { return this.items[0].value; };

	  priorityProto.removeAt = function (index) {
	    this.items[index] = this.items[--this.length];
	    this.items[this.length] = undefined;
	    this.heapify();
	  };

	  priorityProto.dequeue = function () {
	    var result = this.peek();
	    this.removeAt(0);
	    return result;
	  };

	  priorityProto.enqueue = function (item) {
	    var index = this.length++;
	    this.items[index] = new IndexedItem(PriorityQueue.count++, item);
	    this.percolate(index);
	  };

	  priorityProto.remove = function (item) {
	    for (var i = 0; i < this.length; i++) {
	      if (this.items[i].value === item) {
	        this.removeAt(i);
	        return true;
	      }
	    }
	    return false;
	  };
	  PriorityQueue.count = 0;

	  /**
	   * Represents a group of disposable resources that are disposed together.
	   * @constructor
	   */
	  var CompositeDisposable = Rx.CompositeDisposable = function () {
	    var args = [], i, len;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	    } else {
	      len = arguments.length;
	      args = new Array(len);
	      for(i = 0; i < len; i++) { args[i] = arguments[i]; }
	    }
	    this.disposables = args;
	    this.isDisposed = false;
	    this.length = args.length;
	  };

	  var CompositeDisposablePrototype = CompositeDisposable.prototype;

	  /**
	   * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
	   * @param {Mixed} item Disposable to add.
	   */
	  CompositeDisposablePrototype.add = function (item) {
	    if (this.isDisposed) {
	      item.dispose();
	    } else {
	      this.disposables.push(item);
	      this.length++;
	    }
	  };

	  /**
	   * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
	   * @param {Mixed} item Disposable to remove.
	   * @returns {Boolean} true if found; false otherwise.
	   */
	  CompositeDisposablePrototype.remove = function (item) {
	    var shouldDispose = false;
	    if (!this.isDisposed) {
	      var idx = this.disposables.indexOf(item);
	      if (idx !== -1) {
	        shouldDispose = true;
	        this.disposables.splice(idx, 1);
	        this.length--;
	        item.dispose();
	      }
	    }
	    return shouldDispose;
	  };

	  /**
	   *  Disposes all disposables in the group and removes them from the group.
	   */
	  CompositeDisposablePrototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var len = this.disposables.length, currentDisposables = new Array(len);
	      for(var i = 0; i < len; i++) { currentDisposables[i] = this.disposables[i]; }
	      this.disposables = [];
	      this.length = 0;

	      for (i = 0; i < len; i++) {
	        currentDisposables[i].dispose();
	      }
	    }
	  };

	  /**
	   * Provides a set of static methods for creating Disposables.
	   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	   */
	  var Disposable = Rx.Disposable = function (action) {
	    this.isDisposed = false;
	    this.action = action || noop;
	  };

	  /** Performs the task of cleaning up resources. */
	  Disposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.action();
	      this.isDisposed = true;
	    }
	  };

	  /**
	   * Creates a disposable object that invokes the specified action when disposed.
	   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	   * @return {Disposable} The disposable object that runs the given action upon disposal.
	   */
	  var disposableCreate = Disposable.create = function (action) { return new Disposable(action); };

	  /**
	   * Gets the disposable that does nothing when disposed.
	   */
	  var disposableEmpty = Disposable.empty = { dispose: noop };

	  /**
	   * Validates whether the given object is a disposable
	   * @param {Object} Object to test whether it has a dispose method
	   * @returns {Boolean} true if a disposable object, else false.
	   */
	  var isDisposable = Disposable.isDisposable = function (d) {
	    return d && isFunction(d.dispose);
	  };

	  var checkDisposed = Disposable.checkDisposed = function (disposable) {
	    if (disposable.isDisposed) { throw new ObjectDisposedError(); }
	  };

	  var disposableFixup = Disposable._fixup = function (result) {
	    return isDisposable(result) ? result : disposableEmpty;
	  };

	  // Single assignment
	  var SingleAssignmentDisposable = Rx.SingleAssignmentDisposable = function () {
	    this.isDisposed = false;
	    this.current = null;
	  };
	  SingleAssignmentDisposable.prototype.getDisposable = function () {
	    return this.current;
	  };
	  SingleAssignmentDisposable.prototype.setDisposable = function (value) {
	    if (this.current) { throw new Error('Disposable has already been assigned'); }
	    var shouldDispose = this.isDisposed;
	    !shouldDispose && (this.current = value);
	    shouldDispose && value && value.dispose();
	  };
	  SingleAssignmentDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old = this.current;
	      this.current = null;
	      old && old.dispose();
	    }
	  };

	  // Multiple assignment disposable
	  var SerialDisposable = Rx.SerialDisposable = function () {
	    this.isDisposed = false;
	    this.current = null;
	  };
	  SerialDisposable.prototype.getDisposable = function () {
	    return this.current;
	  };
	  SerialDisposable.prototype.setDisposable = function (value) {
	    var shouldDispose = this.isDisposed;
	    if (!shouldDispose) {
	      var old = this.current;
	      this.current = value;
	    }
	    old && old.dispose();
	    shouldDispose && value && value.dispose();
	  };
	  SerialDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old = this.current;
	      this.current = null;
	    }
	    old && old.dispose();
	  };

	  var BinaryDisposable = Rx.BinaryDisposable = function (first, second) {
	    this._first = first;
	    this._second = second;
	    this.isDisposed = false;
	  };

	  BinaryDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old1 = this._first;
	      this._first = null;
	      old1 && old1.dispose();
	      var old2 = this._second;
	      this._second = null;
	      old2 && old2.dispose();
	    }
	  };

	  var NAryDisposable = Rx.NAryDisposable = function (disposables) {
	    this._disposables = disposables;
	    this.isDisposed = false;
	  };

	  NAryDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      for (var i = 0, len = this._disposables.length; i < len; i++) {
	        this._disposables[i].dispose();
	      }
	      this._disposables.length = 0;
	    }
	  };

	  /**
	   * Represents a disposable resource that only disposes its underlying disposable resource when all dependent disposable objects have been disposed.
	   */
	  var RefCountDisposable = Rx.RefCountDisposable = (function () {

	    function InnerDisposable(disposable) {
	      this.disposable = disposable;
	      this.disposable.count++;
	      this.isInnerDisposed = false;
	    }

	    InnerDisposable.prototype.dispose = function () {
	      if (!this.disposable.isDisposed && !this.isInnerDisposed) {
	        this.isInnerDisposed = true;
	        this.disposable.count--;
	        if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
	          this.disposable.isDisposed = true;
	          this.disposable.underlyingDisposable.dispose();
	        }
	      }
	    };

	    /**
	     * Initializes a new instance of the RefCountDisposable with the specified disposable.
	     * @constructor
	     * @param {Disposable} disposable Underlying disposable.
	      */
	    function RefCountDisposable(disposable) {
	      this.underlyingDisposable = disposable;
	      this.isDisposed = false;
	      this.isPrimaryDisposed = false;
	      this.count = 0;
	    }

	    /**
	     * Disposes the underlying disposable only when all dependent disposables have been disposed
	     */
	    RefCountDisposable.prototype.dispose = function () {
	      if (!this.isDisposed && !this.isPrimaryDisposed) {
	        this.isPrimaryDisposed = true;
	        if (this.count === 0) {
	          this.isDisposed = true;
	          this.underlyingDisposable.dispose();
	        }
	      }
	    };

	    /**
	     * Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
	     * @returns {Disposable} A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.
	     */
	    RefCountDisposable.prototype.getDisposable = function () {
	      return this.isDisposed ? disposableEmpty : new InnerDisposable(this);
	    };

	    return RefCountDisposable;
	  })();

	  function ScheduledDisposable(scheduler, disposable) {
	    this.scheduler = scheduler;
	    this.disposable = disposable;
	    this.isDisposed = false;
	  }

	  function scheduleItem(s, self) {
	    if (!self.isDisposed) {
	      self.isDisposed = true;
	      self.disposable.dispose();
	    }
	  }

	  ScheduledDisposable.prototype.dispose = function () {
	    this.scheduler.schedule(this, scheduleItem);
	  };

	  var ScheduledItem = Rx.internals.ScheduledItem = function (scheduler, state, action, dueTime, comparer) {
	    this.scheduler = scheduler;
	    this.state = state;
	    this.action = action;
	    this.dueTime = dueTime;
	    this.comparer = comparer || defaultSubComparer;
	    this.disposable = new SingleAssignmentDisposable();
	  };

	  ScheduledItem.prototype.invoke = function () {
	    this.disposable.setDisposable(this.invokeCore());
	  };

	  ScheduledItem.prototype.compareTo = function (other) {
	    return this.comparer(this.dueTime, other.dueTime);
	  };

	  ScheduledItem.prototype.isCancelled = function () {
	    return this.disposable.isDisposed;
	  };

	  ScheduledItem.prototype.invokeCore = function () {
	    return disposableFixup(this.action(this.scheduler, this.state));
	  };

	  /** Provides a set of static properties to access commonly used schedulers. */
	  var Scheduler = Rx.Scheduler = (function () {

	    function Scheduler() { }

	    /** Determines whether the given object is a scheduler */
	    Scheduler.isScheduler = function (s) {
	      return s instanceof Scheduler;
	    };

	    var schedulerProto = Scheduler.prototype;

	    /**
	   * Schedules an action to be executed.
	   * @param state State passed to the action to be executed.
	   * @param {Function} action Action to be executed.
	   * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	   */
	    schedulerProto.schedule = function (state, action) {
	      throw new NotImplementedError();
	    };

	  /**
	   * Schedules an action to be executed after dueTime.
	   * @param state State passed to the action to be executed.
	   * @param {Function} action Action to be executed.
	   * @param {Number} dueTime Relative time after which to execute the action.
	   * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	   */
	    schedulerProto.scheduleFuture = function (state, dueTime, action) {
	      var dt = dueTime;
	      dt instanceof Date && (dt = dt - this.now());
	      dt = Scheduler.normalize(dt);

	      if (dt === 0) { return this.schedule(state, action); }

	      return this._scheduleFuture(state, dt, action);
	    };

	    schedulerProto._scheduleFuture = function (state, dueTime, action) {
	      throw new NotImplementedError();
	    };

	    /** Gets the current time according to the local machine's system clock. */
	    Scheduler.now = defaultNow;

	    /** Gets the current time according to the local machine's system clock. */
	    Scheduler.prototype.now = defaultNow;

	    /**
	     * Normalizes the specified TimeSpan value to a positive value.
	     * @param {Number} timeSpan The time span value to normalize.
	     * @returns {Number} The specified TimeSpan value if it is zero or positive; otherwise, 0
	     */
	    Scheduler.normalize = function (timeSpan) {
	      timeSpan < 0 && (timeSpan = 0);
	      return timeSpan;
	    };

	    return Scheduler;
	  }());

	  var normalizeTime = Scheduler.normalize, isScheduler = Scheduler.isScheduler;

	  (function (schedulerProto) {

	    function invokeRecImmediate(scheduler, pair) {
	      var state = pair[0], action = pair[1], group = new CompositeDisposable();
	      action(state, innerAction);
	      return group;

	      function innerAction(state2) {
	        var isAdded = false, isDone = false;

	        var d = scheduler.schedule(state2, scheduleWork);
	        if (!isDone) {
	          group.add(d);
	          isAdded = true;
	        }

	        function scheduleWork(_, state3) {
	          if (isAdded) {
	            group.remove(d);
	          } else {
	            isDone = true;
	          }
	          action(state3, innerAction);
	          return disposableEmpty;
	        }
	      }
	    }

	    function invokeRecDate(scheduler, pair) {
	      var state = pair[0], action = pair[1], group = new CompositeDisposable();
	      action(state, innerAction);
	      return group;

	      function innerAction(state2, dueTime1) {
	        var isAdded = false, isDone = false;

	        var d = scheduler.scheduleFuture(state2, dueTime1, scheduleWork);
	        if (!isDone) {
	          group.add(d);
	          isAdded = true;
	        }

	        function scheduleWork(_, state3) {
	          if (isAdded) {
	            group.remove(d);
	          } else {
	            isDone = true;
	          }
	          action(state3, innerAction);
	          return disposableEmpty;
	        }
	      }
	    }

	    /**
	     * Schedules an action to be executed recursively.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursive = function (state, action) {
	      return this.schedule([state, action], invokeRecImmediate);
	    };

	    /**
	     * Schedules an action to be executed recursively after a specified relative or absolute due time.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
	     * @param {Number | Date} dueTime Relative or absolute time after which to execute the action for the first time.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveFuture = function (state, dueTime, action) {
	      return this.scheduleFuture([state, action], dueTime, invokeRecDate);
	    };

	  }(Scheduler.prototype));

	  (function (schedulerProto) {

	    /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
	     * @param {Mixed} state Initial state passed to the action upon the first iteration.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed, potentially updating the state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */
	    schedulerProto.schedulePeriodic = function(state, period, action) {
	      if (typeof root.setInterval === 'undefined') { throw new NotSupportedError(); }
	      period = normalizeTime(period);
	      var s = state, id = root.setInterval(function () { s = action(s); }, period);
	      return disposableCreate(function () { root.clearInterval(id); });
	    };

	  }(Scheduler.prototype));

	  (function (schedulerProto) {
	    /**
	     * Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.
	     * @param {Function} handler Handler that's run if an exception is caught. The exception will be rethrown if the handler returns false.
	     * @returns {Scheduler} Wrapper around the original scheduler, enforcing exception handling.
	     */
	    schedulerProto.catchError = schedulerProto['catch'] = function (handler) {
	      return new CatchScheduler(this, handler);
	    };
	  }(Scheduler.prototype));

	  var SchedulePeriodicRecursive = Rx.internals.SchedulePeriodicRecursive = (function () {
	    function createTick(self) {
	      return function tick(command, recurse) {
	        recurse(0, self._period);
	        var state = tryCatch(self._action)(self._state);
	        if (state === errorObj) {
	          self._cancel.dispose();
	          thrower(state.e);
	        }
	        self._state = state;
	      };
	    }

	    function SchedulePeriodicRecursive(scheduler, state, period, action) {
	      this._scheduler = scheduler;
	      this._state = state;
	      this._period = period;
	      this._action = action;
	    }

	    SchedulePeriodicRecursive.prototype.start = function () {
	      var d = new SingleAssignmentDisposable();
	      this._cancel = d;
	      d.setDisposable(this._scheduler.scheduleRecursiveFuture(0, this._period, createTick(this)));

	      return d;
	    };

	    return SchedulePeriodicRecursive;
	  }());

	  /** Gets a scheduler that schedules work immediately on the current thread. */
	   var ImmediateScheduler = (function (__super__) {
	    inherits(ImmediateScheduler, __super__);
	    function ImmediateScheduler() {
	      __super__.call(this);
	    }

	    ImmediateScheduler.prototype.schedule = function (state, action) {
	      return disposableFixup(action(this, state));
	    };

	    return ImmediateScheduler;
	  }(Scheduler));

	  var immediateScheduler = Scheduler.immediate = new ImmediateScheduler();

	  /**
	   * Gets a scheduler that schedules work as soon as possible on the current thread.
	   */
	  var CurrentThreadScheduler = (function (__super__) {
	    var queue;

	    function runTrampoline () {
	      while (queue.length > 0) {
	        var item = queue.dequeue();
	        !item.isCancelled() && item.invoke();
	      }
	    }

	    inherits(CurrentThreadScheduler, __super__);
	    function CurrentThreadScheduler() {
	      __super__.call(this);
	    }

	    CurrentThreadScheduler.prototype.schedule = function (state, action) {
	      var si = new ScheduledItem(this, state, action, this.now());

	      if (!queue) {
	        queue = new PriorityQueue(4);
	        queue.enqueue(si);

	        var result = tryCatch(runTrampoline)();
	        queue = null;
	        if (result === errorObj) { thrower(result.e); }
	      } else {
	        queue.enqueue(si);
	      }
	      return si.disposable;
	    };

	    CurrentThreadScheduler.prototype.scheduleRequired = function () { return !queue; };

	    return CurrentThreadScheduler;
	  }(Scheduler));

	  var currentThreadScheduler = Scheduler.currentThread = new CurrentThreadScheduler();

	  var scheduleMethod, clearMethod;

	  var localTimer = (function () {
	    var localSetTimeout, localClearTimeout = noop;
	    if (!!root.setTimeout) {
	      localSetTimeout = root.setTimeout;
	      localClearTimeout = root.clearTimeout;
	    } else if (!!root.WScript) {
	      localSetTimeout = function (fn, time) {
	        root.WScript.Sleep(time);
	        fn();
	      };
	    } else {
	      throw new NotSupportedError();
	    }

	    return {
	      setTimeout: localSetTimeout,
	      clearTimeout: localClearTimeout
	    };
	  }());
	  var localSetTimeout = localTimer.setTimeout,
	    localClearTimeout = localTimer.clearTimeout;

	  (function () {

	    var nextHandle = 1, tasksByHandle = {}, currentlyRunning = false;

	    clearMethod = function (handle) {
	      delete tasksByHandle[handle];
	    };

	    function runTask(handle) {
	      if (currentlyRunning) {
	        localSetTimeout(function () { runTask(handle); }, 0);
	      } else {
	        var task = tasksByHandle[handle];
	        if (task) {
	          currentlyRunning = true;
	          var result = tryCatch(task)();
	          clearMethod(handle);
	          currentlyRunning = false;
	          if (result === errorObj) { thrower(result.e); }
	        }
	      }
	    }

	    var reNative = new RegExp('^' +
	      String(toString)
	        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	        .replace(/toString| for [^\]]+/g, '.*?') + '$'
	    );

	    var setImmediate = typeof (setImmediate = freeGlobal && moduleExports && freeGlobal.setImmediate) == 'function' &&
	      !reNative.test(setImmediate) && setImmediate;

	    function postMessageSupported () {
	      // Ensure not in a worker
	      if (!root.postMessage || root.importScripts) { return false; }
	      var isAsync = false, oldHandler = root.onmessage;
	      // Test for async
	      root.onmessage = function () { isAsync = true; };
	      root.postMessage('', '*');
	      root.onmessage = oldHandler;

	      return isAsync;
	    }

	    // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
	    if (isFunction(setImmediate)) {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        setImmediate(function () { runTask(id); });

	        return id;
	      };
	    } else if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        process.nextTick(function () { runTask(id); });

	        return id;
	      };
	    } else if (postMessageSupported()) {
	      var MSG_PREFIX = 'ms.rx.schedule' + Math.random();

	      var onGlobalPostMessage = function (event) {
	        // Only if we're a match to avoid any other global events
	        if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
	          runTask(event.data.substring(MSG_PREFIX.length));
	        }
	      };

	      root.addEventListener('message', onGlobalPostMessage, false);

	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        root.postMessage(MSG_PREFIX + currentId, '*');
	        return id;
	      };
	    } else if (!!root.MessageChannel) {
	      var channel = new root.MessageChannel();

	      channel.port1.onmessage = function (e) { runTask(e.data); };

	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        channel.port2.postMessage(id);
	        return id;
	      };
	    } else if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {

	      scheduleMethod = function (action) {
	        var scriptElement = root.document.createElement('script');
	        var id = nextHandle++;
	        tasksByHandle[id] = action;

	        scriptElement.onreadystatechange = function () {
	          runTask(id);
	          scriptElement.onreadystatechange = null;
	          scriptElement.parentNode.removeChild(scriptElement);
	          scriptElement = null;
	        };
	        root.document.documentElement.appendChild(scriptElement);
	        return id;
	      };

	    } else {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        localSetTimeout(function () {
	          runTask(id);
	        }, 0);

	        return id;
	      };
	    }
	  }());

	  /**
	   * Gets a scheduler that schedules work via a timed callback based upon platform.
	   */
	   var DefaultScheduler = (function (__super__) {
	     inherits(DefaultScheduler, __super__);
	     function DefaultScheduler() {
	       __super__.call(this);
	     }

	     function scheduleAction(disposable, action, scheduler, state) {
	       return function schedule() {
	         disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
	       };
	     }

	     function ClearDisposable(id) {
	       this._id = id;
	       this.isDisposed = false;
	     }

	     ClearDisposable.prototype.dispose = function () {
	       if (!this.isDisposed) {
	         this.isDisposed = true;
	         clearMethod(this._id);
	       }
	     };

	     function LocalClearDisposable(id) {
	       this._id = id;
	       this.isDisposed = false;
	     }

	     LocalClearDisposable.prototype.dispose = function () {
	       if (!this.isDisposed) {
	         this.isDisposed = true;
	         localClearTimeout(this._id);
	       }
	     };

	    DefaultScheduler.prototype.schedule = function (state, action) {
	      var disposable = new SingleAssignmentDisposable(),
	          id = scheduleMethod(scheduleAction(disposable, action, this, state));
	      return new BinaryDisposable(disposable, new ClearDisposable(id));
	    };

	    DefaultScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
	      if (dueTime === 0) { return this.schedule(state, action); }
	      var disposable = new SingleAssignmentDisposable(),
	          id = localSetTimeout(scheduleAction(disposable, action, this, state), dueTime);
	      return new BinaryDisposable(disposable, new LocalClearDisposable(id));
	    };

	    return DefaultScheduler;
	  }(Scheduler));

	  var defaultScheduler = Scheduler['default'] = Scheduler.async = new DefaultScheduler();

	  var CatchScheduler = (function (__super__) {
	    inherits(CatchScheduler, __super__);

	    function CatchScheduler(scheduler, handler) {
	      this._scheduler = scheduler;
	      this._handler = handler;
	      this._recursiveOriginal = null;
	      this._recursiveWrapper = null;
	      __super__.call(this);
	    }

	    CatchScheduler.prototype.schedule = function (state, action) {
	      return this._scheduler.schedule(state, this._wrap(action));
	    };

	    CatchScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
	      return this._scheduler.schedule(state, dueTime, this._wrap(action));
	    };

	    CatchScheduler.prototype.now = function () { return this._scheduler.now(); };

	    CatchScheduler.prototype._clone = function (scheduler) {
	        return new CatchScheduler(scheduler, this._handler);
	    };

	    CatchScheduler.prototype._wrap = function (action) {
	      var parent = this;
	      return function (self, state) {
	        var res = tryCatch(action)(parent._getRecursiveWrapper(self), state);
	        if (res === errorObj) {
	          if (!parent._handler(res.e)) { thrower(res.e); }
	          return disposableEmpty;
	        }
	        return disposableFixup(res);
	      };
	    };

	    CatchScheduler.prototype._getRecursiveWrapper = function (scheduler) {
	      if (this._recursiveOriginal !== scheduler) {
	        this._recursiveOriginal = scheduler;
	        var wrapper = this._clone(scheduler);
	        wrapper._recursiveOriginal = scheduler;
	        wrapper._recursiveWrapper = wrapper;
	        this._recursiveWrapper = wrapper;
	      }
	      return this._recursiveWrapper;
	    };

	    CatchScheduler.prototype.schedulePeriodic = function (state, period, action) {
	      var self = this, failed = false, d = new SingleAssignmentDisposable();

	      d.setDisposable(this._scheduler.schedulePeriodic(state, period, function (state1) {
	        if (failed) { return null; }
	        var res = tryCatch(action)(state1);
	        if (res === errorObj) {
	          failed = true;
	          if (!self._handler(res.e)) { thrower(res.e); }
	          d.dispose();
	          return null;
	        }
	        return res;
	      }));

	      return d;
	    };

	    return CatchScheduler;
	  }(Scheduler));

	  /**
	   *  Represents a notification to an observer.
	   */
	  var Notification = Rx.Notification = (function () {
	    function Notification() {

	    }

	    Notification.prototype._accept = function (onNext, onError, onCompleted) {
	      throw new NotImplementedError();
	    };

	    Notification.prototype._acceptObserver = function (onNext, onError, onCompleted) {
	      throw new NotImplementedError();
	    };

	    /**
	     * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
	     * @param {Function | Observer} observerOrOnNext Function to invoke for an OnNext notification or Observer to invoke the notification on..
	     * @param {Function} onError Function to invoke for an OnError notification.
	     * @param {Function} onCompleted Function to invoke for an OnCompleted notification.
	     * @returns {Any} Result produced by the observation.
	     */
	    Notification.prototype.accept = function (observerOrOnNext, onError, onCompleted) {
	      return observerOrOnNext && typeof observerOrOnNext === 'object' ?
	        this._acceptObserver(observerOrOnNext) :
	        this._accept(observerOrOnNext, onError, onCompleted);
	    };

	    /**
	     * Returns an observable sequence with a single notification.
	     *
	     * @memberOf Notifications
	     * @param {Scheduler} [scheduler] Scheduler to send out the notification calls on.
	     * @returns {Observable} The observable sequence that surfaces the behavior of the notification upon subscription.
	     */
	    Notification.prototype.toObservable = function (scheduler) {
	      var self = this;
	      isScheduler(scheduler) || (scheduler = immediateScheduler);
	      return new AnonymousObservable(function (o) {
	        return scheduler.schedule(self, function (_, notification) {
	          notification._acceptObserver(o);
	          notification.kind === 'N' && o.onCompleted();
	        });
	      });
	    };

	    return Notification;
	  })();

	  var OnNextNotification = (function (__super__) {
	    inherits(OnNextNotification, __super__);
	    function OnNextNotification(value) {
	      this.value = value;
	      this.kind = 'N';
	    }

	    OnNextNotification.prototype._accept = function (onNext) {
	      return onNext(this.value);
	    };

	    OnNextNotification.prototype._acceptObserver = function (o) {
	      return o.onNext(this.value);
	    };

	    OnNextNotification.prototype.toString = function () {
	      return 'OnNext(' + this.value + ')';
	    };

	    return OnNextNotification;
	  }(Notification));

	  var OnErrorNotification = (function (__super__) {
	    inherits(OnErrorNotification, __super__);
	    function OnErrorNotification(error) {
	      this.error = error;
	      this.kind = 'E';
	    }

	    OnErrorNotification.prototype._accept = function (onNext, onError) {
	      return onError(this.error);
	    };

	    OnErrorNotification.prototype._acceptObserver = function (o) {
	      return o.onError(this.error);
	    };

	    OnErrorNotification.prototype.toString = function () {
	      return 'OnError(' + this.error + ')';
	    };

	    return OnErrorNotification;
	  }(Notification));

	  var OnCompletedNotification = (function (__super__) {
	    inherits(OnCompletedNotification, __super__);
	    function OnCompletedNotification() {
	      this.kind = 'C';
	    }

	    OnCompletedNotification.prototype._accept = function (onNext, onError, onCompleted) {
	      return onCompleted();
	    };

	    OnCompletedNotification.prototype._acceptObserver = function (o) {
	      return o.onCompleted();
	    };

	    OnCompletedNotification.prototype.toString = function () {
	      return 'OnCompleted()';
	    };

	    return OnCompletedNotification;
	  }(Notification));

	  /**
	   * Creates an object that represents an OnNext notification to an observer.
	   * @param {Any} value The value contained in the notification.
	   * @returns {Notification} The OnNext notification containing the value.
	   */
	  var notificationCreateOnNext = Notification.createOnNext = function (value) {
	    return new OnNextNotification(value);
	  };

	  /**
	   * Creates an object that represents an OnError notification to an observer.
	   * @param {Any} error The exception contained in the notification.
	   * @returns {Notification} The OnError notification containing the exception.
	   */
	  var notificationCreateOnError = Notification.createOnError = function (error) {
	    return new OnErrorNotification(error);
	  };

	  /**
	   * Creates an object that represents an OnCompleted notification to an observer.
	   * @returns {Notification} The OnCompleted notification.
	   */
	  var notificationCreateOnCompleted = Notification.createOnCompleted = function () {
	    return new OnCompletedNotification();
	  };

	  /**
	   * Supports push-style iteration over an observable sequence.
	   */
	  var Observer = Rx.Observer = function () { };

	  /**
	   *  Creates a notification callback from an observer.
	   * @returns The action that forwards its input notification to the underlying observer.
	   */
	  Observer.prototype.toNotifier = function () {
	    var observer = this;
	    return function (n) { return n.accept(observer); };
	  };

	  /**
	   *  Hides the identity of an observer.
	   * @returns An observer that hides the identity of the specified observer.
	   */
	  Observer.prototype.asObserver = function () {
	    var self = this;
	    return new AnonymousObserver(
	      function (x) { self.onNext(x); },
	      function (err) { self.onError(err); },
	      function () { self.onCompleted(); });
	  };

	  /**
	   *  Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
	   *  If a violation is detected, an Error is thrown from the offending observer method call.
	   * @returns An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.
	   */
	  Observer.prototype.checked = function () { return new CheckedObserver(this); };

	  /**
	   *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
	   * @param {Function} [onNext] Observer's OnNext action implementation.
	   * @param {Function} [onError] Observer's OnError action implementation.
	   * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
	   * @returns {Observer} The observer object implemented using the given actions.
	   */
	  var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
	    onNext || (onNext = noop);
	    onError || (onError = defaultError);
	    onCompleted || (onCompleted = noop);
	    return new AnonymousObserver(onNext, onError, onCompleted);
	  };

	  /**
	   *  Creates an observer from a notification callback.
	   * @param {Function} handler Action that handles a notification.
	   * @returns The observer object that invokes the specified handler using a notification corresponding to each message it receives.
	   */
	  Observer.fromNotifier = function (handler, thisArg) {
	    var cb = bindCallback(handler, thisArg, 1);
	    return new AnonymousObserver(function (x) {
	      return cb(notificationCreateOnNext(x));
	    }, function (e) {
	      return cb(notificationCreateOnError(e));
	    }, function () {
	      return cb(notificationCreateOnCompleted());
	    });
	  };

	  /**
	   * Schedules the invocation of observer methods on the given scheduler.
	   * @param {Scheduler} scheduler Scheduler to schedule observer messages on.
	   * @returns {Observer} Observer whose messages are scheduled on the given scheduler.
	   */
	  Observer.prototype.notifyOn = function (scheduler) {
	    return new ObserveOnObserver(scheduler, this);
	  };

	  Observer.prototype.makeSafe = function(disposable) {
	    return new AnonymousSafeObserver(this._onNext, this._onError, this._onCompleted, disposable);
	  };

	  /**
	   * Abstract base class for implementations of the Observer class.
	   * This base class enforces the grammar of observers where OnError and OnCompleted are terminal messages.
	   */
	  var AbstractObserver = Rx.internals.AbstractObserver = (function (__super__) {
	    inherits(AbstractObserver, __super__);

	    /**
	     * Creates a new observer in a non-stopped state.
	     */
	    function AbstractObserver() {
	      this.isStopped = false;
	    }

	    // Must be implemented by other observers
	    AbstractObserver.prototype.next = notImplemented;
	    AbstractObserver.prototype.error = notImplemented;
	    AbstractObserver.prototype.completed = notImplemented;

	    /**
	     * Notifies the observer of a new element in the sequence.
	     * @param {Any} value Next element in the sequence.
	     */
	    AbstractObserver.prototype.onNext = function (value) {
	      !this.isStopped && this.next(value);
	    };

	    /**
	     * Notifies the observer that an exception has occurred.
	     * @param {Any} error The error that has occurred.
	     */
	    AbstractObserver.prototype.onError = function (error) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.error(error);
	      }
	    };

	    /**
	     * Notifies the observer of the end of the sequence.
	     */
	    AbstractObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.completed();
	      }
	    };

	    /**
	     * Disposes the observer, causing it to transition to the stopped state.
	     */
	    AbstractObserver.prototype.dispose = function () { this.isStopped = true; };

	    AbstractObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.error(e);
	        return true;
	      }

	      return false;
	    };

	    return AbstractObserver;
	  }(Observer));

	  /**
	   * Class to create an Observer instance from delegate-based implementations of the on* methods.
	   */
	  var AnonymousObserver = Rx.AnonymousObserver = (function (__super__) {
	    inherits(AnonymousObserver, __super__);

	    /**
	     * Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
	     * @param {Any} onNext Observer's OnNext action implementation.
	     * @param {Any} onError Observer's OnError action implementation.
	     * @param {Any} onCompleted Observer's OnCompleted action implementation.
	     */
	    function AnonymousObserver(onNext, onError, onCompleted) {
	      __super__.call(this);
	      this._onNext = onNext;
	      this._onError = onError;
	      this._onCompleted = onCompleted;
	    }

	    /**
	     * Calls the onNext action.
	     * @param {Any} value Next element in the sequence.
	     */
	    AnonymousObserver.prototype.next = function (value) {
	      this._onNext(value);
	    };

	    /**
	     * Calls the onError action.
	     * @param {Any} error The error that has occurred.
	     */
	    AnonymousObserver.prototype.error = function (error) {
	      this._onError(error);
	    };

	    /**
	     *  Calls the onCompleted action.
	     */
	    AnonymousObserver.prototype.completed = function () {
	      this._onCompleted();
	    };

	    return AnonymousObserver;
	  }(AbstractObserver));

	  var CheckedObserver = (function (__super__) {
	    inherits(CheckedObserver, __super__);

	    function CheckedObserver(observer) {
	      __super__.call(this);
	      this._observer = observer;
	      this._state = 0; // 0 - idle, 1 - busy, 2 - done
	    }

	    var CheckedObserverPrototype = CheckedObserver.prototype;

	    CheckedObserverPrototype.onNext = function (value) {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onNext).call(this._observer, value);
	      this._state = 0;
	      res === errorObj && thrower(res.e);
	    };

	    CheckedObserverPrototype.onError = function (err) {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onError).call(this._observer, err);
	      this._state = 2;
	      res === errorObj && thrower(res.e);
	    };

	    CheckedObserverPrototype.onCompleted = function () {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onCompleted).call(this._observer);
	      this._state = 2;
	      res === errorObj && thrower(res.e);
	    };

	    CheckedObserverPrototype.checkAccess = function () {
	      if (this._state === 1) { throw new Error('Re-entrancy detected'); }
	      if (this._state === 2) { throw new Error('Observer completed'); }
	      if (this._state === 0) { this._state = 1; }
	    };

	    return CheckedObserver;
	  }(Observer));

	  var ScheduledObserver = Rx.internals.ScheduledObserver = (function (__super__) {
	    inherits(ScheduledObserver, __super__);

	    function ScheduledObserver(scheduler, observer) {
	      __super__.call(this);
	      this.scheduler = scheduler;
	      this.observer = observer;
	      this.isAcquired = false;
	      this.hasFaulted = false;
	      this.queue = [];
	      this.disposable = new SerialDisposable();
	    }

	    function enqueueNext(observer, x) { return function () { observer.onNext(x); }; }
	    function enqueueError(observer, e) { return function () { observer.onError(e); }; }
	    function enqueueCompleted(observer) { return function () { observer.onCompleted(); }; }

	    ScheduledObserver.prototype.next = function (x) {
	      this.queue.push(enqueueNext(this.observer, x));
	    };

	    ScheduledObserver.prototype.error = function (e) {
	      this.queue.push(enqueueError(this.observer, e));
	    };

	    ScheduledObserver.prototype.completed = function () {
	      this.queue.push(enqueueCompleted(this.observer));
	    };


	    function scheduleMethod(state, recurse) {
	      var work;
	      if (state.queue.length > 0) {
	        work = state.queue.shift();
	      } else {
	        state.isAcquired = false;
	        return;
	      }
	      var res = tryCatch(work)();
	      if (res === errorObj) {
	        state.queue = [];
	        state.hasFaulted = true;
	        return thrower(res.e);
	      }
	      recurse(state);
	    }

	    ScheduledObserver.prototype.ensureActive = function () {
	      var isOwner = false;
	      if (!this.hasFaulted && this.queue.length > 0) {
	        isOwner = !this.isAcquired;
	        this.isAcquired = true;
	      }
	      isOwner &&
	        this.disposable.setDisposable(this.scheduler.scheduleRecursive(this, scheduleMethod));
	    };

	    ScheduledObserver.prototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this.disposable.dispose();
	    };

	    return ScheduledObserver;
	  }(AbstractObserver));

	  var ObserveOnObserver = (function (__super__) {
	    inherits(ObserveOnObserver, __super__);

	    function ObserveOnObserver(scheduler, observer, cancel) {
	      __super__.call(this, scheduler, observer);
	      this._cancel = cancel;
	    }

	    ObserveOnObserver.prototype.next = function (value) {
	      __super__.prototype.next.call(this, value);
	      this.ensureActive();
	    };

	    ObserveOnObserver.prototype.error = function (e) {
	      __super__.prototype.error.call(this, e);
	      this.ensureActive();
	    };

	    ObserveOnObserver.prototype.completed = function () {
	      __super__.prototype.completed.call(this);
	      this.ensureActive();
	    };

	    ObserveOnObserver.prototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this._cancel && this._cancel.dispose();
	      this._cancel = null;
	    };

	    return ObserveOnObserver;
	  })(ScheduledObserver);

	  var observableProto;

	  /**
	   * Represents a push-style collection.
	   */
	  var Observable = Rx.Observable = (function () {

	    function makeSubscribe(self, subscribe) {
	      return function (o) {
	        var oldOnError = o.onError;
	        o.onError = function (e) {
	          makeStackTraceLong(e, self);
	          oldOnError.call(o, e);
	        };

	        return subscribe.call(self, o);
	      };
	    }

	    function Observable() {
	      if (Rx.config.longStackSupport && hasStacks) {
	        var oldSubscribe = this._subscribe;
	        var e = tryCatch(thrower)(new Error()).e;
	        this.stack = e.stack.substring(e.stack.indexOf('\n') + 1);
	        this._subscribe = makeSubscribe(this, oldSubscribe);
	      }
	    }

	    observableProto = Observable.prototype;

	    /**
	    * Determines whether the given object is an Observable
	    * @param {Any} An object to determine whether it is an Observable
	    * @returns {Boolean} true if an Observable, else false.
	    */
	    Observable.isObservable = function (o) {
	      return o && isFunction(o.subscribe);
	    };

	    /**
	     *  Subscribes an o to the observable sequence.
	     *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
	     *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
	     *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
	     *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribe = observableProto.forEach = function (oOrOnNext, onError, onCompleted) {
	      return this._subscribe(typeof oOrOnNext === 'object' ?
	        oOrOnNext :
	        observerCreate(oOrOnNext, onError, onCompleted));
	    };

	    /**
	     * Subscribes to the next value in the sequence with an optional "this" argument.
	     * @param {Function} onNext The function to invoke on each element in the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnNext = function (onNext, thisArg) {
	      return this._subscribe(observerCreate(typeof thisArg !== 'undefined' ? function(x) { onNext.call(thisArg, x); } : onNext));
	    };

	    /**
	     * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
	     * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnError = function (onError, thisArg) {
	      return this._subscribe(observerCreate(null, typeof thisArg !== 'undefined' ? function(e) { onError.call(thisArg, e); } : onError));
	    };

	    /**
	     * Subscribes to the next value in the sequence with an optional "this" argument.
	     * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnCompleted = function (onCompleted, thisArg) {
	      return this._subscribe(observerCreate(null, null, typeof thisArg !== 'undefined' ? function() { onCompleted.call(thisArg); } : onCompleted));
	    };

	    return Observable;
	  })();

	  var ObservableBase = Rx.ObservableBase = (function (__super__) {
	    inherits(ObservableBase, __super__);

	    function fixSubscriber(subscriber) {
	      return subscriber && isFunction(subscriber.dispose) ? subscriber :
	        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
	    }

	    function setDisposable(s, state) {
	      var ado = state[0], self = state[1];
	      var sub = tryCatch(self.subscribeCore).call(self, ado);
	      if (sub === errorObj && !ado.fail(errorObj.e)) { thrower(errorObj.e); }
	      ado.setDisposable(fixSubscriber(sub));
	    }

	    function ObservableBase() {
	      __super__.call(this);
	    }

	    ObservableBase.prototype._subscribe = function (o) {
	      var ado = new AutoDetachObserver(o), state = [ado, this];

	      if (currentThreadScheduler.scheduleRequired()) {
	        currentThreadScheduler.schedule(state, setDisposable);
	      } else {
	        setDisposable(null, state);
	      }
	      return ado;
	    };

	    ObservableBase.prototype.subscribeCore = notImplemented;

	    return ObservableBase;
	  }(Observable));

	var FlatMapObservable = Rx.FlatMapObservable = (function(__super__) {

	    inherits(FlatMapObservable, __super__);

	    function FlatMapObservable(source, selector, resultSelector, thisArg) {
	      this.resultSelector = isFunction(resultSelector) ? resultSelector : null;
	      this.selector = bindCallback(isFunction(selector) ? selector : function() { return selector; }, thisArg, 3);
	      this.source = source;
	      __super__.call(this);
	    }

	    FlatMapObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o, this.selector, this.resultSelector, this));
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(observer, selector, resultSelector, source) {
	      this.i = 0;
	      this.selector = selector;
	      this.resultSelector = resultSelector;
	      this.source = source;
	      this.o = observer;
	      AbstractObserver.call(this);
	    }

	    InnerObserver.prototype._wrapResult = function(result, x, i) {
	      return this.resultSelector ?
	        result.map(function(y, i2) { return this.resultSelector(x, y, i, i2); }, this) :
	        result;
	    };

	    InnerObserver.prototype.next = function(x) {
	      var i = this.i++;
	      var result = tryCatch(this.selector)(x, i, this.source);
	      if (result === errorObj) { return this.o.onError(result.e); }

	      isPromise(result) && (result = observableFromPromise(result));
	      (isArrayLike(result) || isIterable(result)) && (result = Observable.from(result));
	      this.o.onNext(this._wrapResult(result, x, i));
	    };

	    InnerObserver.prototype.error = function(e) { this.o.onError(e); };

	    InnerObserver.prototype.completed = function() { this.o.onCompleted(); };

	    return FlatMapObservable;

	}(ObservableBase));

	  var Enumerable = Rx.internals.Enumerable = function () { };

	  function IsDisposedDisposable(state) {
	    this._s = state;
	    this.isDisposed = false;
	  }

	  IsDisposedDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      this._s.isDisposed = true;
	    }
	  };

	  var ConcatEnumerableObservable = (function(__super__) {
	    inherits(ConcatEnumerableObservable, __super__);
	    function ConcatEnumerableObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }

	    function scheduleMethod(state, recurse) {
	      if (state.isDisposed) { return; }
	      var currentItem = tryCatch(state.e.next).call(state.e);
	      if (currentItem === errorObj) { return state.o.onError(currentItem.e); }
	      if (currentItem.done) { return state.o.onCompleted(); }

	      // Check if promise
	      var currentValue = currentItem.value;
	      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	      var d = new SingleAssignmentDisposable();
	      state.subscription.setDisposable(d);
	      d.setDisposable(currentValue.subscribe(new InnerObserver(state, recurse)));
	    }

	    ConcatEnumerableObservable.prototype.subscribeCore = function (o) {
	      var subscription = new SerialDisposable();
	      var state = {
	        isDisposed: false,
	        o: o,
	        subscription: subscription,
	        e: this.sources[$iterator$]()
	      };

	      var cancelable = currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
	      return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
	    };

	    function InnerObserver(state, recurse) {
	      this._state = state;
	      this._recurse = recurse;
	      AbstractObserver.call(this);
	    }

	    inherits(InnerObserver, AbstractObserver);

	    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
	    InnerObserver.prototype.error = function (e) { this._state.o.onError(e); };
	    InnerObserver.prototype.completed = function () { this._recurse(this._state); };

	    return ConcatEnumerableObservable;
	  }(ObservableBase));

	  Enumerable.prototype.concat = function () {
	    return new ConcatEnumerableObservable(this);
	  };

	  var CatchErrorObservable = (function(__super__) {
	    function CatchErrorObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }

	    inherits(CatchErrorObservable, __super__);

	    function scheduleMethod(state, recurse) {
	      if (state.isDisposed) { return; }
	      var currentItem = tryCatch(state.e.next).call(state.e);
	      if (currentItem === errorObj) { return state.o.onError(currentItem.e); }
	      if (currentItem.done) { return state.lastError !== null ? state.o.onError(state.lastError) : state.o.onCompleted(); }

	      var currentValue = currentItem.value;
	      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	      var d = new SingleAssignmentDisposable();
	      state.subscription.setDisposable(d);
	      d.setDisposable(currentValue.subscribe(new InnerObserver(state, recurse)));
	    }

	    CatchErrorObservable.prototype.subscribeCore = function (o) {
	      var subscription = new SerialDisposable();
	      var state = {
	        isDisposed: false,
	        e: this.sources[$iterator$](),
	        subscription: subscription,
	        lastError: null,
	        o: o
	      };

	      var cancelable = currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
	      return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
	    };

	    function InnerObserver(state, recurse) {
	      this._state = state;
	      this._recurse = recurse;
	      AbstractObserver.call(this);
	    }

	    inherits(InnerObserver, AbstractObserver);

	    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
	    InnerObserver.prototype.error = function (e) { this._state.lastError = e; this._recurse(this._state); };
	    InnerObserver.prototype.completed = function () { this._state.o.onCompleted(); };

	    return CatchErrorObservable;
	  }(ObservableBase));

	  Enumerable.prototype.catchError = function () {
	    return new CatchErrorObservable(this);
	  };

	  Enumerable.prototype.catchErrorWhen = function (notificationHandler) {
	    var sources = this;
	    return new AnonymousObservable(function (o) {
	      var exceptions = new Subject(),
	        notifier = new Subject(),
	        handled = notificationHandler(exceptions),
	        notificationDisposable = handled.subscribe(notifier);

	      var e = sources[$iterator$]();

	      var state = { isDisposed: false },
	        lastError,
	        subscription = new SerialDisposable();
	      var cancelable = currentThreadScheduler.scheduleRecursive(null, function (_, self) {
	        if (state.isDisposed) { return; }
	        var currentItem = tryCatch(e.next).call(e);
	        if (currentItem === errorObj) { return o.onError(currentItem.e); }

	        if (currentItem.done) {
	          if (lastError) {
	            o.onError(lastError);
	          } else {
	            o.onCompleted();
	          }
	          return;
	        }

	        // Check if promise
	        var currentValue = currentItem.value;
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	        var outer = new SingleAssignmentDisposable();
	        var inner = new SingleAssignmentDisposable();
	        subscription.setDisposable(new BinaryDisposable(inner, outer));
	        outer.setDisposable(currentValue.subscribe(
	          function(x) { o.onNext(x); },
	          function (exn) {
	            inner.setDisposable(notifier.subscribe(self, function(ex) {
	              o.onError(ex);
	            }, function() {
	              o.onCompleted();
	            }));

	            exceptions.onNext(exn);
	          },
	          function() { o.onCompleted(); }));
	      });

	      return new NAryDisposable([notificationDisposable, subscription, cancelable, new IsDisposedDisposable(state)]);
	    });
	  };

	  var RepeatEnumerable = (function (__super__) {
	    inherits(RepeatEnumerable, __super__);
	    function RepeatEnumerable(v, c) {
	      this.v = v;
	      this.c = c == null ? -1 : c;
	    }

	    RepeatEnumerable.prototype[$iterator$] = function () {
	      return new RepeatEnumerator(this);
	    };

	    function RepeatEnumerator(p) {
	      this.v = p.v;
	      this.l = p.c;
	    }

	    RepeatEnumerator.prototype.next = function () {
	      if (this.l === 0) { return doneEnumerator; }
	      if (this.l > 0) { this.l--; }
	      return { done: false, value: this.v };
	    };

	    return RepeatEnumerable;
	  }(Enumerable));

	  var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
	    return new RepeatEnumerable(value, repeatCount);
	  };

	  var OfEnumerable = (function(__super__) {
	    inherits(OfEnumerable, __super__);
	    function OfEnumerable(s, fn, thisArg) {
	      this.s = s;
	      this.fn = fn ? bindCallback(fn, thisArg, 3) : null;
	    }
	    OfEnumerable.prototype[$iterator$] = function () {
	      return new OfEnumerator(this);
	    };

	    function OfEnumerator(p) {
	      this.i = -1;
	      this.s = p.s;
	      this.l = this.s.length;
	      this.fn = p.fn;
	    }

	    OfEnumerator.prototype.next = function () {
	     return ++this.i < this.l ?
	       { done: false, value: !this.fn ? this.s[this.i] : this.fn(this.s[this.i], this.i, this.s) } :
	       doneEnumerator;
	    };

	    return OfEnumerable;
	  }(Enumerable));

	  var enumerableOf = Enumerable.of = function (source, selector, thisArg) {
	    return new OfEnumerable(source, selector, thisArg);
	  };

	var ObserveOnObservable = (function (__super__) {
	  inherits(ObserveOnObservable, __super__);
	  function ObserveOnObservable(source, s) {
	    this.source = source;
	    this._s = s;
	    __super__.call(this);
	  }

	  ObserveOnObservable.prototype.subscribeCore = function (o) {
	    return this.source.subscribe(new ObserveOnObserver(this._s, o));
	  };

	  return ObserveOnObservable;
	}(ObservableBase));

	   /**
	   *  Wraps the source sequence in order to run its observer callbacks on the specified scheduler.
	   *
	   *  This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects
	   *  that require to be run on a scheduler, use subscribeOn.
	   *
	   *  @param {Scheduler} scheduler Scheduler to notify observers on.
	   *  @returns {Observable} The source sequence whose observations happen on the specified scheduler.
	   */
	  observableProto.observeOn = function (scheduler) {
	    return new ObserveOnObservable(this, scheduler);
	  };

	  var SubscribeOnObservable = (function (__super__) {
	    inherits(SubscribeOnObservable, __super__);
	    function SubscribeOnObservable(source, s) {
	      this.source = source;
	      this._s = s;
	      __super__.call(this);
	    }

	    function scheduleMethod(scheduler, state) {
	      var source = state[0], d = state[1], o = state[2];
	      d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(o)));
	    }

	    SubscribeOnObservable.prototype.subscribeCore = function (o) {
	      var m = new SingleAssignmentDisposable(), d = new SerialDisposable();
	      d.setDisposable(m);
	      m.setDisposable(this._s.schedule([this.source, d, o], scheduleMethod));
	      return d;
	    };

	    return SubscribeOnObservable;
	  }(ObservableBase));

	   /**
	   *  Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler. This operation is not commonly used;
	   *  see the remarks section for more information on the distinction between subscribeOn and observeOn.

	   *  This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer
	   *  callbacks on a scheduler, use observeOn.

	   *  @param {Scheduler} scheduler Scheduler to perform subscription and unsubscription actions on.
	   *  @returns {Observable} The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.
	   */
	  observableProto.subscribeOn = function (scheduler) {
	    return new SubscribeOnObservable(this, scheduler);
	  };

	  var FromPromiseObservable = (function(__super__) {
	    inherits(FromPromiseObservable, __super__);
	    function FromPromiseObservable(p, s) {
	      this._p = p;
	      this._s = s;
	      __super__.call(this);
	    }

	    function scheduleNext(s, state) {
	      var o = state[0], data = state[1];
	      o.onNext(data);
	      o.onCompleted();
	    }

	    function scheduleError(s, state) {
	      var o = state[0], err = state[1];
	      o.onError(err);
	    }

	    FromPromiseObservable.prototype.subscribeCore = function(o) {
	      var sad = new SingleAssignmentDisposable(), self = this;

	      this._p
	        .then(function (data) {
	          sad.setDisposable(self._s.schedule([o, data], scheduleNext));
	        }, function (err) {
	          sad.setDisposable(self._s.schedule([o, err], scheduleError));
	        });

	      return sad;
	    };

	    return FromPromiseObservable;
	  }(ObservableBase));

	  /**
	  * Converts a Promise to an Observable sequence
	  * @param {Promise} An ES6 Compliant promise.
	  * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
	  */
	  var observableFromPromise = Observable.fromPromise = function (promise, scheduler) {
	    scheduler || (scheduler = defaultScheduler);
	    return new FromPromiseObservable(promise, scheduler);
	  };

	  /*
	   * Converts an existing observable sequence to an ES6 Compatible Promise
	   * @example
	   * var promise = Rx.Observable.return(42).toPromise(RSVP.Promise);
	   *
	   * // With config
	   * Rx.config.Promise = RSVP.Promise;
	   * var promise = Rx.Observable.return(42).toPromise();
	   * @param {Function} [promiseCtor] The constructor of the promise. If not provided, it looks for it in Rx.config.Promise.
	   * @returns {Promise} An ES6 compatible promise with the last value from the observable sequence.
	   */
	  observableProto.toPromise = function (promiseCtor) {
	    promiseCtor || (promiseCtor = Rx.config.Promise);
	    if (!promiseCtor) { throw new NotSupportedError('Promise type not provided nor in Rx.config.Promise'); }
	    var source = this;
	    return new promiseCtor(function (resolve, reject) {
	      // No cancellation can be done
	      var value;
	      source.subscribe(function (v) {
	        value = v;
	      }, reject, function () {
	        resolve(value);
	      });
	    });
	  };

	  var ToArrayObservable = (function(__super__) {
	    inherits(ToArrayObservable, __super__);
	    function ToArrayObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    ToArrayObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o));
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o) {
	      this.o = o;
	      this.a = [];
	      AbstractObserver.call(this);
	    }
	    
	    InnerObserver.prototype.next = function (x) { this.a.push(x); };
	    InnerObserver.prototype.error = function (e) { this.o.onError(e);  };
	    InnerObserver.prototype.completed = function () { this.o.onNext(this.a); this.o.onCompleted(); };

	    return ToArrayObservable;
	  }(ObservableBase));

	  /**
	  * Creates an array from an observable sequence.
	  * @returns {Observable} An observable sequence containing a single element with a list containing all the elements of the source sequence.
	  */
	  observableProto.toArray = function () {
	    return new ToArrayObservable(this);
	  };

	  /**
	   *  Creates an observable sequence from a specified subscribe method implementation.
	   * @example
	   *  var res = Rx.Observable.create(function (observer) { return function () { } );
	   *  var res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } );
	   *  var res = Rx.Observable.create(function (observer) { } );
	   * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
	   * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
	   */
	  Observable.create = function (subscribe, parent) {
	    return new AnonymousObservable(subscribe, parent);
	  };

	  var Defer = (function(__super__) {
	    inherits(Defer, __super__);
	    function Defer(factory) {
	      this._f = factory;
	      __super__.call(this);
	    }

	    Defer.prototype.subscribeCore = function (o) {
	      var result = tryCatch(this._f)();
	      if (result === errorObj) { return observableThrow(result.e).subscribe(o);}
	      isPromise(result) && (result = observableFromPromise(result));
	      return result.subscribe(o);
	    };

	    return Defer;
	  }(ObservableBase));

	  /**
	   *  Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
	   *
	   * @example
	   *  var res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });
	   * @param {Function} observableFactory Observable factory function to invoke for each observer that subscribes to the resulting sequence or Promise.
	   * @returns {Observable} An observable sequence whose observers trigger an invocation of the given observable factory function.
	   */
	  var observableDefer = Observable.defer = function (observableFactory) {
	    return new Defer(observableFactory);
	  };

	  var EmptyObservable = (function(__super__) {
	    inherits(EmptyObservable, __super__);
	    function EmptyObservable(scheduler) {
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    EmptyObservable.prototype.subscribeCore = function (observer) {
	      var sink = new EmptySink(observer, this.scheduler);
	      return sink.run();
	    };

	    function EmptySink(observer, scheduler) {
	      this.observer = observer;
	      this.scheduler = scheduler;
	    }

	    function scheduleItem(s, state) {
	      state.onCompleted();
	      return disposableEmpty;
	    }

	    EmptySink.prototype.run = function () {
	      var state = this.observer;
	      return this.scheduler === immediateScheduler ?
	        scheduleItem(null, state) :
	        this.scheduler.schedule(state, scheduleItem);
	    };

	    return EmptyObservable;
	  }(ObservableBase));

	  var EMPTY_OBSERVABLE = new EmptyObservable(immediateScheduler);

	  /**
	   *  Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
	   *
	   * @example
	   *  var res = Rx.Observable.empty();
	   *  var res = Rx.Observable.empty(Rx.Scheduler.timeout);
	   * @param {Scheduler} [scheduler] Scheduler to send the termination call on.
	   * @returns {Observable} An observable sequence with no elements.
	   */
	  var observableEmpty = Observable.empty = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return scheduler === immediateScheduler ? EMPTY_OBSERVABLE : new EmptyObservable(scheduler);
	  };

	  var FromObservable = (function(__super__) {
	    inherits(FromObservable, __super__);
	    function FromObservable(iterable, fn, scheduler) {
	      this._iterable = iterable;
	      this._fn = fn;
	      this._scheduler = scheduler;
	      __super__.call(this);
	    }

	    function createScheduleMethod(o, it, fn) {
	      return function loopRecursive(i, recurse) {
	        var next = tryCatch(it.next).call(it);
	        if (next === errorObj) { return o.onError(next.e); }
	        if (next.done) { return o.onCompleted(); }

	        var result = next.value;

	        if (isFunction(fn)) {
	          result = tryCatch(fn)(result, i);
	          if (result === errorObj) { return o.onError(result.e); }
	        }

	        o.onNext(result);
	        recurse(i + 1);
	      };
	    }

	    FromObservable.prototype.subscribeCore = function (o) {
	      var list = Object(this._iterable),
	          it = getIterable(list);

	      return this._scheduler.scheduleRecursive(0, createScheduleMethod(o, it, this._fn));
	    };

	    return FromObservable;
	  }(ObservableBase));

	  var maxSafeInteger = Math.pow(2, 53) - 1;

	  function StringIterable(s) {
	    this._s = s;
	  }

	  StringIterable.prototype[$iterator$] = function () {
	    return new StringIterator(this._s);
	  };

	  function StringIterator(s) {
	    this._s = s;
	    this._l = s.length;
	    this._i = 0;
	  }

	  StringIterator.prototype[$iterator$] = function () {
	    return this;
	  };

	  StringIterator.prototype.next = function () {
	    return this._i < this._l ? { done: false, value: this._s.charAt(this._i++) } : doneEnumerator;
	  };

	  function ArrayIterable(a) {
	    this._a = a;
	  }

	  ArrayIterable.prototype[$iterator$] = function () {
	    return new ArrayIterator(this._a);
	  };

	  function ArrayIterator(a) {
	    this._a = a;
	    this._l = toLength(a);
	    this._i = 0;
	  }

	  ArrayIterator.prototype[$iterator$] = function () {
	    return this;
	  };

	  ArrayIterator.prototype.next = function () {
	    return this._i < this._l ? { done: false, value: this._a[this._i++] } : doneEnumerator;
	  };

	  function numberIsFinite(value) {
	    return typeof value === 'number' && root.isFinite(value);
	  }

	  function isNan(n) {
	    return n !== n;
	  }

	  function getIterable(o) {
	    var i = o[$iterator$], it;
	    if (!i && typeof o === 'string') {
	      it = new StringIterable(o);
	      return it[$iterator$]();
	    }
	    if (!i && o.length !== undefined) {
	      it = new ArrayIterable(o);
	      return it[$iterator$]();
	    }
	    if (!i) { throw new TypeError('Object is not iterable'); }
	    return o[$iterator$]();
	  }

	  function sign(value) {
	    var number = +value;
	    if (number === 0) { return number; }
	    if (isNaN(number)) { return number; }
	    return number < 0 ? -1 : 1;
	  }

	  function toLength(o) {
	    var len = +o.length;
	    if (isNaN(len)) { return 0; }
	    if (len === 0 || !numberIsFinite(len)) { return len; }
	    len = sign(len) * Math.floor(Math.abs(len));
	    if (len <= 0) { return 0; }
	    if (len > maxSafeInteger) { return maxSafeInteger; }
	    return len;
	  }

	  /**
	  * This method creates a new Observable sequence from an array-like or iterable object.
	  * @param {Any} arrayLike An array-like or iterable object to convert to an Observable sequence.
	  * @param {Function} [mapFn] Map function to call on every element of the array.
	  * @param {Any} [thisArg] The context to use calling the mapFn if provided.
	  * @param {Scheduler} [scheduler] Optional scheduler to use for scheduling.  If not provided, defaults to Scheduler.currentThread.
	  */
	  var observableFrom = Observable.from = function (iterable, mapFn, thisArg, scheduler) {
	    if (iterable == null) {
	      throw new Error('iterable cannot be null.')
	    }
	    if (mapFn && !isFunction(mapFn)) {
	      throw new Error('mapFn when provided must be a function');
	    }
	    if (mapFn) {
	      var mapper = bindCallback(mapFn, thisArg, 2);
	    }
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromObservable(iterable, mapper, scheduler);
	  }

	  var FromArrayObservable = (function(__super__) {
	    inherits(FromArrayObservable, __super__);
	    function FromArrayObservable(args, scheduler) {
	      this._args = args;
	      this._scheduler = scheduler;
	      __super__.call(this);
	    }

	    function scheduleMethod(o, args) {
	      var len = args.length;
	      return function loopRecursive (i, recurse) {
	        if (i < len) {
	          o.onNext(args[i]);
	          recurse(i + 1);
	        } else {
	          o.onCompleted();
	        }
	      };
	    }

	    FromArrayObservable.prototype.subscribeCore = function (o) {
	      return this._scheduler.scheduleRecursive(0, scheduleMethod(o, this._args));
	    };

	    return FromArrayObservable;
	  }(ObservableBase));

	  /**
	  *  Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
	  * @deprecated use Observable.from or Observable.of
	  * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given enumerable sequence.
	  */
	  var observableFromArray = Observable.fromArray = function (array, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromArrayObservable(array, scheduler)
	  };

	  var GenerateObservable = (function (__super__) {
	    inherits(GenerateObservable, __super__);
	    function GenerateObservable(state, cndFn, itrFn, resFn, s) {
	      this._state = state;
	      this._cndFn = cndFn;
	      this._itrFn = itrFn;
	      this._resFn = resFn;
	      this._s = s;
	      this._first = true;
	      __super__.call(this);
	    }

	    function scheduleRecursive(self, recurse) {
	      if (self._first) {
	        self._first = false;
	      } else {
	        self._state = tryCatch(self._itrFn)(self._state);
	        if (self._state === errorObj) { return self._o.onError(self._state.e); }
	      }
	      var hasResult = tryCatch(self._cndFn)(self._state);
	      if (hasResult === errorObj) { return self._o.onError(hasResult.e); }
	      if (hasResult) {
	        var result = tryCatch(self._resFn)(self._state);
	        if (result === errorObj) { return self._o.onError(result.e); }
	        self._o.onNext(result);
	        recurse(self);
	      } else {
	        self._o.onCompleted();
	      }
	    }

	    GenerateObservable.prototype.subscribeCore = function (o) {
	      this._o = o;
	      return this._s.scheduleRecursive(this, scheduleRecursive);
	    };

	    return GenerateObservable;
	  }(ObservableBase));

	  /**
	   *  Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
	   *
	   * @example
	   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
	   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Scheduler} [scheduler] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new GenerateObservable(initialState, condition, iterate, resultSelector, scheduler);
	  };

	  function observableOf (scheduler, array) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromArrayObservable(array, scheduler);
	  }

	  /**
	  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	  */
	  Observable.of = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return new FromArrayObservable(args, currentThreadScheduler);
	  };

	  /**
	  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	  * @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	  */
	  Observable.ofWithScheduler = function (scheduler) {
	    var len = arguments.length, args = new Array(len - 1);
	    for(var i = 1; i < len; i++) { args[i - 1] = arguments[i]; }
	    return new FromArrayObservable(args, scheduler);
	  };

	  /**
	   * Creates an Observable sequence from changes to an array using Array.observe.
	   * @param {Array} array An array to observe changes.
	   * @returns {Observable} An observable sequence containing changes to an array from Array.observe.
	   */
	  Observable.ofArrayChanges = function(array) {
	    if (!Array.isArray(array)) { throw new TypeError('Array.observe only accepts arrays.'); }
	    if (typeof Array.observe !== 'function' && typeof Array.unobserve !== 'function') { throw new TypeError('Array.observe is not supported on your platform') }
	    return new AnonymousObservable(function(observer) {
	      function observerFn(changes) {
	        for(var i = 0, len = changes.length; i < len; i++) {
	          observer.onNext(changes[i]);
	        }
	      }
	      
	      Array.observe(array, observerFn);

	      return function () {
	        Array.unobserve(array, observerFn);
	      };
	    });
	  };

	  /**
	   * Creates an Observable sequence from changes to an object using Object.observe.
	   * @param {Object} obj An object to observe changes.
	   * @returns {Observable} An observable sequence containing changes to an object from Object.observe.
	   */
	  Observable.ofObjectChanges = function(obj) {
	    if (obj == null) { throw new TypeError('object must not be null or undefined.'); }
	    if (typeof Object.observe !== 'function' && typeof Object.unobserve !== 'function') { throw new TypeError('Object.observe is not supported on your platform') }
	    return new AnonymousObservable(function(observer) {
	      function observerFn(changes) {
	        for(var i = 0, len = changes.length; i < len; i++) {
	          observer.onNext(changes[i]);
	        }
	      }

	      Object.observe(obj, observerFn);

	      return function () {
	        Object.unobserve(obj, observerFn);
	      };
	    });
	  };

	  var NeverObservable = (function(__super__) {
	    inherits(NeverObservable, __super__);
	    function NeverObservable() {
	      __super__.call(this);
	    }

	    NeverObservable.prototype.subscribeCore = function (observer) {
	      return disposableEmpty;
	    };

	    return NeverObservable;
	  }(ObservableBase));

	  var NEVER_OBSERVABLE = new NeverObservable();

	  /**
	   * Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
	   * @returns {Observable} An observable sequence whose observers will never get called.
	   */
	  var observableNever = Observable.never = function () {
	    return NEVER_OBSERVABLE;
	  };

	  var PairsObservable = (function(__super__) {
	    inherits(PairsObservable, __super__);
	    function PairsObservable(o, scheduler) {
	      this._o = o;
	      this._keys = Object.keys(o);
	      this._scheduler = scheduler;
	      __super__.call(this);
	    }

	    function scheduleMethod(o, obj, keys) {
	      return function loopRecursive(i, recurse) {
	        if (i < keys.length) {
	          var key = keys[i];
	          o.onNext([key, obj[key]]);
	          recurse(i + 1);
	        } else {
	          o.onCompleted();
	        }
	      };
	    }

	    PairsObservable.prototype.subscribeCore = function (o) {
	      return this._scheduler.scheduleRecursive(0, scheduleMethod(o, this._o, this._keys));
	    };

	    return PairsObservable;
	  }(ObservableBase));

	  /**
	   * Convert an object into an observable sequence of [key, value] pairs.
	   * @param {Object} obj The object to inspect.
	   * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
	   * @returns {Observable} An observable sequence of [key, value] pairs from the object.
	   */
	  Observable.pairs = function (obj, scheduler) {
	    scheduler || (scheduler = currentThreadScheduler);
	    return new PairsObservable(obj, scheduler);
	  };

	    var RangeObservable = (function(__super__) {
	    inherits(RangeObservable, __super__);
	    function RangeObservable(start, count, scheduler) {
	      this.start = start;
	      this.rangeCount = count;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    function loopRecursive(start, count, o) {
	      return function loop (i, recurse) {
	        if (i < count) {
	          o.onNext(start + i);
	          recurse(i + 1);
	        } else {
	          o.onCompleted();
	        }
	      };
	    }

	    RangeObservable.prototype.subscribeCore = function (o) {
	      return this.scheduler.scheduleRecursive(
	        0,
	        loopRecursive(this.start, this.rangeCount, o)
	      );
	    };

	    return RangeObservable;
	  }(ObservableBase));

	  /**
	  *  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
	  * @param {Number} start The value of the first integer in the sequence.
	  * @param {Number} count The number of sequential integers to generate.
	  * @param {Scheduler} [scheduler] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
	  * @returns {Observable} An observable sequence that contains a range of sequential integral numbers.
	  */
	  Observable.range = function (start, count, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new RangeObservable(start, count, scheduler);
	  };

	  var RepeatObservable = (function(__super__) {
	    inherits(RepeatObservable, __super__);
	    function RepeatObservable(value, repeatCount, scheduler) {
	      this.value = value;
	      this.repeatCount = repeatCount == null ? -1 : repeatCount;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    RepeatObservable.prototype.subscribeCore = function (observer) {
	      var sink = new RepeatSink(observer, this);
	      return sink.run();
	    };

	    return RepeatObservable;
	  }(ObservableBase));

	  function RepeatSink(observer, parent) {
	    this.observer = observer;
	    this.parent = parent;
	  }

	  RepeatSink.prototype.run = function () {
	    var observer = this.observer, value = this.parent.value;
	    function loopRecursive(i, recurse) {
	      if (i === -1 || i > 0) {
	        observer.onNext(value);
	        i > 0 && i--;
	      }
	      if (i === 0) { return observer.onCompleted(); }
	      recurse(i);
	    }

	    return this.parent.scheduler.scheduleRecursive(this.parent.repeatCount, loopRecursive);
	  };

	  /**
	   *  Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.
	   * @param {Mixed} value Element to repeat.
	   * @param {Number} repeatCount [Optiona] Number of times to repeat the element. If not specified, repeats indefinitely.
	   * @param {Scheduler} scheduler Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} An observable sequence that repeats the given element the specified number of times.
	   */
	  Observable.repeat = function (value, repeatCount, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new RepeatObservable(value, repeatCount, scheduler);
	  };

	  var JustObservable = (function(__super__) {
	    inherits(JustObservable, __super__);
	    function JustObservable(value, scheduler) {
	      this._value = value;
	      this._scheduler = scheduler;
	      __super__.call(this);
	    }

	    JustObservable.prototype.subscribeCore = function (o) {
	      var state = [this._value, o];
	      return this._scheduler === immediateScheduler ?
	        scheduleItem(null, state) :
	        this._scheduler.schedule(state, scheduleItem);
	    };

	    function scheduleItem(s, state) {
	      var value = state[0], observer = state[1];
	      observer.onNext(value);
	      observer.onCompleted();
	      return disposableEmpty;
	    }

	    return JustObservable;
	  }(ObservableBase));

	  /**
	   *  Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
	   *  There is an alias called 'just' or browsers <IE9.
	   * @param {Mixed} value Single element in the resulting observable sequence.
	   * @param {Scheduler} scheduler Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} An observable sequence containing the single specified element.
	   */
	  var observableReturn = Observable['return'] = Observable.just = function (value, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return new JustObservable(value, scheduler);
	  };

	  var ThrowObservable = (function(__super__) {
	    inherits(ThrowObservable, __super__);
	    function ThrowObservable(error, scheduler) {
	      this._error = error;
	      this._scheduler = scheduler;
	      __super__.call(this);
	    }

	    ThrowObservable.prototype.subscribeCore = function (o) {
	      var state = [this._error, o];
	      return this._scheduler === immediateScheduler ?
	        scheduleItem(null, state) :
	        this._scheduler.schedule(state, scheduleItem);
	    };

	    function scheduleItem(s, state) {
	      var e = state[0], o = state[1];
	      o.onError(e);
	      return disposableEmpty;
	    }

	    return ThrowObservable;
	  }(ObservableBase));

	  /**
	   *  Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single onError message.
	   *  There is an alias to this method called 'throwError' for browsers <IE9.
	   * @param {Mixed} error An object used for the sequence's termination.
	   * @param {Scheduler} scheduler Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} The observable sequence that terminates exceptionally with the specified exception object.
	   */
	  var observableThrow = Observable['throw'] = function (error, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return new ThrowObservable(error, scheduler);
	  };

	  var UsingObservable = (function (__super__) {
	    inherits(UsingObservable, __super__);
	    function UsingObservable(resFn, obsFn) {
	      this._resFn = resFn;
	      this._obsFn = obsFn;
	      __super__.call(this);
	    }

	    UsingObservable.prototype.subscribeCore = function (o) {
	      var disposable = disposableEmpty;
	      var resource = tryCatch(this._resFn)();
	      if (resource === errorObj) {
	        return new BinaryDisposable(observableThrow(resource.e).subscribe(o), disposable);
	      }
	      resource && (disposable = resource);
	      var source = tryCatch(this._obsFn)(resource);
	      if (source === errorObj) {
	        return new BinaryDisposable(observableThrow(source.e).subscribe(o), disposable);
	      }
	      return new BinaryDisposable(source.subscribe(o), disposable);
	    };

	    return UsingObservable;
	  }(ObservableBase));

	  /**
	   * Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
	   * @param {Function} resourceFactory Factory function to obtain a resource object.
	   * @param {Function} observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
	   * @returns {Observable} An observable sequence whose lifetime controls the lifetime of the dependent resource object.
	   */
	  Observable.using = function (resourceFactory, observableFactory) {
	    return new UsingObservable(resourceFactory, observableFactory);
	  };

	  /**
	   * Propagates the observable sequence or Promise that reacts first.
	   * @param {Observable} rightSource Second observable sequence or Promise.
	   * @returns {Observable} {Observable} An observable sequence that surfaces either of the given sequences, whichever reacted first.
	   */
	  observableProto.amb = function (rightSource) {
	    var leftSource = this;
	    return new AnonymousObservable(function (observer) {
	      var choice,
	        leftChoice = 'L', rightChoice = 'R',
	        leftSubscription = new SingleAssignmentDisposable(),
	        rightSubscription = new SingleAssignmentDisposable();

	      isPromise(rightSource) && (rightSource = observableFromPromise(rightSource));

	      function choiceL() {
	        if (!choice) {
	          choice = leftChoice;
	          rightSubscription.dispose();
	        }
	      }

	      function choiceR() {
	        if (!choice) {
	          choice = rightChoice;
	          leftSubscription.dispose();
	        }
	      }

	      var leftSubscribe = observerCreate(
	        function (left) {
	          choiceL();
	          choice === leftChoice && observer.onNext(left);
	        },
	        function (e) {
	          choiceL();
	          choice === leftChoice && observer.onError(e);
	        },
	        function () {
	          choiceL();
	          choice === leftChoice && observer.onCompleted();
	        }
	      );
	      var rightSubscribe = observerCreate(
	        function (right) {
	          choiceR();
	          choice === rightChoice && observer.onNext(right);
	        },
	        function (e) {
	          choiceR();
	          choice === rightChoice && observer.onError(e);
	        },
	        function () {
	          choiceR();
	          choice === rightChoice && observer.onCompleted();
	        }
	      );

	      leftSubscription.setDisposable(leftSource.subscribe(leftSubscribe));
	      rightSubscription.setDisposable(rightSource.subscribe(rightSubscribe));

	      return new BinaryDisposable(leftSubscription, rightSubscription);
	    });
	  };

	  function amb(p, c) { return p.amb(c); }

	  /**
	   * Propagates the observable sequence or Promise that reacts first.
	   * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
	   */
	  Observable.amb = function () {
	    var acc = observableNever(), items;
	    if (Array.isArray(arguments[0])) {
	      items = arguments[0];
	    } else {
	      var len = arguments.length;
	      items = new Array(items);
	      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
	    }
	    for (var i = 0, len = items.length; i < len; i++) {
	      acc = amb(acc, items[i]);
	    }
	    return acc;
	  };

	  var CatchObservable = (function (__super__) {
	    inherits(CatchObservable, __super__);
	    function CatchObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    CatchObservable.prototype.subscribeCore = function (o) {
	      var d1 = new SingleAssignmentDisposable(), subscription = new SerialDisposable();
	      subscription.setDisposable(d1);
	      d1.setDisposable(this.source.subscribe(new CatchObserver(o, subscription, this._fn)));
	      return subscription;
	    };

	    return CatchObservable;
	  }(ObservableBase));

	  var CatchObserver = (function(__super__) {
	    inherits(CatchObserver, __super__);
	    function CatchObserver(o, s, fn) {
	      this._o = o;
	      this._s = s;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    CatchObserver.prototype.next = function (x) { this._o.onNext(x); };
	    CatchObserver.prototype.completed = function () { return this._o.onCompleted(); };
	    CatchObserver.prototype.error = function (e) {
	      var result = tryCatch(this._fn)(e);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      isPromise(result) && (result = observableFromPromise(result));

	      var d = new SingleAssignmentDisposable();
	      this._s.setDisposable(d);
	      d.setDisposable(result.subscribe(this._o));
	    };

	    return CatchObserver;
	  }(AbstractObserver));

	  /**
	   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	   * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
	   * @returns {Observable} An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
	   */
	  observableProto['catch'] = function (handlerOrSecond) {
	    return isFunction(handlerOrSecond) ? new CatchObservable(this, handlerOrSecond) : observableCatch([this, handlerOrSecond]);
	  };

	  /**
	   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	   * @param {Array | Arguments} args Arguments or an array to use as the next sequence if an error occurs.
	   * @returns {Observable} An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.
	   */
	  var observableCatch = Observable['catch'] = function () {
	    var items;
	    if (Array.isArray(arguments[0])) {
	      items = arguments[0];
	    } else {
	      var len = arguments.length;
	      items = new Array(len);
	      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
	    }
	    return enumerableOf(items).catchError();
	  };

	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	   * This can be in the form of an argument list of observables or an array.
	   *
	   * @example
	   * 1 - obs = observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	   * 2 - obs = observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  observableProto.combineLatest = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    if (Array.isArray(args[0])) {
	      args[0].unshift(this);
	    } else {
	      args.unshift(this);
	    }
	    return combineLatest.apply(this, args);
	  };

	  function falseFactory() { return false; }
	  function argumentsToArray() {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return args;
	  }

	  var CombineLatestObservable = (function(__super__) {
	    inherits(CombineLatestObservable, __super__);
	    function CombineLatestObservable(params, cb) {
	      this._params = params;
	      this._cb = cb;
	      __super__.call(this);
	    }

	    CombineLatestObservable.prototype.subscribeCore = function(observer) {
	      var len = this._params.length,
	          subscriptions = new Array(len);

	      var state = {
	        hasValue: arrayInitialize(len, falseFactory),
	        hasValueAll: false,
	        isDone: arrayInitialize(len, falseFactory),
	        values: new Array(len)
	      };

	      for (var i = 0; i < len; i++) {
	        var source = this._params[i], sad = new SingleAssignmentDisposable();
	        subscriptions[i] = sad;
	        isPromise(source) && (source = observableFromPromise(source));
	        sad.setDisposable(source.subscribe(new CombineLatestObserver(observer, i, this._cb, state)));
	      }

	      return new NAryDisposable(subscriptions);
	    };

	    return CombineLatestObservable;
	  }(ObservableBase));

	  var CombineLatestObserver = (function (__super__) {
	    inherits(CombineLatestObserver, __super__);
	    function CombineLatestObserver(o, i, cb, state) {
	      this._o = o;
	      this._i = i;
	      this._cb = cb;
	      this._state = state;
	      __super__.call(this);
	    }

	    function notTheSame(i) {
	      return function (x, j) {
	        return j !== i;
	      };
	    }

	    CombineLatestObserver.prototype.next = function (x) {
	      this._state.values[this._i] = x;
	      this._state.hasValue[this._i] = true;
	      if (this._state.hasValueAll || (this._state.hasValueAll = this._state.hasValue.every(identity))) {
	        var res = tryCatch(this._cb).apply(null, this._state.values);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        this._o.onNext(res);
	      } else if (this._state.isDone.filter(notTheSame(this._i)).every(identity)) {
	        this._o.onCompleted();
	      }
	    };

	    CombineLatestObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    CombineLatestObserver.prototype.completed = function () {
	      this._state.isDone[this._i] = true;
	      this._state.isDone.every(identity) && this._o.onCompleted();
	    };

	    return CombineLatestObserver;
	  }(AbstractObserver));

	  /**
	  * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	  *
	  * @example
	  * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	  * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	  * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	  */
	  var combineLatest = Observable.combineLatest = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);
	    return new CombineLatestObservable(args, resultSelector);
	  };

	  /**
	   * Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
	   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	   */
	  observableProto.concat = function () {
	    for(var args = [], i = 0, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	    args.unshift(this);
	    return observableConcat.apply(null, args);
	  };

	  var ConcatObserver = (function(__super__) {
	    inherits(ConcatObserver, __super__);
	    function ConcatObserver(s, fn) {
	      this._s = s;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    ConcatObserver.prototype.next = function (x) { this._s.o.onNext(x); };
	    ConcatObserver.prototype.error = function (e) { this._s.o.onError(e); };
	    ConcatObserver.prototype.completed = function () { this._s.i++; this._fn(this._s); };

	    return ConcatObserver;
	  }(AbstractObserver));

	  var ConcatObservable = (function(__super__) {
	    inherits(ConcatObservable, __super__);
	    function ConcatObservable(sources) {
	      this._sources = sources;
	      __super__.call(this);
	    }

	    function scheduleRecursive (state, recurse) {
	      if (state.disposable.isDisposed) { return; }
	      if (state.i === state.sources.length) { return state.o.onCompleted(); }

	      // Check if promise
	      var currentValue = state.sources[state.i];
	      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	      var d = new SingleAssignmentDisposable();
	      state.subscription.setDisposable(d);
	      d.setDisposable(currentValue.subscribe(new ConcatObserver(state, recurse)));
	    }

	    ConcatObservable.prototype.subscribeCore = function(o) {
	      var subscription = new SerialDisposable();
	      var disposable = disposableCreate(noop);
	      var state = {
	        o: o,
	        i: 0,
	        subscription: subscription,
	        disposable: disposable,
	        sources: this._sources
	      };

	      var cancelable = immediateScheduler.scheduleRecursive(state, scheduleRecursive);
	      return new NAryDisposable([subscription, disposable, cancelable]);
	    };

	    return ConcatObservable;
	  }(ObservableBase));

	  /**
	   * Concatenates all the observable sequences.
	   * @param {Array | Arguments} args Arguments or an array to concat to the observable sequence.
	   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	   */
	  var observableConcat = Observable.concat = function () {
	    var args;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	    } else {
	      args = new Array(arguments.length);
	      for(var i = 0, len = arguments.length; i < len; i++) { args[i] = arguments[i]; }
	    }
	    return new ConcatObservable(args);
	  };

	  /**
	   * Concatenates an observable sequence of observable sequences.
	   * @returns {Observable} An observable sequence that contains the elements of each observed inner sequence, in sequential order.
	   */
	  observableProto.concatAll = function () {
	    return this.merge(1);
	  };

	  var MergeObservable = (function (__super__) {
	    inherits(MergeObservable, __super__);

	    function MergeObservable(source, maxConcurrent) {
	      this.source = source;
	      this.maxConcurrent = maxConcurrent;
	      __super__.call(this);
	    }

	    MergeObservable.prototype.subscribeCore = function(observer) {
	      var g = new CompositeDisposable();
	      g.add(this.source.subscribe(new MergeObserver(observer, this.maxConcurrent, g)));
	      return g;
	    };

	    return MergeObservable;

	  }(ObservableBase));

	  var MergeObserver = (function (__super__) {
	    function MergeObserver(o, max, g) {
	      this.o = o;
	      this.max = max;
	      this.g = g;
	      this.done = false;
	      this.q = [];
	      this.activeCount = 0;
	      __super__.call(this);
	    }

	    inherits(MergeObserver, __super__);

	    MergeObserver.prototype.handleSubscribe = function (xs) {
	      var sad = new SingleAssignmentDisposable();
	      this.g.add(sad);
	      isPromise(xs) && (xs = observableFromPromise(xs));
	      sad.setDisposable(xs.subscribe(new InnerObserver(this, sad)));
	    };

	    MergeObserver.prototype.next = function (innerSource) {
	      if(this.activeCount < this.max) {
	        this.activeCount++;
	        this.handleSubscribe(innerSource);
	      } else {
	        this.q.push(innerSource);
	      }
	    };
	    MergeObserver.prototype.error = function (e) { this.o.onError(e); };
	    MergeObserver.prototype.completed = function () { this.done = true; this.activeCount === 0 && this.o.onCompleted(); };

	    function InnerObserver(parent, sad) {
	      this.parent = parent;
	      this.sad = sad;
	      __super__.call(this);
	    }

	    inherits(InnerObserver, __super__);

	    InnerObserver.prototype.next = function (x) { this.parent.o.onNext(x); };
	    InnerObserver.prototype.error = function (e) { this.parent.o.onError(e); };
	    InnerObserver.prototype.completed = function () {
	      this.parent.g.remove(this.sad);
	      if (this.parent.q.length > 0) {
	        this.parent.handleSubscribe(this.parent.q.shift());
	      } else {
	        this.parent.activeCount--;
	        this.parent.done && this.parent.activeCount === 0 && this.parent.o.onCompleted();
	      }
	    };

	    return MergeObserver;
	  }(AbstractObserver));

	  /**
	  * Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
	  * Or merges two observable sequences into a single observable sequence.
	  * @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
	  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	  */
	  observableProto.merge = function (maxConcurrentOrOther) {
	    return typeof maxConcurrentOrOther !== 'number' ?
	      observableMerge(this, maxConcurrentOrOther) :
	      new MergeObservable(this, maxConcurrentOrOther);
	  };

	  /**
	   * Merges all the observable sequences into a single observable sequence.
	   * The scheduler is optional and if not specified, the immediate scheduler is used.
	   * @returns {Observable} The observable sequence that merges the elements of the observable sequences.
	   */
	  var observableMerge = Observable.merge = function () {
	    var scheduler, sources = [], i, len = arguments.length;
	    if (!arguments[0]) {
	      scheduler = immediateScheduler;
	      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
	    } else if (isScheduler(arguments[0])) {
	      scheduler = arguments[0];
	      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
	    } else {
	      scheduler = immediateScheduler;
	      for(i = 0; i < len; i++) { sources.push(arguments[i]); }
	    }
	    if (Array.isArray(sources[0])) {
	      sources = sources[0];
	    }
	    return observableOf(scheduler, sources).mergeAll();
	  };

	  var MergeAllObservable = (function (__super__) {
	    inherits(MergeAllObservable, __super__);

	    function MergeAllObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    MergeAllObservable.prototype.subscribeCore = function (o) {
	      var g = new CompositeDisposable(), m = new SingleAssignmentDisposable();
	      g.add(m);
	      m.setDisposable(this.source.subscribe(new MergeAllObserver(o, g)));
	      return g;
	    };

	    return MergeAllObservable;
	  }(ObservableBase));

	  var MergeAllObserver = (function (__super__) {
	    function MergeAllObserver(o, g) {
	      this.o = o;
	      this.g = g;
	      this.done = false;
	      __super__.call(this);
	    }

	    inherits(MergeAllObserver, __super__);

	    MergeAllObserver.prototype.next = function(innerSource) {
	      var sad = new SingleAssignmentDisposable();
	      this.g.add(sad);
	      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	      sad.setDisposable(innerSource.subscribe(new InnerObserver(this, sad)));
	    };

	    MergeAllObserver.prototype.error = function (e) {
	      this.o.onError(e);
	    };

	    MergeAllObserver.prototype.completed = function () {
	      this.done = true;
	      this.g.length === 1 && this.o.onCompleted();
	    };

	    function InnerObserver(parent, sad) {
	      this.parent = parent;
	      this.sad = sad;
	      __super__.call(this);
	    }

	    inherits(InnerObserver, __super__);

	    InnerObserver.prototype.next = function (x) {
	      this.parent.o.onNext(x);
	    };
	    InnerObserver.prototype.error = function (e) {
	      this.parent.o.onError(e);
	    };
	    InnerObserver.prototype.completed = function () {
	      this.parent.g.remove(this.sad);
	      this.parent.done && this.parent.g.length === 1 && this.parent.o.onCompleted();
	    };

	    return MergeAllObserver;
	  }(AbstractObserver));

	  /**
	  * Merges an observable sequence of observable sequences into an observable sequence.
	  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	  */
	  observableProto.mergeAll = function () {
	    return new MergeAllObservable(this);
	  };

	  var CompositeError = Rx.CompositeError = function(errors) {
	    this.innerErrors = errors;
	    this.message = 'This contains multiple errors. Check the innerErrors';
	    Error.call(this);
	  };
	  CompositeError.prototype = Object.create(Error.prototype);
	  CompositeError.prototype.name = 'CompositeError';

	  var MergeDelayErrorObservable = (function(__super__) {
	    inherits(MergeDelayErrorObservable, __super__);
	    function MergeDelayErrorObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    MergeDelayErrorObservable.prototype.subscribeCore = function (o) {
	      var group = new CompositeDisposable(),
	        m = new SingleAssignmentDisposable(),
	        state = { isStopped: false, errors: [], o: o };

	      group.add(m);
	      m.setDisposable(this.source.subscribe(new MergeDelayErrorObserver(group, state)));

	      return group;
	    };

	    return MergeDelayErrorObservable;
	  }(ObservableBase));

	  var MergeDelayErrorObserver = (function(__super__) {
	    inherits(MergeDelayErrorObserver, __super__);
	    function MergeDelayErrorObserver(group, state) {
	      this._group = group;
	      this._state = state;
	      __super__.call(this);
	    }

	    function setCompletion(o, errors) {
	      if (errors.length === 0) {
	        o.onCompleted();
	      } else if (errors.length === 1) {
	        o.onError(errors[0]);
	      } else {
	        o.onError(new CompositeError(errors));
	      }
	    }

	    MergeDelayErrorObserver.prototype.next = function (x) {
	      var inner = new SingleAssignmentDisposable();
	      this._group.add(inner);

	      // Check for promises support
	      isPromise(x) && (x = observableFromPromise(x));
	      inner.setDisposable(x.subscribe(new InnerObserver(inner, this._group, this._state)));
	    };

	    MergeDelayErrorObserver.prototype.error = function (e) {
	      this._state.errors.push(e);
	      this._state.isStopped = true;
	      this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
	    };

	    MergeDelayErrorObserver.prototype.completed = function () {
	      this._state.isStopped = true;
	      this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
	    };

	    inherits(InnerObserver, __super__);
	    function InnerObserver(inner, group, state) {
	      this._inner = inner;
	      this._group = group;
	      this._state = state;
	      __super__.call(this);
	    }

	    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
	    InnerObserver.prototype.error = function (e) {
	      this._state.errors.push(e);
	      this._group.remove(this._inner);
	      this._state.isStopped && this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
	    };
	    InnerObserver.prototype.completed = function () {
	      this._group.remove(this._inner);
	      this._state.isStopped && this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
	    };

	    return MergeDelayErrorObserver;
	  }(AbstractObserver));

	  /**
	  * Flattens an Observable that emits Observables into one Observable, in a way that allows an Observer to
	  * receive all successfully emitted items from all of the source Observables without being interrupted by
	  * an error notification from one of them.
	  *
	  * This behaves like Observable.prototype.mergeAll except that if any of the merged Observables notify of an
	  * error via the Observer's onError, mergeDelayError will refrain from propagating that
	  * error notification until all of the merged Observables have finished emitting items.
	  * @param {Array | Arguments} args Arguments or an array to merge.
	  * @returns {Observable} an Observable that emits all of the items emitted by the Observables emitted by the Observable
	  */
	  Observable.mergeDelayError = function() {
	    var args;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	    } else {
	      var len = arguments.length;
	      args = new Array(len);
	      for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    }
	    var source = observableOf(null, args);
	    return new MergeDelayErrorObservable(source);
	  };

	  /**
	   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	   * @param {Observable} second Second observable sequence used to produce results after the first sequence terminates.
	   * @returns {Observable} An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.
	   */
	  observableProto.onErrorResumeNext = function (second) {
	    if (!second) { throw new Error('Second observable is required'); }
	    return onErrorResumeNext([this, second]);
	  };

	  var OnErrorResumeNextObservable = (function(__super__) {
	    inherits(OnErrorResumeNextObservable, __super__);
	    function OnErrorResumeNextObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }

	    function scheduleMethod(state, recurse) {
	      if (state.pos < state.sources.length) {
	        var current = state.sources[state.pos++];
	        isPromise(current) && (current = observableFromPromise(current));
	        var d = new SingleAssignmentDisposable();
	        state.subscription.setDisposable(d);
	        d.setDisposable(current.subscribe(new OnErrorResumeNextObserver(state, recurse)));
	      } else {
	        state.o.onCompleted();
	      }
	    }

	    OnErrorResumeNextObservable.prototype.subscribeCore = function (o) {
	      var subscription = new SerialDisposable(),
	          state = {pos: 0, subscription: subscription, o: o, sources: this.sources },
	          cancellable = immediateScheduler.scheduleRecursive(state, scheduleMethod);

	      return new BinaryDisposable(subscription, cancellable);
	    };

	    return OnErrorResumeNextObservable;
	  }(ObservableBase));

	  var OnErrorResumeNextObserver = (function(__super__) {
	    inherits(OnErrorResumeNextObserver, __super__);
	    function OnErrorResumeNextObserver(state, recurse) {
	      this._state = state;
	      this._recurse = recurse;
	      __super__.call(this);
	    }

	    OnErrorResumeNextObserver.prototype.next = function (x) { this._state.o.onNext(x); };
	    OnErrorResumeNextObserver.prototype.error = function () { this._recurse(this._state); };
	    OnErrorResumeNextObserver.prototype.completed = function () { this._recurse(this._state); };

	    return OnErrorResumeNextObserver;
	  }(AbstractObserver));

	  /**
	   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	   * @returns {Observable} An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
	   */
	  var onErrorResumeNext = Observable.onErrorResumeNext = function () {
	    var sources = [];
	    if (Array.isArray(arguments[0])) {
	      sources = arguments[0];
	    } else {
	      var len = arguments.length;
	      sources = new Array(len);
	      for(var i = 0; i < len; i++) { sources[i] = arguments[i]; }
	    }
	    return new OnErrorResumeNextObservable(sources);
	  };

	  var SkipUntilObservable = (function(__super__) {
	    inherits(SkipUntilObservable, __super__);

	    function SkipUntilObservable(source, other) {
	      this._s = source;
	      this._o = isPromise(other) ? observableFromPromise(other) : other;
	      this._open = false;
	      __super__.call(this);
	    }

	    SkipUntilObservable.prototype.subscribeCore = function(o) {
	      var leftSubscription = new SingleAssignmentDisposable();
	      leftSubscription.setDisposable(this._s.subscribe(new SkipUntilSourceObserver(o, this)));

	      isPromise(this._o) && (this._o = observableFromPromise(this._o));

	      var rightSubscription = new SingleAssignmentDisposable();
	      rightSubscription.setDisposable(this._o.subscribe(new SkipUntilOtherObserver(o, this, rightSubscription)));

	      return new BinaryDisposable(leftSubscription, rightSubscription);
	    };

	    return SkipUntilObservable;
	  }(ObservableBase));

	  var SkipUntilSourceObserver = (function(__super__) {
	    inherits(SkipUntilSourceObserver, __super__);
	    function SkipUntilSourceObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      __super__.call(this);
	    }

	    SkipUntilSourceObserver.prototype.next = function (x) {
	      this._p._open && this._o.onNext(x);
	    };

	    SkipUntilSourceObserver.prototype.error = function (err) {
	      this._o.onError(err);
	    };

	    SkipUntilSourceObserver.prototype.onCompleted = function () {
	      this._p._open && this._o.onCompleted();
	    };

	    return SkipUntilSourceObserver;
	  }(AbstractObserver));

	  var SkipUntilOtherObserver = (function(__super__) {
	    inherits(SkipUntilOtherObserver, __super__);
	    function SkipUntilOtherObserver(o, p, r) {
	      this._o = o;
	      this._p = p;
	      this._r = r;
	      __super__.call(this);
	    }

	    SkipUntilOtherObserver.prototype.next = function () {
	      this._p._open = true;
	      this._r.dispose();
	    };

	    SkipUntilOtherObserver.prototype.error = function (err) {
	      this._o.onError(err);
	    };

	    SkipUntilOtherObserver.prototype.onCompleted = function () {
	      this._r.dispose();
	    };

	    return SkipUntilOtherObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the values from the source observable sequence only after the other observable sequence produces a value.
	   * @param {Observable | Promise} other The observable sequence or Promise that triggers propagation of elements of the source sequence.
	   * @returns {Observable} An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.
	   */
	  observableProto.skipUntil = function (other) {
	    return new SkipUntilObservable(this, other);
	  };

	  var SwitchObservable = (function(__super__) {
	    inherits(SwitchObservable, __super__);
	    function SwitchObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    SwitchObservable.prototype.subscribeCore = function (o) {
	      var inner = new SerialDisposable(), s = this.source.subscribe(new SwitchObserver(o, inner));
	      return new BinaryDisposable(s, inner);
	    };

	    inherits(SwitchObserver, AbstractObserver);
	    function SwitchObserver(o, inner) {
	      this.o = o;
	      this.inner = inner;
	      this.stopped = false;
	      this.latest = 0;
	      this.hasLatest = false;
	      AbstractObserver.call(this);
	    }

	    SwitchObserver.prototype.next = function (innerSource) {
	      var d = new SingleAssignmentDisposable(), id = ++this.latest;
	      this.hasLatest = true;
	      this.inner.setDisposable(d);
	      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	      d.setDisposable(innerSource.subscribe(new InnerObserver(this, id)));
	    };

	    SwitchObserver.prototype.error = function (e) {
	      this.o.onError(e);
	    };

	    SwitchObserver.prototype.completed = function () {
	      this.stopped = true;
	      !this.hasLatest && this.o.onCompleted();
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(parent, id) {
	      this.parent = parent;
	      this.id = id;
	      AbstractObserver.call(this);
	    }
	    InnerObserver.prototype.next = function (x) {
	      this.parent.latest === this.id && this.parent.o.onNext(x);
	    };

	    InnerObserver.prototype.error = function (e) {
	      this.parent.latest === this.id && this.parent.o.onError(e);
	    };

	    InnerObserver.prototype.completed = function () {
	      if (this.parent.latest === this.id) {
	        this.parent.hasLatest = false;
	        this.parent.stopped && this.parent.o.onCompleted();
	      }
	    };

	    return SwitchObservable;
	  }(ObservableBase));

	  /**
	  * Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
	  * @returns {Observable} The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.
	  */
	  observableProto['switch'] = observableProto.switchLatest = function () {
	    return new SwitchObservable(this);
	  };

	  var TakeUntilObservable = (function(__super__) {
	    inherits(TakeUntilObservable, __super__);

	    function TakeUntilObservable(source, other) {
	      this.source = source;
	      this.other = isPromise(other) ? observableFromPromise(other) : other;
	      __super__.call(this);
	    }

	    TakeUntilObservable.prototype.subscribeCore = function(o) {
	      return new BinaryDisposable(
	        this.source.subscribe(o),
	        this.other.subscribe(new TakeUntilObserver(o))
	      );
	    };

	    return TakeUntilObservable;
	  }(ObservableBase));

	  var TakeUntilObserver = (function(__super__) {
	    inherits(TakeUntilObserver, __super__);
	    function TakeUntilObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }

	    TakeUntilObserver.prototype.next = function () {
	      this._o.onCompleted();
	    };

	    TakeUntilObserver.prototype.error = function (err) {
	      this._o.onError(err);
	    };

	    TakeUntilObserver.prototype.onCompleted = noop;

	    return TakeUntilObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the values from the source observable sequence until the other observable sequence produces a value.
	   * @param {Observable | Promise} other Observable sequence or Promise that terminates propagation of elements of the source sequence.
	   * @returns {Observable} An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.
	   */
	  observableProto.takeUntil = function (other) {
	    return new TakeUntilObservable(this, other);
	  };

	  function falseFactory() { return false; }
	  function argumentsToArray() {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return args;
	  }

	  var WithLatestFromObservable = (function(__super__) {
	    inherits(WithLatestFromObservable, __super__);
	    function WithLatestFromObservable(source, sources, resultSelector) {
	      this._s = source;
	      this._ss = sources;
	      this._cb = resultSelector;
	      __super__.call(this);
	    }

	    WithLatestFromObservable.prototype.subscribeCore = function (o) {
	      var len = this._ss.length;
	      var state = {
	        hasValue: arrayInitialize(len, falseFactory),
	        hasValueAll: false,
	        values: new Array(len)
	      };

	      var n = this._ss.length, subscriptions = new Array(n + 1);
	      for (var i = 0; i < n; i++) {
	        var other = this._ss[i], sad = new SingleAssignmentDisposable();
	        isPromise(other) && (other = observableFromPromise(other));
	        sad.setDisposable(other.subscribe(new WithLatestFromOtherObserver(o, i, state)));
	        subscriptions[i] = sad;
	      }

	      var outerSad = new SingleAssignmentDisposable();
	      outerSad.setDisposable(this._s.subscribe(new WithLatestFromSourceObserver(o, this._cb, state)));
	      subscriptions[n] = outerSad;

	      return new NAryDisposable(subscriptions);
	    };

	    return WithLatestFromObservable;
	  }(ObservableBase));

	  var WithLatestFromOtherObserver = (function (__super__) {
	    inherits(WithLatestFromOtherObserver, __super__);
	    function WithLatestFromOtherObserver(o, i, state) {
	      this._o = o;
	      this._i = i;
	      this._state = state;
	      __super__.call(this);
	    }

	    WithLatestFromOtherObserver.prototype.next = function (x) {
	      this._state.values[this._i] = x;
	      this._state.hasValue[this._i] = true;
	      this._state.hasValueAll = this._state.hasValue.every(identity);
	    };

	    WithLatestFromOtherObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    WithLatestFromOtherObserver.prototype.completed = noop;

	    return WithLatestFromOtherObserver;
	  }(AbstractObserver));

	  var WithLatestFromSourceObserver = (function (__super__) {
	    inherits(WithLatestFromSourceObserver, __super__);
	    function WithLatestFromSourceObserver(o, cb, state) {
	      this._o = o;
	      this._cb = cb;
	      this._state = state;
	      __super__.call(this);
	    }

	    WithLatestFromSourceObserver.prototype.next = function (x) {
	      var allValues = [x].concat(this._state.values);
	      if (!this._state.hasValueAll) { return; }
	      var res = tryCatch(this._cb).apply(null, allValues);
	      if (res === errorObj) { return this._o.onError(res.e); }
	      this._o.onNext(res);
	    };

	    WithLatestFromSourceObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    WithLatestFromSourceObserver.prototype.completed = function () {
	      this._o.onCompleted();
	    };

	    return WithLatestFromSourceObserver;
	  }(AbstractObserver));

	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function only when the (first) source observable sequence produces an element.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  observableProto.withLatestFrom = function () {
	    if (arguments.length === 0) { throw new Error('invalid arguments'); }

	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);

	    return new WithLatestFromObservable(this, args, resultSelector);
	  };

	  function falseFactory() { return false; }
	  function emptyArrayFactory() { return []; }

	  var ZipObservable = (function(__super__) {
	    inherits(ZipObservable, __super__);
	    function ZipObservable(sources, resultSelector) {
	      this._s = sources;
	      this._cb = resultSelector;
	      __super__.call(this);
	    }

	    ZipObservable.prototype.subscribeCore = function(observer) {
	      var n = this._s.length,
	          subscriptions = new Array(n),
	          done = arrayInitialize(n, falseFactory),
	          q = arrayInitialize(n, emptyArrayFactory);

	      for (var i = 0; i < n; i++) {
	        var source = this._s[i], sad = new SingleAssignmentDisposable();
	        subscriptions[i] = sad;
	        isPromise(source) && (source = observableFromPromise(source));
	        sad.setDisposable(source.subscribe(new ZipObserver(observer, i, this, q, done)));
	      }

	      return new NAryDisposable(subscriptions);
	    };

	    return ZipObservable;
	  }(ObservableBase));

	  var ZipObserver = (function (__super__) {
	    inherits(ZipObserver, __super__);
	    function ZipObserver(o, i, p, q, d) {
	      this._o = o;
	      this._i = i;
	      this._p = p;
	      this._q = q;
	      this._d = d;
	      __super__.call(this);
	    }

	    function notEmpty(x) { return x.length > 0; }
	    function shiftEach(x) { return x.shift(); }
	    function notTheSame(i) {
	      return function (x, j) {
	        return j !== i;
	      };
	    }

	    ZipObserver.prototype.next = function (x) {
	      this._q[this._i].push(x);
	      if (this._q.every(notEmpty)) {
	        var queuedValues = this._q.map(shiftEach);
	        var res = tryCatch(this._p._cb).apply(null, queuedValues);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        this._o.onNext(res);
	      } else if (this._d.filter(notTheSame(this._i)).every(identity)) {
	        this._o.onCompleted();
	      }
	    };

	    ZipObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ZipObserver.prototype.completed = function () {
	      this._d[this._i] = true;
	      this._d.every(identity) && this._o.onCompleted();
	    };

	    return ZipObserver;
	  }(AbstractObserver));

	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	   * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	   */
	  observableProto.zip = function () {
	    if (arguments.length === 0) { throw new Error('invalid arguments'); }

	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);

	    var parent = this;
	    args.unshift(parent);

	    return new ZipObservable(args, resultSelector);
	  };

	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
	   * @param arguments Observable sources.
	   * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  Observable.zip = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    if (Array.isArray(args[0])) {
	      args = isFunction(args[1]) ? args[0].concat(args[1]) : args[0];
	    }
	    var first = args.shift();
	    return first.zip.apply(first, args);
	  };

	function falseFactory() { return false; }
	function emptyArrayFactory() { return []; }
	function argumentsToArray() {
	  var len = arguments.length, args = new Array(len);
	  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	  return args;
	}

	var ZipIterableObservable = (function(__super__) {
	  inherits(ZipIterableObservable, __super__);
	  function ZipIterableObservable(sources, cb) {
	    this.sources = sources;
	    this._cb = cb;
	    __super__.call(this);
	  }

	  ZipIterableObservable.prototype.subscribeCore = function (o) {
	    var sources = this.sources, len = sources.length, subscriptions = new Array(len);

	    var state = {
	      q: arrayInitialize(len, emptyArrayFactory),
	      done: arrayInitialize(len, falseFactory),
	      cb: this._cb,
	      o: o
	    };

	    for (var i = 0; i < len; i++) {
	      (function (i) {
	        var source = sources[i], sad = new SingleAssignmentDisposable();
	        (isArrayLike(source) || isIterable(source)) && (source = observableFrom(source));

	        subscriptions[i] = sad;
	        sad.setDisposable(source.subscribe(new ZipIterableObserver(state, i)));
	      }(i));
	    }

	    return new NAryDisposable(subscriptions);
	  };

	  return ZipIterableObservable;
	}(ObservableBase));

	var ZipIterableObserver = (function (__super__) {
	  inherits(ZipIterableObserver, __super__);
	  function ZipIterableObserver(s, i) {
	    this._s = s;
	    this._i = i;
	    __super__.call(this);
	  }

	  function notEmpty(x) { return x.length > 0; }
	  function shiftEach(x) { return x.shift(); }
	  function notTheSame(i) {
	    return function (x, j) {
	      return j !== i;
	    };
	  }

	  ZipIterableObserver.prototype.next = function (x) {
	    this._s.q[this._i].push(x);
	    if (this._s.q.every(notEmpty)) {
	      var queuedValues = this._s.q.map(shiftEach),
	          res = tryCatch(this._s.cb).apply(null, queuedValues);
	      if (res === errorObj) { return this._s.o.onError(res.e); }
	      this._s.o.onNext(res);
	    } else if (this._s.done.filter(notTheSame(this._i)).every(identity)) {
	      this._s.o.onCompleted();
	    }
	  };

	  ZipIterableObserver.prototype.error = function (e) { this._s.o.onError(e); };

	  ZipIterableObserver.prototype.completed = function () {
	    this._s.done[this._i] = true;
	    this._s.done.every(identity) && this._s.o.onCompleted();
	  };

	  return ZipIterableObserver;
	}(AbstractObserver));

	/**
	 * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	 * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	 * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	 */
	observableProto.zipIterable = function () {
	  if (arguments.length === 0) { throw new Error('invalid arguments'); }

	  var len = arguments.length, args = new Array(len);
	  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;

	  var parent = this;
	  args.unshift(parent);
	  return new ZipIterableObservable(args, resultSelector);
	};

	  function asObservable(source) {
	    return function subscribe(o) { return source.subscribe(o); };
	  }

	  /**
	   *  Hides the identity of an observable sequence.
	   * @returns {Observable} An observable sequence that hides the identity of the source sequence.
	   */
	  observableProto.asObservable = function () {
	    return new AnonymousObservable(asObservable(this), this);
	  };

	  function toArray(x) { return x.toArray(); }
	  function notEmpty(x) { return x.length > 0; }

	  /**
	   *  Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.
	   * @param {Number} count Length of each buffer.
	   * @param {Number} [skip] Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithCount = function (count, skip) {
	    typeof skip !== 'number' && (skip = count);
	    return this.windowWithCount(count, skip)
	      .flatMap(toArray)
	      .filter(notEmpty);
	  };

	  var DematerializeObservable = (function (__super__) {
	    inherits(DematerializeObservable, __super__);
	    function DematerializeObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    DematerializeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new DematerializeObserver(o));
	    };

	    return DematerializeObservable;
	  }(ObservableBase));

	  var DematerializeObserver = (function (__super__) {
	    inherits(DematerializeObserver, __super__);

	    function DematerializeObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }

	    DematerializeObserver.prototype.next = function (x) { x.accept(this._o); };
	    DematerializeObserver.prototype.error = function (e) { this._o.onError(e); };
	    DematerializeObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return DematerializeObserver;
	  }(AbstractObserver));

	  /**
	   * Dematerializes the explicit notification values of an observable sequence as implicit notifications.
	   * @returns {Observable} An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
	   */
	  observableProto.dematerialize = function () {
	    return new DematerializeObservable(this);
	  };

	  var DistinctUntilChangedObservable = (function(__super__) {
	    inherits(DistinctUntilChangedObservable, __super__);
	    function DistinctUntilChangedObservable(source, keyFn, comparer) {
	      this.source = source;
	      this.keyFn = keyFn;
	      this.comparer = comparer;
	      __super__.call(this);
	    }

	    DistinctUntilChangedObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new DistinctUntilChangedObserver(o, this.keyFn, this.comparer));
	    };

	    return DistinctUntilChangedObservable;
	  }(ObservableBase));

	  var DistinctUntilChangedObserver = (function(__super__) {
	    inherits(DistinctUntilChangedObserver, __super__);
	    function DistinctUntilChangedObserver(o, keyFn, comparer) {
	      this.o = o;
	      this.keyFn = keyFn;
	      this.comparer = comparer;
	      this.hasCurrentKey = false;
	      this.currentKey = null;
	      __super__.call(this);
	    }

	    DistinctUntilChangedObserver.prototype.next = function (x) {
	      var key = x, comparerEquals;
	      if (isFunction(this.keyFn)) {
	        key = tryCatch(this.keyFn)(x);
	        if (key === errorObj) { return this.o.onError(key.e); }
	      }
	      if (this.hasCurrentKey) {
	        comparerEquals = tryCatch(this.comparer)(this.currentKey, key);
	        if (comparerEquals === errorObj) { return this.o.onError(comparerEquals.e); }
	      }
	      if (!this.hasCurrentKey || !comparerEquals) {
	        this.hasCurrentKey = true;
	        this.currentKey = key;
	        this.o.onNext(x);
	      }
	    };
	    DistinctUntilChangedObserver.prototype.error = function(e) {
	      this.o.onError(e);
	    };
	    DistinctUntilChangedObserver.prototype.completed = function () {
	      this.o.onCompleted();
	    };

	    return DistinctUntilChangedObserver;
	  }(AbstractObserver));

	  /**
	  *  Returns an observable sequence that contains only distinct contiguous elements according to the keyFn and the comparer.
	  * @param {Function} [keyFn] A function to compute the comparison key for each element. If not provided, it projects the value.
	  * @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
	  * @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.
	  */
	  observableProto.distinctUntilChanged = function (keyFn, comparer) {
	    comparer || (comparer = defaultComparer);
	    return new DistinctUntilChangedObservable(this, keyFn, comparer);
	  };

	  var TapObservable = (function(__super__) {
	    inherits(TapObservable,__super__);
	    function TapObservable(source, observerOrOnNext, onError, onCompleted) {
	      this.source = source;
	      this._oN = observerOrOnNext;
	      this._oE = onError;
	      this._oC = onCompleted;
	      __super__.call(this);
	    }

	    TapObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o, this));
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o, p) {
	      this.o = o;
	      this.t = !p._oN || isFunction(p._oN) ?
	        observerCreate(p._oN || noop, p._oE || noop, p._oC || noop) :
	        p._oN;
	      this.isStopped = false;
	      AbstractObserver.call(this);
	    }
	    InnerObserver.prototype.next = function(x) {
	      var res = tryCatch(this.t.onNext).call(this.t, x);
	      if (res === errorObj) { this.o.onError(res.e); }
	      this.o.onNext(x);
	    };
	    InnerObserver.prototype.error = function(err) {
	      var res = tryCatch(this.t.onError).call(this.t, err);
	      if (res === errorObj) { return this.o.onError(res.e); }
	      this.o.onError(err);
	    };
	    InnerObserver.prototype.completed = function() {
	      var res = tryCatch(this.t.onCompleted).call(this.t);
	      if (res === errorObj) { return this.o.onError(res.e); }
	      this.o.onCompleted();
	    };

	    return TapObservable;
	  }(ObservableBase));

	  /**
	  *  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function | Observer} observerOrOnNext Action to invoke for each element in the observable sequence or an o.
	  * @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	  * @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto['do'] = observableProto.tap = observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
	    return new TapObservable(this, observerOrOnNext, onError, onCompleted);
	  };

	  /**
	  *  Invokes an action for each element in the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onNext Action to invoke for each element in the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnNext = observableProto.tapOnNext = function (onNext, thisArg) {
	    return this.tap(typeof thisArg !== 'undefined' ? function (x) { onNext.call(thisArg, x); } : onNext);
	  };

	  /**
	  *  Invokes an action upon exceptional termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onError Action to invoke upon exceptional termination of the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnError = observableProto.tapOnError = function (onError, thisArg) {
	    return this.tap(noop, typeof thisArg !== 'undefined' ? function (e) { onError.call(thisArg, e); } : onError);
	  };

	  /**
	  *  Invokes an action upon graceful termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onCompleted Action to invoke upon graceful termination of the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnCompleted = observableProto.tapOnCompleted = function (onCompleted, thisArg) {
	    return this.tap(noop, null, typeof thisArg !== 'undefined' ? function () { onCompleted.call(thisArg); } : onCompleted);
	  };

	  var FinallyObservable = (function (__super__) {
	    inherits(FinallyObservable, __super__);
	    function FinallyObservable(source, fn, thisArg) {
	      this.source = source;
	      this._fn = bindCallback(fn, thisArg, 0);
	      __super__.call(this);
	    }

	    FinallyObservable.prototype.subscribeCore = function (o) {
	      var d = tryCatch(this.source.subscribe).call(this.source, o);
	      if (d === errorObj) {
	        this._fn();
	        thrower(d.e);
	      }

	      return new FinallyDisposable(d, this._fn);
	    };

	    function FinallyDisposable(s, fn) {
	      this.isDisposed = false;
	      this._s = s;
	      this._fn = fn;
	    }
	    FinallyDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        var res = tryCatch(this._s.dispose).call(this._s);
	        this._fn();
	        res === errorObj && thrower(res.e);
	      }
	    };

	    return FinallyObservable;

	  }(ObservableBase));

	  /**
	   *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
	   * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
	   * @returns {Observable} Source sequence with the action-invoking termination behavior applied.
	   */
	  observableProto['finally'] = function (action, thisArg) {
	    return new FinallyObservable(this, action, thisArg);
	  };

	  var IgnoreElementsObservable = (function(__super__) {
	    inherits(IgnoreElementsObservable, __super__);

	    function IgnoreElementsObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    IgnoreElementsObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o));
	    };

	    function InnerObserver(o) {
	      this.o = o;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = noop;
	    InnerObserver.prototype.onError = function (err) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(err);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.observer.onError(e);
	        return true;
	      }

	      return false;
	    };

	    return IgnoreElementsObservable;
	  }(ObservableBase));

	  /**
	   *  Ignores all elements in an observable sequence leaving only the termination messages.
	   * @returns {Observable} An empty observable sequence that signals termination, successful or exceptional, of the source sequence.
	   */
	  observableProto.ignoreElements = function () {
	    return new IgnoreElementsObservable(this);
	  };

	  var MaterializeObservable = (function (__super__) {
	    inherits(MaterializeObservable, __super__);
	    function MaterializeObservable(source, fn) {
	      this.source = source;
	      __super__.call(this);
	    }

	    MaterializeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new MaterializeObserver(o));
	    };

	    return MaterializeObservable;
	  }(ObservableBase));

	  var MaterializeObserver = (function (__super__) {
	    inherits(MaterializeObserver, __super__);

	    function MaterializeObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }

	    MaterializeObserver.prototype.next = function (x) { this._o.onNext(notificationCreateOnNext(x)) };
	    MaterializeObserver.prototype.error = function (e) { this._o.onNext(notificationCreateOnError(e)); this._o.onCompleted(); };
	    MaterializeObserver.prototype.completed = function () { this._o.onNext(notificationCreateOnCompleted()); this._o.onCompleted(); };

	    return MaterializeObserver;
	  }(AbstractObserver));

	  /**
	   *  Materializes the implicit notifications of an observable sequence as explicit notification values.
	   * @returns {Observable} An observable sequence containing the materialized notification values from the source sequence.
	   */
	  observableProto.materialize = function () {
	    return new MaterializeObservable(this);
	  };

	  /**
	   *  Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
	   * @param {Number} [repeatCount]  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.
	   * @returns {Observable} The observable sequence producing the elements of the given sequence repeatedly.
	   */
	  observableProto.repeat = function (repeatCount) {
	    return enumerableRepeat(this, repeatCount).concat();
	  };

	  /**
	   *  Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
	   *  Note if you encounter an error and want it to retry once, then you must use .retry(2);
	   *
	   * @example
	   *  var res = retried = retry.repeat();
	   *  var res = retried = retry.repeat(2);
	   * @param {Number} [retryCount]  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
	   * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.
	   */
	  observableProto.retry = function (retryCount) {
	    return enumerableRepeat(this, retryCount).catchError();
	  };

	  /**
	   *  Repeats the source observable sequence upon error each time the notifier emits or until it successfully terminates. 
	   *  if the notifier completes, the observable sequence completes.
	   *
	   * @example
	   *  var timer = Observable.timer(500);
	   *  var source = observable.retryWhen(timer);
	   * @param {Observable} [notifier] An observable that triggers the retries or completes the observable with onNext or onCompleted respectively.
	   * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.
	   */
	  observableProto.retryWhen = function (notifier) {
	    return enumerableRepeat(this).catchErrorWhen(notifier);
	  };
	  var ScanObservable = (function(__super__) {
	    inherits(ScanObservable, __super__);
	    function ScanObservable(source, accumulator, hasSeed, seed) {
	      this.source = source;
	      this.accumulator = accumulator;
	      this.hasSeed = hasSeed;
	      this.seed = seed;
	      __super__.call(this);
	    }

	    ScanObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new ScanObserver(o,this));
	    };

	    return ScanObservable;
	  }(ObservableBase));

	  var ScanObserver = (function (__super__) {
	    inherits(ScanObserver, __super__);
	    function ScanObserver(o, parent) {
	      this._o = o;
	      this._p = parent;
	      this._fn = parent.accumulator;
	      this._hs = parent.hasSeed;
	      this._s = parent.seed;
	      this._ha = false;
	      this._a = null;
	      this._hv = false;
	      this._i = 0;
	      __super__.call(this);
	    }

	    ScanObserver.prototype.next = function (x) {
	      !this._hv && (this._hv = true);
	      if (this._ha) {
	        this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
	      } else {
	        this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
	        this._ha = true;
	      }
	      if (this._a === errorObj) { return this._o.onError(this._a.e); }
	      this._o.onNext(this._a);
	      this._i++;
	    };

	    ScanObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ScanObserver.prototype.completed = function () {
	      !this._hv && this._hs && this._o.onNext(this._s);
	      this._o.onCompleted();
	    };

	    return ScanObserver;
	  }(AbstractObserver));

	  /**
	  *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
	  *  For aggregation behavior with no intermediate results, see Observable.aggregate.
	  * @param {Mixed} [seed] The initial accumulator value.
	  * @param {Function} accumulator An accumulator function to be invoked on each element.
	  * @returns {Observable} An observable sequence containing the accumulated values.
	  */
	  observableProto.scan = function () {
	    var hasSeed = false, seed, accumulator = arguments[0];
	    if (arguments.length === 2) {
	      hasSeed = true;
	      seed = arguments[1];
	    }
	    return new ScanObservable(this, accumulator, hasSeed, seed);
	  };

	  var SkipLastObservable = (function (__super__) {
	    inherits(SkipLastObservable, __super__);
	    function SkipLastObservable(source, c) {
	      this.source = source;
	      this._c = c;
	      __super__.call(this);
	    }

	    SkipLastObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SkipLastObserver(o, this._c));
	    };

	    return SkipLastObservable;
	  }(ObservableBase));

	  var SkipLastObserver = (function (__super__) {
	    inherits(SkipLastObserver, __super__);
	    function SkipLastObserver(o, c) {
	      this._o = o;
	      this._c = c;
	      this._q = [];
	      __super__.call(this);
	    }

	    SkipLastObserver.prototype.next = function (x) {
	      this._q.push(x);
	      this._q.length > this._c && this._o.onNext(this._q.shift());
	    };

	    SkipLastObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    SkipLastObserver.prototype.completed = function () {
	      this._o.onCompleted();
	    };

	    return SkipLastObserver;
	  }(AbstractObserver));

	  /**
	   *  Bypasses a specified number of elements at the end of an observable sequence.
	   * @description
	   *  This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are
	   *  received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed.
	   * @param count Number of elements to bypass at the end of the source sequence.
	   * @returns {Observable} An observable sequence containing the source sequence elements except for the bypassed ones at the end.
	   */
	  observableProto.skipLast = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    return new SkipLastObservable(this, count);
	  };

	  /**
	   *  Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
	   *  @example
	   *  var res = source.startWith(1, 2, 3);
	   *  var res = source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
	   * @param {Arguments} args The specified values to prepend to the observable sequence
	   * @returns {Observable} The source sequence prepended with the specified values.
	   */
	  observableProto.startWith = function () {
	    var values, scheduler, start = 0;
	    if (!!arguments.length && isScheduler(arguments[0])) {
	      scheduler = arguments[0];
	      start = 1;
	    } else {
	      scheduler = immediateScheduler;
	    }
	    for(var args = [], i = start, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	    return enumerableOf([observableFromArray(args, scheduler), this]).concat();
	  };

	  var TakeLastObserver = (function (__super__) {
	    inherits(TakeLastObserver, __super__);
	    function TakeLastObserver(o, c) {
	      this._o = o;
	      this._c = c;
	      this._q = [];
	      __super__.call(this);
	    }

	    TakeLastObserver.prototype.next = function (x) {
	      this._q.push(x);
	      this._q.length > this._c && this._q.shift();
	    };

	    TakeLastObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    TakeLastObserver.prototype.completed = function () {
	      while (this._q.length > 0) { this._o.onNext(this._q.shift()); }
	      this._o.onCompleted();
	    };

	    return TakeLastObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns a specified number of contiguous elements from the end of an observable sequence.
	   * @description
	   *  This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of
	   *  the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
	   * @param {Number} count Number of elements to take from the end of the source sequence.
	   * @returns {Observable} An observable sequence containing the specified number of elements from the end of the source sequence.
	   */
	  observableProto.takeLast = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new TakeLastObserver(o, count));
	    }, source);
	  };

	  var TakeLastBufferObserver = (function (__super__) {
	    inherits(TakeLastBufferObserver, __super__);
	    function TakeLastBufferObserver(o, c) {
	      this._o = o;
	      this._c = c;
	      this._q = [];
	      __super__.call(this);
	    }

	    TakeLastBufferObserver.prototype.next = function (x) {
	      this._q.push(x);
	      this._q.length > this._c && this._q.shift();
	    };

	    TakeLastBufferObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    TakeLastBufferObserver.prototype.completed = function () {
	      this._o.onNext(this._q);
	      this._o.onCompleted();
	    };

	    return TakeLastBufferObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns an array with the specified number of contiguous elements from the end of an observable sequence.
	   *
	   * @description
	   *  This operator accumulates a buffer with a length enough to store count elements. Upon completion of the
	   *  source sequence, this buffer is produced on the result sequence.
	   * @param {Number} count Number of elements to take from the end of the source sequence.
	   * @returns {Observable} An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
	   */
	  observableProto.takeLastBuffer = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new TakeLastBufferObserver(o, count));
	    }, source);
	  };

	  /**
	   *  Projects each element of an observable sequence into zero or more windows which are produced based on element count information.
	   * @param {Number} count Length of each window.
	   * @param {Number} [skip] Number of elements to skip between creation of consecutive windows. If not specified, defaults to the count.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithCount = function (count, skip) {
	    var source = this;
	    +count || (count = 0);
	    Math.abs(count) === Infinity && (count = 0);
	    if (count <= 0) { throw new ArgumentOutOfRangeError(); }
	    skip == null && (skip = count);
	    +skip || (skip = 0);
	    Math.abs(skip) === Infinity && (skip = 0);

	    if (skip <= 0) { throw new ArgumentOutOfRangeError(); }
	    return new AnonymousObservable(function (observer) {
	      var m = new SingleAssignmentDisposable(),
	        refCountDisposable = new RefCountDisposable(m),
	        n = 0,
	        q = [];

	      function createWindow () {
	        var s = new Subject();
	        q.push(s);
	        observer.onNext(addRef(s, refCountDisposable));
	      }

	      createWindow();

	      m.setDisposable(source.subscribe(
	        function (x) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onNext(x); }
	          var c = n - count + 1;
	          c >= 0 && c % skip === 0 && q.shift().onCompleted();
	          ++n % skip === 0 && createWindow();
	        },
	        function (e) {
	          while (q.length > 0) { q.shift().onError(e); }
	          observer.onError(e);
	        },
	        function () {
	          while (q.length > 0) { q.shift().onCompleted(); }
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };

	  function concatMap(source, selector, thisArg) {
	    var selectorFunc = bindCallback(selector, thisArg, 3);
	    return source.map(function (x, i) {
	      var result = selectorFunc(x, i, source);
	      isPromise(result) && (result = observableFromPromise(result));
	      (isArrayLike(result) || isIterable(result)) && (result = observableFrom(result));
	      return result;
	    }).concatAll();
	  }

	  /**
	   *  One of the Following:
	   *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
	   *
	   * @example
	   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); });
	   *  Or:
	   *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
	   *
	   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
	   *  Or:
	   *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
	   *
	   *  var res = source.concatMap(Rx.Observable.fromArray([1,2,3]));
	   * @param {Function} selector A transform function to apply to each element or an observable sequence to project each element from the
	   * source sequence onto which could be either an observable or Promise.
	   * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
	   */
	  observableProto.selectConcat = observableProto.concatMap = function (selector, resultSelector, thisArg) {
	    if (isFunction(selector) && isFunction(resultSelector)) {
	      return this.concatMap(function (x, i) {
	        var selectorResult = selector(x, i);
	        isPromise(selectorResult) && (selectorResult = observableFromPromise(selectorResult));
	        (isArrayLike(selectorResult) || isIterable(selectorResult)) && (selectorResult = observableFrom(selectorResult));

	        return selectorResult.map(function (y, i2) {
	          return resultSelector(x, y, i, i2);
	        });
	      });
	    }
	    return isFunction(selector) ?
	      concatMap(this, selector, thisArg) :
	      concatMap(this, function () { return selector; });
	  };

	  /**
	   * Projects each notification of an observable sequence to an observable sequence and concats the resulting observable sequences into one observable sequence.
	   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
	   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
	   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
	   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
	   */
	  observableProto.concatMapObserver = observableProto.selectConcatObserver = function(onNext, onError, onCompleted, thisArg) {
	    var source = this,
	        onNextFunc = bindCallback(onNext, thisArg, 2),
	        onErrorFunc = bindCallback(onError, thisArg, 1),
	        onCompletedFunc = bindCallback(onCompleted, thisArg, 0);
	    return new AnonymousObservable(function (observer) {
	      var index = 0;
	      return source.subscribe(
	        function (x) {
	          var result;
	          try {
	            result = onNextFunc(x, index++);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	        },
	        function (err) {
	          var result;
	          try {
	            result = onErrorFunc(err);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        },
	        function () {
	          var result;
	          try {
	            result = onCompletedFunc();
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        });
	    }, this).concatAll();
	  };

	  var DefaultIfEmptyObserver = (function (__super__) {
	    inherits(DefaultIfEmptyObserver, __super__);
	    function DefaultIfEmptyObserver(o, d) {
	      this._o = o;
	      this._d = d;
	      this._f = false;
	      __super__.call(this);
	    }

	    DefaultIfEmptyObserver.prototype.next = function (x) {
	      this._f = true;
	      this._o.onNext(x);
	    };

	    DefaultIfEmptyObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    DefaultIfEmptyObserver.prototype.completed = function () {
	      !this._f && this._o.onNext(this._d);
	      this._o.onCompleted();
	    };

	    return DefaultIfEmptyObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
	   *
	   *  var res = obs = xs.defaultIfEmpty();
	   *  2 - obs = xs.defaultIfEmpty(false);
	   *
	   * @memberOf Observable#
	   * @param defaultValue The value to return if the sequence is empty. If not provided, this defaults to null.
	   * @returns {Observable} An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself.
	   */
	    observableProto.defaultIfEmpty = function (defaultValue) {
	      var source = this;
	      defaultValue === undefined && (defaultValue = null);
	      return new AnonymousObservable(function (o) {
	        return source.subscribe(new DefaultIfEmptyObserver(o, defaultValue));
	      }, source);
	    };

	  // Swap out for Array.findIndex
	  function arrayIndexOfComparer(array, item, comparer) {
	    for (var i = 0, len = array.length; i < len; i++) {
	      if (comparer(array[i], item)) { return i; }
	    }
	    return -1;
	  }

	  function HashSet(comparer) {
	    this.comparer = comparer;
	    this.set = [];
	  }
	  HashSet.prototype.push = function(value) {
	    var retValue = arrayIndexOfComparer(this.set, value, this.comparer) === -1;
	    retValue && this.set.push(value);
	    return retValue;
	  };

	  var DistinctObservable = (function (__super__) {
	    inherits(DistinctObservable, __super__);
	    function DistinctObservable(source, keyFn, cmpFn) {
	      this.source = source;
	      this._keyFn = keyFn;
	      this._cmpFn = cmpFn;
	      __super__.call(this);
	    }

	    DistinctObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new DistinctObserver(o, this._keyFn, this._cmpFn));
	    };

	    return DistinctObservable;
	  }(ObservableBase));

	  var DistinctObserver = (function (__super__) {
	    inherits(DistinctObserver, __super__);
	    function DistinctObserver(o, keyFn, cmpFn) {
	      this._o = o;
	      this._keyFn = keyFn;
	      this._h = new HashSet(cmpFn);
	      __super__.call(this);
	    }

	    DistinctObserver.prototype.next = function (x) {
	      var key = x;
	      if (isFunction(this._keyFn)) {
	        key = tryCatch(this._keyFn)(x);
	        if (key === errorObj) { return this._o.onError(key.e); }
	      }
	      this._h.push(key) && this._o.onNext(x);
	    };

	    DistinctObserver.prototype.error = function (e) { this._o.onError(e); };
	    DistinctObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return DistinctObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer.
	   *  Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large.
	   *
	   * @example
	   *  var res = obs = xs.distinct();
	   *  2 - obs = xs.distinct(function (x) { return x.id; });
	   *  2 - obs = xs.distinct(function (x) { return x.id; }, function (a,b) { return a === b; });
	   * @param {Function} [keySelector]  A function to compute the comparison key for each element.
	   * @param {Function} [comparer]  Used to compare items in the collection.
	   * @returns {Observable} An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.
	   */
	  observableProto.distinct = function (keySelector, comparer) {
	    comparer || (comparer = defaultComparer);
	    return new DistinctObservable(this, keySelector, comparer);
	  };

	  /**
	   *  Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.
	   *
	   * @example
	   *  var res = observable.groupBy(function (x) { return x.id; });
	   *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; });
	   *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; }, function (x) { return x.toString(); });
	   * @param {Function} keySelector A function to extract the key for each element.
	   * @param {Function} [elementSelector]  A function to map each source element to an element in an observable group.
	   * @returns {Observable} A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
	   */
	  observableProto.groupBy = function (keySelector, elementSelector) {
	    return this.groupByUntil(keySelector, elementSelector, observableNever);
	  };

	    /**
	     *  Groups the elements of an observable sequence according to a specified key selector function.
	     *  A duration selector function is used to control the lifetime of groups. When a group expires, it receives an OnCompleted notification. When a new element with the same
	     *  key value as a reclaimed group occurs, the group will be reborn with a new lifetime request.
	     *
	     * @example
	     *  var res = observable.groupByUntil(function (x) { return x.id; }, null,  function () { return Rx.Observable.never(); });
	     *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); });
	     *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); }, function (x) { return x.toString(); });
	     * @param {Function} keySelector A function to extract the key for each element.
	     * @param {Function} durationSelector A function to signal the expiration of a group.
	     * @returns {Observable}
	     *  A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
	     *  If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encoutered.
	     *
	     */
	    observableProto.groupByUntil = function (keySelector, elementSelector, durationSelector) {
	      var source = this;
	      return new AnonymousObservable(function (o) {
	        var map = new Map(),
	          groupDisposable = new CompositeDisposable(),
	          refCountDisposable = new RefCountDisposable(groupDisposable),
	          handleError = function (e) { return function (item) { item.onError(e); }; };

	        groupDisposable.add(
	          source.subscribe(function (x) {
	            var key = tryCatch(keySelector)(x);
	            if (key === errorObj) {
	              map.forEach(handleError(key.e));
	              return o.onError(key.e);
	            }

	            var fireNewMapEntry = false, writer = map.get(key);
	            if (writer === undefined) {
	              writer = new Subject();
	              map.set(key, writer);
	              fireNewMapEntry = true;
	            }

	            if (fireNewMapEntry) {
	              var group = new GroupedObservable(key, writer, refCountDisposable),
	                durationGroup = new GroupedObservable(key, writer);
	              var duration = tryCatch(durationSelector)(durationGroup);
	              if (duration === errorObj) {
	                map.forEach(handleError(duration.e));
	                return o.onError(duration.e);
	              }

	              o.onNext(group);

	              var md = new SingleAssignmentDisposable();
	              groupDisposable.add(md);

	              md.setDisposable(duration.take(1).subscribe(
	                noop,
	                function (e) {
	                  map.forEach(handleError(e));
	                  o.onError(e);
	                },
	                function () {
	                  if (map['delete'](key)) { writer.onCompleted(); }
	                  groupDisposable.remove(md);
	                }));
	            }

	            var element = x;
	            if (isFunction(elementSelector)) {
	              element = tryCatch(elementSelector)(x);
	              if (element === errorObj) {
	                map.forEach(handleError(element.e));
	                return o.onError(element.e);
	              }
	            }

	            writer.onNext(element);
	        }, function (e) {
	          map.forEach(handleError(e));
	          o.onError(e);
	        }, function () {
	          map.forEach(function (item) { item.onCompleted(); });
	          o.onCompleted();
	        }));

	      return refCountDisposable;
	    }, source);
	  };

	  var MapObservable = (function (__super__) {
	    inherits(MapObservable, __super__);

	    function MapObservable(source, selector, thisArg) {
	      this.source = source;
	      this.selector = bindCallback(selector, thisArg, 3);
	      __super__.call(this);
	    }

	    function innerMap(selector, self) {
	      return function (x, i, o) { return selector.call(this, self.selector(x, i, o), i, o); };
	    }

	    MapObservable.prototype.internalMap = function (selector, thisArg) {
	      return new MapObservable(this.source, innerMap(selector, this), thisArg);
	    };

	    MapObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.selector, this));
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o, selector, source) {
	      this.o = o;
	      this.selector = selector;
	      this.source = source;
	      this.i = 0;
	      AbstractObserver.call(this);
	    }

	    InnerObserver.prototype.next = function(x) {
	      var result = tryCatch(this.selector)(x, this.i++, this.source);
	      if (result === errorObj) { return this.o.onError(result.e); }
	      this.o.onNext(result);
	    };

	    InnerObserver.prototype.error = function (e) {
	      this.o.onError(e);
	    };

	    InnerObserver.prototype.completed = function () {
	      this.o.onCompleted();
	    };

	    return MapObservable;

	  }(ObservableBase));

	  /**
	  * Projects each element of an observable sequence into a new form by incorporating the element's index.
	  * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source.
	  */
	  observableProto.map = observableProto.select = function (selector, thisArg) {
	    var selectorFn = typeof selector === 'function' ? selector : function () { return selector; };
	    return this instanceof MapObservable ?
	      this.internalMap(selectorFn, thisArg) :
	      new MapObservable(this, selectorFn, thisArg);
	  };

	  function plucker(args, len) {
	    return function mapper(x) {
	      var currentProp = x;
	      for (var i = 0; i < len; i++) {
	        var p = currentProp[args[i]];
	        if (typeof p !== 'undefined') {
	          currentProp = p;
	        } else {
	          return undefined;
	        }
	      }
	      return currentProp;
	    }
	  }

	  /**
	   * Retrieves the value of a specified nested property from all elements in
	   * the Observable sequence.
	   * @param {Arguments} arguments The nested properties to pluck.
	   * @returns {Observable} Returns a new Observable sequence of property values.
	   */
	  observableProto.pluck = function () {
	    var len = arguments.length, args = new Array(len);
	    if (len === 0) { throw new Error('List of properties cannot be empty.'); }
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return this.map(plucker(args, len));
	  };

	observableProto.flatMap = observableProto.selectMany = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).mergeAll();
	};

	  /**
	   * Projects each notification of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
	   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
	   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
	   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
	   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
	   */
	  observableProto.flatMapObserver = observableProto.selectManyObserver = function (onNext, onError, onCompleted, thisArg) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var index = 0;

	      return source.subscribe(
	        function (x) {
	          var result;
	          try {
	            result = onNext.call(thisArg, x, index++);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	        },
	        function (err) {
	          var result;
	          try {
	            result = onError.call(thisArg, err);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        },
	        function () {
	          var result;
	          try {
	            result = onCompleted.call(thisArg);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        });
	    }, source).mergeAll();
	  };

	Rx.Observable.prototype.flatMapLatest = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchLatest();
	};
	  var SkipObservable = (function(__super__) {
	    inherits(SkipObservable, __super__);
	    function SkipObservable(source, count) {
	      this.source = source;
	      this._count = count;
	      __super__.call(this);
	    }

	    SkipObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SkipObserver(o, this._count));
	    };

	    function SkipObserver(o, c) {
	      this._o = o;
	      this._r = c;
	      AbstractObserver.call(this);
	    }

	    inherits(SkipObserver, AbstractObserver);

	    SkipObserver.prototype.next = function (x) {
	      if (this._r <= 0) {
	        this._o.onNext(x);
	      } else {
	        this._r--;
	      }
	    };
	    SkipObserver.prototype.error = function(e) { this._o.onError(e); };
	    SkipObserver.prototype.completed = function() { this._o.onCompleted(); };

	    return SkipObservable;
	  }(ObservableBase));

	  /**
	   * Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
	   * @param {Number} count The number of elements to skip before returning the remaining elements.
	   * @returns {Observable} An observable sequence that contains the elements that occur after the specified index in the input sequence.
	   */
	  observableProto.skip = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    return new SkipObservable(this, count);
	  };

	  var SkipWhileObservable = (function (__super__) {
	    inherits(SkipWhileObservable, __super__);
	    function SkipWhileObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    SkipWhileObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SkipWhileObserver(o, this));
	    };

	    return SkipWhileObservable;
	  }(ObservableBase));

	  var SkipWhileObserver = (function (__super__) {
	    inherits(SkipWhileObserver, __super__);

	    function SkipWhileObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      this._i = 0;
	      this._r = false;
	      __super__.call(this);
	    }

	    SkipWhileObserver.prototype.next = function (x) {
	      if (!this._r) {
	        var res = tryCatch(this._p._fn)(x, this._i++, this._p);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        this._r = !res;
	      }
	      this._r && this._o.onNext(x);
	    };
	    SkipWhileObserver.prototype.error = function (e) { this._o.onError(e); };
	    SkipWhileObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return SkipWhileObserver;
	  }(AbstractObserver));

	  /**
	   *  Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.
	   *  The element's index is used in the logic of the predicate function.
	   *
	   *  var res = source.skipWhile(function (value) { return value < 10; });
	   *  var res = source.skipWhile(function (value, index) { return value < 10 || index < 10; });
	   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
	   */
	  observableProto.skipWhile = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new SkipWhileObservable(this, fn);
	  };

	  var TakeObservable = (function(__super__) {
	    inherits(TakeObservable, __super__);
	    function TakeObservable(source, count) {
	      this.source = source;
	      this._count = count;
	      __super__.call(this);
	    }

	    TakeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TakeObserver(o, this._count));
	    };

	    function TakeObserver(o, c) {
	      this._o = o;
	      this._c = c;
	      this._r = c;
	      AbstractObserver.call(this);
	    }

	    inherits(TakeObserver, AbstractObserver);

	    TakeObserver.prototype.next = function (x) {
	      if (this._r-- > 0) {
	        this._o.onNext(x);
	        this._r <= 0 && this._o.onCompleted();
	      }
	    };

	    TakeObserver.prototype.error = function (e) { this._o.onError(e); };
	    TakeObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return TakeObservable;
	  }(ObservableBase));

	  /**
	   *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
	   * @param {Number} count The number of elements to return.
	   * @param {Scheduler} [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
	   * @returns {Observable} An observable sequence that contains the specified number of elements from the start of the input sequence.
	   */
	  observableProto.take = function (count, scheduler) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    if (count === 0) { return observableEmpty(scheduler); }
	    return new TakeObservable(this, count);
	  };

	  var TakeWhileObservable = (function (__super__) {
	    inherits(TakeWhileObservable, __super__);
	    function TakeWhileObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    TakeWhileObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TakeWhileObserver(o, this));
	    };

	    return TakeWhileObservable;
	  }(ObservableBase));

	  var TakeWhileObserver = (function (__super__) {
	    inherits(TakeWhileObserver, __super__);

	    function TakeWhileObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      this._i = 0;
	      this._r = true;
	      __super__.call(this);
	    }

	    TakeWhileObserver.prototype.next = function (x) {
	      if (this._r) {
	        this._r = tryCatch(this._p._fn)(x, this._i++, this._p);
	        if (this._r === errorObj) { return this._o.onError(this._r.e); }
	      }
	      if (this._r) {
	        this._o.onNext(x);
	      } else {
	        this._o.onCompleted();
	      }
	    };
	    TakeWhileObserver.prototype.error = function (e) { this._o.onError(e); };
	    TakeWhileObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return TakeWhileObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns elements from an observable sequence as long as a specified condition is true.
	   *  The element's index is used in the logic of the predicate function.
	   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
	   */
	  observableProto.takeWhile = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new TakeWhileObservable(this, fn);
	  };

	  var FilterObservable = (function (__super__) {
	    inherits(FilterObservable, __super__);

	    function FilterObservable(source, predicate, thisArg) {
	      this.source = source;
	      this.predicate = bindCallback(predicate, thisArg, 3);
	      __super__.call(this);
	    }

	    FilterObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.predicate, this));
	    };

	    function innerPredicate(predicate, self) {
	      return function(x, i, o) { return self.predicate(x, i, o) && predicate.call(this, x, i, o); }
	    }

	    FilterObservable.prototype.internalFilter = function(predicate, thisArg) {
	      return new FilterObservable(this.source, innerPredicate(predicate, this), thisArg);
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o, predicate, source) {
	      this.o = o;
	      this.predicate = predicate;
	      this.source = source;
	      this.i = 0;
	      AbstractObserver.call(this);
	    }

	    InnerObserver.prototype.next = function(x) {
	      var shouldYield = tryCatch(this.predicate)(x, this.i++, this.source);
	      if (shouldYield === errorObj) {
	        return this.o.onError(shouldYield.e);
	      }
	      shouldYield && this.o.onNext(x);
	    };

	    InnerObserver.prototype.error = function (e) {
	      this.o.onError(e);
	    };

	    InnerObserver.prototype.completed = function () {
	      this.o.onCompleted();
	    };

	    return FilterObservable;

	  }(ObservableBase));

	  /**
	  *  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
	  * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.
	  */
	  observableProto.filter = observableProto.where = function (predicate, thisArg) {
	    return this instanceof FilterObservable ? this.internalFilter(predicate, thisArg) :
	      new FilterObservable(this, predicate, thisArg);
	  };

	  var ExtremaByObservable = (function (__super__) {
	    inherits(ExtremaByObservable, __super__);
	    function ExtremaByObservable(source, k, c) {
	      this.source = source;
	      this._k = k;
	      this._c = c;
	      __super__.call(this);
	    }

	    ExtremaByObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new ExtremaByObserver(o, this._k, this._c));
	    };

	    return ExtremaByObservable;
	  }(ObservableBase));

	  var ExtremaByObserver = (function (__super__) {
	    inherits(ExtremaByObserver, __super__);
	    function ExtremaByObserver(o, k, c) {
	      this._o = o;
	      this._k = k;
	      this._c = c;
	      this._v = null;
	      this._hv = false;
	      this._l = [];
	      __super__.call(this);
	    }

	    ExtremaByObserver.prototype.next = function (x) {
	      var key = tryCatch(this._k)(x);
	      if (key === errorObj) { return this._o.onError(key.e); }
	      var comparison = 0;
	      if (!this._hv) {
	        this._hv = true;
	        this._v = key;
	      } else {
	        comparison = tryCatch(this._c)(key, this._v);
	        if (comparison === errorObj) { return this._o.onError(comparison.e); }
	      }
	      if (comparison > 0) {
	        this._v = key;
	        this._l = [];
	      }
	      if (comparison >= 0) { this._l.push(x); }
	    };

	    ExtremaByObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ExtremaByObserver.prototype.completed = function () {
	      this._o.onNext(this._l);
	      this._o.onCompleted();
	    };

	    return ExtremaByObserver;
	  }(AbstractObserver));

	  function firstOnly(x) {
	    if (x.length === 0) { throw new EmptyError(); }
	    return x[0];
	  }

	  var ReduceObservable = (function(__super__) {
	    inherits(ReduceObservable, __super__);
	    function ReduceObservable(source, accumulator, hasSeed, seed) {
	      this.source = source;
	      this.accumulator = accumulator;
	      this.hasSeed = hasSeed;
	      this.seed = seed;
	      __super__.call(this);
	    }

	    ReduceObservable.prototype.subscribeCore = function(observer) {
	      return this.source.subscribe(new ReduceObserver(observer,this));
	    };

	    return ReduceObservable;
	  }(ObservableBase));

	  var ReduceObserver = (function (__super__) {
	    inherits(ReduceObserver, __super__);
	    function ReduceObserver(o, parent) {
	      this._o = o;
	      this._p = parent;
	      this._fn = parent.accumulator;
	      this._hs = parent.hasSeed;
	      this._s = parent.seed;
	      this._ha = false;
	      this._a = null;
	      this._hv = false;
	      this._i = 0;
	      __super__.call(this);
	    }

	    ReduceObserver.prototype.next = function (x) {
	      !this._hv && (this._hv = true);
	      if (this._ha) {
	        this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
	      } else {
	        this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
	        this._ha = true;
	      }
	      if (this._a === errorObj) { return this._o.onError(this._a.e); }
	      this._i++;
	    };

	    ReduceObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ReduceObserver.prototype.completed = function () {
	      this._hv && this._o.onNext(this._a);
	      !this._hv && this._hs && this._o.onNext(this._s);
	      !this._hv && !this._hs && this._o.onError(new EmptyError());
	      this._o.onCompleted();
	    };

	    return ReduceObserver;
	  }(AbstractObserver));

	  /**
	  * Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
	  * For aggregation behavior with incremental intermediate results, see Observable.scan.
	  * @param {Function} accumulator An accumulator function to be invoked on each element.
	  * @param {Any} [seed] The initial accumulator value.
	  * @returns {Observable} An observable sequence containing a single element with the final accumulator value.
	  */
	  observableProto.reduce = function () {
	    var hasSeed = false, seed, accumulator = arguments[0];
	    if (arguments.length === 2) {
	      hasSeed = true;
	      seed = arguments[1];
	    }
	    return new ReduceObservable(this, accumulator, hasSeed, seed);
	  };

	  var SomeObservable = (function (__super__) {
	    inherits(SomeObservable, __super__);
	    function SomeObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    SomeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SomeObserver(o, this._fn, this.source));
	    };

	    return SomeObservable;
	  }(ObservableBase));

	  var SomeObserver = (function (__super__) {
	    inherits(SomeObserver, __super__);

	    function SomeObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }

	    SomeObserver.prototype.next = function (x) {
	      var result = tryCatch(this._fn)(x, this._i++, this._s);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      if (Boolean(result)) {
	        this._o.onNext(true);
	        this._o.onCompleted();
	      }
	    };
	    SomeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SomeObserver.prototype.completed = function () {
	      this._o.onNext(false);
	      this._o.onCompleted();
	    };

	    return SomeObserver;
	  }(AbstractObserver));

	  /**
	   * Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.
	   * @param {Function} [predicate] A function to test each element for a condition.
	   * @returns {Observable} An observable sequence containing a single element determining whether any elements in the source sequence pass the test in the specified predicate if given, else if any items are in the sequence.
	   */
	  observableProto.some = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new SomeObservable(this, fn);
	  };

	  var IsEmptyObservable = (function (__super__) {
	    inherits(IsEmptyObservable, __super__);
	    function IsEmptyObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    IsEmptyObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new IsEmptyObserver(o));
	    };

	    return IsEmptyObservable;
	  }(ObservableBase));

	  var IsEmptyObserver = (function(__super__) {
	    inherits(IsEmptyObserver, __super__);
	    function IsEmptyObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }

	    IsEmptyObserver.prototype.next = function () {
	      this._o.onNext(false);
	      this._o.onCompleted();
	    };
	    IsEmptyObserver.prototype.error = function (e) { this._o.onError(e); };
	    IsEmptyObserver.prototype.completed = function () {
	      this._o.onNext(true);
	      this._o.onCompleted();
	    };

	    return IsEmptyObserver;
	  }(AbstractObserver));

	  /**
	   * Determines whether an observable sequence is empty.
	   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence is empty.
	   */
	  observableProto.isEmpty = function () {
	    return new IsEmptyObservable(this);
	  };

	  var EveryObservable = (function (__super__) {
	    inherits(EveryObservable, __super__);
	    function EveryObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    EveryObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new EveryObserver(o, this._fn, this.source));
	    };

	    return EveryObservable;
	  }(ObservableBase));

	  var EveryObserver = (function (__super__) {
	    inherits(EveryObserver, __super__);

	    function EveryObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }

	    EveryObserver.prototype.next = function (x) {
	      var result = tryCatch(this._fn)(x, this._i++, this._s);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      if (!Boolean(result)) {
	        this._o.onNext(false);
	        this._o.onCompleted();
	      }
	    };
	    EveryObserver.prototype.error = function (e) { this._o.onError(e); };
	    EveryObserver.prototype.completed = function () {
	      this._o.onNext(true);
	      this._o.onCompleted();
	    };

	    return EveryObserver;
	  }(AbstractObserver));

	  /**
	   * Determines whether all elements of an observable sequence satisfy a condition.
	   * @param {Function} [predicate] A function to test each element for a condition.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.
	   */
	  observableProto.every = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new EveryObservable(this, fn);
	  };

	  var IncludesObservable = (function (__super__) {
	    inherits(IncludesObservable, __super__);
	    function IncludesObservable(source, elem, idx) {
	      var n = +idx || 0;
	      Math.abs(n) === Infinity && (n = 0);

	      this.source = source;
	      this._elem = elem;
	      this._n = n;
	      __super__.call(this);
	    }

	    IncludesObservable.prototype.subscribeCore = function (o) {
	      if (this._n < 0) {
	        o.onNext(false);
	        o.onCompleted();
	        return disposableEmpty;
	      }

	      return this.source.subscribe(new IncludesObserver(o, this._elem, this._n));
	    };

	    return IncludesObservable;
	  }(ObservableBase));

	  var IncludesObserver = (function (__super__) {
	    inherits(IncludesObserver, __super__);
	    function IncludesObserver(o, elem, n) {
	      this._o = o;
	      this._elem = elem;
	      this._n = n;
	      this._i = 0;
	      __super__.call(this);
	    }

	    function comparer(a, b) {
	      return (a === 0 && b === 0) || (a === b || (isNaN(a) && isNaN(b)));
	    }

	    IncludesObserver.prototype.next = function (x) {
	      if (this._i++ >= this._n && comparer(x, this._elem)) {
	        this._o.onNext(true);
	        this._o.onCompleted();
	      }
	    };
	    IncludesObserver.prototype.error = function (e) { this._o.onError(e); };
	    IncludesObserver.prototype.completed = function () { this._o.onNext(false); this._o.onCompleted(); };

	    return IncludesObserver;
	  }(AbstractObserver));

	  /**
	   * Determines whether an observable sequence includes a specified element with an optional equality comparer.
	   * @param searchElement The value to locate in the source sequence.
	   * @param {Number} [fromIndex] An equality comparer to compare elements.
	   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence includes an element that has the specified value from the given index.
	   */
	  observableProto.includes = function (searchElement, fromIndex) {
	    return new IncludesObservable(this, searchElement, fromIndex);
	  };

	  var CountObservable = (function (__super__) {
	    inherits(CountObservable, __super__);
	    function CountObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    CountObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new CountObserver(o, this._fn, this.source));
	    };

	    return CountObservable;
	  }(ObservableBase));

	  var CountObserver = (function (__super__) {
	    inherits(CountObserver, __super__);

	    function CountObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      this._c = 0;
	      __super__.call(this);
	    }

	    CountObserver.prototype.next = function (x) {
	      if (this._fn) {
	        var result = tryCatch(this._fn)(x, this._i++, this._s);
	        if (result === errorObj) { return this._o.onError(result.e); }
	        Boolean(result) && (this._c++);
	      } else {
	        this._c++;
	      }
	    };
	    CountObserver.prototype.error = function (e) { this._o.onError(e); };
	    CountObserver.prototype.completed = function () {
	      this._o.onNext(this._c);
	      this._o.onCompleted();
	    };

	    return CountObserver;
	  }(AbstractObserver));

	  /**
	   * Returns an observable sequence containing a value that represents how many elements in the specified observable sequence satisfy a condition if provided, else the count of items.
	   * @example
	   * res = source.count();
	   * res = source.count(function (x) { return x > 3; });
	   * @param {Function} [predicate]A function to test each element for a condition.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with a number that represents how many elements in the input sequence satisfy the condition in the predicate function if provided, else the count of items in the sequence.
	   */
	  observableProto.count = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new CountObservable(this, fn);
	  };

	  var IndexOfObservable = (function (__super__) {
	    inherits(IndexOfObservable, __super__);
	    function IndexOfObservable(source, e, n) {
	      this.source = source;
	      this._e = e;
	      this._n = n;
	      __super__.call(this);
	    }

	    IndexOfObservable.prototype.subscribeCore = function (o) {
	      if (this._n < 0) {
	        o.onNext(-1);
	        o.onCompleted();
	        return disposableEmpty;
	      }

	      return this.source.subscribe(new IndexOfObserver(o, this._e, this._n));
	    };

	    return IndexOfObservable;
	  }(ObservableBase));

	  var IndexOfObserver = (function (__super__) {
	    inherits(IndexOfObserver, __super__);
	    function IndexOfObserver(o, e, n) {
	      this._o = o;
	      this._e = e;
	      this._n = n;
	      this._i = 0;
	      __super__.call(this);
	    }

	    IndexOfObserver.prototype.next = function (x) {
	      if (this._i >= this._n && x === this._e) {
	        this._o.onNext(this._i);
	        this._o.onCompleted();
	      }
	      this._i++;
	    };
	    IndexOfObserver.prototype.error = function (e) { this._o.onError(e); };
	    IndexOfObserver.prototype.completed = function () { this._o.onNext(-1); this._o.onCompleted(); };

	    return IndexOfObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   * @param {Any} searchElement Element to locate in the array.
	   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
	   * @returns {Observable} And observable sequence containing the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   */
	  observableProto.indexOf = function(searchElement, fromIndex) {
	    var n = +fromIndex || 0;
	    Math.abs(n) === Infinity && (n = 0);
	    return new IndexOfObservable(this, searchElement, n);
	  };

	  var SumObservable = (function (__super__) {
	    inherits(SumObservable, __super__);
	    function SumObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    SumObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SumObserver(o, this._fn, this.source));
	    };

	    return SumObservable;
	  }(ObservableBase));

	  var SumObserver = (function (__super__) {
	    inherits(SumObserver, __super__);

	    function SumObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      this._c = 0;
	      __super__.call(this);
	    }

	    SumObserver.prototype.next = function (x) {
	      if (this._fn) {
	        var result = tryCatch(this._fn)(x, this._i++, this._s);
	        if (result === errorObj) { return this._o.onError(result.e); }
	        this._c += result;
	      } else {
	        this._c += x;
	      }
	    };
	    SumObserver.prototype.error = function (e) { this._o.onError(e); };
	    SumObserver.prototype.completed = function () {
	      this._o.onNext(this._c);
	      this._o.onCompleted();
	    };

	    return SumObserver;
	  }(AbstractObserver));

	  /**
	   * Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.
	   * @param {Function} [selector] A transform function to apply to each element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with the sum of the values in the source sequence.
	   */
	  observableProto.sum = function (keySelector, thisArg) {
	    var fn = bindCallback(keySelector, thisArg, 3);
	    return new SumObservable(this, fn);
	  };

	  /**
	   * Returns the elements in an observable sequence with the minimum key value according to the specified comparer.
	   * @example
	   * var res = source.minBy(function (x) { return x.value; });
	   * var res = source.minBy(function (x) { return x.value; }, function (x, y) { return x - y; });
	   * @param {Function} keySelector Key selector function.
	   * @param {Function} [comparer] Comparer used to compare key values.
	   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a minimum key value.
	   */
	  observableProto.minBy = function (keySelector, comparer) {
	    comparer || (comparer = defaultSubComparer);
	    return new ExtremaByObservable(this, keySelector, function (x, y) { return comparer(x, y) * -1; });
	  };

	  /**
	   * Returns the minimum element in an observable sequence according to the optional comparer else a default greater than less than check.
	   * @example
	   * var res = source.min();
	   * var res = source.min(function (x, y) { return x.value - y.value; });
	   * @param {Function} [comparer] Comparer used to compare elements.
	   * @returns {Observable} An observable sequence containing a single element with the minimum element in the source sequence.
	   */
	  observableProto.min = function (comparer) {
	    return this.minBy(identity, comparer).map(function (x) { return firstOnly(x); });
	  };

	  /**
	   * Returns the elements in an observable sequence with the maximum  key value according to the specified comparer.
	   * @example
	   * var res = source.maxBy(function (x) { return x.value; });
	   * var res = source.maxBy(function (x) { return x.value; }, function (x, y) { return x - y;; });
	   * @param {Function} keySelector Key selector function.
	   * @param {Function} [comparer]  Comparer used to compare key values.
	   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a maximum key value.
	   */
	  observableProto.maxBy = function (keySelector, comparer) {
	    comparer || (comparer = defaultSubComparer);
	    return new ExtremaByObservable(this, keySelector, comparer);
	  };

	  /**
	   * Returns the maximum value in an observable sequence according to the specified comparer.
	   * @example
	   * var res = source.max();
	   * var res = source.max(function (x, y) { return x.value - y.value; });
	   * @param {Function} [comparer] Comparer used to compare elements.
	   * @returns {Observable} An observable sequence containing a single element with the maximum element in the source sequence.
	   */
	  observableProto.max = function (comparer) {
	    return this.maxBy(identity, comparer).map(function (x) { return firstOnly(x); });
	  };

	  var AverageObservable = (function (__super__) {
	    inherits(AverageObservable, __super__);
	    function AverageObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    AverageObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new AverageObserver(o, this._fn, this.source));
	    };

	    return AverageObservable;
	  }(ObservableBase));

	  var AverageObserver = (function(__super__) {
	    inherits(AverageObserver, __super__);
	    function AverageObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._c = 0;
	      this._t = 0;
	      __super__.call(this);
	    }

	    AverageObserver.prototype.next = function (x) {
	      if(this._fn) {
	        var r = tryCatch(this._fn)(x, this._c++, this._s);
	        if (r === errorObj) { return this._o.onError(r.e); }
	        this._t += r;
	      } else {
	        this._c++;
	        this._t += x;
	      }
	    };
	    AverageObserver.prototype.error = function (e) { this._o.onError(e); };
	    AverageObserver.prototype.completed = function () {
	      if (this._c === 0) { return this._o.onError(new EmptyError()); }
	      this._o.onNext(this._t / this._c);
	      this._o.onCompleted();
	    };

	    return AverageObserver;
	  }(AbstractObserver));

	  /**
	   * Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
	   * @param {Function} [selector] A transform function to apply to each element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with the average of the sequence of values.
	   */
	  observableProto.average = function (keySelector, thisArg) {
	    var source = this, fn;
	    if (isFunction(keySelector)) {
	      fn = bindCallback(keySelector, thisArg, 3);
	    }
	    return new AverageObservable(source, fn);
	  };

	  /**
	   *  Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.
	   *
	   * @example
	   * var res = res = source.sequenceEqual([1,2,3]);
	   * var res = res = source.sequenceEqual([{ value: 42 }], function (x, y) { return x.value === y.value; });
	   * 3 - res = source.sequenceEqual(Rx.Observable.returnValue(42));
	   * 4 - res = source.sequenceEqual(Rx.Observable.returnValue({ value: 42 }), function (x, y) { return x.value === y.value; });
	   * @param {Observable} second Second observable sequence or array to compare.
	   * @param {Function} [comparer] Comparer used to compare elements of both sequences.
	   * @returns {Observable} An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.
	   */
	  observableProto.sequenceEqual = function (second, comparer) {
	    var first = this;
	    comparer || (comparer = defaultComparer);
	    return new AnonymousObservable(function (o) {
	      var donel = false, doner = false, ql = [], qr = [];
	      var subscription1 = first.subscribe(function (x) {
	        if (qr.length > 0) {
	          var v = qr.shift();
	          var equal = tryCatch(comparer)(v, x);
	          if (equal === errorObj) { return o.onError(equal.e); }
	          if (!equal) {
	            o.onNext(false);
	            o.onCompleted();
	          }
	        } else if (doner) {
	          o.onNext(false);
	          o.onCompleted();
	        } else {
	          ql.push(x);
	        }
	      }, function(e) { o.onError(e); }, function () {
	        donel = true;
	        if (ql.length === 0) {
	          if (qr.length > 0) {
	            o.onNext(false);
	            o.onCompleted();
	          } else if (doner) {
	            o.onNext(true);
	            o.onCompleted();
	          }
	        }
	      });

	      (isArrayLike(second) || isIterable(second)) && (second = observableFrom(second));
	      isPromise(second) && (second = observableFromPromise(second));
	      var subscription2 = second.subscribe(function (x) {
	        if (ql.length > 0) {
	          var v = ql.shift();
	          var equal = tryCatch(comparer)(v, x);
	          if (equal === errorObj) { return o.onError(equal.e); }
	          if (!equal) {
	            o.onNext(false);
	            o.onCompleted();
	          }
	        } else if (donel) {
	          o.onNext(false);
	          o.onCompleted();
	        } else {
	          qr.push(x);
	        }
	      }, function(e) { o.onError(e); }, function () {
	        doner = true;
	        if (qr.length === 0) {
	          if (ql.length > 0) {
	            o.onNext(false);
	            o.onCompleted();
	          } else if (donel) {
	            o.onNext(true);
	            o.onCompleted();
	          }
	        }
	      });
	      return new BinaryDisposable(subscription1, subscription2);
	    }, first);
	  };

	  var ElementAtObservable = (function (__super__) {
	    inherits(ElementAtObservable, __super__);
	    function ElementAtObservable(source, i, d) {
	      this.source = source;
	      this._i = i;
	      this._d = d;
	      __super__.call(this);
	    }

	    ElementAtObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new ElementAtObserver(o, this._i, this._d));
	    };

	    return ElementAtObservable;
	  }(ObservableBase));

	  var ElementAtObserver = (function (__super__) {
	    inherits(ElementAtObserver, __super__);

	    function ElementAtObserver(o, i, d) {
	      this._o = o;
	      this._i = i;
	      this._d = d;
	      __super__.call(this);
	    }

	    ElementAtObserver.prototype.next = function (x) {
	      if (this._i-- === 0) {
	        this._o.onNext(x);
	        this._o.onCompleted();
	      }
	    };
	    ElementAtObserver.prototype.error = function (e) { this._o.onError(e); };
	    ElementAtObserver.prototype.completed = function () {
	      if (this._d === undefined) {
	        this._o.onError(new ArgumentOutOfRangeError());
	      } else {
	        this._o.onNext(this._d);
	        this._o.onCompleted();
	      }
	    };

	    return ElementAtObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the element at a specified index in a sequence or default value if not found.
	   * @param {Number} index The zero-based index of the element to retrieve.
	   * @param {Any} [defaultValue] The default value to use if elementAt does not find a value.
	   * @returns {Observable} An observable sequence that produces the element at the specified position in the source sequence.
	   */
	  observableProto.elementAt =  function (index, defaultValue) {
	    if (index < 0) { throw new ArgumentOutOfRangeError(); }
	    return new ElementAtObservable(this, index, defaultValue);
	  };

	  var SingleObserver = (function(__super__) {
	    inherits(SingleObserver, __super__);
	    function SingleObserver(o, obj, s) {
	      this._o = o;
	      this._obj = obj;
	      this._s = s;
	      this._i = 0;
	      this._hv = false;
	      this._v = null;
	      __super__.call(this);
	    }

	    SingleObserver.prototype.next = function (x) {
	      var shouldYield = false;
	      if (this._obj.predicate) {
	        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        Boolean(res) && (shouldYield = true);
	      } else if (!this._obj.predicate) {
	        shouldYield = true;
	      }
	      if (shouldYield) {
	        if (this._hv) {
	          return this._o.onError(new Error('Sequence contains more than one matching element'));
	        }
	        this._hv = true;
	        this._v = x;
	      }
	    };
	    SingleObserver.prototype.error = function (e) { this._o.onError(e); };
	    SingleObserver.prototype.completed = function () {
	      if (this._hv) {
	        this._o.onNext(this._v);
	        this._o.onCompleted();
	      }
	      else if (this._obj.defaultValue === undefined) {
	        this._o.onError(new EmptyError());
	      } else {
	        this._o.onNext(this._obj.defaultValue);
	        this._o.onCompleted();
	      }
	    };

	    return SingleObserver;
	  }(AbstractObserver));


	    /**
	     * Returns the only element of an observable sequence that satisfies the condition in the optional predicate, and reports an exception if there is not exactly one element in the observable sequence.
	     * @returns {Observable} Sequence containing the single element in the observable sequence that satisfies the condition in the predicate.
	     */
	    observableProto.single = function (predicate, thisArg) {
	      var obj = {}, source = this;
	      if (typeof arguments[0] === 'object') {
	        obj = arguments[0];
	      } else {
	        obj = {
	          predicate: arguments[0],
	          thisArg: arguments[1],
	          defaultValue: arguments[2]
	        };
	      }
	      if (isFunction (obj.predicate)) {
	        var fn = obj.predicate;
	        obj.predicate = bindCallback(fn, obj.thisArg, 3);
	      }
	      return new AnonymousObservable(function (o) {
	        return source.subscribe(new SingleObserver(o, obj, source));
	      }, source);
	    };

	  var FirstObservable = (function (__super__) {
	    inherits(FirstObservable, __super__);
	    function FirstObservable(source, obj) {
	      this.source = source;
	      this._obj = obj;
	      __super__.call(this);
	    }

	    FirstObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new FirstObserver(o, this._obj, this.source));
	    };

	    return FirstObservable;
	  }(ObservableBase));

	  var FirstObserver = (function(__super__) {
	    inherits(FirstObserver, __super__);
	    function FirstObserver(o, obj, s) {
	      this._o = o;
	      this._obj = obj;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }

	    FirstObserver.prototype.next = function (x) {
	      if (this._obj.predicate) {
	        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        if (Boolean(res)) {
	          this._o.onNext(x);
	          this._o.onCompleted();
	        }
	      } else if (!this._obj.predicate) {
	        this._o.onNext(x);
	        this._o.onCompleted();
	      }
	    };
	    FirstObserver.prototype.error = function (e) { this._o.onError(e); };
	    FirstObserver.prototype.completed = function () {
	      if (this._obj.defaultValue === undefined) {
	        this._o.onError(new EmptyError());
	      } else {
	        this._o.onNext(this._obj.defaultValue);
	        this._o.onCompleted();
	      }
	    };

	    return FirstObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the first element of an observable sequence that satisfies the condition in the predicate if present else the first item in the sequence.
	   * @returns {Observable} Sequence containing the first element in the observable sequence that satisfies the condition in the predicate if provided, else the first item in the sequence.
	   */
	  observableProto.first = function () {
	    var obj = {}, source = this;
	    if (typeof arguments[0] === 'object') {
	      obj = arguments[0];
	    } else {
	      obj = {
	        predicate: arguments[0],
	        thisArg: arguments[1],
	        defaultValue: arguments[2]
	      };
	    }
	    if (isFunction (obj.predicate)) {
	      var fn = obj.predicate;
	      obj.predicate = bindCallback(fn, obj.thisArg, 3);
	    }
	    return new FirstObservable(this, obj);
	  };

	  var LastObservable = (function (__super__) {
	    inherits(LastObservable, __super__);
	    function LastObservable(source, obj) {
	      this.source = source;
	      this._obj = obj;
	      __super__.call(this);
	    }

	    LastObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new LastObserver(o, this._obj, this.source));
	    };

	    return LastObservable;
	  }(ObservableBase));

	  var LastObserver = (function(__super__) {
	    inherits(LastObserver, __super__);
	    function LastObserver(o, obj, s) {
	      this._o = o;
	      this._obj = obj;
	      this._s = s;
	      this._i = 0;
	      this._hv = false;
	      this._v = null;
	      __super__.call(this);
	    }

	    LastObserver.prototype.next = function (x) {
	      var shouldYield = false;
	      if (this._obj.predicate) {
	        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        Boolean(res) && (shouldYield = true);
	      } else if (!this._obj.predicate) {
	        shouldYield = true;
	      }
	      if (shouldYield) {
	        this._hv = true;
	        this._v = x;
	      }
	    };
	    LastObserver.prototype.error = function (e) { this._o.onError(e); };
	    LastObserver.prototype.completed = function () {
	      if (this._hv) {
	        this._o.onNext(this._v);
	        this._o.onCompleted();
	      }
	      else if (this._obj.defaultValue === undefined) {
	        this._o.onError(new EmptyError());
	      } else {
	        this._o.onNext(this._obj.defaultValue);
	        this._o.onCompleted();
	      }
	    };

	    return LastObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.
	   * @returns {Observable} Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.
	   */
	  observableProto.last = function () {
	    var obj = {}, source = this;
	    if (typeof arguments[0] === 'object') {
	      obj = arguments[0];
	    } else {
	      obj = {
	        predicate: arguments[0],
	        thisArg: arguments[1],
	        defaultValue: arguments[2]
	      };
	    }
	    if (isFunction (obj.predicate)) {
	      var fn = obj.predicate;
	      obj.predicate = bindCallback(fn, obj.thisArg, 3);
	    }
	    return new LastObservable(this, obj);
	  };

	  var FindValueObserver = (function(__super__) {
	    inherits(FindValueObserver, __super__);
	    function FindValueObserver(observer, source, callback, yieldIndex) {
	      this._o = observer;
	      this._s = source;
	      this._cb = callback;
	      this._y = yieldIndex;
	      this._i = 0;
	      __super__.call(this);
	    }

	    FindValueObserver.prototype.next = function (x) {
	      var shouldRun = tryCatch(this._cb)(x, this._i, this._s);
	      if (shouldRun === errorObj) { return this._o.onError(shouldRun.e); }
	      if (shouldRun) {
	        this._o.onNext(this._y ? this._i : x);
	        this._o.onCompleted();
	      } else {
	        this._i++;
	      }
	    };

	    FindValueObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    FindValueObserver.prototype.completed = function () {
	      this._y && this._o.onNext(-1);
	      this._o.onCompleted();
	    };

	    return FindValueObserver;
	  }(AbstractObserver));

	  function findValue (source, predicate, thisArg, yieldIndex) {
	    var callback = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new FindValueObserver(o, source, callback, yieldIndex));
	    }, source);
	  }

	  /**
	   * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire Observable sequence.
	   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} An Observable sequence with the first element that matches the conditions defined by the specified predicate, if found; otherwise, undefined.
	   */
	  observableProto.find = function (predicate, thisArg) {
	    return findValue(this, predicate, thisArg, false);
	  };

	  /**
	   * Searches for an element that matches the conditions defined by the specified predicate, and returns
	   * an Observable sequence with the zero-based index of the first occurrence within the entire Observable sequence.
	   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} An Observable sequence with the zero-based index of the first occurrence of an element that matches the conditions defined by match, if found; otherwise, –1.
	  */
	  observableProto.findIndex = function (predicate, thisArg) {
	    return findValue(this, predicate, thisArg, true);
	  };

	  var ToSetObservable = (function (__super__) {
	    inherits(ToSetObservable, __super__);
	    function ToSetObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    ToSetObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new ToSetObserver(o));
	    };

	    return ToSetObservable;
	  }(ObservableBase));

	  var ToSetObserver = (function (__super__) {
	    inherits(ToSetObserver, __super__);
	    function ToSetObserver(o) {
	      this._o = o;
	      this._s = new root.Set();
	      __super__.call(this);
	    }

	    ToSetObserver.prototype.next = function (x) {
	      this._s.add(x);
	    };

	    ToSetObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ToSetObserver.prototype.completed = function () {
	      this._o.onNext(this._s);
	      this._o.onCompleted();
	    };

	    return ToSetObserver;
	  }(AbstractObserver));

	  /**
	   * Converts the observable sequence to a Set if it exists.
	   * @returns {Observable} An observable sequence with a single value of a Set containing the values from the observable sequence.
	   */
	  observableProto.toSet = function () {
	    if (typeof root.Set === 'undefined') { throw new TypeError(); }
	    return new ToSetObservable(this);
	  };

	  var ToMapObservable = (function (__super__) {
	    inherits(ToMapObservable, __super__);
	    function ToMapObservable(source, k, e) {
	      this.source = source;
	      this._k = k;
	      this._e = e;
	      __super__.call(this);
	    }

	    ToMapObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new ToMapObserver(o, this._k, this._e));
	    };

	    return ToMapObservable;
	  }(ObservableBase));

	  var ToMapObserver = (function (__super__) {
	    inherits(ToMapObserver, __super__);
	    function ToMapObserver(o, k, e) {
	      this._o = o;
	      this._k = k;
	      this._e = e;
	      this._m = new root.Map();
	      __super__.call(this);
	    }

	    ToMapObserver.prototype.next = function (x) {
	      var key = tryCatch(this._k)(x);
	      if (key === errorObj) { return this._o.onError(key.e); }
	      var elem = x;
	      if (this._e) {
	        elem = tryCatch(this._e)(x);
	        if (elem === errorObj) { return this._o.onError(elem.e); }
	      }

	      this._m.set(key, elem);
	    };

	    ToMapObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ToMapObserver.prototype.completed = function () {
	      this._o.onNext(this._m);
	      this._o.onCompleted();
	    };

	    return ToMapObserver;
	  }(AbstractObserver));

	  /**
	  * Converts the observable sequence to a Map if it exists.
	  * @param {Function} keySelector A function which produces the key for the Map.
	  * @param {Function} [elementSelector] An optional function which produces the element for the Map. If not present, defaults to the value from the observable sequence.
	  * @returns {Observable} An observable sequence with a single value of a Map containing the values from the observable sequence.
	  */
	  observableProto.toMap = function (keySelector, elementSelector) {
	    if (typeof root.Map === 'undefined') { throw new TypeError(); }
	    return new ToMapObservable(this, keySelector, elementSelector);
	  };

	  var SliceObservable = (function (__super__) {
	    inherits(SliceObservable, __super__);
	    function SliceObservable(source, b, e) {
	      this.source = source;
	      this._b = b;
	      this._e = e;
	      __super__.call(this);
	    }

	    SliceObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SliceObserver(o, this._b, this._e));
	    };

	    return SliceObservable;
	  }(ObservableBase));

	  var SliceObserver = (function (__super__) {
	    inherits(SliceObserver, __super__);

	    function SliceObserver(o, b, e) {
	      this._o = o;
	      this._b = b;
	      this._e = e;
	      this._i = 0;
	      __super__.call(this);
	    }

	    SliceObserver.prototype.next = function (x) {
	      if (this._i >= this._b) {
	        if (this._e === this._i) {
	          this._o.onCompleted();
	        } else {
	          this._o.onNext(x);
	        }
	      }
	      this._i++;
	    };
	    SliceObserver.prototype.error = function (e) { this._o.onError(e); };
	    SliceObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return SliceObserver;
	  }(AbstractObserver));

	  /*
	  * The slice() method returns a shallow copy of a portion of an Observable into a new Observable object.
	  * Unlike the array version, this does not support negative numbers for being or end.
	  * @param {Number} [begin] Zero-based index at which to begin extraction. If omitted, this will default to zero.
	  * @param {Number} [end] Zero-based index at which to end extraction. slice extracts up to but not including end.
	  * If omitted, this will emit the rest of the Observable object.
	  * @returns {Observable} A shallow copy of a portion of an Observable into a new Observable object.
	  */
	  observableProto.slice = function (begin, end) {
	    var start = begin || 0;
	    if (start < 0) { throw new Rx.ArgumentOutOfRangeError(); }
	    if (typeof end === 'number' && end < start) {
	      throw new Rx.ArgumentOutOfRangeError();
	    }
	    return new SliceObservable(this, start, end);
	  };

	  var LastIndexOfObservable = (function (__super__) {
	    inherits(LastIndexOfObservable, __super__);
	    function LastIndexOfObservable(source, e, n) {
	      this.source = source;
	      this._e = e;
	      this._n = n;
	      __super__.call(this);
	    }

	    LastIndexOfObservable.prototype.subscribeCore = function (o) {
	      if (this._n < 0) {
	        o.onNext(-1);
	        o.onCompleted();
	        return disposableEmpty;
	      }

	      return this.source.subscribe(new LastIndexOfObserver(o, this._e, this._n));
	    };

	    return LastIndexOfObservable;
	  }(ObservableBase));

	  var LastIndexOfObserver = (function (__super__) {
	    inherits(LastIndexOfObserver, __super__);
	    function LastIndexOfObserver(o, e, n) {
	      this._o = o;
	      this._e = e;
	      this._n = n;
	      this._v = 0;
	      this._hv = false;
	      this._i = 0;
	      __super__.call(this);
	    }

	    LastIndexOfObserver.prototype.next = function (x) {
	      if (this._i >= this._n && x === this._e) {
	        this._hv = true;
	        this._v = this._i;
	      }
	      this._i++;
	    };
	    LastIndexOfObserver.prototype.error = function (e) { this._o.onError(e); };
	    LastIndexOfObserver.prototype.completed = function () {
	      if (this._hv) {
	        this._o.onNext(this._v);
	      } else {
	        this._o.onNext(-1);
	      }
	      this._o.onCompleted();
	    };

	    return LastIndexOfObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the last index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   * @param {Any} searchElement Element to locate in the array.
	   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
	   * @returns {Observable} And observable sequence containing the last index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   */
	  observableProto.lastIndexOf = function(searchElement, fromIndex) {
	    var n = +fromIndex || 0;
	    Math.abs(n) === Infinity && (n = 0);
	    return new LastIndexOfObservable(this, searchElement, n);
	  };

	  Observable.wrap = function (fn) {
	    function createObservable() {
	      return Observable.spawn.call(this, fn.apply(this, arguments));
	    }

	    createObservable.__generatorFunction__ = fn;
	    return createObservable;
	  };

	  var spawn = Observable.spawn = function () {
	    var gen = arguments[0], self = this, args = [];
	    for (var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }

	    return new AnonymousObservable(function (o) {
	      var g = new CompositeDisposable();

	      if (isFunction(gen)) { gen = gen.apply(self, args); }
	      if (!gen || !isFunction(gen.next)) {
	        o.onNext(gen);
	        return o.onCompleted();
	      }

	      function processGenerator(res) {
	        var ret = tryCatch(gen.next).call(gen, res);
	        if (ret === errorObj) { return o.onError(ret.e); }
	        next(ret);
	      }

	      processGenerator();

	      function onError(err) {
	        var ret = tryCatch(gen.next).call(gen, err);
	        if (ret === errorObj) { return o.onError(ret.e); }
	        next(ret);
	      }

	      function next(ret) {
	        if (ret.done) {
	          o.onNext(ret.value);
	          o.onCompleted();
	          return;
	        }
	        var obs = toObservable.call(self, ret.value);
	        var value = null;
	        var hasValue = false;
	        if (Observable.isObservable(obs)) {
	          g.add(obs.subscribe(function(val) {
	            hasValue = true;
	            value = val;
	          }, onError, function() {
	            hasValue && processGenerator(value);
	          }));
	        } else {
	          onError(new TypeError('type not supported'));
	        }
	      }

	      return g;
	    });
	  };

	  function toObservable(obj) {
	    if (!obj) { return obj; }
	    if (Observable.isObservable(obj)) { return obj; }
	    if (isPromise(obj)) { return Observable.fromPromise(obj); }
	    if (isGeneratorFunction(obj) || isGenerator(obj)) { return spawn.call(this, obj); }
	    if (isFunction(obj)) { return thunkToObservable.call(this, obj); }
	    if (isArrayLike(obj) || isIterable(obj)) { return arrayToObservable.call(this, obj); }
	    if (isObject(obj)) {return objectToObservable.call(this, obj);}
	    return obj;
	  }

	  function arrayToObservable (obj) {
	    return Observable.from(obj).concatMap(function(o) {
	      if(Observable.isObservable(o) || isObject(o)) {
	        return toObservable.call(null, o);
	      } else {
	        return Rx.Observable.just(o);
	      }
	    }).toArray();
	  }

	  function objectToObservable (obj) {
	    var results = new obj.constructor(), keys = Object.keys(obj), observables = [];
	    for (var i = 0, len = keys.length; i < len; i++) {
	      var key = keys[i];
	      var observable = toObservable.call(this, obj[key]);

	      if(observable && Observable.isObservable(observable)) {
	        defer(observable, key);
	      } else {
	        results[key] = obj[key];
	      }
	    }

	    return Observable.forkJoin.apply(Observable, observables).map(function() {
	      return results;
	    });


	    function defer (observable, key) {
	      results[key] = undefined;
	      observables.push(observable.map(function (next) {
	        results[key] = next;
	      }));
	    }
	  }

	  function thunkToObservable(fn) {
	    var self = this;
	    return new AnonymousObservable(function (o) {
	      fn.call(self, function () {
	        var err = arguments[0], res = arguments[1];
	        if (err) { return o.onError(err); }
	        if (arguments.length > 2) {
	          var args = [];
	          for (var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	          res = args;
	        }
	        o.onNext(res);
	        o.onCompleted();
	      });
	    });
	  }

	  function isGenerator(obj) {
	    return isFunction (obj.next) && isFunction (obj['throw']);
	  }

	  function isGeneratorFunction(obj) {
	    var ctor = obj.constructor;
	    if (!ctor) { return false; }
	    if (ctor.name === 'GeneratorFunction' || ctor.displayName === 'GeneratorFunction') { return true; }
	    return isGenerator(ctor.prototype);
	  }

	  function isObject(val) {
	    return Object == val.constructor;
	  }

	  /**
	   * Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.
	   *
	   * @example
	   * var res = Rx.Observable.start(function () { console.log('hello'); });
	   * var res = Rx.Observable.start(function () { console.log('hello'); }, Rx.Scheduler.timeout);
	   * var res = Rx.Observable.start(function () { this.log('hello'); }, Rx.Scheduler.timeout, console);
	   *
	   * @param {Function} func Function to run asynchronously.
	   * @param {Scheduler} [scheduler]  Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
	   * @param [context]  The context for the func parameter to be executed.  If not specified, defaults to undefined.
	   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
	   *
	   * Remarks
	   * * The function is called immediately, not during the subscription of the resulting sequence.
	   * * Multiple subscriptions to the resulting sequence can observe the function's result.
	   */
	  Observable.start = function (func, context, scheduler) {
	    return observableToAsync(func, context, scheduler)();
	  };

	  /**
	   * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
	   * @param {Function} function Function to convert to an asynchronous function.
	   * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
	   * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	   * @returns {Function} Asynchronous function.
	   */
	  var observableToAsync = Observable.toAsync = function (func, context, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return function () {
	      var args = arguments,
	        subject = new AsyncSubject();

	      scheduler.schedule(null, function () {
	        var result;
	        try {
	          result = func.apply(context, args);
	        } catch (e) {
	          subject.onError(e);
	          return;
	        }
	        subject.onNext(result);
	        subject.onCompleted();
	      });
	      return subject.asObservable();
	    };
	  };

	function createCbObservable(fn, ctx, selector, args) {
	  var o = new AsyncSubject();

	  args.push(createCbHandler(o, ctx, selector));
	  fn.apply(ctx, args);

	  return o.asObservable();
	}

	function createCbHandler(o, ctx, selector) {
	  return function handler () {
	    var len = arguments.length, results = new Array(len);
	    for(var i = 0; i < len; i++) { results[i] = arguments[i]; }

	    if (isFunction(selector)) {
	      results = tryCatch(selector).apply(ctx, results);
	      if (results === errorObj) { return o.onError(results.e); }
	      o.onNext(results);
	    } else {
	      if (results.length <= 1) {
	        o.onNext(results[0]);
	      } else {
	        o.onNext(results);
	      }
	    }

	    o.onCompleted();
	  };
	}

	/**
	 * Converts a callback function to an observable sequence.
	 *
	 * @param {Function} fn Function with a callback as the last parameter to convert to an Observable sequence.
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
	 * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
	 */
	Observable.fromCallback = function (fn, ctx, selector) {
	  return function () {
	    typeof ctx === 'undefined' && (ctx = this); 

	    var len = arguments.length, args = new Array(len)
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return createCbObservable(fn, ctx, selector, args);
	  };
	};

	function createNodeObservable(fn, ctx, selector, args) {
	  var o = new AsyncSubject();

	  args.push(createNodeHandler(o, ctx, selector));
	  fn.apply(ctx, args);

	  return o.asObservable();
	}

	function createNodeHandler(o, ctx, selector) {
	  return function handler () {
	    var err = arguments[0];
	    if (err) { return o.onError(err); }

	    var len = arguments.length, results = [];
	    for(var i = 1; i < len; i++) { results[i - 1] = arguments[i]; }

	    if (isFunction(selector)) {
	      var results = tryCatch(selector).apply(ctx, results);
	      if (results === errorObj) { return o.onError(results.e); }
	      o.onNext(results);
	    } else {
	      if (results.length <= 1) {
	        o.onNext(results[0]);
	      } else {
	        o.onNext(results);
	      }
	    }

	    o.onCompleted();
	  };
	}

	/**
	 * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
	 * @param {Function} fn The function to call
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
	 * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
	 */
	Observable.fromNodeCallback = function (fn, ctx, selector) {
	  return function () {
	    typeof ctx === 'undefined' && (ctx = this); 
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return createNodeObservable(fn, ctx, selector, args);
	  };
	};

	  function isNodeList(el) {
	    if (root.StaticNodeList) {
	      // IE8 Specific
	      // instanceof is slower than Object#toString, but Object#toString will not work as intended in IE8
	      return el instanceof root.StaticNodeList || el instanceof root.NodeList;
	    } else {
	      return Object.prototype.toString.call(el) === '[object NodeList]';
	    }
	  }

	  function ListenDisposable(e, n, fn) {
	    this._e = e;
	    this._n = n;
	    this._fn = fn;
	    this._e.addEventListener(this._n, this._fn, false);
	    this.isDisposed = false;
	  }
	  ListenDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this._e.removeEventListener(this._n, this._fn, false);
	      this.isDisposed = true;
	    }
	  };

	  function createEventListener (el, eventName, handler) {
	    var disposables = new CompositeDisposable();

	    // Asume NodeList or HTMLCollection
	    var elemToString = Object.prototype.toString.call(el);
	    if (isNodeList(el) || elemToString === '[object HTMLCollection]') {
	      for (var i = 0, len = el.length; i < len; i++) {
	        disposables.add(createEventListener(el.item(i), eventName, handler));
	      }
	    } else if (el) {
	      disposables.add(new ListenDisposable(el, eventName, handler));
	    }

	    return disposables;
	  }

	  /**
	   * Configuration option to determine whether to use native events only
	   */
	  Rx.config.useNativeEvents = false;

	  var EventObservable = (function(__super__) {
	    inherits(EventObservable, __super__);
	    function EventObservable(el, name, fn) {
	      this._el = el;
	      this._n = name;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    function createHandler(o, fn) {
	      return function handler () {
	        var results = arguments[0];
	        if (isFunction(fn)) {
	          results = tryCatch(fn).apply(null, arguments);
	          if (results === errorObj) { return o.onError(results.e); }
	        }
	        o.onNext(results);
	      };
	    }

	    EventObservable.prototype.subscribeCore = function (o) {
	      return createEventListener(
	        this._el,
	        this._n,
	        createHandler(o, this._fn));
	    };

	    return EventObservable;
	  }(ObservableBase));

	  /**
	   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
	   * @param {Object} element The DOMElement or NodeList to attach a listener.
	   * @param {String} eventName The event name to attach the observable sequence.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @returns {Observable} An observable sequence of events from the specified element and the specified event.
	   */
	  Observable.fromEvent = function (element, eventName, selector) {
	    // Node.js specific
	    if (element.addListener) {
	      return fromEventPattern(
	        function (h) { element.addListener(eventName, h); },
	        function (h) { element.removeListener(eventName, h); },
	        selector);
	    }

	    // Use only if non-native events are allowed
	    if (!Rx.config.useNativeEvents) {
	      // Handles jq, Angular.js, Zepto, Marionette, Ember.js
	      if (typeof element.on === 'function' && typeof element.off === 'function') {
	        return fromEventPattern(
	          function (h) { element.on(eventName, h); },
	          function (h) { element.off(eventName, h); },
	          selector);
	      }
	    }

	    return new EventObservable(element, eventName, selector).publish().refCount();
	  };

	  var EventPatternObservable = (function(__super__) {
	    inherits(EventPatternObservable, __super__);
	    function EventPatternObservable(add, del, fn) {
	      this._add = add;
	      this._del = del;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    function createHandler(o, fn) {
	      return function handler () {
	        var results = arguments[0];
	        if (isFunction(fn)) {
	          results = tryCatch(fn).apply(null, arguments);
	          if (results === errorObj) { return o.onError(results.e); }
	        }
	        o.onNext(results);
	      };
	    }

	    EventPatternObservable.prototype.subscribeCore = function (o) {
	      var fn = createHandler(o, this._fn);
	      var returnValue = this._add(fn);
	      return new EventPatternDisposable(this._del, fn, returnValue);
	    };

	    function EventPatternDisposable(del, fn, ret) {
	      this._del = del;
	      this._fn = fn;
	      this._ret = ret;
	      this.isDisposed = false;
	    }

	    EventPatternDisposable.prototype.dispose = function () {
	      if(!this.isDisposed) {
	        isFunction(this._del) && this._del(this._fn, this._ret);
	      }
	    };

	    return EventPatternObservable;
	  }(ObservableBase));

	  /**
	   * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
	   * @param {Function} addHandler The function to add a handler to the emitter.
	   * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @returns {Observable} An observable sequence which wraps an event from an event emitter
	   */
	  var fromEventPattern = Observable.fromEventPattern = function (addHandler, removeHandler, selector) {
	    return new EventPatternObservable(addHandler, removeHandler, selector).publish().refCount();
	  };

	  /**
	   * Invokes the asynchronous function, surfacing the result through an observable sequence.
	   * @param {Function} functionAsync Asynchronous function which returns a Promise to run.
	   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
	   */
	  Observable.startAsync = function (functionAsync) {
	    var promise = tryCatch(functionAsync)();
	    if (promise === errorObj) { return observableThrow(promise.e); }
	    return observableFromPromise(promise);
	  };

	  var PausableObservable = (function (__super__) {
	    inherits(PausableObservable, __super__);
	    function PausableObservable(source, pauser) {
	      this.source = source;
	      this.controller = new Subject();

	      if (pauser && pauser.subscribe) {
	        this.pauser = this.controller.merge(pauser);
	      } else {
	        this.pauser = this.controller;
	      }

	      __super__.call(this);
	    }

	    PausableObservable.prototype._subscribe = function (o) {
	      var conn = this.source.publish(),
	        subscription = conn.subscribe(o),
	        connection = disposableEmpty;

	      var pausable = this.pauser.distinctUntilChanged().subscribe(function (b) {
	        if (b) {
	          connection = conn.connect();
	        } else {
	          connection.dispose();
	          connection = disposableEmpty;
	        }
	      });

	      return new NAryDisposable([subscription, connection, pausable]);
	    };

	    PausableObservable.prototype.pause = function () {
	      this.controller.onNext(false);
	    };

	    PausableObservable.prototype.resume = function () {
	      this.controller.onNext(true);
	    };

	    return PausableObservable;

	  }(Observable));

	  /**
	   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false.
	   * @example
	   * var pauser = new Rx.Subject();
	   * var source = Rx.Observable.interval(100).pausable(pauser);
	   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
	   * @returns {Observable} The observable sequence which is paused based upon the pauser.
	   */
	  observableProto.pausable = function (pauser) {
	    return new PausableObservable(this, pauser);
	  };

	  function combineLatestSource(source, subject, resultSelector) {
	    return new AnonymousObservable(function (o) {
	      var hasValue = [false, false],
	        hasValueAll = false,
	        isDone = false,
	        values = new Array(2),
	        err;

	      function next(x, i) {
	        values[i] = x;
	        hasValue[i] = true;
	        if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
	          if (err) { return o.onError(err); }
	          var res = tryCatch(resultSelector).apply(null, values);
	          if (res === errorObj) { return o.onError(res.e); }
	          o.onNext(res);
	        }
	        isDone && values[1] && o.onCompleted();
	      }

	      return new BinaryDisposable(
	        source.subscribe(
	          function (x) {
	            next(x, 0);
	          },
	          function (e) {
	            if (values[1]) {
	              o.onError(e);
	            } else {
	              err = e;
	            }
	          },
	          function () {
	            isDone = true;
	            values[1] && o.onCompleted();
	          }),
	        subject.subscribe(
	          function (x) {
	            next(x, 1);
	          },
	          function (e) { o.onError(e); },
	          function () {
	            isDone = true;
	            next(true, 1);
	          })
	        );
	    }, source);
	  }

	  var PausableBufferedObservable = (function (__super__) {
	    inherits(PausableBufferedObservable, __super__);
	    function PausableBufferedObservable(source, pauser) {
	      this.source = source;
	      this.controller = new Subject();

	      if (pauser && pauser.subscribe) {
	        this.pauser = this.controller.merge(pauser);
	      } else {
	        this.pauser = this.controller;
	      }

	      __super__.call(this);
	    }

	    PausableBufferedObservable.prototype._subscribe = function (o) {
	      var q = [], previousShouldFire;

	      function drainQueue() { while (q.length > 0) { o.onNext(q.shift()); } }

	      var subscription =
	        combineLatestSource(
	          this.source,
	          this.pauser.startWith(false).distinctUntilChanged(),
	          function (data, shouldFire) {
	            return { data: data, shouldFire: shouldFire };
	          })
	          .subscribe(
	            function (results) {
	              if (previousShouldFire !== undefined && results.shouldFire !== previousShouldFire) {
	                previousShouldFire = results.shouldFire;
	                // change in shouldFire
	                if (results.shouldFire) { drainQueue(); }
	              } else {
	                previousShouldFire = results.shouldFire;
	                // new data
	                if (results.shouldFire) {
	                  o.onNext(results.data);
	                } else {
	                  q.push(results.data);
	                }
	              }
	            },
	            function (err) {
	              drainQueue();
	              o.onError(err);
	            },
	            function () {
	              drainQueue();
	              o.onCompleted();
	            }
	          );
	      return subscription;      
	    };

	    PausableBufferedObservable.prototype.pause = function () {
	      this.controller.onNext(false);
	    };

	    PausableBufferedObservable.prototype.resume = function () {
	      this.controller.onNext(true);
	    };

	    return PausableBufferedObservable;

	  }(Observable));

	  /**
	   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false,
	   * and yields the values that were buffered while paused.
	   * @example
	   * var pauser = new Rx.Subject();
	   * var source = Rx.Observable.interval(100).pausableBuffered(pauser);
	   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
	   * @returns {Observable} The observable sequence which is paused based upon the pauser.
	   */
	  observableProto.pausableBuffered = function (pauser) {
	    return new PausableBufferedObservable(this, pauser);
	  };

	  var ControlledObservable = (function (__super__) {
	    inherits(ControlledObservable, __super__);
	    function ControlledObservable (source, enableQueue, scheduler) {
	      __super__.call(this);
	      this.subject = new ControlledSubject(enableQueue, scheduler);
	      this.source = source.multicast(this.subject).refCount();
	    }

	    ControlledObservable.prototype._subscribe = function (o) {
	      return this.source.subscribe(o);
	    };

	    ControlledObservable.prototype.request = function (numberOfItems) {
	      return this.subject.request(numberOfItems == null ? -1 : numberOfItems);
	    };

	    return ControlledObservable;

	  }(Observable));

	  var ControlledSubject = (function (__super__) {
	    inherits(ControlledSubject, __super__);
	    function ControlledSubject(enableQueue, scheduler) {
	      enableQueue == null && (enableQueue = true);

	      __super__.call(this);
	      this.subject = new Subject();
	      this.enableQueue = enableQueue;
	      this.queue = enableQueue ? [] : null;
	      this.requestedCount = 0;
	      this.requestedDisposable = null;
	      this.error = null;
	      this.hasFailed = false;
	      this.hasCompleted = false;
	      this.scheduler = scheduler || currentThreadScheduler;
	    }

	    addProperties(ControlledSubject.prototype, Observer, {
	      _subscribe: function (o) {
	        return this.subject.subscribe(o);
	      },
	      onCompleted: function () {
	        this.hasCompleted = true;
	        if (!this.enableQueue || this.queue.length === 0) {
	          this.subject.onCompleted();
	          this.disposeCurrentRequest();
	        } else {
	          this.queue.push(Notification.createOnCompleted());
	        }
	      },
	      onError: function (error) {
	        this.hasFailed = true;
	        this.error = error;
	        if (!this.enableQueue || this.queue.length === 0) {
	          this.subject.onError(error);
	          this.disposeCurrentRequest();
	        } else {
	          this.queue.push(Notification.createOnError(error));
	        }
	      },
	      onNext: function (value) {
	        if (this.requestedCount <= 0) {
	          this.enableQueue && this.queue.push(Notification.createOnNext(value));
	        } else {
	          (this.requestedCount-- === 0) && this.disposeCurrentRequest();
	          this.subject.onNext(value);
	        }
	      },
	      _processRequest: function (numberOfItems) {
	        if (this.enableQueue) {
	          while (this.queue.length > 0 && (numberOfItems > 0 || this.queue[0].kind !== 'N')) {
	            var first = this.queue.shift();
	            first.accept(this.subject);
	            if (first.kind === 'N') {
	              numberOfItems--;
	            } else {
	              this.disposeCurrentRequest();
	              this.queue = [];
	            }
	          }
	        }

	        return numberOfItems;
	      },
	      request: function (number) {
	        this.disposeCurrentRequest();
	        var self = this;

	        this.requestedDisposable = this.scheduler.schedule(number,
	        function(s, i) {
	          var remaining = self._processRequest(i);
	          var stopped = self.hasCompleted || self.hasFailed;
	          if (!stopped && remaining > 0) {
	            self.requestedCount = remaining;

	            return disposableCreate(function () {
	              self.requestedCount = 0;
	            });
	              // Scheduled item is still in progress. Return a new
	              // disposable to allow the request to be interrupted
	              // via dispose.
	          }
	        });

	        return this.requestedDisposable;
	      },
	      disposeCurrentRequest: function () {
	        if (this.requestedDisposable) {
	          this.requestedDisposable.dispose();
	          this.requestedDisposable = null;
	        }
	      }
	    });

	    return ControlledSubject;
	  }(Observable));

	  /**
	   * Attaches a controller to the observable sequence with the ability to queue.
	   * @example
	   * var source = Rx.Observable.interval(100).controlled();
	   * source.request(3); // Reads 3 values
	   * @param {bool} enableQueue truthy value to determine if values should be queued pending the next request
	   * @param {Scheduler} scheduler determines how the requests will be scheduled
	   * @returns {Observable} The observable sequence which only propagates values on request.
	   */
	  observableProto.controlled = function (enableQueue, scheduler) {

	    if (enableQueue && isScheduler(enableQueue)) {
	      scheduler = enableQueue;
	      enableQueue = true;
	    }

	    if (enableQueue == null) {  enableQueue = true; }
	    return new ControlledObservable(this, enableQueue, scheduler);
	  };

	  var StopAndWaitObservable = (function (__super__) {
	    inherits(StopAndWaitObservable, __super__);
	    function StopAndWaitObservable (source) {
	      __super__.call(this);
	      this.source = source;
	    }

	    function scheduleMethod(s, self) {
	      self.source.request(1);
	    }

	    StopAndWaitObservable.prototype._subscribe = function (o) {
	      this.subscription = this.source.subscribe(new StopAndWaitObserver(o, this, this.subscription));
	      return new BinaryDisposable(
	        this.subscription,
	        defaultScheduler.schedule(this, scheduleMethod)
	      );
	    };

	    var StopAndWaitObserver = (function (__sub__) {
	      inherits(StopAndWaitObserver, __sub__);
	      function StopAndWaitObserver (observer, observable, cancel) {
	        __sub__.call(this);
	        this.observer = observer;
	        this.observable = observable;
	        this.cancel = cancel;
	        this.scheduleDisposable = null;
	      }

	      StopAndWaitObserver.prototype.completed = function () {
	        this.observer.onCompleted();
	        this.dispose();
	      };

	      StopAndWaitObserver.prototype.error = function (error) {
	        this.observer.onError(error);
	        this.dispose();
	      };

	      function innerScheduleMethod(s, self) {
	        self.observable.source.request(1);
	      }

	      StopAndWaitObserver.prototype.next = function (value) {
	        this.observer.onNext(value);
	        this.scheduleDisposable = defaultScheduler.schedule(this, innerScheduleMethod);
	      };

	      StopAndWaitObservable.dispose = function () {
	        this.observer = null;
	        if (this.cancel) {
	          this.cancel.dispose();
	          this.cancel = null;
	        }
	        if (this.scheduleDisposable) {
	          this.scheduleDisposable.dispose();
	          this.scheduleDisposable = null;
	        }
	        __sub__.prototype.dispose.call(this);
	      };

	      return StopAndWaitObserver;
	    }(AbstractObserver));

	    return StopAndWaitObservable;
	  }(Observable));


	  /**
	   * Attaches a stop and wait observable to the current observable.
	   * @returns {Observable} A stop and wait observable.
	   */
	  ControlledObservable.prototype.stopAndWait = function () {
	    return new StopAndWaitObservable(this);
	  };

	  var WindowedObservable = (function (__super__) {
	    inherits(WindowedObservable, __super__);
	    function WindowedObservable(source, windowSize) {
	      __super__.call(this);
	      this.source = source;
	      this.windowSize = windowSize;
	    }

	    function scheduleMethod(s, self) {
	      self.source.request(self.windowSize);
	    }

	    WindowedObservable.prototype._subscribe = function (o) {
	      this.subscription = this.source.subscribe(new WindowedObserver(o, this, this.subscription));
	      return new BinaryDisposable(
	        this.subscription,
	        defaultScheduler.schedule(this, scheduleMethod)
	      );
	    };

	    var WindowedObserver = (function (__sub__) {
	      inherits(WindowedObserver, __sub__);
	      function WindowedObserver(observer, observable, cancel) {
	        this.observer = observer;
	        this.observable = observable;
	        this.cancel = cancel;
	        this.received = 0;
	        this.scheduleDisposable = null;
	        __sub__.call(this);
	      }

	      WindowedObserver.prototype.completed = function () {
	        this.observer.onCompleted();
	        this.dispose();
	      };

	      WindowedObserver.prototype.error = function (error) {
	        this.observer.onError(error);
	        this.dispose();
	      };

	      function innerScheduleMethod(s, self) {
	        self.observable.source.request(self.observable.windowSize);
	      }

	      WindowedObserver.prototype.next = function (value) {
	        this.observer.onNext(value);
	        this.received = ++this.received % this.observable.windowSize;
	        this.received === 0 && (this.scheduleDisposable = defaultScheduler.schedule(this, innerScheduleMethod));
	      };

	      WindowedObserver.prototype.dispose = function () {
	        this.observer = null;
	        if (this.cancel) {
	          this.cancel.dispose();
	          this.cancel = null;
	        }
	        if (this.scheduleDisposable) {
	          this.scheduleDisposable.dispose();
	          this.scheduleDisposable = null;
	        }
	        __sub__.prototype.dispose.call(this);
	      };

	      return WindowedObserver;
	    }(AbstractObserver));

	    return WindowedObservable;
	  }(Observable));

	  /**
	   * Creates a sliding windowed observable based upon the window size.
	   * @param {Number} windowSize The number of items in the window
	   * @returns {Observable} A windowed observable based upon the window size.
	   */
	  ControlledObservable.prototype.windowed = function (windowSize) {
	    return new WindowedObservable(this, windowSize);
	  };

	  /**
	   * Pipes the existing Observable sequence into a Node.js Stream.
	   * @param {Stream} dest The destination Node.js stream.
	   * @returns {Stream} The destination stream.
	   */
	  observableProto.pipe = function (dest) {
	    var source = this.pausableBuffered();

	    function onDrain() {
	      source.resume();
	    }

	    dest.addListener('drain', onDrain);

	    source.subscribe(
	      function (x) {
	        !dest.write(String(x)) && source.pause();
	      },
	      function (err) {
	        dest.emit('error', err);
	      },
	      function () {
	        // Hack check because STDIO is not closable
	        !dest._isStdio && dest.end();
	        dest.removeListener('drain', onDrain);
	      });

	    source.resume();

	    return dest;
	  };

	  var MulticastObservable = (function (__super__) {
	    inherits(MulticastObservable, __super__);
	    function MulticastObservable(source, fn1, fn2) {
	      this.source = source;
	      this._fn1 = fn1;
	      this._fn2 = fn2;
	      __super__.call(this);
	    }

	    MulticastObservable.prototype.subscribeCore = function (o) {
	      var connectable = this.source.multicast(this._fn1());
	      return new BinaryDisposable(this._fn2(connectable).subscribe(o), connectable.connect());
	    };

	    return MulticastObservable;
	  }(ObservableBase));

	  /**
	   * Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
	   * subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
	   * invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
	   *
	   * @example
	   * 1 - res = source.multicast(observable);
	   * 2 - res = source.multicast(function () { return new Subject(); }, function (x) { return x; });
	   *
	   * @param {Function|Subject} subjectOrSubjectSelector
	   * Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
	   * Or:
	   * Subject to push source elements into.
	   *
	   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.multicast = function (subjectOrSubjectSelector, selector) {
	    return isFunction(subjectOrSubjectSelector) ?
	      new MulticastObservable(this, subjectOrSubjectSelector, selector) :
	      new ConnectableObservable(this, subjectOrSubjectSelector);
	  };

	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
	   * This operator is a specialization of Multicast using a regular Subject.
	   *
	   * @example
	   * var resres = source.publish();
	   * var res = source.publish(function (x) { return x; });
	   *
	   * @param {Function} [selector] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publish = function (selector) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new Subject(); }, selector) :
	      this.multicast(new Subject());
	  };

	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence.
	   * This operator is a specialization of publish which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.share = function () {
	    return this.publish().refCount();
	  };

	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.
	   * This operator is a specialization of Multicast using a AsyncSubject.
	   *
	   * @example
	   * var res = source.publishLast();
	   * var res = source.publishLast(function (x) { return x; });
	   *
	   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publishLast = function (selector) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new AsyncSubject(); }, selector) :
	      this.multicast(new AsyncSubject());
	  };

	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
	   * This operator is a specialization of Multicast using a BehaviorSubject.
	   *
	   * @example
	   * var res = source.publishValue(42);
	   * var res = source.publishValue(function (x) { return x.select(function (y) { return y * y; }) }, 42);
	   *
	   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.
	   * @param {Mixed} initialValue Initial value received by observers upon subscription.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publishValue = function (initialValueOrSelector, initialValue) {
	    return arguments.length === 2 ?
	      this.multicast(function () {
	        return new BehaviorSubject(initialValue);
	      }, initialValueOrSelector) :
	      this.multicast(new BehaviorSubject(initialValueOrSelector));
	  };

	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence and starts with an initialValue.
	   * This operator is a specialization of publishValue which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   * @param {Mixed} initialValue Initial value received by observers upon subscription.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.shareValue = function (initialValue) {
	    return this.publishValue(initialValue).refCount();
	  };

	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
	   * This operator is a specialization of Multicast using a ReplaySubject.
	   *
	   * @example
	   * var res = source.replay(null, 3);
	   * var res = source.replay(null, 3, 500);
	   * var res = source.replay(null, 3, 500, scheduler);
	   * var res = source.replay(function (x) { return x.take(6).repeat(); }, 3, 500, scheduler);
	   *
	   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.
	   * @param bufferSize [Optional] Maximum element count of the replay buffer.
	   * @param windowSize [Optional] Maximum time length of the replay buffer.
	   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.replay = function (selector, bufferSize, windowSize, scheduler) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new ReplaySubject(bufferSize, windowSize, scheduler); }, selector) :
	      this.multicast(new ReplaySubject(bufferSize, windowSize, scheduler));
	  };

	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
	   * This operator is a specialization of replay which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   *
	   * @example
	   * var res = source.shareReplay(3);
	   * var res = source.shareReplay(3, 500);
	   * var res = source.shareReplay(3, 500, scheduler);
	   *

	   * @param bufferSize [Optional] Maximum element count of the replay buffer.
	   * @param window [Optional] Maximum time length of the replay buffer.
	   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.shareReplay = function (bufferSize, windowSize, scheduler) {
	    return this.replay(null, bufferSize, windowSize, scheduler).refCount();
	  };

	  var InnerSubscription = function (s, o) {
	    this._s = s;
	    this._o = o;
	  };

	  InnerSubscription.prototype.dispose = function () {
	    if (!this._s.isDisposed && this._o !== null) {
	      var idx = this._s.observers.indexOf(this._o);
	      this._s.observers.splice(idx, 1);
	      this._o = null;
	    }
	  };

	  var RefCountObservable = (function (__super__) {
	    inherits(RefCountObservable, __super__);
	    function RefCountObservable(source) {
	      this.source = source;
	      this._count = 0;
	      this._connectableSubscription = null;
	      __super__.call(this);
	    }

	    RefCountObservable.prototype.subscribeCore = function (o) {
	      var subscription = this.source.subscribe(o);
	      ++this._count === 1 && (this._connectableSubscription = this.source.connect());
	      return new RefCountDisposable(this, subscription);
	    };

	    function RefCountDisposable(p, s) {
	      this._p = p;
	      this._s = s;
	      this.isDisposed = false;
	    }

	    RefCountDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this._s.dispose();
	        --this._p._count === 0 && this._p._connectableSubscription.dispose();
	      }
	    };

	    return RefCountObservable;
	  }(ObservableBase));

	  var ConnectableObservable = Rx.ConnectableObservable = (function (__super__) {
	    inherits(ConnectableObservable, __super__);
	    function ConnectableObservable(source, subject) {
	      this.source = source;
	      this._connection = null;
	      this._source = source.asObservable();
	      this._subject = subject;
	      __super__.call(this);
	    }

	    function ConnectDisposable(parent, subscription) {
	      this._p = parent;
	      this._s = subscription;
	    }

	    ConnectDisposable.prototype.dispose = function () {
	      if (this._s) {
	        this._s.dispose();
	        this._s = null;
	        this._p._connection = null;
	      }
	    };

	    ConnectableObservable.prototype.connect = function () {
	      if (!this._connection) {
	        var subscription = this._source.subscribe(this._subject);
	        this._connection = new ConnectDisposable(this, subscription);
	      }
	      return this._connection;
	    };

	    ConnectableObservable.prototype._subscribe = function (o) {
	      return this._subject.subscribe(o);
	    };

	    ConnectableObservable.prototype.refCount = function () {
	      return new RefCountObservable(this);
	    };

	    return ConnectableObservable;
	  }(Observable));

	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence. This observable sequence
	   * can be resubscribed to, even if all prior subscriptions have ended. (unlike `.publish().refCount()`)
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source.
	   */
	  observableProto.singleInstance = function() {
	    var source = this, hasObservable = false, observable;

	    function getObservable() {
	      if (!hasObservable) {
	        hasObservable = true;
	        observable = source['finally'](function() { hasObservable = false; }).publish().refCount();
	      }
	      return observable;
	    }

	    return new AnonymousObservable(function(o) {
	      return getObservable().subscribe(o);
	    });
	  };

	  /**
	   *  Correlates the elements of two sequences based on overlapping durations.
	   *
	   *  @param {Observable} right The right observable sequence to join elements for.
	   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
	   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
	   *  @param {Function} resultSelector A function invoked to compute a result element for any two overlapping elements of the left and right observable sequences. The parameters passed to the function correspond with the elements from the left and right source sequences for which overlap occurs.
	   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
	   */
	  observableProto.join = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
	    var left = this;
	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable();
	      var leftDone = false, rightDone = false;
	      var leftId = 0, rightId = 0;
	      var leftMap = new Map(), rightMap = new Map();
	      var handleError = function (e) { o.onError(e); };

	      group.add(left.subscribe(
	        function (value) {
	          var id = leftId++, md = new SingleAssignmentDisposable();

	          leftMap.set(id, value);
	          group.add(md);

	          var duration = tryCatch(leftDurationSelector)(value);
	          if (duration === errorObj) { return o.onError(duration.e); }

	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            handleError,
	            function () {
	              leftMap['delete'](id) && leftMap.size === 0 && leftDone && o.onCompleted();
	              group.remove(md);
	            }));

	          rightMap.forEach(function (v) {
	            var result = tryCatch(resultSelector)(value, v);
	            if (result === errorObj) { return o.onError(result.e); }
	            o.onNext(result);
	          });
	        },
	        handleError,
	        function () {
	          leftDone = true;
	          (rightDone || leftMap.size === 0) && o.onCompleted();
	        })
	      );

	      group.add(right.subscribe(
	        function (value) {
	          var id = rightId++, md = new SingleAssignmentDisposable();

	          rightMap.set(id, value);
	          group.add(md);

	          var duration = tryCatch(rightDurationSelector)(value);
	          if (duration === errorObj) { return o.onError(duration.e); }

	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            handleError,
	            function () {
	              rightMap['delete'](id) && rightMap.size === 0 && rightDone && o.onCompleted();
	              group.remove(md);
	            }));

	          leftMap.forEach(function (v) {
	            var result = tryCatch(resultSelector)(v, value);
	            if (result === errorObj) { return o.onError(result.e); }
	            o.onNext(result);
	          });
	        },
	        handleError,
	        function () {
	          rightDone = true;
	          (leftDone || rightMap.size === 0) && o.onCompleted();
	        })
	      );
	      return group;
	    }, left);
	  };

	  /**
	   *  Correlates the elements of two sequences based on overlapping durations, and groups the results.
	   *
	   *  @param {Observable} right The right observable sequence to join elements for.
	   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
	   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
	   *  @param {Function} resultSelector A function invoked to compute a result element for any element of the left sequence with overlapping elements from the right observable sequence. The first parameter passed to the function is an element of the left sequence. The second parameter passed to the function is an observable sequence with elements from the right sequence that overlap with the left sequence's element.
	   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
	   */
	  observableProto.groupJoin = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
	    var left = this;
	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable();
	      var r = new RefCountDisposable(group);
	      var leftMap = new Map(), rightMap = new Map();
	      var leftId = 0, rightId = 0;
	      var handleError = function (e) { return function (v) { v.onError(e); }; };

	      function handleError(e) { };

	      group.add(left.subscribe(
	        function (value) {
	          var s = new Subject();
	          var id = leftId++;
	          leftMap.set(id, s);

	          var result = tryCatch(resultSelector)(value, addRef(s, r));
	          if (result === errorObj) {
	            leftMap.forEach(handleError(result.e));
	            return o.onError(result.e);
	          }
	          o.onNext(result);

	          rightMap.forEach(function (v) { s.onNext(v); });

	          var md = new SingleAssignmentDisposable();
	          group.add(md);

	          var duration = tryCatch(leftDurationSelector)(value);
	          if (duration === errorObj) {
	            leftMap.forEach(handleError(duration.e));
	            return o.onError(duration.e);
	          }

	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            function (e) {
	              leftMap.forEach(handleError(e));
	              o.onError(e);
	            },
	            function () {
	              leftMap['delete'](id) && s.onCompleted();
	              group.remove(md);
	            }));
	        },
	        function (e) {
	          leftMap.forEach(handleError(e));
	          o.onError(e);
	        },
	        function () { o.onCompleted(); })
	      );

	      group.add(right.subscribe(
	        function (value) {
	          var id = rightId++;
	          rightMap.set(id, value);

	          var md = new SingleAssignmentDisposable();
	          group.add(md);

	          var duration = tryCatch(rightDurationSelector)(value);
	          if (duration === errorObj) {
	            leftMap.forEach(handleError(duration.e));
	            return o.onError(duration.e);
	          }

	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            function (e) {
	              leftMap.forEach(handleError(e));
	              o.onError(e);
	            },
	            function () {
	              rightMap['delete'](id);
	              group.remove(md);
	            }));

	          leftMap.forEach(function (v) { v.onNext(value); });
	        },
	        function (e) {
	          leftMap.forEach(handleError(e));
	          o.onError(e);
	        })
	      );

	      return r;
	    }, left);
	  };

	  function toArray(x) { return x.toArray(); }

	  /**
	   *  Projects each element of an observable sequence into zero or more buffers.
	   *  @param {Mixed} bufferOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	   *  @param {Function} [bufferClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	   *  @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.buffer = function () {
	    return this.window.apply(this, arguments)
	      .flatMap(toArray);
	  };

	  /**
	   *  Projects each element of an observable sequence into zero or more windows.
	   *
	   *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	   *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	   *  @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.window = function (windowOpeningsOrClosingSelector, windowClosingSelector) {
	    if (arguments.length === 1 && typeof arguments[0] !== 'function') {
	      return observableWindowWithBoundaries.call(this, windowOpeningsOrClosingSelector);
	    }
	    return typeof windowOpeningsOrClosingSelector === 'function' ?
	      observableWindowWithClosingSelector.call(this, windowOpeningsOrClosingSelector) :
	      observableWindowWithOpenings.call(this, windowOpeningsOrClosingSelector, windowClosingSelector);
	  };

	  function observableWindowWithOpenings(windowOpenings, windowClosingSelector) {
	    return windowOpenings.groupJoin(this, windowClosingSelector, observableEmpty, function (_, win) {
	      return win;
	    });
	  }

	  function observableWindowWithBoundaries(windowBoundaries) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var win = new Subject(),
	        d = new CompositeDisposable(),
	        r = new RefCountDisposable(d);

	      observer.onNext(addRef(win, r));

	      d.add(source.subscribe(function (x) {
	        win.onNext(x);
	      }, function (err) {
	        win.onError(err);
	        observer.onError(err);
	      }, function () {
	        win.onCompleted();
	        observer.onCompleted();
	      }));

	      isPromise(windowBoundaries) && (windowBoundaries = observableFromPromise(windowBoundaries));

	      d.add(windowBoundaries.subscribe(function (w) {
	        win.onCompleted();
	        win = new Subject();
	        observer.onNext(addRef(win, r));
	      }, function (err) {
	        win.onError(err);
	        observer.onError(err);
	      }, function () {
	        win.onCompleted();
	        observer.onCompleted();
	      }));

	      return r;
	    }, source);
	  }

	  function observableWindowWithClosingSelector(windowClosingSelector) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var m = new SerialDisposable(),
	        d = new CompositeDisposable(m),
	        r = new RefCountDisposable(d),
	        win = new Subject();
	      observer.onNext(addRef(win, r));
	      d.add(source.subscribe(function (x) {
	          win.onNext(x);
	      }, function (err) {
	          win.onError(err);
	          observer.onError(err);
	      }, function () {
	          win.onCompleted();
	          observer.onCompleted();
	      }));

	      function createWindowClose () {
	        var windowClose;
	        try {
	          windowClose = windowClosingSelector();
	        } catch (e) {
	          observer.onError(e);
	          return;
	        }

	        isPromise(windowClose) && (windowClose = observableFromPromise(windowClose));

	        var m1 = new SingleAssignmentDisposable();
	        m.setDisposable(m1);
	        m1.setDisposable(windowClose.take(1).subscribe(noop, function (err) {
	          win.onError(err);
	          observer.onError(err);
	        }, function () {
	          win.onCompleted();
	          win = new Subject();
	          observer.onNext(addRef(win, r));
	          createWindowClose();
	        }));
	      }

	      createWindowClose();
	      return r;
	    }, source);
	  }

	  var PairwiseObservable = (function (__super__) {
	    inherits(PairwiseObservable, __super__);
	    function PairwiseObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    PairwiseObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new PairwiseObserver(o));
	    };

	    return PairwiseObservable;
	  }(ObservableBase));

	  var PairwiseObserver = (function(__super__) {
	    inherits(PairwiseObserver, __super__);
	    function PairwiseObserver(o) {
	      this._o = o;
	      this._p = null;
	      this._hp = false;
	    }

	    PairwiseObserver.prototype.next = function (x) {
	      if (this._hp) {
	        this._o.onNext([this._p, x]);
	      } else {
	        this._hp = true;
	      }
	      this._p = x;
	    };
	    PairwiseObserver.prototype.error = function (err) { this._o.onError(err); };
	    PairwiseObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return PairwiseObserver;
	  }(AbstractObserver));

	  /**
	   * Returns a new observable that triggers on the second and subsequent triggerings of the input observable.
	   * The Nth triggering of the input observable passes the arguments from the N-1th and Nth triggering as a pair.
	   * The argument passed to the N-1th triggering is held in hidden internal state until the Nth triggering occurs.
	   * @returns {Observable} An observable that triggers on successive pairs of observations from the input observable as an array.
	   */
	  observableProto.pairwise = function () {
	    return new PairwiseObservable(this);
	  };

	  /**
	   * Returns two observables which partition the observations of the source by the given function.
	   * The first will trigger observations for those values for which the predicate returns true.
	   * The second will trigger observations for those values where the predicate returns false.
	   * The predicate is executed once for each subscribed observer.
	   * Both also propagate all error observations arising from the source and each completes
	   * when the source completes.
	   * @param {Function} predicate
	   *    The function to determine which output Observable will trigger a particular observation.
	   * @returns {Array}
	   *    An array of observables. The first triggers when the predicate returns true,
	   *    and the second triggers when the predicate returns false.
	  */
	  observableProto.partition = function(predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return [
	      this.filter(predicate, thisArg),
	      this.filter(function (x, i, o) { return !fn(x, i, o); })
	    ];
	  };

	  var WhileEnumerable = (function(__super__) {
	    inherits(WhileEnumerable, __super__);
	    function WhileEnumerable(c, s) {
	      this.c = c;
	      this.s = s;
	    }
	    WhileEnumerable.prototype[$iterator$] = function () {
	      var self = this;
	      return {
	        next: function () {
	          return self.c() ?
	           { done: false, value: self.s } :
	           { done: true, value: void 0 };
	        }
	      };
	    };
	    return WhileEnumerable;
	  }(Enumerable));
	  
	  function enumerableWhile(condition, source) {
	    return new WhileEnumerable(condition, source);
	  }  

	   /**
	   *  Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.
	   *  This operator allows for a fluent style of writing queries that use the same sequence multiple times.
	   *
	   * @param {Function} selector Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.letBind = observableProto['let'] = function (func) {
	    return func(this);
	  };

	   /**
	   *  Determines whether an observable collection contains values. 
	   *
	   * @example
	   *  1 - res = Rx.Observable.if(condition, obs1);
	   *  2 - res = Rx.Observable.if(condition, obs1, obs2);
	   *  3 - res = Rx.Observable.if(condition, obs1, scheduler);
	   * @param {Function} condition The condition which determines if the thenSource or elseSource will be run.
	   * @param {Observable} thenSource The observable sequence or Promise that will be run if the condition function returns true.
	   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the condition function returns false. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.
	   * @returns {Observable} An observable sequence which is either the thenSource or elseSource.
	   */
	  Observable['if'] = function (condition, thenSource, elseSourceOrScheduler) {
	    return observableDefer(function () {
	      elseSourceOrScheduler || (elseSourceOrScheduler = observableEmpty());

	      isPromise(thenSource) && (thenSource = observableFromPromise(thenSource));
	      isPromise(elseSourceOrScheduler) && (elseSourceOrScheduler = observableFromPromise(elseSourceOrScheduler));

	      // Assume a scheduler for empty only
	      typeof elseSourceOrScheduler.now === 'function' && (elseSourceOrScheduler = observableEmpty(elseSourceOrScheduler));
	      return condition() ? thenSource : elseSourceOrScheduler;
	    });
	  };

	   /**
	   *  Concatenates the observable sequences obtained by running the specified result selector for each element in source.
	   * There is an alias for this method called 'forIn' for browsers <IE9
	   * @param {Array} sources An array of values to turn into an observable sequence.
	   * @param {Function} resultSelector A function to apply to each item in the sources array to turn it into an observable sequence.
	   * @returns {Observable} An observable sequence from the concatenated observable sequences.
	   */
	  Observable['for'] = Observable.forIn = function (sources, resultSelector, thisArg) {
	    return enumerableOf(sources, resultSelector, thisArg).concat();
	  };

	   /**
	   *  Repeats source as long as condition holds emulating a while loop.
	   * There is an alias for this method called 'whileDo' for browsers <IE9
	   *
	   * @param {Function} condition The condition which determines if the source will be repeated.
	   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
	   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
	   */
	  var observableWhileDo = Observable['while'] = Observable.whileDo = function (condition, source) {
	    isPromise(source) && (source = observableFromPromise(source));
	    return enumerableWhile(condition, source).concat();
	  };

	   /**
	   *  Repeats source as long as condition holds emulating a do while loop.
	   *
	   * @param {Function} condition The condition which determines if the source will be repeated.
	   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
	   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
	   */
	  observableProto.doWhile = function (condition) {
	    return observableConcat([this, observableWhileDo(condition, this)]);
	  };

	   /**
	   *  Uses selector to determine which source in sources to use.
	   * @param {Function} selector The function which extracts the value for to test in a case statement.
	   * @param {Array} sources A object which has keys which correspond to the case statement labels.
	   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.empty with the specified scheduler.
	   *
	   * @returns {Observable} An observable sequence which is determined by a case statement.
	   */
	  Observable['case'] = function (selector, sources, defaultSourceOrScheduler) {
	    return observableDefer(function () {
	      isPromise(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableFromPromise(defaultSourceOrScheduler));
	      defaultSourceOrScheduler || (defaultSourceOrScheduler = observableEmpty());

	      isScheduler(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableEmpty(defaultSourceOrScheduler));

	      var result = sources[selector()];
	      isPromise(result) && (result = observableFromPromise(result));

	      return result || defaultSourceOrScheduler;
	    });
	  };

	  var ExpandObservable = (function(__super__) {
	    inherits(ExpandObservable, __super__);
	    function ExpandObservable(source, fn, scheduler) {
	      this.source = source;
	      this._fn = fn;
	      this._scheduler = scheduler;
	      __super__.call(this);
	    }

	    function scheduleRecursive(args, recurse) {
	      var state = args[0], self = args[1];
	      var work;
	      if (state.q.length > 0) {
	        work = state.q.shift();
	      } else {
	        state.isAcquired = false;
	        return;
	      }
	      var m1 = new SingleAssignmentDisposable();
	      state.d.add(m1);
	      m1.setDisposable(work.subscribe(new ExpandObserver(state, self, m1)));
	      recurse([state, self]);
	    }

	    ExpandObservable.prototype._ensureActive = function (state) {
	      var isOwner = false;
	      if (state.q.length > 0) {
	        isOwner = !state.isAcquired;
	        state.isAcquired = true;
	      }
	      isOwner && state.m.setDisposable(this._scheduler.scheduleRecursive([state, this], scheduleRecursive));
	    };

	    ExpandObservable.prototype.subscribeCore = function (o) {
	      var m = new SerialDisposable(),
	        d = new CompositeDisposable(m),
	        state = {
	          q: [],
	          m: m,
	          d: d,
	          activeCount: 0,
	          isAcquired: false,
	          o: o
	        };

	      state.q.push(this.source);
	      state.activeCount++;
	      this._ensureActive(state);
	      return d;
	    };

	    return ExpandObservable;
	  }(ObservableBase));

	  var ExpandObserver = (function(__super__) {
	    inherits(ExpandObserver, __super__);
	    function ExpandObserver(state, parent, m1) {
	      this._s = state;
	      this._p = parent;
	      this._m1 = m1;
	      __super__.call(this);
	    }

	    ExpandObserver.prototype.next = function (x) {
	      this._s.o.onNext(x);
	      var result = tryCatch(this._p._fn)(x);
	      if (result === errorObj) { return this._s.o.onError(result.e); }
	      this._s.q.push(result);
	      this._s.activeCount++;
	      this._p._ensureActive(this._s);
	    };

	    ExpandObserver.prototype.error = function (e) {
	      this._s.o.onError(e);
	    };

	    ExpandObserver.prototype.completed = function () {
	      this._s.d.remove(this._m1);
	      this._s.activeCount--;
	      this._s.activeCount === 0 && this._s.o.onCompleted();
	    };

	    return ExpandObserver;
	  }(AbstractObserver));

	   /**
	   *  Expands an observable sequence by recursively invoking selector.
	   *
	   * @param {Function} selector Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
	   * @param {Scheduler} [scheduler] Scheduler on which to perform the expansion. If not provided, this defaults to the current thread scheduler.
	   * @returns {Observable} An observable sequence containing all the elements produced by the recursive expansion.
	   */
	  observableProto.expand = function (selector, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new ExpandObservable(this, selector, scheduler);
	  };

	  function argumentsToArray() {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return args;
	  }

	  var ForkJoinObservable = (function (__super__) {
	    inherits(ForkJoinObservable, __super__);
	    function ForkJoinObservable(sources, cb) {
	      this._sources = sources;
	      this._cb = cb;
	      __super__.call(this);
	    }

	    ForkJoinObservable.prototype.subscribeCore = function (o) {
	      if (this._sources.length === 0) {
	        o.onCompleted();
	        return disposableEmpty;
	      }

	      var count = this._sources.length;
	      var state = {
	        finished: false,
	        hasResults: new Array(count),
	        hasCompleted: new Array(count),
	        results: new Array(count)
	      };

	      var subscriptions = new CompositeDisposable();
	      for (var i = 0, len = this._sources.length; i < len; i++) {
	        var source = this._sources[i];
	        isPromise(source) && (source = observableFromPromise(source));
	        subscriptions.add(source.subscribe(new ForkJoinObserver(o, state, i, this._cb, subscriptions)));
	      }

	      return subscriptions;
	    };

	    return ForkJoinObservable;
	  }(ObservableBase));

	  var ForkJoinObserver = (function(__super__) {
	    inherits(ForkJoinObserver, __super__);
	    function ForkJoinObserver(o, s, i, cb, subs) {
	      this._o = o;
	      this._s = s;
	      this._i = i;
	      this._cb = cb;
	      this._subs = subs;
	      __super__.call(this);
	    }

	    ForkJoinObserver.prototype.next = function (x) {
	      if (!this._s.finished) {
	        this._s.hasResults[this._i] = true;
	        this._s.results[this._i] = x;
	      }
	    };

	    ForkJoinObserver.prototype.error = function (e) {
	      this._s.finished = true;
	      this._o.onError(e);
	      this._subs.dispose();
	    };

	    ForkJoinObserver.prototype.completed = function () {
	      if (!this._s.finished) {
	        if (!this._s.hasResults[this._i]) {
	          return this._o.onCompleted();
	        }
	        this._s.hasCompleted[this._i] = true;
	        for (var i = 0; i < this._s.results.length; i++) {
	          if (!this._s.hasCompleted[i]) { return; }
	        }
	        this._s.finished = true;

	        var res = tryCatch(this._cb).apply(null, this._s.results);
	        if (res === errorObj) { return this._o.onError(res.e); }

	        this._o.onNext(res);
	        this._o.onCompleted();
	      }
	    };

	    return ForkJoinObserver;
	  }(AbstractObserver));

	   /**
	   *  Runs all observable sequences in parallel and collect their last elements.
	   *
	   * @example
	   *  1 - res = Rx.Observable.forkJoin([obs1, obs2]);
	   *  1 - res = Rx.Observable.forkJoin(obs1, obs2, ...);
	   * @returns {Observable} An observable sequence with an array collecting the last elements of all the input sequences.
	   */
	  Observable.forkJoin = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);
	    return new ForkJoinObservable(args, resultSelector);
	  };

	   /**
	   *  Runs two observable sequences in parallel and combines their last elemenets.
	   * @param {Observable} second Second observable sequence.
	   * @param {Function} resultSelector Result selector function to invoke with the last elements of both sequences.
	   * @returns {Observable} An observable sequence with the result of calling the selector function with the last elements of both input sequences.
	   */
	  observableProto.forkJoin = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    if (Array.isArray(args[0])) {
	      args[0].unshift(this);
	    } else {
	      args.unshift(this);
	    }
	    return Observable.forkJoin.apply(null, args);
	  };

	  /**
	   * Comonadic bind operator.
	   * @param {Function} selector A transform function to apply to each element.
	   * @param {Object} scheduler Scheduler used to execute the operation. If not specified, defaults to the ImmediateScheduler.
	   * @returns {Observable} An observable sequence which results from the comonadic bind operation.
	   */
	  observableProto.manySelect = observableProto.extend = function (selector, scheduler) {
	    isScheduler(scheduler) || (scheduler = Rx.Scheduler.immediate);
	    var source = this;
	    return observableDefer(function () {
	      var chain;

	      return source
	        .map(function (x) {
	          var curr = new ChainObservable(x);

	          chain && chain.onNext(x);
	          chain = curr;

	          return curr;
	        })
	        .tap(
	          noop,
	          function (e) { chain && chain.onError(e); },
	          function () { chain && chain.onCompleted(); }
	        )
	        .observeOn(scheduler)
	        .map(selector);
	    }, source);
	  };

	  var ChainObservable = (function (__super__) {
	    inherits(ChainObservable, __super__);
	    function ChainObservable(head) {
	      __super__.call(this);
	      this.head = head;
	      this.tail = new AsyncSubject();
	    }

	    addProperties(ChainObservable.prototype, Observer, {
	      _subscribe: function (o) {
	        var g = new CompositeDisposable();
	        g.add(currentThreadScheduler.schedule(this, function (_, self) {
	          o.onNext(self.head);
	          g.add(self.tail.mergeAll().subscribe(o));
	        }));

	        return g;
	      },
	      onCompleted: function () {
	        this.onNext(Observable.empty());
	      },
	      onError: function (e) {
	        this.onNext(Observable['throw'](e));
	      },
	      onNext: function (v) {
	        this.tail.onNext(v);
	        this.tail.onCompleted();
	      }
	    });

	    return ChainObservable;

	  }(Observable));

	  var Map = root.Map || (function () {
	    function Map() {
	      this.size = 0;
	      this._values = [];
	      this._keys = [];
	    }

	    Map.prototype['delete'] = function (key) {
	      var i = this._keys.indexOf(key);
	      if (i === -1) { return false; }
	      this._values.splice(i, 1);
	      this._keys.splice(i, 1);
	      this.size--;
	      return true;
	    };

	    Map.prototype.get = function (key) {
	      var i = this._keys.indexOf(key);
	      return i === -1 ? undefined : this._values[i];
	    };

	    Map.prototype.set = function (key, value) {
	      var i = this._keys.indexOf(key);
	      if (i === -1) {
	        this._keys.push(key);
	        this._values.push(value);
	        this.size++;
	      } else {
	        this._values[i] = value;
	      }
	      return this;
	    };

	    Map.prototype.forEach = function (cb, thisArg) {
	      for (var i = 0; i < this.size; i++) {
	        cb.call(thisArg, this._values[i], this._keys[i]);
	      }
	    };

	    return Map;
	  }());

	  /**
	   * @constructor
	   * Represents a join pattern over observable sequences.
	   */
	  function Pattern(patterns) {
	    this.patterns = patterns;
	  }

	  /**
	   *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
	   *  @param other Observable sequence to match in addition to the current pattern.
	   *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
	   */
	  Pattern.prototype.and = function (other) {
	    return new Pattern(this.patterns.concat(other));
	  };

	  /**
	   *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
	   *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
	   *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	   */
	  Pattern.prototype.thenDo = function (selector) {
	    return new Plan(this, selector);
	  };

	  function Plan(expression, selector) {
	    this.expression = expression;
	    this.selector = selector;
	  }

	  function handleOnError(o) { return function (e) { o.onError(e); }; }
	  function handleOnNext(self, observer) {
	    return function onNext () {
	      var result = tryCatch(self.selector).apply(self, arguments);
	      if (result === errorObj) { return observer.onError(result.e); }
	      observer.onNext(result);
	    };
	  }

	  Plan.prototype.activate = function (externalSubscriptions, observer, deactivate) {
	    var joinObservers = [], errHandler = handleOnError(observer);
	    for (var i = 0, len = this.expression.patterns.length; i < len; i++) {
	      joinObservers.push(planCreateObserver(externalSubscriptions, this.expression.patterns[i], errHandler));
	    }
	    var activePlan = new ActivePlan(joinObservers, handleOnNext(this, observer), function () {
	      for (var j = 0, jlen = joinObservers.length; j < jlen; j++) {
	        joinObservers[j].removeActivePlan(activePlan);
	      }
	      deactivate(activePlan);
	    });
	    for (i = 0, len = joinObservers.length; i < len; i++) {
	      joinObservers[i].addActivePlan(activePlan);
	    }
	    return activePlan;
	  };

	  function planCreateObserver(externalSubscriptions, observable, onError) {
	    var entry = externalSubscriptions.get(observable);
	    if (!entry) {
	      var observer = new JoinObserver(observable, onError);
	      externalSubscriptions.set(observable, observer);
	      return observer;
	    }
	    return entry;
	  }

	  function ActivePlan(joinObserverArray, onNext, onCompleted) {
	    this.joinObserverArray = joinObserverArray;
	    this.onNext = onNext;
	    this.onCompleted = onCompleted;
	    this.joinObservers = new Map();
	    for (var i = 0, len = this.joinObserverArray.length; i < len; i++) {
	      var joinObserver = this.joinObserverArray[i];
	      this.joinObservers.set(joinObserver, joinObserver);
	    }
	  }

	  ActivePlan.prototype.dequeue = function () {
	    this.joinObservers.forEach(function (v) { v.queue.shift(); });
	  };

	  ActivePlan.prototype.match = function () {
	    var i, len, hasValues = true;
	    for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
	      if (this.joinObserverArray[i].queue.length === 0) {
	        hasValues = false;
	        break;
	      }
	    }
	    if (hasValues) {
	      var firstValues = [],
	          isCompleted = false;
	      for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
	        firstValues.push(this.joinObserverArray[i].queue[0]);
	        this.joinObserverArray[i].queue[0].kind === 'C' && (isCompleted = true);
	      }
	      if (isCompleted) {
	        this.onCompleted();
	      } else {
	        this.dequeue();
	        var values = [];
	        for (i = 0, len = firstValues.length; i < firstValues.length; i++) {
	          values.push(firstValues[i].value);
	        }
	        this.onNext.apply(this, values);
	      }
	    }
	  };

	  var JoinObserver = (function (__super__) {
	    inherits(JoinObserver, __super__);

	    function JoinObserver(source, onError) {
	      __super__.call(this);
	      this.source = source;
	      this.onError = onError;
	      this.queue = [];
	      this.activePlans = [];
	      this.subscription = new SingleAssignmentDisposable();
	      this.isDisposed = false;
	    }

	    var JoinObserverPrototype = JoinObserver.prototype;

	    JoinObserverPrototype.next = function (notification) {
	      if (!this.isDisposed) {
	        if (notification.kind === 'E') {
	          return this.onError(notification.error);
	        }
	        this.queue.push(notification);
	        var activePlans = this.activePlans.slice(0);
	        for (var i = 0, len = activePlans.length; i < len; i++) {
	          activePlans[i].match();
	        }
	      }
	    };

	    JoinObserverPrototype.error = noop;
	    JoinObserverPrototype.completed = noop;

	    JoinObserverPrototype.addActivePlan = function (activePlan) {
	      this.activePlans.push(activePlan);
	    };

	    JoinObserverPrototype.subscribe = function () {
	      this.subscription.setDisposable(this.source.materialize().subscribe(this));
	    };

	    JoinObserverPrototype.removeActivePlan = function (activePlan) {
	      this.activePlans.splice(this.activePlans.indexOf(activePlan), 1);
	      this.activePlans.length === 0 && this.dispose();
	    };

	    JoinObserverPrototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this.subscription.dispose();
	      }
	    };

	    return JoinObserver;
	  } (AbstractObserver));

	  /**
	   *  Creates a pattern that matches when both observable sequences have an available value.
	   *
	   *  @param right Observable sequence to match with the current sequence.
	   *  @return {Pattern} Pattern object that matches when both observable sequences have an available value.
	   */
	  observableProto.and = function (right) {
	    return new Pattern([this, right]);
	  };

	  /**
	   *  Matches when the observable sequence has an available value and projects the value.
	   *
	   *  @param {Function} selector Selector that will be invoked for values in the source sequence.
	   *  @returns {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	   */
	  observableProto.thenDo = function (selector) {
	    return new Pattern([this]).thenDo(selector);
	  };

	  /**
	   *  Joins together the results from several patterns.
	   *
	   *  @param plans A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.
	   *  @returns {Observable} Observable sequence with the results form matching several patterns.
	   */
	  Observable.when = function () {
	    var len = arguments.length, plans;
	    if (Array.isArray(arguments[0])) {
	      plans = arguments[0];
	    } else {
	      plans = new Array(len);
	      for(var i = 0; i < len; i++) { plans[i] = arguments[i]; }
	    }
	    return new AnonymousObservable(function (o) {
	      var activePlans = [],
	          externalSubscriptions = new Map();
	      var outObserver = observerCreate(
	        function (x) { o.onNext(x); },
	        function (err) {
	          externalSubscriptions.forEach(function (v) { v.onError(err); });
	          o.onError(err);
	        },
	        function (x) { o.onCompleted(); }
	      );
	      try {
	        for (var i = 0, len = plans.length; i < len; i++) {
	          activePlans.push(plans[i].activate(externalSubscriptions, outObserver, function (activePlan) {
	            var idx = activePlans.indexOf(activePlan);
	            activePlans.splice(idx, 1);
	            activePlans.length === 0 && o.onCompleted();
	          }));
	        }
	      } catch (e) {
	        observableThrow(e).subscribe(o);
	      }
	      var group = new CompositeDisposable();
	      externalSubscriptions.forEach(function (joinObserver) {
	        joinObserver.subscribe();
	        group.add(joinObserver);
	      });

	      return group;
	    });
	  };

	  var TimerObservable = (function(__super__) {
	    inherits(TimerObservable, __super__);
	    function TimerObservable(dt, s) {
	      this._dt = dt;
	      this._s = s;
	      __super__.call(this);
	    }

	    TimerObservable.prototype.subscribeCore = function (o) {
	      return this._s.scheduleFuture(o, this._dt, scheduleMethod);
	    };

	    function scheduleMethod(s, o) {
	      o.onNext(0);
	      o.onCompleted();
	    }

	    return TimerObservable;
	  }(ObservableBase));

	  function _observableTimer(dueTime, scheduler) {
	    return new TimerObservable(dueTime, scheduler);
	  }

	  function observableTimerDateAndPeriod(dueTime, period, scheduler) {
	    return new AnonymousObservable(function (observer) {
	      var d = dueTime, p = normalizeTime(period);
	      return scheduler.scheduleRecursiveFuture(0, d, function (count, self) {
	        if (p > 0) {
	          var now = scheduler.now();
	          d = new Date(d.getTime() + p);
	          d.getTime() <= now && (d = new Date(now + p));
	        }
	        observer.onNext(count);
	        self(count + 1, new Date(d));
	      });
	    });
	  }

	  function observableTimerTimeSpanAndPeriod(dueTime, period, scheduler) {
	    return dueTime === period ?
	      new AnonymousObservable(function (observer) {
	        return scheduler.schedulePeriodic(0, period, function (count) {
	          observer.onNext(count);
	          return count + 1;
	        });
	      }) :
	      observableDefer(function () {
	        return observableTimerDateAndPeriod(new Date(scheduler.now() + dueTime), period, scheduler);
	      });
	  }

	  /**
	   *  Returns an observable sequence that produces a value after each period.
	   *
	   * @example
	   *  1 - res = Rx.Observable.interval(1000);
	   *  2 - res = Rx.Observable.interval(1000, Rx.Scheduler.timeout);
	   *
	   * @param {Number} period Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.
	   * @returns {Observable} An observable sequence that produces a value after each period.
	   */
	  var observableinterval = Observable.interval = function (period, scheduler) {
	    return observableTimerTimeSpanAndPeriod(period, period, isScheduler(scheduler) ? scheduler : defaultScheduler);
	  };

	  /**
	   *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
	   * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
	   */
	  var observableTimer = Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
	    var period;
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    if (periodOrScheduler != null && typeof periodOrScheduler === 'number') {
	      period = periodOrScheduler;
	    } else if (isScheduler(periodOrScheduler)) {
	      scheduler = periodOrScheduler;
	    }
	    if ((dueTime instanceof Date || typeof dueTime === 'number') && period === undefined) {
	      return _observableTimer(dueTime, scheduler);
	    }
	    if (dueTime instanceof Date && period !== undefined) {
	      return observableTimerDateAndPeriod(dueTime.getTime(), periodOrScheduler, scheduler);
	    }
	    return observableTimerTimeSpanAndPeriod(dueTime, period, scheduler);
	  };

	  function observableDelayRelative(source, dueTime, scheduler) {
	    return new AnonymousObservable(function (o) {
	      var active = false,
	        cancelable = new SerialDisposable(),
	        exception = null,
	        q = [],
	        running = false,
	        subscription;
	      subscription = source.materialize().timestamp(scheduler).subscribe(function (notification) {
	        var d, shouldRun;
	        if (notification.value.kind === 'E') {
	          q = [];
	          q.push(notification);
	          exception = notification.value.error;
	          shouldRun = !running;
	        } else {
	          q.push({ value: notification.value, timestamp: notification.timestamp + dueTime });
	          shouldRun = !active;
	          active = true;
	        }
	        if (shouldRun) {
	          if (exception !== null) {
	            o.onError(exception);
	          } else {
	            d = new SingleAssignmentDisposable();
	            cancelable.setDisposable(d);
	            d.setDisposable(scheduler.scheduleRecursiveFuture(null, dueTime, function (_, self) {
	              var e, recurseDueTime, result, shouldRecurse;
	              if (exception !== null) {
	                return;
	              }
	              running = true;
	              do {
	                result = null;
	                if (q.length > 0 && q[0].timestamp - scheduler.now() <= 0) {
	                  result = q.shift().value;
	                }
	                if (result !== null) {
	                  result.accept(o);
	                }
	              } while (result !== null);
	              shouldRecurse = false;
	              recurseDueTime = 0;
	              if (q.length > 0) {
	                shouldRecurse = true;
	                recurseDueTime = Math.max(0, q[0].timestamp - scheduler.now());
	              } else {
	                active = false;
	              }
	              e = exception;
	              running = false;
	              if (e !== null) {
	                o.onError(e);
	              } else if (shouldRecurse) {
	                self(null, recurseDueTime);
	              }
	            }));
	          }
	        }
	      });
	      return new BinaryDisposable(subscription, cancelable);
	    }, source);
	  }

	  function observableDelayAbsolute(source, dueTime, scheduler) {
	    return observableDefer(function () {
	      return observableDelayRelative(source, dueTime - scheduler.now(), scheduler);
	    });
	  }

	  function delayWithSelector(source, subscriptionDelay, delayDurationSelector) {
	    var subDelay, selector;
	    if (isFunction(subscriptionDelay)) {
	      selector = subscriptionDelay;
	    } else {
	      subDelay = subscriptionDelay;
	      selector = delayDurationSelector;
	    }
	    return new AnonymousObservable(function (o) {
	      var delays = new CompositeDisposable(), atEnd = false, subscription = new SerialDisposable();

	      function start() {
	        subscription.setDisposable(source.subscribe(
	          function (x) {
	            var delay = tryCatch(selector)(x);
	            if (delay === errorObj) { return o.onError(delay.e); }
	            var d = new SingleAssignmentDisposable();
	            delays.add(d);
	            d.setDisposable(delay.subscribe(
	              function () {
	                o.onNext(x);
	                delays.remove(d);
	                done();
	              },
	              function (e) { o.onError(e); },
	              function () {
	                o.onNext(x);
	                delays.remove(d);
	                done();
	              }
	            ));
	          },
	          function (e) { o.onError(e); },
	          function () {
	            atEnd = true;
	            subscription.dispose();
	            done();
	          }
	        ));
	      }

	      function done () {
	        atEnd && delays.length === 0 && o.onCompleted();
	      }

	      if (!subDelay) {
	        start();
	      } else {
	        subscription.setDisposable(subDelay.subscribe(start, function (e) { o.onError(e); }, start));
	      }

	      return new BinaryDisposable(subscription, delays);
	    }, this);
	  }

	  /**
	   *  Time shifts the observable sequence by dueTime.
	   *  The relative time intervals between the values are preserved.
	   *
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
	   * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Time-shifted sequence.
	   */
	  observableProto.delay = function () {
	    var firstArg = arguments[0];
	    if (typeof firstArg === 'number' || firstArg instanceof Date) {
	      var dueTime = firstArg, scheduler = arguments[1];
	      isScheduler(scheduler) || (scheduler = defaultScheduler);
	      return dueTime instanceof Date ?
	        observableDelayAbsolute(this, dueTime, scheduler) :
	        observableDelayRelative(this, dueTime, scheduler);
	    } else if (Observable.isObservable(firstArg) || isFunction(firstArg)) {
	      return delayWithSelector(this, firstArg, arguments[1]);
	    } else {
	      throw new Error('Invalid arguments');
	    }
	  };

	  var DebounceObservable = (function (__super__) {
	    inherits(DebounceObservable, __super__);
	    function DebounceObservable(source, dt, s) {
	      isScheduler(s) || (s = defaultScheduler);
	      this.source = source;
	      this._dt = dt;
	      this._s = s;
	      __super__.call(this);
	    }

	    DebounceObservable.prototype.subscribeCore = function (o) {
	      var cancelable = new SerialDisposable();
	      return new BinaryDisposable(
	        this.source.subscribe(new DebounceObserver(o, this.source, this._dt, this._s, cancelable)),
	        cancelable);
	    };

	    return DebounceObservable;
	  }(ObservableBase));

	  var DebounceObserver = (function (__super__) {
	    inherits(DebounceObserver, __super__);
	    function DebounceObserver(observer, source, dueTime, scheduler, cancelable) {
	      this._o = observer;
	      this._s = source;
	      this._d = dueTime;
	      this._scheduler = scheduler;
	      this._c = cancelable;
	      this._v = null;
	      this._hv = false;
	      this._id = 0;
	      __super__.call(this);
	    }

	    DebounceObserver.prototype.next = function (x) {
	      this._hv = true;
	      this._v = x;
	      var currentId = ++this._id, d = new SingleAssignmentDisposable();
	      this._c.setDisposable(d);
	      d.setDisposable(this._scheduler.scheduleFuture(this, this._d, function (_, self) {
	        self._hv && self._id === currentId && self._o.onNext(x);
	        self._hv = false;
	      }));
	    };

	    DebounceObserver.prototype.error = function (e) {
	      this._c.dispose();
	      this._o.onError(e);
	      this._hv = false;
	      this._id++;
	    };

	    DebounceObserver.prototype.completed = function () {
	      this._c.dispose();
	      this._hv && this._o.onNext(this._v);
	      this._o.onCompleted();
	      this._hv = false;
	      this._id++;
	    };

	    return DebounceObserver;
	  }(AbstractObserver));

	  function debounceWithSelector(source, durationSelector) {
	    return new AnonymousObservable(function (o) {
	      var value, hasValue = false, cancelable = new SerialDisposable(), id = 0;
	      var subscription = source.subscribe(
	        function (x) {
	          var throttle = tryCatch(durationSelector)(x);
	          if (throttle === errorObj) { return o.onError(throttle.e); }

	          isPromise(throttle) && (throttle = observableFromPromise(throttle));

	          hasValue = true;
	          value = x;
	          id++;
	          var currentid = id, d = new SingleAssignmentDisposable();
	          cancelable.setDisposable(d);
	          d.setDisposable(throttle.subscribe(
	            function () {
	              hasValue && id === currentid && o.onNext(value);
	              hasValue = false;
	              d.dispose();
	            },
	            function (e) { o.onError(e); },
	            function () {
	              hasValue && id === currentid && o.onNext(value);
	              hasValue = false;
	              d.dispose();
	            }
	          ));
	        },
	        function (e) {
	          cancelable.dispose();
	          o.onError(e);
	          hasValue = false;
	          id++;
	        },
	        function () {
	          cancelable.dispose();
	          hasValue && o.onNext(value);
	          o.onCompleted();
	          hasValue = false;
	          id++;
	        }
	      );
	      return new BinaryDisposable(subscription, cancelable);
	    }, source);
	  }

	  observableProto.debounce = function () {
	    if (isFunction (arguments[0])) {
	      return debounceWithSelector(this, arguments[0]);
	    } else if (typeof arguments[0] === 'number') {
	      return new DebounceObservable(this, arguments[0], arguments[1]);
	    } else {
	      throw new Error('Invalid arguments');
	    }
	  };

	  /**
	   *  Projects each element of an observable sequence into zero or more windows which are produced based on timing information.
	   * @param {Number} timeSpan Length of each window (specified as an integer denoting milliseconds).
	   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive windows (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent windows.
	   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
	    var source = this, timeShift;
	    timeShiftOrScheduler == null && (timeShift = timeSpan);
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    if (typeof timeShiftOrScheduler === 'number') {
	      timeShift = timeShiftOrScheduler;
	    } else if (isScheduler(timeShiftOrScheduler)) {
	      timeShift = timeSpan;
	      scheduler = timeShiftOrScheduler;
	    }
	    return new AnonymousObservable(function (observer) {
	      var groupDisposable,
	        nextShift = timeShift,
	        nextSpan = timeSpan,
	        q = [],
	        refCountDisposable,
	        timerD = new SerialDisposable(),
	        totalTime = 0;
	        groupDisposable = new CompositeDisposable(timerD),
	        refCountDisposable = new RefCountDisposable(groupDisposable);

	       function createTimer () {
	        var m = new SingleAssignmentDisposable(),
	          isSpan = false,
	          isShift = false;
	        timerD.setDisposable(m);
	        if (nextSpan === nextShift) {
	          isSpan = true;
	          isShift = true;
	        } else if (nextSpan < nextShift) {
	            isSpan = true;
	        } else {
	          isShift = true;
	        }
	        var newTotalTime = isSpan ? nextSpan : nextShift,
	          ts = newTotalTime - totalTime;
	        totalTime = newTotalTime;
	        if (isSpan) {
	          nextSpan += timeShift;
	        }
	        if (isShift) {
	          nextShift += timeShift;
	        }
	        m.setDisposable(scheduler.scheduleFuture(null, ts, function () {
	          if (isShift) {
	            var s = new Subject();
	            q.push(s);
	            observer.onNext(addRef(s, refCountDisposable));
	          }
	          isSpan && q.shift().onCompleted();
	          createTimer();
	        }));
	      };
	      q.push(new Subject());
	      observer.onNext(addRef(q[0], refCountDisposable));
	      createTimer();
	      groupDisposable.add(source.subscribe(
	        function (x) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onNext(x); }
	        },
	        function (e) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onError(e); }
	          observer.onError(e);
	        },
	        function () {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onCompleted(); }
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };

	  /**
	   *  Projects each element of an observable sequence into a window that is completed when either it's full or a given amount of time has elapsed.
	   * @param {Number} timeSpan Maximum time length of a window.
	   * @param {Number} count Maximum element count of a window.
	   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithTimeOrCount = function (timeSpan, count, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new AnonymousObservable(function (observer) {
	      var timerD = new SerialDisposable(),
	          groupDisposable = new CompositeDisposable(timerD),
	          refCountDisposable = new RefCountDisposable(groupDisposable),
	          n = 0,
	          windowId = 0,
	          s = new Subject();

	      function createTimer(id) {
	        var m = new SingleAssignmentDisposable();
	        timerD.setDisposable(m);
	        m.setDisposable(scheduler.scheduleFuture(null, timeSpan, function () {
	          if (id !== windowId) { return; }
	          n = 0;
	          var newId = ++windowId;
	          s.onCompleted();
	          s = new Subject();
	          observer.onNext(addRef(s, refCountDisposable));
	          createTimer(newId);
	        }));
	      }

	      observer.onNext(addRef(s, refCountDisposable));
	      createTimer(0);

	      groupDisposable.add(source.subscribe(
	        function (x) {
	          var newId = 0, newWindow = false;
	          s.onNext(x);
	          if (++n === count) {
	            newWindow = true;
	            n = 0;
	            newId = ++windowId;
	            s.onCompleted();
	            s = new Subject();
	            observer.onNext(addRef(s, refCountDisposable));
	          }
	          newWindow && createTimer(newId);
	        },
	        function (e) {
	          s.onError(e);
	          observer.onError(e);
	        }, function () {
	          s.onCompleted();
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };

	  function toArray(x) { return x.toArray(); }

	  /**
	   *  Projects each element of an observable sequence into zero or more buffers which are produced based on timing information.
	   * @param {Number} timeSpan Length of each buffer (specified as an integer denoting milliseconds).
	   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive buffers (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent buffers.
	   * @param {Scheduler} [scheduler]  Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
	    return this.windowWithTime(timeSpan, timeShiftOrScheduler, scheduler).flatMap(toArray);
	  };

	  function toArray(x) { return x.toArray(); }

	  /**
	   *  Projects each element of an observable sequence into a buffer that is completed when either it's full or a given amount of time has elapsed.
	   * @param {Number} timeSpan Maximum time length of a buffer.
	   * @param {Number} count Maximum element count of a buffer.
	   * @param {Scheduler} [scheduler]  Scheduler to run bufferin timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithTimeOrCount = function (timeSpan, count, scheduler) {
	    return this.windowWithTimeOrCount(timeSpan, count, scheduler).flatMap(toArray);
	  };

	  var TimeIntervalObservable = (function (__super__) {
	    inherits(TimeIntervalObservable, __super__);
	    function TimeIntervalObservable(source, s) {
	      this.source = source;
	      this._s = s;
	      __super__.call(this);
	    }

	    TimeIntervalObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TimeIntervalObserver(o, this._s));
	    };

	    return TimeIntervalObservable;
	  }(ObservableBase));

	  var TimeIntervalObserver = (function (__super__) {
	    inherits(TimeIntervalObserver, __super__);

	    function TimeIntervalObserver(o, s) {
	      this._o = o;
	      this._s = s;
	      this._l = s.now();
	      __super__.call(this);
	    }

	    TimeIntervalObserver.prototype.next = function (x) {
	      var now = this._s.now(), span = now - this._l;
	      this._l = now;
	      this._o.onNext({ value: x, interval: span });
	    };
	    TimeIntervalObserver.prototype.error = function (e) { this._o.onError(e); };
	    TimeIntervalObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return TimeIntervalObserver;
	  }(AbstractObserver));

	  /**
	   *  Records the time interval between consecutive values in an observable sequence.
	   *
	   * @example
	   *  1 - res = source.timeInterval();
	   *  2 - res = source.timeInterval(Rx.Scheduler.timeout);
	   *
	   * @param [scheduler]  Scheduler used to compute time intervals. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence with time interval information on values.
	   */
	  observableProto.timeInterval = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new TimeIntervalObservable(this, scheduler);
	  };

	  var TimestampObservable = (function (__super__) {
	    inherits(TimestampObservable, __super__);
	    function TimestampObservable(source, s) {
	      this.source = source;
	      this._s = s;
	      __super__.call(this);
	    }

	    TimestampObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TimestampObserver(o, this._s));
	    };

	    return TimestampObservable;
	  }(ObservableBase));

	  var TimestampObserver = (function (__super__) {
	    inherits(TimestampObserver, __super__);
	    function TimestampObserver(o, s) {
	      this._o = o;
	      this._s = s;
	      __super__.call(this);
	    }

	    TimestampObserver.prototype.next = function (x) {
	      this._o.onNext({ value: x, timestamp: this._s.now() });
	    };

	    TimestampObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    TimestampObserver.prototype.completed = function () {
	      this._o.onCompleted();
	    };

	    return TimestampObserver;
	  }(AbstractObserver));

	  /**
	   *  Records the timestamp for each value in an observable sequence.
	   *
	   * @example
	   *  1 - res = source.timestamp(); // produces { value: x, timestamp: ts }
	   *  2 - res = source.timestamp(Rx.Scheduler.default);
	   *
	   * @param {Scheduler} [scheduler]  Scheduler used to compute timestamps. If not specified, the default scheduler is used.
	   * @returns {Observable} An observable sequence with timestamp information on values.
	   */
	  observableProto.timestamp = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new TimestampObservable(this, scheduler);
	  };

	  function sampleObservable(source, sampler) {
	    return new AnonymousObservable(function (o) {
	      var atEnd = false, value, hasValue = false;

	      function sampleSubscribe() {
	        if (hasValue) {
	          hasValue = false;
	          o.onNext(value);
	        }
	        atEnd && o.onCompleted();
	      }

	      var sourceSubscription = new SingleAssignmentDisposable();
	      sourceSubscription.setDisposable(source.subscribe(
	        function (newValue) {
	          hasValue = true;
	          value = newValue;
	        },
	        function (e) { o.onError(e); },
	        function () {
	          atEnd = true;
	          sourceSubscription.dispose();
	        }
	      ));

	      return new BinaryDisposable(
	        sourceSubscription,
	        sampler.subscribe(sampleSubscribe, function (e) { o.onError(e); }, sampleSubscribe)
	      );
	    }, source);
	  }

	  /**
	   *  Samples the observable sequence at each interval.
	   *
	   * @example
	   *  1 - res = source.sample(sampleObservable); // Sampler tick sequence
	   *  2 - res = source.sample(5000); // 5 seconds
	   *  2 - res = source.sample(5000, Rx.Scheduler.timeout); // 5 seconds
	   *
	   * @param {Mixed} intervalOrSampler Interval at which to sample (specified as an integer denoting milliseconds) or Sampler Observable.
	   * @param {Scheduler} [scheduler]  Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Sampled observable sequence.
	   */
	  observableProto.sample = observableProto.throttleLatest = function (intervalOrSampler, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return typeof intervalOrSampler === 'number' ?
	      sampleObservable(this, observableinterval(intervalOrSampler, scheduler)) :
	      sampleObservable(this, intervalOrSampler);
	  };

	  var TimeoutError = Rx.TimeoutError = function(message) {
	    this.message = message || 'Timeout has occurred';
	    this.name = 'TimeoutError';
	    Error.call(this);
	  };
	  TimeoutError.prototype = Object.create(Error.prototype);

	  function timeoutWithSelector(source, firstTimeout, timeoutDurationSelector, other) {
	    if (isFunction(firstTimeout)) {
	      other = timeoutDurationSelector;
	      timeoutDurationSelector = firstTimeout;
	      firstTimeout = observableNever();
	    }
	    Observable.isObservable(other) || (other = observableThrow(new TimeoutError()));
	    return new AnonymousObservable(function (o) {
	      var subscription = new SerialDisposable(),
	        timer = new SerialDisposable(),
	        original = new SingleAssignmentDisposable();

	      subscription.setDisposable(original);

	      var id = 0, switched = false;

	      function setTimer(timeout) {
	        var myId = id, d = new SingleAssignmentDisposable();

	        function timerWins() {
	          switched = (myId === id);
	          return switched;
	        }

	        timer.setDisposable(d);
	        d.setDisposable(timeout.subscribe(function () {
	          timerWins() && subscription.setDisposable(other.subscribe(o));
	          d.dispose();
	        }, function (e) {
	          timerWins() && o.onError(e);
	        }, function () {
	          timerWins() && subscription.setDisposable(other.subscribe(o));
	        }));
	      };

	      setTimer(firstTimeout);

	      function oWins() {
	        var res = !switched;
	        if (res) { id++; }
	        return res;
	      }

	      original.setDisposable(source.subscribe(function (x) {
	        if (oWins()) {
	          o.onNext(x);
	          var timeout = tryCatch(timeoutDurationSelector)(x);
	          if (timeout === errorObj) { return o.onError(timeout.e); }
	          setTimer(isPromise(timeout) ? observableFromPromise(timeout) : timeout);
	        }
	      }, function (e) {
	        oWins() && o.onError(e);
	      }, function () {
	        oWins() && o.onCompleted();
	      }));
	      return new BinaryDisposable(subscription, timer);
	    }, source);
	  }

	  function timeout(source, dueTime, other, scheduler) {
	    if (isScheduler(other)) {
	      scheduler = other;
	      other = observableThrow(new TimeoutError());
	    }
	    if (other instanceof Error) { other = observableThrow(other); }
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    Observable.isObservable(other) || (other = observableThrow(new TimeoutError()));
	    return new AnonymousObservable(function (o) {
	      var id = 0,
	        original = new SingleAssignmentDisposable(),
	        subscription = new SerialDisposable(),
	        switched = false,
	        timer = new SerialDisposable();

	      subscription.setDisposable(original);

	      function createTimer() {
	        var myId = id;
	        timer.setDisposable(scheduler.scheduleFuture(null, dueTime, function () {
	          switched = id === myId;
	          if (switched) {
	            isPromise(other) && (other = observableFromPromise(other));
	            subscription.setDisposable(other.subscribe(o));
	          }
	        }));
	      }

	      createTimer();

	      original.setDisposable(source.subscribe(function (x) {
	        if (!switched) {
	          id++;
	          o.onNext(x);
	          createTimer();
	        }
	      }, function (e) {
	        if (!switched) {
	          id++;
	          o.onError(e);
	        }
	      }, function () {
	        if (!switched) {
	          id++;
	          o.onCompleted();
	        }
	      }));
	      return new BinaryDisposable(subscription, timer);
	    }, source);
	  }

	  observableProto.timeout = function () {
	    var firstArg = arguments[0];
	    if (firstArg instanceof Date || typeof firstArg === 'number') {
	      return timeout(this, firstArg, arguments[1], arguments[2]);
	    } else if (Observable.isObservable(firstArg) || isFunction(firstArg)) {
	      return timeoutWithSelector(this, firstArg, arguments[1], arguments[2]);
	    } else {
	      throw new Error('Invalid arguments');
	    }
	  };

	  var GenerateAbsoluteObservable = (function (__super__) {
	    inherits(GenerateAbsoluteObservable, __super__);
	    function GenerateAbsoluteObservable(state, cndFn, itrFn, resFn, timeFn, s) {
	      this._state = state;
	      this._cndFn = cndFn;
	      this._itrFn = itrFn;
	      this._resFn = resFn;
	      this._timeFn = timeFn;
	      this._s = s;
	      this._first = true;
	      this._hasResult = false;
	      __super__.call(this);
	    }

	    function scheduleRecursive(self, recurse) {
	      self._hasResult && self._o.onNext(self._state);

	      if (self._first) {
	        self._first = false;
	      } else {
	        self._state = tryCatch(self._itrFn)(self._state);
	        if (self._state === errorObj) { return self._o.onError(self._state.e); }
	      }
	      self._hasResult = tryCatch(self._cndFn)(self._state);
	      if (self._hasResult === errorObj) { return self._o.onError(self._hasResult.e); }
	      if (self._hasResult) {
	        var result = tryCatch(self._resFn)(self._state);
	        if (result === errorObj) { return self._o.onError(result.e); }
	        var time = tryCatch(self._timeFn)(self._state);
	        if (time === errorObj) { return self._o.onError(time.e); }
	        recurse(self, time);
	      } else {
	        self._o.onCompleted();
	      }
	    }

	    GenerateAbsoluteObservable.prototype.subscribeCore = function (o) {
	      this._o = o;
	      return this._s.scheduleRecursiveFuture(this, new Date(this._s.now()), scheduleRecursive);
	    };

	    return GenerateAbsoluteObservable;
	  }(ObservableBase));

	  /**
	   *  GenerateAbsolutes an observable sequence by iterating a state from an initial state until the condition fails.
	   *
	   * @example
	   *  res = source.generateWithAbsoluteTime(0,
	   *      function (x) { return return true; },
	   *      function (x) { return x + 1; },
	   *      function (x) { return x; },
	   *      function (x) { return new Date(); }
	   *  });
	   *
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning Date values.
	   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generateWithAbsoluteTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new GenerateAbsoluteObservable(initialState, condition, iterate, resultSelector, timeSelector, scheduler);
	  };

	  var GenerateRelativeObservable = (function (__super__) {
	    inherits(GenerateRelativeObservable, __super__);
	    function GenerateRelativeObservable(state, cndFn, itrFn, resFn, timeFn, s) {
	      this._state = state;
	      this._cndFn = cndFn;
	      this._itrFn = itrFn;
	      this._resFn = resFn;
	      this._timeFn = timeFn;
	      this._s = s;
	      this._first = true;
	      this._hasResult = false;
	      __super__.call(this);
	    }

	    function scheduleRecursive(self, recurse) {
	      self._hasResult && self._o.onNext(self._state);

	      if (self._first) {
	        self._first = false;
	      } else {
	        self._state = tryCatch(self._itrFn)(self._state);
	        if (self._state === errorObj) { return self._o.onError(self._state.e); }
	      }
	      self._hasResult = tryCatch(self._cndFn)(self._state);
	      if (self._hasResult === errorObj) { return self._o.onError(self._hasResult.e); }
	      if (self._hasResult) {
	        var result = tryCatch(self._resFn)(self._state);
	        if (result === errorObj) { return self._o.onError(result.e); }
	        var time = tryCatch(self._timeFn)(self._state);
	        if (time === errorObj) { return self._o.onError(time.e); }
	        recurse(self, time);
	      } else {
	        self._o.onCompleted();
	      }
	    }

	    GenerateRelativeObservable.prototype.subscribeCore = function (o) {
	      this._o = o;
	      return this._s.scheduleRecursiveFuture(this, 0, scheduleRecursive);
	    };

	    return GenerateRelativeObservable;
	  }(ObservableBase));

	  /**
	   *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
	   *
	   * @example
	   *  res = source.generateWithRelativeTime(0,
	   *      function (x) { return return true; },
	   *      function (x) { return x + 1; },
	   *      function (x) { return x; },
	   *      function (x) { return 500; }
	   *  );
	   *
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning integer values denoting milliseconds.
	   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generateWithRelativeTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new GenerateRelativeObservable(initialState, condition, iterate, resultSelector, timeSelector, scheduler);
	  };

	  var DelaySubscription = (function(__super__) {
	    inherits(DelaySubscription, __super__);
	    function DelaySubscription(source, dt, s) {
	      this.source = source;
	      this._dt = dt;
	      this._s = s;
	      __super__.call(this);
	    }

	    DelaySubscription.prototype.subscribeCore = function (o) {
	      var d = new SerialDisposable();

	      d.setDisposable(this._s.scheduleFuture([this.source, o, d], this._dt, scheduleMethod));

	      return d;
	    };

	    function scheduleMethod(s, state) {
	      var source = state[0], o = state[1], d = state[2];
	      d.setDisposable(source.subscribe(o));
	    }

	    return DelaySubscription;
	  }(ObservableBase));

	  /**
	   *  Time shifts the observable sequence by delaying the subscription with the specified relative time duration, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.delaySubscription(5000); // 5s
	   *  2 - res = source.delaySubscription(5000, Rx.Scheduler.default); // 5 seconds
	   *
	   * @param {Number} dueTime Relative or absolute time shift of the subscription.
	   * @param {Scheduler} [scheduler]  Scheduler to run the subscription delay timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Time-shifted sequence.
	   */
	  observableProto.delaySubscription = function (dueTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new DelaySubscription(this, dueTime, scheduler);
	  };

	  var SkipLastWithTimeObservable = (function (__super__) {
	    inherits(SkipLastWithTimeObservable, __super__);
	    function SkipLastWithTimeObservable(source, d, s) {
	      this.source = source;
	      this._d = d;
	      this._s = s;
	      __super__.call(this);
	    }

	    SkipLastWithTimeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SkipLastWithTimeObserver(o, this));
	    };

	    return SkipLastWithTimeObservable;
	  }(ObservableBase));

	  var SkipLastWithTimeObserver = (function (__super__) {
	    inherits(SkipLastWithTimeObserver, __super__);

	    function SkipLastWithTimeObserver(o, p) {
	      this._o = o;
	      this._s = p._s;
	      this._d = p._d;
	      this._q = [];
	      __super__.call(this);
	    }

	    SkipLastWithTimeObserver.prototype.next = function (x) {
	      var now = this._s.now();
	      this._q.push({ interval: now, value: x });
	      while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	        this._o.onNext(this._q.shift().value);
	      }
	    };
	    SkipLastWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SkipLastWithTimeObserver.prototype.completed = function () {
	      var now = this._s.now();
	      while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	        this._o.onNext(this._q.shift().value);
	      }
	      this._o.onCompleted();
	    };

	    return SkipLastWithTimeObserver;
	  }(AbstractObserver));

	  /**
	   *  Skips elements for the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for skipping elements from the end of the sequence.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout
	   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the end of the source sequence.
	   */
	  observableProto.skipLastWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new SkipLastWithTimeObservable(this, duration, scheduler);
	  };

	  var TakeLastWithTimeObservable = (function (__super__) {
	    inherits(TakeLastWithTimeObservable, __super__);
	    function TakeLastWithTimeObservable(source, d, s) {
	      this.source = source;
	      this._d = d;
	      this._s = s;
	      __super__.call(this);
	    }

	    TakeLastWithTimeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TakeLastWithTimeObserver(o, this._d, this._s));
	    };

	    return TakeLastWithTimeObservable;
	  }(ObservableBase));

	  var TakeLastWithTimeObserver = (function (__super__) {
	    inherits(TakeLastWithTimeObserver, __super__);

	    function TakeLastWithTimeObserver(o, d, s) {
	      this._o = o;
	      this._d = d;
	      this._s = s;
	      this._q = [];
	      __super__.call(this);
	    }

	    TakeLastWithTimeObserver.prototype.next = function (x) {
	      var now = this._s.now();
	      this._q.push({ interval: now, value: x });
	      while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	        this._q.shift();
	      }
	    };
	    TakeLastWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
	    TakeLastWithTimeObserver.prototype.completed = function () {
	      var now = this._s.now();
	      while (this._q.length > 0) {
	        var next = this._q.shift();
	        if (now - next.interval <= this._d) { this._o.onNext(next.value); }
	      }
	      this._o.onCompleted();
	    };

	    return TakeLastWithTimeObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the end of the sequence.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the end of the source sequence.
	   */
	  observableProto.takeLastWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new TakeLastWithTimeObservable(this, duration, scheduler);
	  };

	  /**
	   *  Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the end of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.
	   */
	  observableProto.takeLastBufferWithTime = function (duration, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        var now = scheduler.now();
	        q.push({ interval: now, value: x });
	        while (q.length > 0 && now - q[0].interval >= duration) {
	          q.shift();
	        }
	      }, function (e) { o.onError(e); }, function () {
	        var now = scheduler.now(), res = [];
	        while (q.length > 0) {
	          var next = q.shift();
	          now - next.interval <= duration && res.push(next.value);
	        }
	        o.onNext(res);
	        o.onCompleted();
	      });
	    }, source);
	  };

	  var TakeWithTimeObservable = (function (__super__) {
	    inherits(TakeWithTimeObservable, __super__);
	    function TakeWithTimeObservable(source, d, s) {
	      this.source = source;
	      this._d = d;
	      this._s = s;
	      __super__.call(this);
	    }

	    function scheduleMethod(s, o) {
	      o.onCompleted();
	    }

	    TakeWithTimeObservable.prototype.subscribeCore = function (o) {
	      return new BinaryDisposable(
	        this._s.scheduleFuture(o, this._d, scheduleMethod),
	        this.source.subscribe(o)
	      );
	    };

	    return TakeWithTimeObservable;
	  }(ObservableBase));

	  /**
	   *  Takes elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.takeWithTime(5000,  [optional scheduler]);
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the start of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the start of the source sequence.
	   */
	  observableProto.takeWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new TakeWithTimeObservable(this, duration, scheduler);
	  };

	  var SkipWithTimeObservable = (function (__super__) {
	    inherits(SkipWithTimeObservable, __super__);
	    function SkipWithTimeObservable(source, d, s) {
	      this.source = source;
	      this._d = d;
	      this._s = s;
	      this._open = false;
	      __super__.call(this);
	    }

	    function scheduleMethod(s, self) {
	      self._open = true;
	    }

	    SkipWithTimeObservable.prototype.subscribeCore = function (o) {
	      return new BinaryDisposable(
	        this._s.scheduleFuture(this, this._d, scheduleMethod),
	        this.source.subscribe(new SkipWithTimeObserver(o, this))
	      );
	    };

	    return SkipWithTimeObservable;
	  }(ObservableBase));

	  var SkipWithTimeObserver = (function (__super__) {
	    inherits(SkipWithTimeObserver, __super__);

	    function SkipWithTimeObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      __super__.call(this);
	    }

	    SkipWithTimeObserver.prototype.next = function (x) { this._p._open && this._o.onNext(x); };
	    SkipWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SkipWithTimeObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return SkipWithTimeObserver;
	  }(AbstractObserver));

	  /**
	   *  Skips elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  Specifying a zero value for duration doesn't guarantee no elements will be dropped from the start of the source sequence.
	   *  This is a side-effect of the asynchrony introduced by the scheduler, where the action that causes callbacks from the source sequence to be forwarded
	   *  may not execute immediately, despite the zero due time.
	   *
	   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the duration.
	   * @param {Number} duration Duration for skipping elements from the start of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the start of the source sequence.
	   */
	  observableProto.skipWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new SkipWithTimeObservable(this, duration, scheduler);
	  };

	  var SkipUntilWithTimeObservable = (function (__super__) {
	    inherits(SkipUntilWithTimeObservable, __super__);
	    function SkipUntilWithTimeObservable(source, startTime, scheduler) {
	      this.source = source;
	      this._st = startTime;
	      this._s = scheduler;
	      __super__.call(this);
	    }

	    function scheduleMethod(s, state) {
	      state._open = true;
	    }

	    SkipUntilWithTimeObservable.prototype.subscribeCore = function (o) {
	      this._open = false;
	      return new BinaryDisposable(
	        this._s.scheduleFuture(this, this._st, scheduleMethod),
	        this.source.subscribe(new SkipUntilWithTimeObserver(o, this))
	      );
	    };

	    return SkipUntilWithTimeObservable;
	  }(ObservableBase));

	  var SkipUntilWithTimeObserver = (function (__super__) {
	    inherits(SkipUntilWithTimeObserver, __super__);

	    function SkipUntilWithTimeObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      __super__.call(this);
	    }

	    SkipUntilWithTimeObserver.prototype.next = function (x) { this._p._open && this._o.onNext(x); };
	    SkipUntilWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SkipUntilWithTimeObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return SkipUntilWithTimeObserver;
	  }(AbstractObserver));


	  /**
	   *  Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.
	   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time.
	   *
	   * @examples
	   *  1 - res = source.skipUntilWithTime(new Date(), [scheduler]);
	   *  2 - res = source.skipUntilWithTime(5000, [scheduler]);
	   * @param {Date|Number} startTime Time to start taking elements from the source sequence. If this value is less than or equal to Date(), no elements will be skipped.
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements skipped until the specified start time.
	   */
	  observableProto.skipUntilWithTime = function (startTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new SkipUntilWithTimeObservable(this, startTime, scheduler);
	  };

	  /**
	   *  Takes elements for the specified duration until the specified end time, using the specified scheduler to run timers.
	   * @param {Number | Date} endTime Time to stop taking elements from the source sequence. If this value is less than or equal to new Date(), the result stream will complete immediately.
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on.
	   * @returns {Observable} An observable sequence with the elements taken until the specified end time.
	   */
	  observableProto.takeUntilWithTime = function (endTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return new BinaryDisposable(
	        scheduler.scheduleFuture(o, endTime, function (_, o) { o.onCompleted(); }),
	        source.subscribe(o));
	    }, source);
	  };

	  /**
	   * Returns an Observable that emits only the first item emitted by the source Observable during sequential time windows of a specified duration.
	   * @param {Number} windowDuration time to wait before emitting another item after emitting the last item
	   * @param {Scheduler} [scheduler] the Scheduler to use internally to manage the timers that handle timeout for each item. If not provided, defaults to Scheduler.timeout.
	   * @returns {Observable} An Observable that performs the throttle operation.
	   */
	  observableProto.throttle = function (windowDuration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    var duration = +windowDuration || 0;
	    if (duration <= 0) { throw new RangeError('windowDuration cannot be less or equal zero.'); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var lastOnNext = 0;
	      return source.subscribe(
	        function (x) {
	          var now = scheduler.now();
	          if (lastOnNext === 0 || now - lastOnNext >= duration) {
	            lastOnNext = now;
	            o.onNext(x);
	          }
	        },function (e) { o.onError(e); }, function () { o.onCompleted(); }
	      );
	    }, source);
	  };

	  var TransduceObserver = (function (__super__) {
	    inherits(TransduceObserver, __super__);
	    function TransduceObserver(o, xform) {
	      this._o = o;
	      this._xform = xform;
	      __super__.call(this);
	    }

	    TransduceObserver.prototype.next = function (x) {
	      var res = tryCatch(this._xform['@@transducer/step']).call(this._xform, this._o, x);
	      if (res === errorObj) { this._o.onError(res.e); }
	    };

	    TransduceObserver.prototype.error = function (e) { this._o.onError(e); };

	    TransduceObserver.prototype.completed = function () {
	      this._xform['@@transducer/result'](this._o);
	    };

	    return TransduceObserver;
	  }(AbstractObserver));

	  function transformForObserver(o) {
	    return {
	      '@@transducer/init': function() {
	        return o;
	      },
	      '@@transducer/step': function(obs, input) {
	        return obs.onNext(input);
	      },
	      '@@transducer/result': function(obs) {
	        return obs.onCompleted();
	      }
	    };
	  }

	  /**
	   * Executes a transducer to transform the observable sequence
	   * @param {Transducer} transducer A transducer to execute
	   * @returns {Observable} An Observable sequence containing the results from the transducer.
	   */
	  observableProto.transduce = function(transducer) {
	    var source = this;
	    return new AnonymousObservable(function(o) {
	      var xform = transducer(transformForObserver(o));
	      return source.subscribe(new TransduceObserver(o, xform));
	    }, source);
	  };

	  var SwitchFirstObservable = (function (__super__) {
	    inherits(SwitchFirstObservable, __super__);
	    function SwitchFirstObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    SwitchFirstObservable.prototype.subscribeCore = function (o) {
	      var m = new SingleAssignmentDisposable(),
	        g = new CompositeDisposable(),
	        state = {
	          hasCurrent: false,
	          isStopped: false,
	          o: o,
	          g: g
	        };

	      g.add(m);
	      m.setDisposable(this.source.subscribe(new SwitchFirstObserver(state)));
	      return g;
	    };

	    return SwitchFirstObservable;
	  }(ObservableBase));

	  var SwitchFirstObserver = (function(__super__) {
	    inherits(SwitchFirstObserver, __super__);
	    function SwitchFirstObserver(state) {
	      this._s = state;
	      __super__.call(this);
	    }

	    SwitchFirstObserver.prototype.next = function (x) {
	      if (!this._s.hasCurrent) {
	        this._s.hasCurrent = true;
	        isPromise(x) && (x = observableFromPromise(x));
	        var inner = new SingleAssignmentDisposable();
	        this._s.g.add(inner);
	        inner.setDisposable(x.subscribe(new InnerObserver(this._s, inner)));
	      }
	    };

	    SwitchFirstObserver.prototype.error = function (e) {
	      this._s.o.onError(e);
	    };

	    SwitchFirstObserver.prototype.completed = function () {
	      this._s.isStopped = true;
	      !this._s.hasCurrent && this._s.g.length === 1 && this._s.o.onCompleted();
	    };

	    inherits(InnerObserver, __super__);
	    function InnerObserver(state, inner) {
	      this._s = state;
	      this._i = inner;
	      __super__.call(this);
	    }

	    InnerObserver.prototype.next = function (x) { this._s.o.onNext(x); };
	    InnerObserver.prototype.error = function (e) { this._s.o.onError(e); };
	    InnerObserver.prototype.completed = function () {
	      this._s.g.remove(this._i);
	      this._s.hasCurrent = false;
	      this._s.isStopped && this._s.g.length === 1 && this._s.o.onCompleted();
	    };

	    return SwitchFirstObserver;
	  }(AbstractObserver));

	  /**
	   * Performs a exclusive waiting for the first to finish before subscribing to another observable.
	   * Observables that come in between subscriptions will be dropped on the floor.
	   * @returns {Observable} A exclusive observable with only the results that happen when subscribed.
	   */
	  observableProto.switchFirst = function () {
	    return new SwitchFirstObservable(this);
	  };

	observableProto.flatMapFirst = observableProto.selectManyFirst = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchFirst();
	};

	Rx.Observable.prototype.flatMapWithMaxConcurrent = function(limit, selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(limit);
	};
	  /** Provides a set of extension methods for virtual time scheduling. */
	  var VirtualTimeScheduler = Rx.VirtualTimeScheduler = (function (__super__) {
	    inherits(VirtualTimeScheduler, __super__);

	    /**
	     * Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.
	     *
	     * @constructor
	     * @param {Number} initialClock Initial value for the clock.
	     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
	     */
	    function VirtualTimeScheduler(initialClock, comparer) {
	      this.clock = initialClock;
	      this.comparer = comparer;
	      this.isEnabled = false;
	      this.queue = new PriorityQueue(1024);
	      __super__.call(this);
	    }

	    var VirtualTimeSchedulerPrototype = VirtualTimeScheduler.prototype;

	    VirtualTimeSchedulerPrototype.now = function () {
	      return this.toAbsoluteTime(this.clock);
	    };

	    VirtualTimeSchedulerPrototype.schedule = function (state, action) {
	      return this.scheduleAbsolute(state, this.clock, action);
	    };

	    VirtualTimeSchedulerPrototype.scheduleFuture = function (state, dueTime, action) {
	      var dt = dueTime instanceof Date ?
	        this.toRelativeTime(dueTime - this.now()) :
	        this.toRelativeTime(dueTime);

	      return this.scheduleRelative(state, dt, action);
	    };

	    /**
	     * Adds a relative time value to an absolute time value.
	     * @param {Number} absolute Absolute virtual time value.
	     * @param {Number} relative Relative virtual time value to add.
	     * @return {Number} Resulting absolute virtual time sum value.
	     */
	    VirtualTimeSchedulerPrototype.add = notImplemented;

	    /**
	     * Converts an absolute time to a number
	     * @param {Any} The absolute time.
	     * @returns {Number} The absolute time in ms
	     */
	    VirtualTimeSchedulerPrototype.toAbsoluteTime = notImplemented;

	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     * @param {Number} timeSpan TimeSpan value to convert.
	     * @return {Number} Corresponding relative virtual time value.
	     */
	    VirtualTimeSchedulerPrototype.toRelativeTime = notImplemented;

	    /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be emulated using recursive scheduling.
	     * @param {Mixed} state Initial state passed to the action upon the first iteration.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed, potentially updating the state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.schedulePeriodic = function (state, period, action) {
	      var s = new SchedulePeriodicRecursive(this, state, period, action);
	      return s.start();
	    };

	    /**
	     * Schedules an action to be executed after dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Number} dueTime Relative time after which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleRelative = function (state, dueTime, action) {
	      var runAt = this.add(this.clock, dueTime);
	      return this.scheduleAbsolute(state, runAt, action);
	    };

	    /**
	     * Starts the virtual time scheduler.
	     */
	    VirtualTimeSchedulerPrototype.start = function () {
	      if (!this.isEnabled) {
	        this.isEnabled = true;
	        do {
	          var next = this.getNext();
	          if (next !== null) {
	            this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
	            next.invoke();
	          } else {
	            this.isEnabled = false;
	          }
	        } while (this.isEnabled);
	      }
	    };

	    /**
	     * Stops the virtual time scheduler.
	     */
	    VirtualTimeSchedulerPrototype.stop = function () {
	      this.isEnabled = false;
	    };

	    /**
	     * Advances the scheduler's clock to the specified time, running all work till that point.
	     * @param {Number} time Absolute time to advance the scheduler's clock to.
	     */
	    VirtualTimeSchedulerPrototype.advanceTo = function (time) {
	      var dueToClock = this.comparer(this.clock, time);
	      if (this.comparer(this.clock, time) > 0) { throw new ArgumentOutOfRangeError(); }
	      if (dueToClock === 0) { return; }
	      if (!this.isEnabled) {
	        this.isEnabled = true;
	        do {
	          var next = this.getNext();
	          if (next !== null && this.comparer(next.dueTime, time) <= 0) {
	            this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
	            next.invoke();
	          } else {
	            this.isEnabled = false;
	          }
	        } while (this.isEnabled);
	        this.clock = time;
	      }
	    };

	    /**
	     * Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
	     * @param {Number} time Relative time to advance the scheduler's clock by.
	     */
	    VirtualTimeSchedulerPrototype.advanceBy = function (time) {
	      var dt = this.add(this.clock, time),
	          dueToClock = this.comparer(this.clock, dt);
	      if (dueToClock > 0) { throw new ArgumentOutOfRangeError(); }
	      if (dueToClock === 0) {  return; }

	      this.advanceTo(dt);
	    };

	    /**
	     * Advances the scheduler's clock by the specified relative time.
	     * @param {Number} time Relative time to advance the scheduler's clock by.
	     */
	    VirtualTimeSchedulerPrototype.sleep = function (time) {
	      var dt = this.add(this.clock, time);
	      if (this.comparer(this.clock, dt) >= 0) { throw new ArgumentOutOfRangeError(); }

	      this.clock = dt;
	    };

	    /**
	     * Gets the next scheduled item to be executed.
	     * @returns {ScheduledItem} The next scheduled item.
	     */
	    VirtualTimeSchedulerPrototype.getNext = function () {
	      while (this.queue.length > 0) {
	        var next = this.queue.peek();
	        if (next.isCancelled()) {
	          this.queue.dequeue();
	        } else {
	          return next;
	        }
	      }
	      return null;
	    };

	    /**
	     * Schedules an action to be executed at dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Number} dueTime Absolute time at which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleAbsolute = function (state, dueTime, action) {
	      var self = this;

	      function run(scheduler, state1) {
	        self.queue.remove(si);
	        return action(scheduler, state1);
	      }

	      var si = new ScheduledItem(this, state, run, dueTime, this.comparer);
	      this.queue.enqueue(si);

	      return si.disposable;
	    };

	    return VirtualTimeScheduler;
	  }(Scheduler));

	  /** Provides a virtual time scheduler that uses Date for absolute time and number for relative time. */
	  Rx.HistoricalScheduler = (function (__super__) {
	    inherits(HistoricalScheduler, __super__);

	    /**
	     * Creates a new historical scheduler with the specified initial clock value.
	     * @constructor
	     * @param {Number} initialClock Initial value for the clock.
	     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
	     */
	    function HistoricalScheduler(initialClock, comparer) {
	      var clock = initialClock == null ? 0 : initialClock;
	      var cmp = comparer || defaultSubComparer;
	      __super__.call(this, clock, cmp);
	    }

	    var HistoricalSchedulerProto = HistoricalScheduler.prototype;

	    /**
	     * Adds a relative time value to an absolute time value.
	     * @param {Number} absolute Absolute virtual time value.
	     * @param {Number} relative Relative virtual time value to add.
	     * @return {Number} Resulting absolute virtual time sum value.
	     */
	    HistoricalSchedulerProto.add = function (absolute, relative) {
	      return absolute + relative;
	    };

	    HistoricalSchedulerProto.toAbsoluteTime = function (absolute) {
	      return new Date(absolute).getTime();
	    };

	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     * @memberOf HistoricalScheduler
	     * @param {Number} timeSpan TimeSpan value to convert.
	     * @return {Number} Corresponding relative virtual time value.
	     */
	    HistoricalSchedulerProto.toRelativeTime = function (timeSpan) {
	      return timeSpan;
	    };

	    return HistoricalScheduler;
	  }(Rx.VirtualTimeScheduler));

	function OnNextPredicate(predicate) {
	    this.predicate = predicate;
	}

	OnNextPredicate.prototype.equals = function (other) {
	  if (other === this) { return true; }
	  if (other == null) { return false; }
	  if (other.kind !== 'N') { return false; }
	  return this.predicate(other.value);
	};

	function OnErrorPredicate(predicate) {
	  this.predicate = predicate;
	}

	OnErrorPredicate.prototype.equals = function (other) {
	  if (other === this) { return true; }
	  if (other == null) { return false; }
	  if (other.kind !== 'E') { return false; }
	  return this.predicate(other.error);
	};

	var ReactiveTest = Rx.ReactiveTest = {
	  /** Default virtual time used for creation of observable sequences in unit tests. */
	  created: 100,
	  /** Default virtual time used to subscribe to observable sequences in unit tests. */
	  subscribed: 200,
	  /** Default virtual time used to dispose subscriptions in unit tests. */
	  disposed: 1000,

	  /**
	   * Factory method for an OnNext notification record at a given time with a given value or a predicate function.
	   *
	   * 1 - ReactiveTest.onNext(200, 42);
	   * 2 - ReactiveTest.onNext(200, function (x) { return x.length == 2; });
	   *
	   * @param ticks Recorded virtual time the OnNext notification occurs.
	   * @param value Recorded value stored in the OnNext notification or a predicate.
	   * @return Recorded OnNext notification.
	   */
	  onNext: function (ticks, value) {
	    return typeof value === 'function' ?
	      new Recorded(ticks, new OnNextPredicate(value)) :
	      new Recorded(ticks, Notification.createOnNext(value));
	  },
	  /**
	   * Factory method for an OnError notification record at a given time with a given error.
	   *
	   * 1 - ReactiveTest.onNext(200, new Error('error'));
	   * 2 - ReactiveTest.onNext(200, function (e) { return e.message === 'error'; });
	   *
	   * @param ticks Recorded virtual time the OnError notification occurs.
	   * @param exception Recorded exception stored in the OnError notification.
	   * @return Recorded OnError notification.
	   */
	  onError: function (ticks, error) {
	    return typeof error === 'function' ?
	      new Recorded(ticks, new OnErrorPredicate(error)) :
	      new Recorded(ticks, Notification.createOnError(error));
	  },
	  /**
	   * Factory method for an OnCompleted notification record at a given time.
	   *
	   * @param ticks Recorded virtual time the OnCompleted notification occurs.
	   * @return Recorded OnCompleted notification.
	   */
	  onCompleted: function (ticks) {
	    return new Recorded(ticks, Notification.createOnCompleted());
	  },
	  /**
	   * Factory method for a subscription record based on a given subscription and disposal time.
	   *
	   * @param start Virtual time indicating when the subscription was created.
	   * @param end Virtual time indicating when the subscription was disposed.
	   * @return Subscription object.
	   */
	  subscribe: function (start, end) {
	    return new Subscription(start, end);
	  }
	};

	  /**
	   * Creates a new object recording the production of the specified value at the given virtual time.
	   *
	   * @constructor
	   * @param {Number} time Virtual time the value was produced on.
	   * @param {Mixed} value Value that was produced.
	   * @param {Function} comparer An optional comparer.
	   */
	  var Recorded = Rx.Recorded = function (time, value, comparer) {
	    this.time = time;
	    this.value = value;
	    this.comparer = comparer || defaultComparer;
	  };

	  /**
	   * Checks whether the given recorded object is equal to the current instance.
	   *
	   * @param {Recorded} other Recorded object to check for equality.
	   * @returns {Boolean} true if both objects are equal; false otherwise.
	   */
	  Recorded.prototype.equals = function (other) {
	    return this.time === other.time && this.comparer(this.value, other.value);
	  };

	  /**
	   * Returns a string representation of the current Recorded value.
	   *
	   * @returns {String} String representation of the current Recorded value.
	   */
	  Recorded.prototype.toString = function () {
	    return this.value.toString() + '@' + this.time;
	  };

	  /**
	   * Creates a new subscription object with the given virtual subscription and unsubscription time.
	   *
	   * @constructor
	   * @param {Number} subscribe Virtual time at which the subscription occurred.
	   * @param {Number} unsubscribe Virtual time at which the unsubscription occurred.
	   */
	  var Subscription = Rx.Subscription = function (start, end) {
	    this.subscribe = start;
	    this.unsubscribe = end || Number.MAX_VALUE;
	  };

	  /**
	   * Checks whether the given subscription is equal to the current instance.
	   * @param other Subscription object to check for equality.
	   * @returns {Boolean} true if both objects are equal; false otherwise.
	   */
	  Subscription.prototype.equals = function (other) {
	    return this.subscribe === other.subscribe && this.unsubscribe === other.unsubscribe;
	  };

	  /**
	   * Returns a string representation of the current Subscription value.
	   * @returns {String} String representation of the current Subscription value.
	   */
	  Subscription.prototype.toString = function () {
	    return '(' + this.subscribe + ', ' + (this.unsubscribe === Number.MAX_VALUE ? 'Infinite' : this.unsubscribe) + ')';
	  };

	  var MockDisposable = Rx.MockDisposable = function (scheduler) {
	    this.scheduler = scheduler;
	    this.disposes = [];
	    this.disposes.push(this.scheduler.clock);
	  };

	  MockDisposable.prototype.dispose = function () {
	    this.disposes.push(this.scheduler.clock);
	  };

	  var MockObserver = (function (__super__) {
	    inherits(MockObserver, __super__);

	    function MockObserver(scheduler) {
	      __super__.call(this);
	      this.scheduler = scheduler;
	      this.messages = [];
	    }

	    var MockObserverPrototype = MockObserver.prototype;

	    MockObserverPrototype.onNext = function (value) {
	      this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnNext(value)));
	    };

	    MockObserverPrototype.onError = function (e) {
	      this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnError(e)));
	    };

	    MockObserverPrototype.onCompleted = function () {
	      this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnCompleted()));
	    };

	    return MockObserver;
	  })(Observer);

	  function MockPromise(scheduler, messages) {
	    var self = this;
	    this.scheduler = scheduler;
	    this.messages = messages;
	    this.subscriptions = [];
	    this.observers = [];
	    for (var i = 0, len = this.messages.length; i < len; i++) {
	      var message = this.messages[i],
	          notification = message.value;
	      (function (innerNotification) {
	        scheduler.scheduleAbsolute(null, message.time, function () {
	          var obs = self.observers.slice(0);

	          for (var j = 0, jLen = obs.length; j < jLen; j++) {
	            innerNotification.accept(obs[j]);
	          }
	          return disposableEmpty;
	        });
	      })(notification);
	    }
	  }

	  MockPromise.prototype.then = function (onResolved, onRejected) {
	    var self = this;

	    this.subscriptions.push(new Subscription(this.scheduler.clock));
	    var index = this.subscriptions.length - 1;

	    var newPromise;

	    var observer = Rx.Observer.create(
	      function (x) {
	        var retValue = onResolved(x);
	        if (retValue && typeof retValue.then === 'function') {
	          newPromise = retValue;
	        } else {
	          var ticks = self.scheduler.clock;
	          newPromise = new MockPromise(self.scheduler, [Rx.ReactiveTest.onNext(ticks, undefined), Rx.ReactiveTest.onCompleted(ticks)]);
	        }
	        var idx = self.observers.indexOf(observer);
	        self.observers.splice(idx, 1);
	        self.subscriptions[index] = new Subscription(self.subscriptions[index].subscribe, self.scheduler.clock);
	      },
	      function (err) {
	        onRejected(err);
	        var idx = self.observers.indexOf(observer);
	        self.observers.splice(idx, 1);
	        self.subscriptions[index] = new Subscription(self.subscriptions[index].subscribe, self.scheduler.clock);
	      }
	    );
	    this.observers.push(observer);

	    return newPromise || new MockPromise(this.scheduler, this.messages);
	  };

	  var HotObservable = (function (__super__) {
	    inherits(HotObservable, __super__);

	    function HotObservable(scheduler, messages) {
	      __super__.call(this);
	      var message, notification, observable = this;
	      this.scheduler = scheduler;
	      this.messages = messages;
	      this.subscriptions = [];
	      this.observers = [];
	      for (var i = 0, len = this.messages.length; i < len; i++) {
	        message = this.messages[i];
	        notification = message.value;
	        (function (innerNotification) {
	          scheduler.scheduleAbsolute(null, message.time, function () {
	            var obs = observable.observers.slice(0);

	            for (var j = 0, jLen = obs.length; j < jLen; j++) {
	              innerNotification.accept(obs[j]);
	            }
	            return disposableEmpty;
	          });
	        })(notification);
	      }
	    }

	    HotObservable.prototype._subscribe = function (o) {
	      var observable = this;
	      this.observers.push(o);
	      this.subscriptions.push(new Subscription(this.scheduler.clock));
	      var index = this.subscriptions.length - 1;
	      return disposableCreate(function () {
	        var idx = observable.observers.indexOf(o);
	        observable.observers.splice(idx, 1);
	        observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
	      });
	    };

	    return HotObservable;
	  })(Observable);

	  var ColdObservable = (function (__super__) {
	    inherits(ColdObservable, __super__);

	    function ColdObservable(scheduler, messages) {
	      __super__.call(this);
	      this.scheduler = scheduler;
	      this.messages = messages;
	      this.subscriptions = [];
	    }

	    ColdObservable.prototype._subscribe = function (o) {
	      var message, notification, observable = this;
	      this.subscriptions.push(new Subscription(this.scheduler.clock));
	      var index = this.subscriptions.length - 1;
	      var d = new CompositeDisposable();
	      for (var i = 0, len = this.messages.length; i < len; i++) {
	        message = this.messages[i];
	        notification = message.value;
	        (function (innerNotification) {
	          d.add(observable.scheduler.scheduleRelative(null, message.time, function () {
	            innerNotification.accept(o);
	            return disposableEmpty;
	          }));
	        })(notification);
	      }
	      return disposableCreate(function () {
	        observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
	        d.dispose();
	      });
	    };

	    return ColdObservable;
	  })(Observable);

	  /** Virtual time scheduler used for testing applications and libraries built using Reactive Extensions. */
	  Rx.TestScheduler = (function (__super__) {
	    inherits(TestScheduler, __super__);

	    function baseComparer(x, y) {
	      return x > y ? 1 : (x < y ? -1 : 0);
	    }

	    function TestScheduler() {
	      __super__.call(this, 0, baseComparer);
	    }

	    /**
	     * Schedules an action to be executed at the specified virtual time.
	     *
	     * @param state State passed to the action to be executed.
	     * @param dueTime Absolute virtual time at which to execute the action.
	     * @param action Action to be executed.
	     * @return Disposable object used to cancel the scheduled action (best effort).
	     */
	    TestScheduler.prototype.scheduleAbsolute = function (state, dueTime, action) {
	      dueTime <= this.clock && (dueTime = this.clock + 1);
	      return __super__.prototype.scheduleAbsolute.call(this, state, dueTime, action);
	    };
	    /**
	     * Adds a relative virtual time to an absolute virtual time value.
	     *
	     * @param absolute Absolute virtual time value.
	     * @param relative Relative virtual time value to add.
	     * @return Resulting absolute virtual time sum value.
	     */
	    TestScheduler.prototype.add = function (absolute, relative) {
	      return absolute + relative;
	    };
	    /**
	     * Converts the absolute virtual time value to a DateTimeOffset value.
	     *
	     * @param absolute Absolute virtual time value to convert.
	     * @return Corresponding DateTimeOffset value.
	     */
	    TestScheduler.prototype.toAbsoluteTime = function (absolute) {
	      return new Date(absolute).getTime();
	    };
	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     *
	     * @param timeSpan TimeSpan value to convert.
	     * @return Corresponding relative virtual time value.
	     */
	    TestScheduler.prototype.toRelativeTime = function (timeSpan) {
	      return timeSpan;
	    };
	    /**
	     * Starts the test scheduler and uses the specified virtual times to invoke the factory function, subscribe to the resulting sequence, and dispose the subscription.
	     *
	     * @param create Factory method to create an observable sequence.
	     * @param created Virtual time at which to invoke the factory to create an observable sequence.
	     * @param subscribed Virtual time at which to subscribe to the created observable sequence.
	     * @param disposed Virtual time at which to dispose the subscription.
	     * @return Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.
	     */
	    TestScheduler.prototype.startScheduler = function (createFn, settings) {
	      settings || (settings = {});
	      settings.created == null && (settings.created = ReactiveTest.created);
	      settings.subscribed == null && (settings.subscribed = ReactiveTest.subscribed);
	      settings.disposed == null && (settings.disposed = ReactiveTest.disposed);

	      var observer = this.createObserver(), source, subscription;

	      this.scheduleAbsolute(null, settings.created, function () {
	        source = createFn();
	        return disposableEmpty;
	      });

	      this.scheduleAbsolute(null, settings.subscribed, function () {
	        subscription = source.subscribe(observer);
	        return disposableEmpty;
	      });

	      this.scheduleAbsolute(null, settings.disposed, function () {
	        subscription.dispose();
	        return disposableEmpty;
	      });

	      this.start();

	      return observer;
	    };

	    /**
	     * Creates a hot observable using the specified timestamped notification messages either as an array or arguments.
	     * @param messages Notifications to surface through the created sequence at their specified absolute virtual times.
	     * @return Hot observable sequence that can be used to assert the timing of subscriptions and notifications.
	     */
	    TestScheduler.prototype.createHotObservable = function () {
	      var len = arguments.length, args;
	      if (Array.isArray(arguments[0])) {
	        args = arguments[0];
	      } else {
	        args = new Array(len);
	        for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
	      }
	      return new HotObservable(this, args);
	    };

	    /**
	     * Creates a cold observable using the specified timestamped notification messages either as an array or arguments.
	     * @param messages Notifications to surface through the created sequence at their specified virtual time offsets from the sequence subscription time.
	     * @return Cold observable sequence that can be used to assert the timing of subscriptions and notifications.
	     */
	    TestScheduler.prototype.createColdObservable = function () {
	      var len = arguments.length, args;
	      if (Array.isArray(arguments[0])) {
	        args = arguments[0];
	      } else {
	        args = new Array(len);
	        for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
	      }
	      return new ColdObservable(this, args);
	    };

	    /**
	     * Creates a resolved promise with the given value and ticks
	     * @param {Number} ticks The absolute time of the resolution.
	     * @param {Any} value The value to yield at the given tick.
	     * @returns {MockPromise} A mock Promise which fulfills with the given value.
	     */
	    TestScheduler.prototype.createResolvedPromise = function (ticks, value) {
	      return new MockPromise(this, [Rx.ReactiveTest.onNext(ticks, value), Rx.ReactiveTest.onCompleted(ticks)]);
	    };

	    /**
	     * Creates a rejected promise with the given reason and ticks
	     * @param {Number} ticks The absolute time of the resolution.
	     * @param {Any} reason The reason for rejection to yield at the given tick.
	     * @returns {MockPromise} A mock Promise which rejects with the given reason.
	     */
	    TestScheduler.prototype.createRejectedPromise = function (ticks, reason) {
	      return new MockPromise(this, [Rx.ReactiveTest.onError(ticks, reason)]);
	    };

	    /**
	     * Creates an observer that records received notification messages and timestamps those.
	     * @return Observer that can be used to assert the timing of received notifications.
	     */
	    TestScheduler.prototype.createObserver = function () {
	      return new MockObserver(this);
	    };

	    return TestScheduler;
	  })(VirtualTimeScheduler);

	  var AnonymousObservable = Rx.AnonymousObservable = (function (__super__) {
	    inherits(AnonymousObservable, __super__);

	    // Fix subscriber to check for undefined or function returned to decorate as Disposable
	    function fixSubscriber(subscriber) {
	      return subscriber && isFunction(subscriber.dispose) ? subscriber :
	        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
	    }

	    function setDisposable(s, state) {
	      var ado = state[0], self = state[1];
	      var sub = tryCatch(self.__subscribe).call(self, ado);
	      if (sub === errorObj && !ado.fail(errorObj.e)) { thrower(errorObj.e); }
	      ado.setDisposable(fixSubscriber(sub));
	    }

	    function AnonymousObservable(subscribe, parent) {
	      this.source = parent;
	      this.__subscribe = subscribe;
	      __super__.call(this);
	    }

	    AnonymousObservable.prototype._subscribe = function (o) {
	      var ado = new AutoDetachObserver(o), state = [ado, this];

	      if (currentThreadScheduler.scheduleRequired()) {
	        currentThreadScheduler.schedule(state, setDisposable);
	      } else {
	        setDisposable(null, state);
	      }
	      return ado;
	    };

	    return AnonymousObservable;

	  }(Observable));

	  var AutoDetachObserver = (function (__super__) {
	    inherits(AutoDetachObserver, __super__);

	    function AutoDetachObserver(observer) {
	      __super__.call(this);
	      this.observer = observer;
	      this.m = new SingleAssignmentDisposable();
	    }

	    var AutoDetachObserverPrototype = AutoDetachObserver.prototype;

	    AutoDetachObserverPrototype.next = function (value) {
	      var result = tryCatch(this.observer.onNext).call(this.observer, value);
	      if (result === errorObj) {
	        this.dispose();
	        thrower(result.e);
	      }
	    };

	    AutoDetachObserverPrototype.error = function (err) {
	      var result = tryCatch(this.observer.onError).call(this.observer, err);
	      this.dispose();
	      result === errorObj && thrower(result.e);
	    };

	    AutoDetachObserverPrototype.completed = function () {
	      var result = tryCatch(this.observer.onCompleted).call(this.observer);
	      this.dispose();
	      result === errorObj && thrower(result.e);
	    };

	    AutoDetachObserverPrototype.setDisposable = function (value) { this.m.setDisposable(value); };
	    AutoDetachObserverPrototype.getDisposable = function () { return this.m.getDisposable(); };

	    AutoDetachObserverPrototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this.m.dispose();
	    };

	    return AutoDetachObserver;
	  }(AbstractObserver));

	  var UnderlyingObservable = (function (__super__) {
	    inherits(UnderlyingObservable, __super__);
	    function UnderlyingObservable(m, u) {
	      this._m = m;
	      this._u = u;
	      __super__.call(this);
	    }

	    UnderlyingObservable.prototype.subscribeCore = function (o) {
	      return new BinaryDisposable(this._m.getDisposable(), this._u.subscribe(o));
	    };

	    return UnderlyingObservable;
	  }(ObservableBase));

	  var GroupedObservable = (function (__super__) {
	    inherits(GroupedObservable, __super__);
	    function GroupedObservable(key, underlyingObservable, mergedDisposable) {
	      __super__.call(this);
	      this.key = key;
	      this.underlyingObservable = !mergedDisposable ?
	        underlyingObservable :
	        new UnderlyingObservable(mergedDisposable, underlyingObservable);
	    }

	    GroupedObservable.prototype._subscribe = function (o) {
	      return this.underlyingObservable.subscribe(o);
	    };

	    return GroupedObservable;
	  }(Observable));

	  /**
	   *  Represents an object that is both an observable sequence as well as an observer.
	   *  Each notification is broadcasted to all subscribed observers.
	   */
	  var Subject = Rx.Subject = (function (__super__) {
	    inherits(Subject, __super__);
	    function Subject() {
	      __super__.call(this);
	      this.isDisposed = false;
	      this.isStopped = false;
	      this.observers = [];
	      this.hasError = false;
	    }

	    addProperties(Subject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.observers.push(o);
	          return new InnerSubscription(this, o);
	        }
	        if (this.hasError) {
	          o.onError(this.error);
	          return disposableEmpty;
	        }
	        o.onCompleted();
	        return disposableEmpty;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () { return this.observers.length > 0; },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onCompleted();
	          }

	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.error = error;
	          this.hasError = true;
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onError(error);
	          }

	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onNext(value);
	          }
	        }
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	      }
	    });

	    /**
	     * Creates a subject from the specified observer and observable.
	     * @param {Observer} observer The observer used to send messages to the subject.
	     * @param {Observable} observable The observable used to subscribe to messages sent from the subject.
	     * @returns {Subject} Subject implemented using the given observer and observable.
	     */
	    Subject.create = function (observer, observable) {
	      return new AnonymousSubject(observer, observable);
	    };

	    return Subject;
	  }(Observable));

	  /**
	   *  Represents the result of an asynchronous operation.
	   *  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.
	   */
	  var AsyncSubject = Rx.AsyncSubject = (function (__super__) {
	    inherits(AsyncSubject, __super__);

	    /**
	     * Creates a subject that can only receive one value and that value is cached for all future observations.
	     * @constructor
	     */
	    function AsyncSubject() {
	      __super__.call(this);
	      this.isDisposed = false;
	      this.isStopped = false;
	      this.hasValue = false;
	      this.observers = [];
	      this.hasError = false;
	    }

	    addProperties(AsyncSubject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        checkDisposed(this);

	        if (!this.isStopped) {
	          this.observers.push(o);
	          return new InnerSubscription(this, o);
	        }

	        if (this.hasError) {
	          o.onError(this.error);
	        } else if (this.hasValue) {
	          o.onNext(this.value);
	          o.onCompleted();
	        } else {
	          o.onCompleted();
	        }

	        return disposableEmpty;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () {
	        checkDisposed(this);
	        return this.observers.length > 0;
	      },
	      /**
	       * Notifies all subscribed observers about the end of the sequence, also causing the last received value to be sent out (if any).
	       */
	      onCompleted: function () {
	        var i, len;
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          var os = cloneArray(this.observers), len = os.length;

	          if (this.hasValue) {
	            for (i = 0; i < len; i++) {
	              var o = os[i];
	              o.onNext(this.value);
	              o.onCompleted();
	            }
	          } else {
	            for (i = 0; i < len; i++) {
	              os[i].onCompleted();
	            }
	          }

	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the error.
	       * @param {Mixed} error The Error to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.hasError = true;
	          this.error = error;

	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onError(error);
	          }

	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Sends a value to the subject. The last value received before successful termination will be sent to all subscribed and future observers.
	       * @param {Mixed} value The value to store in the subject.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.value = value;
	        this.hasValue = true;
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	        this.error = null;
	        this.value = null;
	      }
	    });

	    return AsyncSubject;
	  }(Observable));

	  /**
	   *  Represents a value that changes over time.
	   *  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.
	   */
	  var BehaviorSubject = Rx.BehaviorSubject = (function (__super__) {
	    inherits(BehaviorSubject, __super__);
	    function BehaviorSubject(value) {
	      __super__.call(this);
	      this.value = value;
	      this.observers = [];
	      this.isDisposed = false;
	      this.isStopped = false;
	      this.hasError = false;
	    }

	    addProperties(BehaviorSubject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.observers.push(o);
	          o.onNext(this.value);
	          return new InnerSubscription(this, o);
	        }
	        if (this.hasError) {
	          o.onError(this.error);
	        } else {
	          o.onCompleted();
	        }
	        return disposableEmpty;
	      },
	      /**
	       * Gets the current value or throws an exception.
	       * Value is frozen after onCompleted is called.
	       * After onError is called always throws the specified exception.
	       * An exception is always thrown after dispose is called.
	       * @returns {Mixed} The initial value passed to the constructor until onNext is called; after which, the last value passed to onNext.
	       */
	      getValue: function () {
	        checkDisposed(this);
	        if (this.hasError) { thrower(this.error); }
	        return this.value;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () { return this.observers.length > 0; },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onCompleted();
	        }

	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        this.hasError = true;
	        this.error = error;

	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onError(error);
	        }

	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.value = value;
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onNext(value);
	        }
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	        this.value = null;
	        this.error = null;
	      }
	    });

	    return BehaviorSubject;
	  }(Observable));

	  /**
	   * Represents an object that is both an observable sequence as well as an observer.
	   * Each notification is broadcasted to all subscribed and future observers, subject to buffer trimming policies.
	   */
	  var ReplaySubject = Rx.ReplaySubject = (function (__super__) {

	    var maxSafeInteger = Math.pow(2, 53) - 1;

	    function createRemovableDisposable(subject, observer) {
	      return disposableCreate(function () {
	        observer.dispose();
	        !subject.isDisposed && subject.observers.splice(subject.observers.indexOf(observer), 1);
	      });
	    }

	    inherits(ReplaySubject, __super__);

	    /**
	     *  Initializes a new instance of the ReplaySubject class with the specified buffer size, window size and scheduler.
	     *  @param {Number} [bufferSize] Maximum element count of the replay buffer.
	     *  @param {Number} [windowSize] Maximum time length of the replay buffer.
	     *  @param {Scheduler} [scheduler] Scheduler the observers are invoked on.
	     */
	    function ReplaySubject(bufferSize, windowSize, scheduler) {
	      this.bufferSize = bufferSize == null ? maxSafeInteger : bufferSize;
	      this.windowSize = windowSize == null ? maxSafeInteger : windowSize;
	      this.scheduler = scheduler || currentThreadScheduler;
	      this.q = [];
	      this.observers = [];
	      this.isStopped = false;
	      this.isDisposed = false;
	      this.hasError = false;
	      this.error = null;
	      __super__.call(this);
	    }

	    addProperties(ReplaySubject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        checkDisposed(this);
	        var so = new ScheduledObserver(this.scheduler, o), subscription = createRemovableDisposable(this, so);

	        this._trim(this.scheduler.now());
	        this.observers.push(so);

	        for (var i = 0, len = this.q.length; i < len; i++) {
	          so.onNext(this.q[i].value);
	        }

	        if (this.hasError) {
	          so.onError(this.error);
	        } else if (this.isStopped) {
	          so.onCompleted();
	        }

	        so.ensureActive();
	        return subscription;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () {
	        return this.observers.length > 0;
	      },
	      _trim: function (now) {
	        while (this.q.length > this.bufferSize) {
	          this.q.shift();
	        }
	        while (this.q.length > 0 && (now - this.q[0].interval) > this.windowSize) {
	          this.q.shift();
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        var now = this.scheduler.now();
	        this.q.push({ interval: now, value: value });
	        this._trim(now);

	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onNext(value);
	          observer.ensureActive();
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        this.error = error;
	        this.hasError = true;
	        var now = this.scheduler.now();
	        this._trim(now);
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onError(error);
	          observer.ensureActive();
	        }
	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        var now = this.scheduler.now();
	        this._trim(now);
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onCompleted();
	          observer.ensureActive();
	        }
	        this.observers.length = 0;
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	      }
	    });

	    return ReplaySubject;
	  }(Observable));

	  var AnonymousSubject = Rx.AnonymousSubject = (function (__super__) {
	    inherits(AnonymousSubject, __super__);
	    function AnonymousSubject(observer, observable) {
	      this.observer = observer;
	      this.observable = observable;
	      __super__.call(this);
	    }

	    addProperties(AnonymousSubject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        return this.observable.subscribe(o);
	      },
	      onCompleted: function () {
	        this.observer.onCompleted();
	      },
	      onError: function (error) {
	        this.observer.onError(error);
	      },
	      onNext: function (value) {
	        this.observer.onNext(value);
	      }
	    });

	    return AnonymousSubject;
	  }(Observable));

	  /**
	  * Used to pause and resume streams.
	  */
	  Rx.Pauser = (function (__super__) {
	    inherits(Pauser, __super__);
	    function Pauser() {
	      __super__.call(this);
	    }

	    /**
	     * Pauses the underlying sequence.
	     */
	    Pauser.prototype.pause = function () { this.onNext(false); };

	    /**
	    * Resumes the underlying sequence.
	    */
	    Pauser.prototype.resume = function () { this.onNext(true); };

	    return Pauser;
	  }(Subject));

	  if (true) {
	    root.Rx = Rx;

	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return Rx;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (freeExports && freeModule) {
	    // in Node.js or RingoJS
	    if (moduleExports) {
	      (freeModule.exports = Rx).Rx = Rx;
	    } else {
	      freeExports.Rx = Rx;
	    }
	  } else {
	    // in a browser or Rhino
	    root.Rx = Rx;
	  }

	  // All code before this point will be filtered from stack traces.
	  var rEndingLine = captureLine();

	}.call(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module), (function() { return this; }()), __webpack_require__(3)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["wx"] = factory();
		else
			root["wx"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		function __export(m) {
		    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
		}
		// WebRx Complete API-Surface
		var App_1 = __webpack_require__(1);
		exports.app = App_1.app;
		exports.router = App_1.router;
		exports.messageBus = App_1.messageBus;
		var Module_1 = __webpack_require__(9);
		exports.module = Module_1.module;
		__export(__webpack_require__(3));
		var Property_1 = __webpack_require__(8);
		exports.property = Property_1.property;
		var DomManager_1 = __webpack_require__(11);
		exports.applyBindings = DomManager_1.applyBindings;
		exports.cleanNode = DomManager_1.cleanNode;
		var Command_1 = __webpack_require__(25);
		exports.command = Command_1.command;
		exports.asyncCommand = Command_1.asyncCommand;
		exports.isCommand = Command_1.isCommand;
		var Animation_1 = __webpack_require__(54);
		exports.animation = Animation_1.animation;
		var Oid_1 = __webpack_require__(13);
		exports.getOid = Oid_1.getOid;
		var List_1 = __webpack_require__(18);
		exports.list = List_1.list;
		var ListSupport_1 = __webpack_require__(17);
		exports.isList = ListSupport_1.isList;
		var Map_1 = __webpack_require__(15);
		exports.createMap = Map_1.createMap;
		var Set_1 = __webpack_require__(14);
		exports.createSet = Set_1.createSet;
		exports.setToArray = Set_1.setToArray;
		var WeakMap_1 = __webpack_require__(12);
		exports.createWeakMap = WeakMap_1.createWeakMap;
		var Lazy_1 = __webpack_require__(19);
		exports.Lazy = Lazy_1.default;
		var VirtualChildNodes_1 = __webpack_require__(32);
		exports.VirtualChildNodes = VirtualChildNodes_1.default;
		var RouteMatcher_1 = __webpack_require__(49);
		exports.route = RouteMatcher_1.route;
		var Value_1 = __webpack_require__(34);
		exports.getNodeValue = Value_1.getNodeValue;
		exports.setNodeValue = Value_1.setNodeValue;
		var Injector_1 = __webpack_require__(2);
		exports.injector = Injector_1.injector;
		var IID_1 = __webpack_require__(5);
		exports.IID = IID_1.default;
		var HttpClient_1 = __webpack_require__(51);
		exports.getHttpClientDefaultConfig = HttpClient_1.getHttpClientDefaultConfig;
		var BindingBase_1 = __webpack_require__(29);
		exports.SingleOneWayBindingBase = BindingBase_1.SingleOneWayBindingBase;
		exports.MultiOneWayBindingBase = BindingBase_1.MultiOneWayBindingBase;
		// re-exports
		var res = __webpack_require__(6);
		exports.res = res;
		var env = __webpack_require__(16);
		exports.env = env;
		//# sourceMappingURL=WebRx.js.map

	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="./Interfaces.ts" />
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var Injector_1 = __webpack_require__(2);
		var Utils_1 = __webpack_require__(3);
		var res = __webpack_require__(6);
		var log = __webpack_require__(7);
		var Property_1 = __webpack_require__(8);
		var Module_1 = __webpack_require__(9);
		var ExpressionCompiler = __webpack_require__(10);
		var DomManager_1 = __webpack_require__(11);
		var HtmlTemplateEngine_1 = __webpack_require__(23);
		var Command_1 = __webpack_require__(24);
		var Module_2 = __webpack_require__(26);
		var If_1 = __webpack_require__(27);
		var MultiOneWay_1 = __webpack_require__(28);
		var SingleOneWay_1 = __webpack_require__(30);
		var ForEach_1 = __webpack_require__(31);
		var Event_1 = __webpack_require__(33);
		var Value_1 = __webpack_require__(34);
		var HasFocus_1 = __webpack_require__(35);
		var With_1 = __webpack_require__(37);
		var Checked_1 = __webpack_require__(38);
		var KeyPress_1 = __webpack_require__(39);
		var TextInput_1 = __webpack_require__(40);
		var SelectedValue_1 = __webpack_require__(41);
		var Component_1 = __webpack_require__(42);
		var StateActive_1 = __webpack_require__(43);
		var View_1 = __webpack_require__(44);
		var StateRef_1 = __webpack_require__(45);
		var Select_1 = __webpack_require__(46);
		var RadioGroup_1 = __webpack_require__(47);
		var Router_1 = __webpack_require__(48);
		var MessageBus_1 = __webpack_require__(50);
		var HttpClient_1 = __webpack_require__(51);
		var Version_1 = __webpack_require__(52);
		// make sure RxExtensions get installed
		var RxExtensions_1 = __webpack_require__(53);
		RxExtensions_1.install();
		"use strict";
		var App = (function (_super) {
		    __extends(App, _super);
		    function App() {
		        _super.call(this, "app");
		        /// <summary>
		        /// This Observer is signalled whenever an object that has a
		        /// ThrownExceptions property doesn't Subscribe to that Observable. Use
		        /// Observer.create to set up what will happen.
		        /// </summary>
		        this.defaultExceptionHandler = Rx.Observer.create(function (ex) {
		        });
		        this.title = Property_1.property(document.title);
		        this.version = Version_1.version;
		        if (!Utils_1.isInUnitTest()) {
		            this.history = this.createHistory();
		        }
		        else {
		            this.history = window["createMockHistory"]();
		        }
		    }
		    Object.defineProperty(App.prototype, "mainThreadScheduler", {
		        /// <summary>
		        /// MainThreadScheduler is the scheduler used to schedule work items that
		        /// should be run "on the UI thread". In normal mode, this will be
		        /// DispatcherScheduler, and in Unit Test mode this will be Immediate,
		        /// to simplify writing common unit tests.
		        /// </summary>
		        get: function () {
		            return this._unitTestMainThreadScheduler || this._mainThreadScheduler
		                || Rx.Scheduler.currentThread; // OW: return a default if schedulers haven't been setup by in
		        },
		        set: function (value) {
		            if (Utils_1.isInUnitTest()) {
		                this._unitTestMainThreadScheduler = value;
		                this._mainThreadScheduler = this._mainThreadScheduler || value;
		            }
		            else {
		                this._mainThreadScheduler = value;
		            }
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(App.prototype, "templateEngine", {
		        get: function () {
		            if (!this._templateEngine) {
		                this._templateEngine = Injector_1.injector.get(res.templateEngine);
		            }
		            return this._templateEngine;
		        },
		        set: function (newVal) {
		            this._templateEngine = newVal;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(App.prototype, "router", {
		        get: function () {
		            if (!this._router) {
		                this._router = Injector_1.injector.get(res.router);
		            }
		            return this._router;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    App.prototype.devModeEnable = function () {
		        // configure logging
		        log.hintEnable = true;
		        // wire exception logging
		        this.defaultExceptionHandler = Rx.Observer.create(function (ex) {
		            log.error("An onError occurred on an object (usually a computedProperty) that would break a binding or command. To prevent this, subscribe to the thrownExceptions property of your objects: {0}", ex);
		        });
		    };
		    App.prototype.createHistory = function () {
		        // inherit default implementation
		        var result = {
		            back: window.history.back.bind(window.history),
		            forward: window.history.forward.bind(window.history),
		            //go: window.history.go,
		            pushState: window.history.pushState.bind(window.history),
		            replaceState: window.history.replaceState.bind(window.history),
		            getSearchParameters: function (query) {
		                query = query || result.location.search.substr(1);
		                if (query) {
		                    var result_1 = {};
		                    var params = query.split("&");
		                    for (var i = 0; i < params.length; i++) {
		                        var tmp = params[i].split("=");
		                        result_1[tmp[0]] = decodeURIComponent(tmp[1]);
		                    }
		                    return result_1;
		                }
		                return {};
		            }
		        };
		        Object.defineProperty(result, "length", {
		            get: function () {
		                return window.history.length;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Object.defineProperty(result, "state", {
		            get: function () {
		                return window.history.state;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Object.defineProperty(result, "location", {
		            get: function () {
		                return window.location;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        // enrich with observable
		        result.onPopState = Rx.Observable.fromEventPattern(function (h) { return window.addEventListener("popstate", h); }, function (h) { return window.removeEventListener("popstate", h); })
		            .publish()
		            .refCount();
		        return result;
		    };
		    App.prototype.register = function () {
		        Injector_1.injector.register(res.app, this) // register with injector
		            .register(res.expressionCompiler, ExpressionCompiler)
		            .register(res.templateEngine, [HtmlTemplateEngine_1.default], true)
		            .register(res.domManager, [res.expressionCompiler, res.app, DomManager_1.DomManager], true)
		            .register(res.router, [res.domManager, res.app, Router_1.Router], true)
		            .register(res.messageBus, [MessageBus_1.default], true)
		            .register(res.httpClient, [HttpClient_1.default], false);
		        Injector_1.injector.register("bindings.module", [res.domManager, res.app, Module_2.default], true)
		            .register("bindings.command", [res.domManager, res.app, Command_1.default], true)
		            .register("bindings.if", [res.domManager, res.app, If_1.IfBinding], true)
		            .register("bindings.with", [res.domManager, res.app, With_1.default], true)
		            .register("bindings.notif", [res.domManager, res.app, If_1.NotIfBinding], true)
		            .register("bindings.css", [res.domManager, res.app, MultiOneWay_1.CssBinding], true)
		            .register("bindings.attr", [res.domManager, res.app, MultiOneWay_1.AttrBinding], true)
		            .register("bindings.style", [res.domManager, res.app, MultiOneWay_1.StyleBinding], true)
		            .register("bindings.text", [res.domManager, res.app, SingleOneWay_1.TextBinding], true)
		            .register("bindings.html", [res.domManager, res.app, SingleOneWay_1.HtmlBinding], true)
		            .register("bindings.visible", [res.domManager, res.app, SingleOneWay_1.VisibleBinding], true)
		            .register("bindings.hidden", [res.domManager, res.app, SingleOneWay_1.HiddenBinding], true)
		            .register("bindings.enabled", [res.domManager, res.app, SingleOneWay_1.EnableBinding], true)
		            .register("bindings.disabled", [res.domManager, res.app, SingleOneWay_1.DisableBinding], true)
		            .register("bindings.foreach", [res.domManager, res.app, ForEach_1.default], true)
		            .register("bindings.event", [res.domManager, res.app, Event_1.default], true)
		            .register("bindings.keyPress", [res.domManager, res.app, KeyPress_1.default], true)
		            .register("bindings.textInput", [res.domManager, res.app, TextInput_1.default], true)
		            .register("bindings.checked", [res.domManager, res.app, Checked_1.default], true)
		            .register("bindings.selectedValue", [res.domManager, res.app, SelectedValue_1.default], true)
		            .register("bindings.component", [res.domManager, res.app, Component_1.default], true)
		            .register("bindings.value", [res.domManager, res.app, Value_1.default], true)
		            .register("bindings.hasFocus", [res.domManager, res.app, HasFocus_1.default], true)
		            .register("bindings.view", [res.domManager, res.router, res.app, View_1.default], true)
		            .register("bindings.sref", [res.domManager, res.router, res.app, StateRef_1.default], true)
		            .register("bindings.sactive", [res.domManager, res.router, res.app, StateActive_1.default], true);
		        Injector_1.injector.register("components.radiogroup", [res.templateEngine, RadioGroup_1.default])
		            .register("components.select", [res.templateEngine, Select_1.default]);
		        // initialize module
		        this.binding("module", "bindings.module")
		            .binding("css", "bindings.css")
		            .binding("attr", "bindings.attr")
		            .binding("style", "bindings.style")
		            .binding("command", "bindings.command")
		            .binding("if", "bindings.if")
		            .binding("with", "bindings.with")
		            .binding("ifnot", "bindings.notif")
		            .binding("text", "bindings.text")
		            .binding("html", "bindings.html")
		            .binding("visible", "bindings.visible")
		            .binding("hidden", "bindings.hidden")
		            .binding("disabled", "bindings.disabled")
		            .binding("enabled", "bindings.enabled")
		            .binding("foreach", "bindings.foreach")
		            .binding("event", "bindings.event")
		            .binding(["keyPress", "keypress"], "bindings.keyPress")
		            .binding(["textInput", "textinput"], "bindings.textInput")
		            .binding("checked", "bindings.checked")
		            .binding("selectedValue", "bindings.selectedValue")
		            .binding("component", "bindings.component")
		            .binding("value", "bindings.value")
		            .binding(["hasFocus", "hasfocus"], "bindings.hasFocus")
		            .binding("view", "bindings.view")
		            .binding(["sref", "stateRef", "stateref"], "bindings.sref")
		            .binding(["sactive", "stateActive", "stateactive"], "bindings.sactive");
		        this.component("wx-radiogroup", { resolve: "components.radiogroup" })
		            .component("wx-select", { resolve: "components.select" });
		        // register with module-registry
		        Module_1.modules["app"] = { instance: this };
		    };
		    return App;
		})(Module_1.Module);
		var _app = new App();
		exports.app = _app;
		_app.register();
		exports.router = Injector_1.injector.get(res.router);
		exports.messageBus = Injector_1.injector.get(res.messageBus);
		//# sourceMappingURL=App.js.map

	/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		var res = __webpack_require__(6);
		"use strict";
		/**
		* Simple IoC & Service Locator
		*/
		var Injector = (function () {
		    function Injector() {
		        //////////////////////////////////
		        // Implementation
		        this.registrations = {};
		    }
		    Injector.prototype.register = function () {
		        var key = arguments[0];
		        var val = arguments[1];
		        var isSingleton = arguments[2];
		        var factory;
		        if (this.registrations.hasOwnProperty(key))
		            Utils_1.throwError("'{0}' is already registered", key);
		        if (Utils_1.isFunction(val)) {
		            // second overload
		            // it's a factory function
		            factory = function (args, deps) { return val.apply(null, args); };
		        }
		        else if (Array.isArray(val)) {
		            // first overload
		            // array assumed to be inline array notation with constructor
		            var self_1 = this;
		            var ctor = val.pop();
		            var dependencies = val;
		            factory = function (args, deps) {
		                // resolve dependencies
		                var resolved = dependencies.map(function (x) {
		                    try {
		                        return self_1.get(x, undefined, deps);
		                    }
		                    catch (e) {
		                        Utils_1.throwError("Error resolving dependency '{0}' for '{1}': {2}", x, key, e);
		                    }
		                });
		                // invoke constructor
		                var _args = [null].concat(resolved).concat(args);
		                var ctorFunc = ctor.bind.apply(ctor, _args);
		                return new ctorFunc();
		            };
		        }
		        else {
		            // third overload
		            // singleton
		            factory = function (args, deps) { return val; };
		        }
		        this.registrations[key] = { factory: factory, isSingleton: isSingleton };
		        return this;
		    };
		    Injector.prototype.get = function (key, args, deps) {
		        deps = deps || {};
		        if (deps.hasOwnProperty(key))
		            Utils_1.throwError("Detected circular dependency a from '{0}' to '{1}'", Object.keys(deps).join(", "), key);
		        // registered?
		        var registration = this.registrations[key];
		        if (registration === undefined)
		            Utils_1.throwError("'{0}' is not registered", key);
		        // already instantiated?
		        if (registration.isSingleton && registration.value)
		            return registration.value;
		        // append current key
		        var newDeps = {};
		        newDeps[key] = true;
		        Utils_1.extend(deps, newDeps);
		        // create it
		        var result = registration.factory(args, newDeps);
		        // cache if singleton
		        if (registration.isSingleton)
		            registration.value = result;
		        return result;
		    };
		    Injector.prototype.resolve = function (iaa, args) {
		        var ctor = iaa.pop();
		        if (!Utils_1.isFunction(ctor))
		            Utils_1.throwError("Error resolving inline-annotated-array. Constructor must be of type 'function' but is '{0}", typeof ctor);
		        var self = this;
		        // resolve dependencies
		        var resolved = iaa.map(function (x) {
		            try {
		                return self.get(x, undefined, iaa);
		            }
		            catch (e) {
		                Utils_1.throwError("Error resolving dependency '{0}' for '{1}': {2}", x, Object.getPrototypeOf(ctor), e);
		            }
		        });
		        // invoke constructor
		        var _args = [null].concat(resolved).concat(args);
		        var ctorFunc = ctor.bind.apply(ctor, _args);
		        return new ctorFunc();
		    };
		    return Injector;
		})();
		exports.injector = new Injector();
		exports.injector.register(res.injector, function () { return new Injector(); });
		//# sourceMappingURL=Injector.js.map

	/***/ },
	/* 3 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Events_1 = __webpack_require__(4);
		var IID_1 = __webpack_require__(5);
		/*
		* Global helpers
		*/
		"use strict";
		var regexCssClassName = /\S+/g;
		var RxObsConstructor = Rx.Observable; // the cast is neccessary because the rx.js.d.ts declares Observable as an interface
		exports.noop = function () { };
		/**
		* Returns true if a ECMAScript5 strict-mode is active
		*/
		function isStrictMode() {
		    return typeof this === "undefined";
		}
		exports.isStrictMode = isStrictMode;
		/**
		* Returns true if target is a javascript primitive
		*/
		function isPrimitive(target) {
		    var t = typeof target;
		    return t === "boolean" || t === "number" || t === "string";
		}
		exports.isPrimitive = isPrimitive;
		/**
		* Tests if the target supports the interface
		* @param {any} target
		* @param {string} iid
		*/
		function queryInterface(target, iid) {
		    if (target == null || isPrimitive(target))
		        return false;
		    var unk = target;
		    if (!isFunction(unk.queryInterface))
		        return false;
		    return unk.queryInterface(iid);
		}
		exports.queryInterface = queryInterface;
		/**
		* Returns all own properties of target implementing interface iid
		* @param {any} target
		* @param {string} iid
		*/
		function getOwnPropertiesImplementingInterface(target, iid) {
		    return Object.keys(target).filter(function (propertyName) {
		        // lookup object for name
		        var o = target[propertyName];
		        // is it an ObservableProperty?
		        return queryInterface(o, iid);
		    }).map(function (x) { return new PropertyInfo(x, target[x]); });
		}
		exports.getOwnPropertiesImplementingInterface = getOwnPropertiesImplementingInterface;
		/**
		* Disposes all disposable members of an object
		* @param {any} target
		*/
		function disposeMembers(target) {
		    Object.keys(target).filter(function (propertyName) {
		        var disp = target[propertyName];
		        return disp != null && isFunction(disp.dispose);
		    })
		        .map(function (propertyName) { return target[propertyName]; })
		        .forEach(function (disp) { return disp.dispose(); });
		}
		exports.disposeMembers = disposeMembers;
		/**
		* Determines if target is an instance of a IObservableProperty
		* @param {any} target
		*/
		function isProperty(target) {
		    if (target == null)
		        return false;
		    return queryInterface(target, IID_1.default.IObservableProperty);
		}
		exports.isProperty = isProperty;
		/**
		* Determines if target is an instance of a Rx.Scheduler
		* @param {any} target
		*/
		function isRxScheduler(target) {
		    if (target == null)
		        return false;
		    return Rx.Scheduler.isScheduler(target);
		}
		exports.isRxScheduler = isRxScheduler;
		/**
		* Determines if target is an instance of a Rx.Observable
		* @param {any} target
		*/
		function isRxObservable(target) {
		    if (target == null)
		        return false;
		    return target instanceof RxObsConstructor;
		}
		exports.isRxObservable = isRxObservable;
		/**
		* Determines if target is an instance of a promise
		* @param {any} target
		*/
		function isPromise(target) {
		    if (target == null)
		        return false;
		    return Rx.helpers.isPromise(target);
		}
		exports.isPromise = isPromise;
		/**
		* If the prop is an observable property return its value
		* @param {any} prop
		*/
		function unwrapProperty(prop) {
		    if (isProperty(prop))
		        return prop();
		    return prop;
		}
		exports.unwrapProperty = unwrapProperty;
		function getObservable(o) {
		    if (isProperty(o)) {
		        var prop = o;
		        return prop.changed.startWith(prop());
		    }
		    if (isRxObservable(o))
		        return o;
		    throwError("getObservable: '" + o + "' is neither observable property nor observable");
		}
		exports.getObservable = getObservable;
		/**
		* Returns true if a Unit-Testing environment is detected
		*/
		function isInUnitTest() {
		    // detect jasmine 1.x
		    if (window && window["jasmine"] && window["jasmine"].version_ !== undefined) {
		        return true;
		    }
		    // detect jasmine 2.x
		    if (window && window["getJasmineRequireObj"] && typeof window["getJasmineRequireObj"] === "function") {
		        return true;
		    }
		    return false;
		}
		exports.isInUnitTest = isInUnitTest;
		/**
		* Transforms the current method's arguments into an array
		*/
		function args2Array(args) {
		    var result = [];
		    for (var i = 0, len = args.length; i < len; i++) {
		        result.push(args[i]);
		    }
		    return result;
		}
		exports.args2Array = args2Array;
		/**
		* Formats a string using .net style format string
		* @param {string} fmt The format string
		* @param {any[]} ...args Format arguments
		*/
		function formatString(fmt) {
		    var args = [];
		    for (var _i = 1; _i < arguments.length; _i++) {
		        args[_i - 1] = arguments[_i];
		    }
		    var pattern = /\{\d+\}/g;
		    return fmt.replace(pattern, function (capture) {
		        return args[capture.match(/\d+/)];
		    });
		}
		exports.formatString = formatString;
		/**
		* Copies own properties from src to dst
		*/
		function extend(src, dst, inherited) {
		    var prop;
		    if (!inherited) {
		        var ownProps = Object.getOwnPropertyNames(src);
		        for (var i = 0; i < ownProps.length; i++) {
		            prop = ownProps[i];
		            dst[prop] = src[prop];
		        }
		    }
		    else {
		        for (prop in src) {
		            dst[prop] = src[prop];
		        }
		    }
		    return dst;
		}
		exports.extend = extend;
		var PropertyInfo = (function () {
		    function PropertyInfo(propertyName, property) {
		        this.property = property;
		        this.propertyName = propertyName;
		    }
		    return PropertyInfo;
		})();
		exports.PropertyInfo = PropertyInfo;
		/**
		* Toggles one ore more css classes on the specified DOM element
		* @param {Node} node The target element
		* @param {boolean} shouldHaveClass True if the classes should be added to the element, false if they should be removed
		* @param {string[]} classNames The list of classes to process
		*/
		function toggleCssClass(node, shouldHaveClass) {
		    var classNames = [];
		    for (var _i = 2; _i < arguments.length; _i++) {
		        classNames[_i - 2] = arguments[_i];
		    }
		    if (classNames) {
		        var currentClassNames = node.className.match(regexCssClassName) || [];
		        var index;
		        var className;
		        if (shouldHaveClass) {
		            for (var i = 0; i < classNames.length; i++) {
		                className = classNames[i];
		                index = currentClassNames.indexOf(className);
		                if (index === -1)
		                    currentClassNames.push(className);
		            }
		        }
		        else {
		            for (var i = 0; i < classNames.length; i++) {
		                className = classNames[i];
		                index = currentClassNames.indexOf(className);
		                if (index !== -1)
		                    currentClassNames.splice(index, 1);
		            }
		        }
		        node.className = currentClassNames.join(" ");
		    }
		}
		exports.toggleCssClass = toggleCssClass;
		/**
		* Determines if the specified DOM element has the specified CSS-Class
		* @param {Node} node The target element
		* @param {string} className The classe to check
		*/
		function hasCssClass(node, className) {
		    var currentClassNames = node.className.match(regexCssClassName) || [];
		    return currentClassNames.indexOf(className) !== -1;
		}
		exports.hasCssClass = hasCssClass;
		/**
		 * Trigger a reflow on the target element
		 * @param {HTMLElement} el
		 */
		function triggerReflow(el) {
		    el.getBoundingClientRect();
		}
		exports.triggerReflow = triggerReflow;
		/**
		 * Returns true if the specified element may be disabled
		 * @param {HTMLElement} el
		 */
		function elementCanBeDisabled(el) {
		    return el instanceof HTMLButtonElement ||
		        el instanceof HTMLAnchorElement ||
		        el instanceof HTMLInputElement ||
		        el instanceof HTMLFieldSetElement ||
		        el instanceof HTMLLinkElement ||
		        el instanceof HTMLOptGroupElement ||
		        el instanceof HTMLOptionElement ||
		        el instanceof HTMLSelectElement ||
		        el instanceof HTMLTextAreaElement;
		}
		exports.elementCanBeDisabled = elementCanBeDisabled;
		/**
		 * Returns true if object is a Function.
		 * @param obj
		 */
		function isFunction(obj) {
		    return typeof obj == 'function' || false;
		}
		exports.isFunction = isFunction;
		/**
		 * Returns true if object is a Disposable
		 * @param obj
		 */
		function isDisposable(obj) {
		    return queryInterface(obj, IID_1.default.IDisposable) || isFunction(obj["dispose"]);
		}
		exports.isDisposable = isDisposable;
		/**
		 * Performs an optimized deep comparison between the two objects, to determine if they should be considered equal.
		 * @param a Object to compare
		 * @param b Object to compare to
		 */
		function isEqual(a, b, aStack, bStack) {
		    var toString = ({}).toString;
		    // Identical objects are equal. `0 === -0`, but they aren't identical.
		    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
		    if (a === b)
		        return a !== 0 || 1 / a === 1 / b;
		    // A strict comparison is necessary because `null == undefined`.
		    if (a == null || b == null)
		        return a === b;
		    // Unwrap any wrapped objects.
		    //if (a instanceof _) a = a._wrapped;
		    //if (b instanceof _) b = b._wrapped;
		    // Compare `[[Class]]` names.
		    var className = toString.call(a);
		    if (className !== toString.call(b))
		        return false;
		    switch (className) {
		        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
		        case '[object RegExp]':
		        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
		        case '[object String]':
		            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
		            // equivalent to `new String("5")`.
		            return '' + a === '' + b;
		        case '[object Number]':
		            // `NaN`s are equivalent, but non-reflexive.
		            // Object(NaN) is equivalent to NaN
		            if (+a !== +a)
		                return +b !== +b;
		            // An `egal` comparison is performed for other numeric values.
		            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
		        case '[object Date]':
		        case '[object Boolean]':
		            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
		            // millisecond representations. Note that invalid dates with millisecond representations
		            // of `NaN` are not equivalent.
		            return +a === +b;
		    }
		    var areArrays = className === '[object Array]';
		    if (!areArrays) {
		        if (typeof a != 'object' || typeof b != 'object')
		            return false;
		        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
		        // from different frames are.
		        var aCtor = a.constructor, bCtor = b.constructor;
		        if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
		            isFunction(bCtor) && bCtor instanceof bCtor)
		            && ('constructor' in a && 'constructor' in b)) {
		            return false;
		        }
		    }
		    // Assume equality for cyclic structures. The algorithm for detecting cyclic
		    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
		    // Initializing stack of traversed objects.
		    // It's done here since we only need them for objects and arrays comparison.
		    aStack = aStack || [];
		    bStack = bStack || [];
		    var length = aStack.length;
		    while (length--) {
		        // Linear search. Performance is inversely proportional to the number of
		        // unique nested structures.
		        if (aStack[length] === a)
		            return bStack[length] === b;
		    }
		    // Add the first object to the stack of traversed objects.
		    aStack.push(a);
		    bStack.push(b);
		    // Recursively compare objects and arrays.
		    if (areArrays) {
		        // Compare array lengths to determine if a deep comparison is necessary.
		        length = a.length;
		        if (length !== b.length)
		            return false;
		        // Deep compare the contents, ignoring non-numeric properties.
		        while (length--) {
		            if (!isEqual(a[length], b[length], aStack, bStack))
		                return false;
		        }
		    }
		    else {
		        // Deep compare objects.
		        var keys = Object.keys(a), key;
		        length = keys.length;
		        // Ensure that both objects contain the same number of properties before comparing deep equality.
		        if (Object.keys(b).length !== length)
		            return false;
		        while (length--) {
		            // Deep compare each member
		            key = keys[length];
		            if (!(b.hasOwnProperty(key) && isEqual(a[key], b[key], aStack, bStack)))
		                return false;
		        }
		    }
		    // Remove the first object from the stack of traversed objects.
		    aStack.pop();
		    bStack.pop();
		    return true;
		}
		exports.isEqual = isEqual;
		/**
		* Returns an array of clones of the nodes in the source array
		*/
		function cloneNodeArray(nodes) {
		    var length = nodes.length;
		    var result = new Array(length);
		    for (var i = 0; i < length; i++) {
		        result[i] = nodes[i].cloneNode(true);
		    }
		    return result;
		}
		exports.cloneNodeArray = cloneNodeArray;
		/**
		 * Converts a NodeList into a javascript array
		 * @param {NodeList} nodes
		 */
		function nodeListToArray(nodes) {
		    return Array.prototype.slice.call(nodes);
		}
		exports.nodeListToArray = nodeListToArray;
		/**
		 * Converts the node's children into a javascript array
		 * @param {Node} node
		 */
		function nodeChildrenToArray(node) {
		    return nodeListToArray(node.childNodes);
		}
		exports.nodeChildrenToArray = nodeChildrenToArray;
		/**
		* Wraps an action in try/finally block and disposes the resource after the action has completed even if it throws an exception
		* (mimics C# using statement)
		* @param {Rx.IDisposable} disp The resource to dispose after action completes
		* @param {() => void} action The action to wrap
		*/
		function using(disp, action) {
		    if (!disp)
		        throw new Error("disp");
		    if (!action)
		        throw new Error("action");
		    try {
		        action(disp);
		    }
		    finally {
		        disp.dispose();
		    }
		}
		exports.using = using;
		/**
		* Turns an AMD-Style require call into an observable
		* @param {string} Module The module to load
		* @return {Rx.Observable<any>} An observable that yields a value and completes as soon as the module has been loaded
		*/
		function observableRequire(module) {
		    var requireFunc = window["require"];
		    if (!isFunction(requireFunc))
		        throwError("there's no AMD-module loader available (Hint: did you forget to include RequireJS in your project?)");
		    return Rx.Observable.create(function (observer) {
		        try {
		            requireFunc([module], function (m) {
		                observer.onNext(m);
		                observer.onCompleted();
		            }, function (err) {
		                observer.onError(err);
		            });
		        }
		        catch (e) {
		            observer.onError(e);
		        }
		        return Rx.Disposable.empty;
		    });
		}
		exports.observableRequire = observableRequire;
		/**
		* Returns an observable that notifes of any observable property changes on the target
		* @param {any} target The object to observe
		* @return {Rx.Observable<T>} An observable
		*/
		function observeObject(target, defaultExceptionHandler, onChanging) {
		    if (onChanging === void 0) { onChanging = false; }
		    var thrownExceptionsSubject = queryInterface(target, IID_1.default.IHandleObservableErrors) ?
		        target.thrownExceptions : defaultExceptionHandler;
		    return Rx.Observable.create(function (observer) {
		        var result = new Rx.CompositeDisposable();
		        var observableProperties = getOwnPropertiesImplementingInterface(target, IID_1.default.IObservableProperty);
		        observableProperties.forEach(function (x) {
		            var prop = x.property;
		            var obs = onChanging ? prop.changing : prop.changed;
		            result.add(obs.subscribe(function (_) {
		                var e = new Events_1.PropertyChangedEventArgs(self, x.propertyName);
		                try {
		                    observer.onNext(e);
		                }
		                catch (ex) {
		                    thrownExceptionsSubject.onNext(ex);
		                }
		            }));
		        });
		        return result;
		    })
		        .publish()
		        .refCount();
		}
		exports.observeObject = observeObject;
		/**
		 * whenAny allows you to observe whenever the value of one or more properties
		 * on an object have changed, providing an initial value when the Observable is set up.
		 */
		function whenAny() {
		    // no need to invoke combineLatest for the simplest case
		    if (arguments.length === 2) {
		        return getObservable(arguments[0]).select(arguments[1]);
		    }
		    var args = args2Array(arguments);
		    // extract selector
		    var selector = args.pop();
		    // transform args
		    args = args.map(function (x) { return getObservable(x); });
		    // finally append the selector
		    args.push(selector);
		    return Rx.Observable.combineLatest.apply(this, args);
		}
		exports.whenAny = whenAny;
		/**
		* FOR INTERNAL USE ONLY
		* Throw an error containing the specified description
		*/
		function throwError(fmt) {
		    var args = [];
		    for (var _i = 1; _i < arguments.length; _i++) {
		        args[_i - 1] = arguments[_i];
		    }
		    var msg = "WebRx: " + formatString(fmt, args);
		    throw new Error(msg);
		}
		exports.throwError = throwError;
		//# sourceMappingURL=Utils.js.map

	/***/ },
	/* 4 */
	/***/ function(module, exports) {

		/// <reference path="../Interfaces.ts" />
		"use strict";
		var PropertyChangedEventArgs = (function () {
		    /// <summary>
		    /// Initializes a new instance of the <see cref="ObservablePropertyChangedEventArgs{TSender}"/> class.
		    /// </summary>
		    /// <param name="sender">The sender.</param>
		    /// <param name="propertyName">Name of the property.</param>
		    function PropertyChangedEventArgs(sender, propertyName) {
		        this.propertyName = propertyName;
		        this.sender = sender;
		    }
		    return PropertyChangedEventArgs;
		})();
		exports.PropertyChangedEventArgs = PropertyChangedEventArgs;
		//# sourceMappingURL=Events.js.map

	/***/ },
	/* 5 */
	/***/ function(module, exports) {

		"use strict";
		/// <summary>
		/// Interface registry to be used with IUnknown.queryInterface
		/// </summary>
		var IID = (function () {
		    function IID() {
		    }
		    IID.IDisposable = "IDisposable";
		    IID.IObservableProperty = "IObservableProperty";
		    IID.IObservableList = "IObservableList";
		    IID.ICommand = "ICommand";
		    IID.IHandleObservableErrors = "IHandleObservableErrors";
		    return IID;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = IID;
		//# sourceMappingURL=IID.js.map

	/***/ },
	/* 6 */
	/***/ function(module, exports) {

		"use strict";
		exports.app = "app";
		exports.injector = "injector";
		exports.domManager = "domservice";
		exports.router = "router";
		exports.messageBus = "messageBus";
		exports.expressionCompiler = "expressioncompiler";
		exports.templateEngine = "templateEngine";
		exports.httpClient = "httpClient";
		exports.hasValueBindingValue = "has.bindings.value";
		exports.valueBindingValue = "bindings.value";
		//# sourceMappingURL=Resources.js.map

	/***/ },
	/* 7 */
	/***/ function(module, exports, __webpack_require__) {

		var Utils_1 = __webpack_require__(3);
		"use strict";
		exports.hintEnable = false;
		function log() {
		    var args = [];
		    for (var _i = 0; _i < arguments.length; _i++) {
		        args[_i - 0] = arguments[_i];
		    }
		    try {
		        console.log.apply(console, arguments);
		    }
		    catch (e) {
		        try {
		            window['opera'].postError.apply(window['opera'], arguments);
		        }
		        catch (e) {
		            alert(Array.prototype.join.call(arguments, " "));
		        }
		    }
		}
		function critical(fmt) {
		    var args = [];
		    for (var _i = 1; _i < arguments.length; _i++) {
		        args[_i - 1] = arguments[_i];
		    }
		    if (args.length) {
		        fmt = Utils_1.formatString.apply(null, [fmt].concat(args));
		    }
		    log("**** WebRx Critical: " + fmt);
		}
		exports.critical = critical;
		function error(fmt) {
		    var args = [];
		    for (var _i = 1; _i < arguments.length; _i++) {
		        args[_i - 1] = arguments[_i];
		    }
		    if (args.length) {
		        fmt = Utils_1.formatString.apply(null, [fmt].concat(args));
		    }
		    log("*** WebRx Error: " + fmt);
		}
		exports.error = error;
		function info(fmt) {
		    var args = [];
		    for (var _i = 1; _i < arguments.length; _i++) {
		        args[_i - 1] = arguments[_i];
		    }
		    if (args.length) {
		        fmt = Utils_1.formatString.apply(null, [fmt].concat(args));
		    }
		    log("* WebRx Info: " + fmt);
		}
		exports.info = info;
		function hint(fmt) {
		    var args = [];
		    for (var _i = 1; _i < arguments.length; _i++) {
		        args[_i - 1] = arguments[_i];
		    }
		    if (!exports.hintEnable)
		        return;
		    if (args.length) {
		        fmt = Utils_1.formatString.apply(null, [fmt].concat(args));
		    }
		    log("* WebRx Hint: " + fmt);
		}
		exports.hint = hint;
		//# sourceMappingURL=Log.js.map

	/***/ },
	/* 8 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var IID_1 = __webpack_require__(5);
		// NOTE: The factory method approach is necessary because it is
		// currently impossible to implement a Typescript interface
		// with a function signature in a Typescript class.
		"use strict";
		/**
		* Creates an observable property with an optional default value
		* @param {T} initialValue?
		*/
		function property(initialValue) {
		    // initialize accessor function
		    var accessor = function (newVal) {
		        if (arguments.length > 0) {
		            // set
		            if (newVal !== accessor.value) {
		                accessor.changingSubject.onNext(newVal);
		                accessor.value = newVal;
		                accessor.changedSubject.onNext(newVal);
		            }
		        }
		        else {
		            // get
		            return accessor.value;
		        }
		    };
		    //////////////////////////////////
		    // wx.IUnknown implementation
		    accessor.queryInterface = function (iid) {
		        return iid === IID_1.default.IObservableProperty || iid === IID_1.default.IDisposable;
		    };
		    //////////////////////////////////
		    // IDisposable implementation
		    accessor.dispose = function () {
		    };
		    //////////////////////////////////
		    // IObservableProperty<T> implementation
		    if (initialValue !== undefined)
		        accessor.value = initialValue;
		    // setup observables
		    accessor.changedSubject = new Rx.Subject();
		    accessor.changed = accessor.changedSubject.asObservable();
		    accessor.changingSubject = new Rx.Subject();
		    accessor.changing = accessor.changingSubject.asObservable();
		    return accessor;
		}
		exports.property = property;
		//# sourceMappingURL=Property.js.map

	/***/ },
	/* 9 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Injector_1 = __webpack_require__(2);
		var Utils_1 = __webpack_require__(3);
		var res = __webpack_require__(6);
		"use strict";
		var Module = (function () {
		    function Module(name) {
		        //////////////////////////////////
		        // Implementation
		        this.bindings = {};
		        this.components = {};
		        this.expressionFilters = {};
		        this.animations = {};
		        this.name = name;
		    }
		    //////////////////////////////////
		    // wx.IModule
		    Module.prototype.merge = function (other) {
		        var _other = other;
		        Utils_1.extend(_other.components, this.components);
		        Utils_1.extend(_other.bindings, this.bindings);
		        Utils_1.extend(_other.expressionFilters, this.expressionFilters);
		        Utils_1.extend(_other.animations, this.animations);
		        return this;
		    };
		    Module.prototype.component = function (name, component) {
		        this.components[name] = component;
		        return this;
		    };
		    Module.prototype.hasComponent = function (name) {
		        return this.components[name] != null;
		    };
		    Module.prototype.loadComponent = function (name, params) {
		        return this.initializeComponent(this.instantiateComponent(name), params);
		    };
		    Module.prototype.binding = function () {
		        var _this = this;
		        var args = Utils_1.args2Array(arguments);
		        var name = args.shift();
		        var handler;
		        // lookup?
		        if (args.length === 0) {
		            // if the handler has been registered as resource, resolve it now and update registry
		            handler = this.bindings[name];
		            if (typeof handler === "string") {
		                handler = Injector_1.injector.get(handler);
		                this.bindings[name] = handler;
		            }
		            return handler;
		        }
		        // registration
		        handler = args.shift();
		        if (Array.isArray(name)) {
		            name.forEach(function (x) { return _this.bindings[x] = handler; });
		        }
		        else {
		            this.bindings[name] = handler;
		        }
		        return this;
		    };
		    Module.prototype.filter = function () {
		        var args = Utils_1.args2Array(arguments);
		        var name = args.shift();
		        var filter;
		        // lookup?
		        if (args.length === 0) {
		            // if the filter has been registered as resource, resolve it now and update registry
		            filter = this.expressionFilters[name];
		            if (typeof filter === "string") {
		                filter = Injector_1.injector.get(filter);
		                this.bindings[name] = filter;
		            }
		            return filter;
		        }
		        // registration
		        filter = args.shift();
		        this.expressionFilters[name] = filter;
		        return this;
		    };
		    Module.prototype.filters = function () {
		        return this.expressionFilters;
		    };
		    Module.prototype.animation = function () {
		        var args = Utils_1.args2Array(arguments);
		        var name = args.shift();
		        var animation;
		        // lookup?
		        if (args.length === 0) {
		            // if the animation has been registered as resource, resolve it now and update registry
		            animation = this.animations[name];
		            if (typeof animation === "string") {
		                animation = Injector_1.injector.get(animation);
		                this.bindings[name] = animation;
		            }
		            return animation;
		        }
		        // registration
		        animation = args.shift();
		        this.animations[name] = animation;
		        return this;
		    };
		    Object.defineProperty(Module.prototype, "app", {
		        get: function () {
		            return Injector_1.injector.get(res.app);
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Module.prototype.instantiateComponent = function (name) {
		        var _this = this;
		        var _cd = this.components[name];
		        var result = undefined;
		        if (_cd != null) {
		            if (Utils_1.isRxObservable(_cd))
		                result = _cd;
		            else if (Utils_1.isPromise(_cd))
		                return Rx.Observable.fromPromise(_cd);
		            else {
		                // if the component has been registered as resource, resolve it now and update registry
		                var cd = _cd;
		                if (cd.instance) {
		                    result = Rx.Observable.return(cd.instance);
		                }
		                else if (cd.resolve) {
		                    var resolved = Injector_1.injector.get(cd.resolve);
		                    result = Rx.Observable.return(resolved);
		                }
		                else if (cd.require) {
		                    result = Utils_1.observableRequire(cd.require);
		                }
		                else {
		                    result = Rx.Observable.return(cd);
		                }
		            }
		        }
		        else {
		            result = Rx.Observable.return(undefined);
		        }
		        return result.do(function (x) { return _this.components[name] = { instance: x }; }); // cache descriptor
		    };
		    Module.prototype.initializeComponent = function (obs, params) {
		        var _this = this;
		        return obs.take(1).selectMany(function (component) {
		            if (component == null) {
		                return Rx.Observable.return(undefined);
		            }
		            return Rx.Observable.combineLatest(component.template ? _this.loadComponentTemplate(component.template, params) : Rx.Observable.return(undefined), component.viewModel ? _this.loadComponentViewModel(component.viewModel, params) : Rx.Observable.return(undefined), function (t, vm) {
		                // if view-model factory yields a function, use it as constructor
		                if (Utils_1.isFunction(vm)) {
		                    vm = new vm(params);
		                }
		                return {
		                    template: t,
		                    viewModel: vm,
		                    preBindingInit: component.preBindingInit,
		                    postBindingInit: component.postBindingInit
		                };
		            });
		        })
		            .take(1);
		    };
		    Module.prototype.loadComponentTemplate = function (template, params) {
		        var _this = this;
		        var syncResult;
		        var el;
		        if (Utils_1.isFunction(template)) {
		            syncResult = template(params);
		            if (Utils_1.isRxObservable(template))
		                return template;
		            if (typeof syncResult === "string") {
		                syncResult = this.app.templateEngine.parse(template(params));
		            }
		            return Rx.Observable.return(syncResult);
		        }
		        else if (typeof template === "string") {
		            syncResult = this.app.templateEngine.parse(template);
		            return Rx.Observable.return(syncResult);
		        }
		        else if (Array.isArray(template)) {
		            return Rx.Observable.return(template);
		        }
		        else if (typeof template === "object") {
		            var options = template;
		            if (options.resolve) {
		                syncResult = Injector_1.injector.get(options.resolve);
		                return Rx.Observable.return(syncResult);
		            }
		            else if (options.promise) {
		                var promise = options.promise;
		                return Rx.Observable.fromPromise(promise);
		            }
		            else if (options.observable) {
		                return options.observable;
		            }
		            else if (options.require) {
		                return Utils_1.observableRequire(options.require).select(function (x) { return _this.app.templateEngine.parse(x); });
		            }
		            else if (options.select) {
		                // try both getElementById & querySelector
		                el = document.getElementById(options.select) ||
		                    document.querySelector(options.select);
		                if (el != null) {
		                    // only the nodes inside the specified element will be cloned for use as the component’s template
		                    syncResult = this.app.templateEngine.parse(el.innerHTML);
		                }
		                else {
		                    syncResult = [];
		                }
		                return Rx.Observable.return(syncResult);
		            }
		        }
		        Utils_1.throwError("invalid template descriptor");
		    };
		    Module.prototype.loadComponentViewModel = function (vm, componentParams) {
		        var syncResult;
		        if (Utils_1.isFunction(vm)) {
		            return Rx.Observable.return(vm);
		        }
		        else if (Array.isArray(vm)) {
		            // assumed to be inline-annotated-array
		            syncResult = Injector_1.injector.resolve(vm, componentParams);
		            return Rx.Observable.return(syncResult);
		        }
		        else if (typeof vm === "object") {
		            var options = vm;
		            if (options.resolve) {
		                syncResult = Injector_1.injector.get(options.resolve, componentParams);
		                return Rx.Observable.return(syncResult);
		            }
		            else if (options.observable) {
		                return options.observable;
		            }
		            else if (options.promise) {
		                var promise = options.promise;
		                return Rx.Observable.fromPromise(promise);
		            }
		            else if (options.require) {
		                return Utils_1.observableRequire(options.require);
		            }
		            else if (options.instance) {
		                return Rx.Observable.return(options.instance);
		            }
		        }
		        Utils_1.throwError("invalid view-model descriptor");
		    };
		    return Module;
		})();
		exports.Module = Module;
		exports.modules = {};
		/**
		* Defines a module.
		* @param {string} name The module name
		* @return {wx.IModule} The module handle
		*/
		function module(name, descriptor) {
		    exports.modules[name] = descriptor;
		    return this;
		}
		exports.module = module;
		/**
		* Instantiate a new module instance and configure it using the user supplied configuration
		* @param {string} name The module name
		* @return {wx.IModule} The module handle
		*/
		function loadModule(name) {
		    var md = exports.modules[name];
		    var result = undefined;
		    var module;
		    if (md != null) {
		        if (Array.isArray(md)) {
		            // assumed to be inline-annotated-array
		            // resolve the configuration function via DI and invoke it with the module instance as argument
		            module = new Module(name);
		            Injector_1.injector.resolve(md, module);
		            result = Rx.Observable.return(module);
		        }
		        else if (Utils_1.isFunction(md)) {
		            // configuration function
		            module = new Module(name);
		            md(module);
		            result = Rx.Observable.return(module);
		        }
		        else {
		            var mdd = md;
		            if (mdd.instance) {
		                result = Rx.Observable.return(mdd.instance);
		            }
		            else {
		                module = new Module(name);
		                if (mdd.resolve) {
		                    // resolve the configuration function via DI and invoke it with the module instance as argument
		                    Injector_1.injector.get(mdd.resolve, module);
		                    result = Rx.Observable.return(module);
		                }
		                else if (mdd.require) {
		                    // load the configuration function from external module and invoke it with the module instance as argument
		                    result = Utils_1.observableRequire(mdd.require)
		                        .do(function (x) { return x(module); }) // configure the module
		                        .select(function (x) { return module; });
		                }
		            }
		        }
		    }
		    else {
		        result = Rx.Observable.return(undefined);
		    }
		    return result.take(1).do(function (x) { return exports.modules[name] = { instance: x }; }); // cache instantiated module
		}
		exports.loadModule = loadModule;
		//# sourceMappingURL=Module.js.map

	/***/ },
	/* 10 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		"use strict";
		/**
		* Knockout's object-literal parser ported to Typescript
		*/
		// The following regular expressions will be used to split an object-literal string into tokens
		// These two match strings, either with double quotes or single quotes
		var stringDouble = '"(?:[^"\\\\]|\\\\.)*"';
		var stringSingle = "'(?:[^'\\\\]|\\\\.)*'";
		// Matches a regular expression (text enclosed by slashes), but will also match sets of divisions
		// as a regular expression (this is handled by the parsing loop below).
		var stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*';
		// These characters have special meaning to the parser and must not appear in the middle of a
		// token, except as part of a string.
		var specials = ',"\'{}()/:[\\]';
		// Match text (at least two characters) that does not contain any of the above special characters,
		// although some of the special characters are allowed to start it (all but the colon and comma).
		// The text can contain spaces, but leading or trailing spaces are skipped.
		var everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']';
		// Match any non-space character not matched already. This will match colons and commas, since they're
		// not matched by "everyThingElse", but will also match any other single character that wasn't already
		// matched (for example: in "a: 1, b: 2", each of the non-space characters will be matched by oneNotSpace).
		var oneNotSpace = '[^\\s]';
		// Create the actual regular expression by or-ing the above strings. The order is important.
		var bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g');
		// Match end of previous token to determine whether a slash is a division or regex.
		var divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/;
		var keywordRegexLookBehind = { 'in': 1, 'return': 1, 'typeof': 1 };
		// Simplified extend() for our use-case
		function extend(dst, obj) {
		    var key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) {
		            dst[key] = obj[key];
		        }
		    }
		    return dst;
		}
		/**
		* Split an object-literal string into tokens (borrowed from the KnockoutJS project)
		* @param {string} objectLiteralString A javascript-style object literal without leading and trailing curly brances
		* @return {Command<any>} A Command whose ExecuteAsync just returns the CommandParameter immediately. Which you should ignore!
		*/
		function parseObjectLiteral(objectLiteralString) {
		    // Trim leading and trailing spaces from the string
		    var str = objectLiteralString.trim();
		    // Trim braces '{' surrounding the whole object literal
		    if (str.charCodeAt(0) === 123)
		        str = str.slice(1, -1);
		    // Split into tokens
		    var result = new Array(), toks = str.match(bindingToken), key, values, depth = 0;
		    if (toks) {
		        // Append a comma so that we don't need a separate code block to deal with the last item
		        toks.push(',');
		        for (var i = 0, tok = void 0; tok = toks[i]; ++i) {
		            var c = tok.charCodeAt(0);
		            // A comma signals the end of a key/value pair if depth is zero
		            if (c === 44) {
		                if (depth <= 0) {
		                    if (key)
		                        result.push(values ? { key: key, value: values.join('') } : { 'unknown': key, value: undefined });
		                    key = values = depth = 0;
		                    continue;
		                }
		            }
		            else if (c === 58) {
		                if (!values)
		                    continue;
		            }
		            else if (c === 47 && i && tok.length > 1) {
		                // Look at the end of the previous token to determine if the slash is actually division
		                var match = toks[i - 1].match(divisionLookBehind);
		                if (match && !keywordRegexLookBehind[match[0]]) {
		                    // The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
		                    str = str.substr(str.indexOf(tok) + 1);
		                    toks = str.match(bindingToken);
		                    toks.push(',');
		                    i = -1;
		                    // Continue with just the slash
		                    tok = '/';
		                }
		            }
		            else if (c === 40 || c === 123 || c === 91) {
		                ++depth;
		            }
		            else if (c === 41 || c === 125 || c === 93) {
		                --depth;
		            }
		            else if (!key && !values) {
		                key = (c === 34 || c === 39) /* '"', "'" */ ? tok.slice(1, -1) : tok;
		                continue;
		            }
		            if (values)
		                values.push(tok);
		            else
		                values = [tok];
		        }
		    }
		    return result;
		}
		exports.parseObjectLiteral = parseObjectLiteral;
		/**
		* Angular's expression compiler ported to Typescript
		*/
		var hookField = "___runtimeHooks";
		function isDefined(value) { return typeof value !== "undefined"; }
		//function valueFn(value) { return () => value; }
		function $parseMinErr(module, message, arg1, arg2, arg3, arg4, arg5) {
		    var args = arguments;
		    message = message.replace(/{(\d)}/g, function (match) {
		        return args[2 + parseInt(match[1])];
		    });
		    throw new SyntaxError(message);
		}
		function lowercase(string) { return typeof string === "string" ? string.toLowerCase() : string; }
		// Sandboxing Angular Expressions
		// ------------------------------
		// Angular expressions are generally considered safe because these expressions only have direct
		// access to $scope and locals. However, one can obtain the ability to execute arbitrary JS code by
		// obtaining a reference to native JS functions such as the Function constructor.
		//
		// As an example, consider the following Angular expression:
		//
		//   {}.toString.constructor(alert("evil JS code"))
		//
		// We want to prevent this type of access. For the sake of performance, during the lexing phase we
		// disallow any "dotted" access to any member named "constructor".
		//
		// For reflective calls (a[b]) we check that the value of the lookup is not the Function constructor
		// while evaluating the expression, which is a stronger but more expensive test. Since reflective
		// calls are expensive anyway, this is not such a big deal compared to static dereferencing.
		//
		// This sandboxing technique is not perfect and doesn't aim to be. The goal is to prevent exploits
		// against the expression language, but not to prevent exploits that were enabled by exposing
		// sensitive JavaScript or browser apis on Scope. Exposing such objects on a Scope is never a good
		// practice and therefore we are not even trying to protect against interaction with an object
		// explicitly exposed in this way.
		//
		// A developer could foil the name check by aliasing the Function constructor under a different
		// name on the scope.
		//
		// In general, it is not possible to access a Window object from an angular expression unless a
		// window or some DOM object that has a reference to window is published onto a Scope.
		function ensureSafeMemberName(name, fullExpression) {
		    if (name === "constructor") {
		        throw $parseMinErr("isecfld", "Referencing \"constructor\" field in WebRx expressions is disallowed! Expression: {0}", fullExpression);
		    }
		    return name;
		}
		function ensureSafeObject(obj, fullExpression) {
		    // nifty check if obj is Function that is fast and works across iframes and other contexts
		    if (obj) {
		        if (obj.constructor === obj) {
		            throw $parseMinErr("isecfn", "Referencing Function in WebRx expressions is disallowed! Expression: {0}", fullExpression);
		        }
		        else if (obj.document && obj.location && obj.alert && obj.setInterval) {
		            throw $parseMinErr("isecwindow", "Referencing the Window in WebRx expressions is disallowed! Expression: {0}", fullExpression);
		        }
		        else if (obj.children && (obj.nodeName || (obj.prop && obj.attr && obj.find))) {
		            throw $parseMinErr("isecdom", "Referencing DOM nodes in WebRx expressions is disallowed! Expression: {0}", fullExpression);
		        }
		    }
		    return obj;
		}
		var OPERATORS = {
		    /* jshint bitwise : false */
		    'null': function () { return null; },
		    'true': function () { return true; },
		    'false': function () { return false; },
		    undefined: Utils_1.noop,
		    '+': function (self, locals, a, b) {
		        a = a(self, locals);
		        b = b(self, locals);
		        if (isDefined(a)) {
		            if (isDefined(b)) {
		                return a + b;
		            }
		            return a;
		        }
		        return isDefined(b) ? b : undefined;
		    },
		    '-': function (self, locals, a, b) {
		        a = a(self, locals);
		        b = b(self, locals);
		        return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
		    },
		    '*': function (self, locals, a, b) { return a(self, locals) * b(self, locals); },
		    '/': function (self, locals, a, b) { return a(self, locals) / b(self, locals); },
		    '%': function (self, locals, a, b) { return a(self, locals) % b(self, locals); },
		    '^': function (self, locals, a, b) { return a(self, locals) ^ b(self, locals); },
		    '=': Utils_1.noop,
		    '===': function (self, locals, a, b) { return a(self, locals) === b(self, locals); },
		    '!==': function (self, locals, a, b) { return a(self, locals) !== b(self, locals); },
		    '==': function (self, locals, a, b) { return a(self, locals) === b(self, locals); },
		    '!=': function (self, locals, a, b) { return a(self, locals) !== b(self, locals); },
		    '<': function (self, locals, a, b) { return a(self, locals) < b(self, locals); },
		    '>': function (self, locals, a, b) { return a(self, locals) > b(self, locals); },
		    '<=': function (self, locals, a, b) { return a(self, locals) <= b(self, locals); },
		    '>=': function (self, locals, a, b) { return a(self, locals) >= b(self, locals); },
		    '&&': function (self, locals, a, b) { return a(self, locals) && b(self, locals); },
		    '||': function (self, locals, a, b) { return a(self, locals) || b(self, locals); },
		    '&': function (self, locals, a, b) { return a(self, locals) & b(self, locals); },
		    //    '|':function(self, locals, a,b){return a|b;},
		    '|': function (self, locals, a, b) { return b(self, locals)(self, locals, a(self, locals)); },
		    '!': function (self, locals, a) { return !a(self, locals); }
		};
		/* jshint bitwise: true */
		var ESCAPE = { "n": "\n", "f": "\f", "r": "\r", "t": "\t", "v": "\v", "'": "'", '"': "\"" };
		/**
		* @constructor
		*/
		var Lexer = (function () {
		    function Lexer(options) {
		        this.options = options;
		    }
		    Lexer.prototype.lex = function (text) {
		        this.text = text;
		        this.index = 0;
		        this.ch = undefined;
		        this.lastCh = ":"; // can start regexp
		        this.tokens = [];
		        var token;
		        var json = [];
		        while (this.index < this.text.length) {
		            this.ch = this.text.charAt(this.index);
		            if (this.is("\"'")) {
		                this.readString(this.ch);
		            }
		            else if (this.isNumber(this.ch) || this.is(".") && this.isNumber(this.peek())) {
		                this.readNumber();
		            }
		            else if (this.isIdent(this.ch)) {
		                this.readIdent();
		                // identifiers can only be if the preceding char was a { or ,
		                if (this.was("{,") && json[0] === "{" &&
		                    (token = this.tokens[this.tokens.length - 1])) {
		                    token.json = token.text.indexOf(".") === -1;
		                }
		            }
		            else if (this.is("(){}[].,;:?")) {
		                this.tokens.push({
		                    index: this.index,
		                    text: this.ch,
		                    json: (this.was(":[,") && this.is("{[")) || this.is("}]:,")
		                });
		                if (this.is("{["))
		                    json.unshift(this.ch);
		                if (this.is("}]"))
		                    json.shift();
		                this.index++;
		            }
		            else if (this.isWhitespace(this.ch)) {
		                this.index++;
		                continue;
		            }
		            else {
		                var ch2 = this.ch + this.peek();
		                var ch3 = ch2 + this.peek(2);
		                var fn = OPERATORS[this.ch];
		                var fn2 = OPERATORS[ch2];
		                var fn3 = OPERATORS[ch3];
		                if (fn3) {
		                    this.tokens.push({ index: this.index, text: ch3, fn: fn3 });
		                    this.index += 3;
		                }
		                else if (fn2) {
		                    this.tokens.push({ index: this.index, text: ch2, fn: fn2 });
		                    this.index += 2;
		                }
		                else if (fn) {
		                    this.tokens.push({
		                        index: this.index,
		                        text: this.ch,
		                        fn: fn,
		                        json: (this.was("[,:") && this.is(" + -"))
		                    });
		                    this.index += 1;
		                }
		                else {
		                    this.throwError("Unexpected next character ", this.index, this.index + 1);
		                }
		            }
		            this.lastCh = this.ch;
		        }
		        return this.tokens;
		    };
		    Lexer.prototype.is = function (chars) {
		        return chars.indexOf(this.ch) !== -1;
		    };
		    Lexer.prototype.was = function (chars) {
		        return chars.indexOf(this.lastCh) !== -1;
		    };
		    Lexer.prototype.peek = function (i) {
		        var num = i || 1;
		        return (this.index + num < this.text.length) ? this.text.charAt(this.index + num) : false;
		    };
		    Lexer.prototype.isNumber = function (ch) {
		        return ("0" <= ch && ch <= "9");
		    };
		    Lexer.prototype.isWhitespace = function (ch) {
		        // IE treats non-breaking space as \u00A0
		        return (ch === " " || ch === "\r" || ch === "\t" ||
		            ch === "\n" || ch === "\v" || ch === "\u00A0");
		    };
		    Lexer.prototype.isIdent = function (ch) {
		        return ("a" <= ch && ch <= "z" ||
		            "A" <= ch && ch <= "Z" ||
		            "_" === ch || ch === "$" || ch === "@");
		    };
		    Lexer.prototype.isExpOperator = function (ch) {
		        return (ch === "-" || ch === "+" || this.isNumber(ch));
		    };
		    Lexer.prototype.throwError = function (error, start, end) {
		        end = end || this.index;
		        var colStr = (isDefined(start)
		            ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]"
		            : " " + end);
		        throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, colStr, this.text);
		    };
		    Lexer.prototype.readNumber = function () {
		        var n = "";
		        var start = this.index;
		        while (this.index < this.text.length) {
		            var ch = lowercase(this.text.charAt(this.index));
		            if (ch === "." || this.isNumber(ch)) {
		                n += ch;
		            }
		            else {
		                var peekCh = this.peek();
		                if (ch === "e" && this.isExpOperator(peekCh)) {
		                    n += ch;
		                }
		                else if (this.isExpOperator(ch) &&
		                    peekCh && this.isNumber(peekCh) &&
		                    n.charAt(n.length - 1) === "e") {
		                    n += ch;
		                }
		                else if (this.isExpOperator(ch) &&
		                    (!peekCh || !this.isNumber(peekCh)) &&
		                    n.charAt(n.length - 1) === "e") {
		                    this.throwError("Invalid exponent");
		                }
		                else {
		                    break;
		                }
		            }
		            this.index++;
		        }
		        n = 1 * n;
		        this.tokens.push({
		            index: start,
		            text: n,
		            json: true,
		            fn: function () {
		                return n;
		            }
		        });
		    };
		    Lexer.prototype.readIdent = function () {
		        var parser = this;
		        var ident = "";
		        var start = this.index;
		        var lastDot, peekIndex, methodName, ch;
		        while (this.index < this.text.length) {
		            ch = this.text.charAt(this.index);
		            if (ch === "." || this.isIdent(ch) || this.isNumber(ch)) {
		                if (ch === ".")
		                    lastDot = this.index;
		                ident += ch;
		            }
		            else {
		                break;
		            }
		            this.index++;
		        }
		        //check if this is not a method invocation and if it is back out to last dot
		        if (lastDot) {
		            peekIndex = this.index;
		            while (peekIndex < this.text.length) {
		                ch = this.text.charAt(peekIndex);
		                if (ch === "(") {
		                    methodName = ident.substr(lastDot - start + 1);
		                    ident = ident.substr(0, lastDot - start);
		                    this.index = peekIndex;
		                    break;
		                }
		                if (this.isWhitespace(ch)) {
		                    peekIndex++;
		                }
		                else {
		                    break;
		                }
		            }
		        }
		        var token = {
		            index: start,
		            text: ident
		        };
		        // OPERATORS is our own object so we don't need to use special hasOwnPropertyFn
		        if (OPERATORS.hasOwnProperty(ident)) {
		            token.fn = OPERATORS[ident];
		            token.json = OPERATORS[ident];
		        }
		        else {
		            var getter = getterFn(ident, this.options, this.text);
		            token.fn = extend(function (self, locals) {
		                return (getter(self, locals));
		            }, {
		                assign: function (self, value, locals) {
		                    return setter(self, ident, value, parser.text, parser.options, locals);
		                }
		            });
		        }
		        this.tokens.push(token);
		        if (methodName) {
		            this.tokens.push({
		                index: lastDot,
		                text: ".",
		                json: false
		            });
		            this.tokens.push({
		                index: lastDot + 1,
		                text: methodName,
		                json: false
		            });
		        }
		    };
		    Lexer.prototype.readString = function (quote) {
		        var start = this.index;
		        this.index++;
		        var value = "";
		        var rawString = quote;
		        var escape = false;
		        while (this.index < this.text.length) {
		            var ch = this.text.charAt(this.index);
		            rawString += ch;
		            if (escape) {
		                if (ch === "u") {
		                    var hex = this.text.substring(this.index + 1, this.index + 5);
		                    if (!hex.match(/[\da-f]{4}/i))
		                        this.throwError("Invalid unicode escape [\\u" + hex + "]");
		                    this.index += 4;
		                    value += String.fromCharCode(parseInt(hex, 16));
		                }
		                else {
		                    var rep = ESCAPE[ch];
		                    if (rep) {
		                        value += rep;
		                    }
		                    else {
		                        value += ch;
		                    }
		                }
		                escape = false;
		            }
		            else if (ch === "\\") {
		                escape = true;
		            }
		            else if (ch === quote) {
		                this.index++;
		                this.tokens.push({
		                    index: start,
		                    text: rawString,
		                    string: value,
		                    json: true,
		                    fn: function () {
		                        return value;
		                    }
		                });
		                return;
		            }
		            else {
		                value += ch;
		            }
		            this.index++;
		        }
		        this.throwError("Unterminated quote", start);
		    };
		    return Lexer;
		})();
		/**
		* @constructor
		*/
		var Parser = (function () {
		    function Parser(lexer, options) {
		        this.lexer = lexer;
		        this.options = options || { filters: {} };
		    }
		    Parser.prototype.parse = function (text) {
		        this.text = text;
		        this.tokens = this.lexer.lex(text);
		        var value = this.statements();
		        if (this.tokens.length !== 0) {
		            this.throwError("is an unexpected token", this.tokens[0]);
		        }
		        value.literal = !!value.literal;
		        value.constant = !!value.constant;
		        return value;
		    };
		    Parser.prototype.primary = function () {
		        var primary;
		        if (this.expect("(")) {
		            primary = this.filterChain();
		            this.consume(")");
		        }
		        else if (this.expect("[")) {
		            primary = this.arrayDeclaration();
		        }
		        else if (this.expect("{")) {
		            primary = this.object();
		        }
		        else {
		            var token = this.expect();
		            primary = token.fn;
		            if (!primary) {
		                this.throwError("not a primary expression", token);
		            }
		            if (token.json) {
		                primary.constant = true;
		                primary.literal = true;
		            }
		        }
		        var next, context;
		        while ((next = this.expect("(", "[", "."))) {
		            if (next.text === "(") {
		                primary = this.functionCall(primary, context);
		                context = null;
		            }
		            else if (next.text === "[") {
		                context = primary;
		                primary = this.objectIndex(primary);
		            }
		            else if (next.text === ".") {
		                context = primary;
		                primary = this.fieldAccess(primary);
		            }
		            else {
		                this.throwError("IMPOSSIBLE");
		            }
		        }
		        return primary;
		    };
		    Parser.prototype.throwError = function (msg, token) {
		        throw $parseMinErr("syntax", "WebRx Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, (token.index + 1), this.text, this.text.substring(token.index));
		    };
		    Parser.prototype.peekToken = function () {
		        if (this.tokens.length === 0)
		            throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
		        return this.tokens[0];
		    };
		    Parser.prototype.peek = function (e1, e2, e3, e4) {
		        if (this.tokens.length > 0) {
		            var token = this.tokens[0];
		            var t = token.text;
		            if (t === e1 || t === e2 || t === e3 || t === e4 ||
		                (!e1 && !e2 && !e3 && !e4)) {
		                return token;
		            }
		        }
		        return false;
		    };
		    Parser.prototype.expect = function (e1, e2, e3, e4) {
		        var token = this.peek(e1, e2, e3, e4);
		        if (token) {
		            this.tokens.shift();
		            return token;
		        }
		        return false;
		    };
		    Parser.prototype.consume = function (e1) {
		        if (!this.expect(e1)) {
		            this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
		        }
		    };
		    Parser.prototype.unaryFn = function (fn, right) {
		        return extend(function (self, locals) {
		            return fn(self, locals, right);
		        }, {
		            constant: right.constant
		        });
		    };
		    Parser.prototype.ternaryFn = function (left, middle, right) {
		        return extend(function (self, locals) {
		            return left(self, locals) ? middle(self, locals) : right(self, locals);
		        }, {
		            constant: left.constant && middle.constant && right.constant
		        });
		    };
		    Parser.prototype.binaryFn = function (left, fn, right) {
		        return extend(function (self, locals) {
		            return fn(self, locals, left, right);
		        }, {
		            constant: left.constant && right.constant
		        });
		    };
		    Parser.prototype.statements = function () {
		        var statements = [];
		        while (true) {
		            if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]"))
		                statements.push(this.filterChain());
		            if (!this.expect(";")) {
		                // optimize for the common case where there is only one statement.
		                // TODO(size): maybe we should not support multiple statements?
		                return (statements.length === 1)
		                    ? statements[0] :
		                    function (self, locals) {
		                        var value;
		                        for (var i = 0; i < statements.length; i++) {
		                            var statement = statements[i];
		                            if (statement) {
		                                value = statement(self, locals);
		                            }
		                        }
		                        return value;
		                    };
		            }
		        }
		    };
		    Parser.prototype.filterChain = function () {
		        var left = this.expression();
		        var token;
		        while (true) {
		            if ((token = this.expect("|"))) {
		                left = this.binaryFn(left, token.fn, this.filter());
		            }
		            else {
		                return left;
		            }
		        }
		    };
		    Parser.prototype.filter = function () {
		        var token = this.expect();
		        var fn = this.options.filters[token.text];
		        var argsFn = [];
		        while (true) {
		            if ((token = this.expect(":"))) {
		                argsFn.push(this.expression());
		            }
		            else {
		                var fnInvoke = function (self, locals, input) {
		                    var args = [input];
		                    for (var i = 0; i < argsFn.length; i++) {
		                        args.push(argsFn[i](self, locals));
		                    }
		                    return fn.apply(self, args);
		                };
		                return function () {
		                    return fnInvoke;
		                };
		            }
		        }
		    };
		    Parser.prototype.expression = function () {
		        return this.assignment();
		    };
		    Parser.prototype.assignment = function () {
		        var left = this.ternary();
		        var right;
		        var token;
		        if ((token = this.expect("="))) {
		            if (!left.assign) {
		                this.throwError("implies assignment but [" +
		                    this.text.substring(0, token.index) + "] can not be assigned to", token);
		            }
		            right = this.ternary();
		            return function (scope, locals) {
		                return left.assign(scope, right(scope, locals), locals);
		            };
		        }
		        return left;
		    };
		    Parser.prototype.ternary = function () {
		        var left = this.logicalOR();
		        var middle;
		        var token;
		        if ((token = this.expect("?"))) {
		            middle = this.ternary();
		            if ((token = this.expect(":"))) {
		                return this.ternaryFn(left, middle, this.ternary());
		            }
		            else {
		                this.throwError("expected :", token);
		            }
		        }
		        return left;
		    };
		    Parser.prototype.logicalOR = function () {
		        var left = this.logicalAND();
		        var token;
		        while (true) {
		            if ((token = this.expect("||"))) {
		                left = this.binaryFn(left, token.fn, this.logicalAND());
		            }
		            else {
		                return left;
		            }
		        }
		    };
		    Parser.prototype.logicalAND = function () {
		        var left = this.equality();
		        var token;
		        if ((token = this.expect("&&"))) {
		            left = this.binaryFn(left, token.fn, this.logicalAND());
		        }
		        return left;
		    };
		    Parser.prototype.equality = function () {
		        var left = this.relational();
		        var token;
		        if ((token = this.expect("==", "!=", "===", "!=="))) {
		            left = this.binaryFn(left, token.fn, this.equality());
		        }
		        return left;
		    };
		    Parser.prototype.relational = function () {
		        var left = this.additive();
		        var token;
		        if ((token = this.expect("<", ">", "<=", ">="))) {
		            left = this.binaryFn(left, token.fn, this.relational());
		        }
		        return left;
		    };
		    Parser.prototype.additive = function () {
		        var left = this.multiplicative();
		        var token;
		        while ((token = this.expect("+", "-"))) {
		            left = this.binaryFn(left, token.fn, this.multiplicative());
		        }
		        return left;
		    };
		    Parser.prototype.multiplicative = function () {
		        var left = this.unary();
		        var token;
		        while ((token = this.expect("*", "/", "%"))) {
		            left = this.binaryFn(left, token.fn, this.unary());
		        }
		        return left;
		    };
		    Parser.prototype.unary = function () {
		        var token;
		        if (this.expect("+")) {
		            return this.primary();
		        }
		        else if ((token = this.expect("-"))) {
		            return this.binaryFn(ZERO, token.fn, this.unary());
		        }
		        else if ((token = this.expect("!"))) {
		            return this.unaryFn(token.fn, this.unary());
		        }
		        else {
		            return this.primary();
		        }
		    };
		    Parser.prototype.fieldAccess = function (object) {
		        var parser = this;
		        var field = this.expect().text;
		        var getter = getterFn(field, this.options, this.text);
		        return extend(function (scope, locals, self) {
		            return getter(self || object(scope, locals));
		        }, {
		            assign: function (scope, value, locals) {
		                return setter(object(scope, locals), field, value, parser.text, parser.options, locals);
		            }
		        });
		    };
		    Parser.prototype.objectIndex = function (obj) {
		        var parser = this;
		        var indexFn = this.expression();
		        this.consume("]");
		        return extend(function (self, locals) {
		            var o = obj(self, locals), i = indexFn(self, locals), v, p;
		            if (!o)
		                return undefined;
		            var hooks = getRuntimeHooks(locals);
		            if (hooks && hooks.readIndexHook)
		                v = hooks.readIndexHook(o, i);
		            else
		                v = o[i];
		            v = ensureSafeObject(v, parser.text);
		            return v;
		        }, {
		            assign: function (self, value, locals) {
		                var key = indexFn(self, locals);
		                // prevent overwriting of Function.constructor which would break ensureSafeObject check
		                var safe = ensureSafeObject(obj(self, locals), parser.text);
		                var hooks = getRuntimeHooks(locals);
		                if (hooks && hooks.writeIndexHook)
		                    return hooks.writeIndexHook(safe, key, value);
		                return safe[key] = value;
		            }
		        });
		    };
		    Parser.prototype.functionCall = function (fn, contextGetter) {
		        if (this.options.disallowFunctionCalls)
		            this.throwError("Function calls are not allowed");
		        var argsFn = [];
		        if (this.peekToken().text !== ")") {
		            do {
		                argsFn.push(this.expression());
		            } while (this.expect(","));
		        }
		        this.consume(")");
		        var parser = this;
		        return function (scope, locals) {
		            var args = [];
		            var context = contextGetter ? contextGetter(scope, locals) : scope;
		            for (var i = 0; i < argsFn.length; i++) {
		                args.push(argsFn[i](scope, locals));
		            }
		            var fnPtr = fn(scope, locals, context) || Utils_1.noop;
		            ensureSafeObject(context, parser.text);
		            ensureSafeObject(fnPtr, parser.text);
		            // IE stupidity! (IE doesn't have apply for some native functions)
		            var v = fnPtr.apply
		                ? fnPtr.apply(context, args)
		                : fnPtr(args[0], args[1], args[2], args[3], args[4]);
		            return ensureSafeObject(v, parser.text);
		        };
		    };
		    // This is used with json array declaration
		    Parser.prototype.arrayDeclaration = function () {
		        var elementFns = [];
		        var allConstant = true;
		        if (this.peekToken().text !== "]") {
		            do {
		                if (this.peek("]")) {
		                    // Support trailing commas per ES5.1.
		                    break;
		                }
		                var elementFn = this.expression();
		                elementFns.push(elementFn);
		                if (!elementFn.constant) {
		                    allConstant = false;
		                }
		            } while (this.expect(","));
		        }
		        this.consume("]");
		        return extend(function (self, locals) {
		            var array = [];
		            for (var i = 0; i < elementFns.length; i++) {
		                array.push(elementFns[i](self, locals));
		            }
		            return array;
		        }, {
		            literal: true,
		            constant: allConstant
		        });
		    };
		    Parser.prototype.object = function () {
		        var keyValues = [];
		        var allConstant = true;
		        if (this.peekToken().text !== "}") {
		            do {
		                if (this.peek("}")) {
		                    // Support trailing commas per ES5.1.
		                    break;
		                }
		                var token = this.expect(), key = token.string || token.text;
		                this.consume(":");
		                var value = this.expression();
		                keyValues.push({ key: key, value: value });
		                if (!value.constant) {
		                    allConstant = false;
		                }
		            } while (this.expect(","));
		        }
		        this.consume("}");
		        return extend(function (self, locals) {
		            var object = {};
		            for (var i = 0; i < keyValues.length; i++) {
		                var keyValue = keyValues[i];
		                object[keyValue.key] = keyValue.value(self, locals);
		            }
		            return object;
		        }, {
		            literal: true,
		            constant: allConstant
		        });
		    };
		    return Parser;
		})();
		function ZERO() { return 0; }
		;
		//////////////////////////////////////////////////
		// Parser helper functions
		//////////////////////////////////////////////////
		function setter(obj, path, setValue, fullExp, options, locals) {
		    var element = path.split("."), key;
		    var i;
		    var propertyObj;
		    var hooks = getRuntimeHooks(locals);
		    if (hooks) {
		        for (var i_1 = 0; element.length > 1; i_1++) {
		            key = ensureSafeMemberName(element.shift(), fullExp);
		            propertyObj = hooks.readFieldHook ?
		                hooks.readFieldHook(obj, key) :
		                obj[key];
		            if (!propertyObj) {
		                propertyObj = {};
		                if (hooks.writeFieldHook)
		                    hooks.writeFieldHook(obj, key, propertyObj);
		                else
		                    obj[key] = propertyObj;
		            }
		            obj = propertyObj;
		        }
		    }
		    else {
		        for (var i_2 = 0; element.length > 1; i_2++) {
		            key = ensureSafeMemberName(element.shift(), fullExp);
		            propertyObj = obj[key];
		            if (!propertyObj) {
		                propertyObj = {};
		                obj[key] = propertyObj;
		            }
		            obj = propertyObj;
		        }
		    }
		    key = ensureSafeMemberName(element.shift(), fullExp);
		    if (hooks && hooks.writeFieldHook)
		        hooks.writeFieldHook(obj, key, setValue);
		    else
		        obj[key] = setValue;
		    return setValue;
		}
		var getterFnCache = {};
		/**
		* Implementation of the "Black Hole" variant from:
		* - http://jsperf.com/angularjs-parse-getter/4
		* - http://jsperf.com/path-evaluation-simplified/7
		*/
		function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, options) {
		    ensureSafeMemberName(key0, fullExp);
		    ensureSafeMemberName(key1, fullExp);
		    ensureSafeMemberName(key2, fullExp);
		    ensureSafeMemberName(key3, fullExp);
		    ensureSafeMemberName(key4, fullExp);
		    return function (scope, locals) {
		        var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope;
		        var hooks = getRuntimeHooks(locals);
		        if (hooks && hooks.readFieldHook) {
		            if (pathVal == null)
		                return pathVal;
		            pathVal = hooks.readFieldHook(pathVal, key0);
		            if (!key1)
		                return pathVal;
		            if (pathVal == null)
		                return undefined;
		            pathVal = hooks.readFieldHook(pathVal, key1);
		            if (!key2)
		                return pathVal;
		            if (pathVal == null)
		                return undefined;
		            pathVal = hooks.readFieldHook(pathVal, key2);
		            if (!key3)
		                return pathVal;
		            if (pathVal == null)
		                return undefined;
		            pathVal = hooks.readFieldHook(pathVal, key3);
		            if (!key4)
		                return pathVal;
		            if (pathVal == null)
		                return undefined;
		            pathVal = hooks.readFieldHook(pathVal, key4);
		            return pathVal;
		        }
		        if (pathVal == null)
		            return pathVal;
		        pathVal = pathVal[key0];
		        if (!key1)
		            return pathVal;
		        if (pathVal == null)
		            return undefined;
		        pathVal = pathVal[key1];
		        if (!key2)
		            return pathVal;
		        if (pathVal == null)
		            return undefined;
		        pathVal = pathVal[key2];
		        if (!key3)
		            return pathVal;
		        if (pathVal == null)
		            return undefined;
		        pathVal = pathVal[key3];
		        if (!key4)
		            return pathVal;
		        if (pathVal == null)
		            return undefined;
		        pathVal = pathVal[key4];
		        return pathVal;
		    };
		}
		function simpleGetterFn1(key0, fullExp) {
		    ensureSafeMemberName(key0, fullExp);
		    return function (scope, locals) {
		        scope = ((locals && locals.hasOwnProperty(key0)) ? locals : scope);
		        if (scope == null)
		            return undefined;
		        var hooks = getRuntimeHooks(locals);
		        if (hooks && hooks.readFieldHook)
		            return hooks.readFieldHook(scope, key0);
		        return scope[key0];
		    };
		}
		function simpleGetterFn2(key0, key1, fullExp) {
		    ensureSafeMemberName(key0, fullExp);
		    ensureSafeMemberName(key1, fullExp);
		    return function (scope, locals) {
		        var hooks = getRuntimeHooks(locals);
		        if (hooks && hooks.readFieldHook) {
		            scope = (locals && locals.hasOwnProperty(key0)) ? locals : scope;
		            if (scope == null)
		                return undefined;
		            scope = hooks.readFieldHook(scope, key0);
		            return scope == null ? undefined : hooks.readFieldHook(scope, key1);
		        }
		        scope = ((locals && locals.hasOwnProperty(key0)) ? locals : scope)[key0];
		        return scope == null ? undefined : scope[key1];
		    };
		}
		function getterFn(path, options, fullExp) {
		    // Check whether the cache has this getter already.
		    // We can use hasOwnProperty directly on the cache because we ensure,
		    // see below, that the cache never stores a path called 'hasOwnProperty'
		    if (getterFnCache.hasOwnProperty(path)) {
		        return getterFnCache[path];
		    }
		    var pathKeys = path.split("."), pathKeysLength = pathKeys.length, fn;
		    // When we have only 1 or 2 tokens, use optimized special case closures.
		    // http://jsperf.com/angularjs-parse-getter/6
		    if (pathKeysLength === 1) {
		        fn = simpleGetterFn1(pathKeys[0], fullExp);
		    }
		    else if (pathKeysLength === 2) {
		        fn = simpleGetterFn2(pathKeys[0], pathKeys[1], fullExp);
		    }
		    else {
		        if (pathKeysLength < 6) {
		            fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options);
		        }
		        else {
		            fn = function (scope, locals) {
		                // backup locals
		                var _locals = {};
		                Object.keys(locals).forEach(function (x) { return _locals[x] = locals[x]; });
		                var i = 0, val;
		                do {
		                    val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals);
		                    scope = val;
		                    // reset locals
		                    locals = {};
		                    Object.keys(_locals).forEach(function (x) { return locals[x] = _locals[x]; });
		                } while (i < pathKeysLength);
		                return val;
		            };
		        }
		    } /* else {
		    let code = "var p;\n";
		    forEach(pathKeys, (key, index) => {
		        ensureSafeMemberName(key, fullExp);
		        code += "if(s == null) return undefined;\n" +
		            "s=" + (index
		                // we simply dereference 's' on any .dot notation
		                ? "s"
		                // but if we are first then we check locals first, and if so read it first
		                : "((k&&k.hasOwnProperty(\"" + key + "\"))?k:s)") + "[\"" + key + "\"]" + ";\n";
		    });
		    code += "return s;";
		
		    // jshint -W054
		    let evaledFnGetter = new Function("s", "k", "pw", code); // s=scope, k=locals, pw=promiseWarning
		    // jshint +W054 /
		    evaledFnGetter.toString = valueFn(code);
		    fn = <(scope: any, locals?: any, self?: any) => any> evaledFnGetter;
		} */
		    // Only cache the value if it's not going to mess up the cache object
		    // This is more performant that using Object.prototype.hasOwnProperty.call
		    if (path !== "hasOwnProperty") {
		        getterFnCache[path] = fn;
		    }
		    return fn;
		}
		function getRuntimeHooks(locals) {
		    return locals !== undefined ? locals[hookField] : undefined;
		}
		exports.getRuntimeHooks = getRuntimeHooks;
		function setRuntimeHooks(locals, hooks) {
		    locals[hookField] = hooks;
		}
		exports.setRuntimeHooks = setRuntimeHooks;
		/**
		 * Compiles src and returns a function that executes src on a target object.
		 * The compiled function is cached under compile.cache[src] to speed up further calls.
		 *
		 * @param {string} src
		 * @returns {function}
		 */
		function compileExpression(src, options, cache) {
		    if (typeof src !== "string") {
		        throw new TypeError("src must be a string, instead saw '" + typeof src + "'");
		    }
		    var lexer = new Lexer({});
		    var parser = new Parser(lexer, options);
		    if (!cache) {
		        return parser.parse(src);
		    }
		    var cached = cache[src];
		    if (!cached) {
		        cached = cache[src] = parser.parse(src);
		    }
		    return cached;
		}
		exports.compileExpression = compileExpression;
		//# sourceMappingURL=ExpressionCompiler.js.map

	/***/ },
	/* 11 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var WeakMap_1 = __webpack_require__(12);
		var Set_1 = __webpack_require__(14);
		var Map_1 = __webpack_require__(15);
		var Injector_1 = __webpack_require__(2);
		var Utils_1 = __webpack_require__(3);
		var res = __webpack_require__(6);
		var env = __webpack_require__(16);
		var ListSupport_1 = __webpack_require__(17);
		"use strict";
		/**
		* The heart of WebRx's binding-system
		* @class
		*/
		var DomManager = (function () {
		    function DomManager(compiler, app) {
		        this.expressionCache = {};
		        this.dataContextExtensions = Set_1.createSet();
		        this.parserOptions = {
		            disallowFunctionCalls: false
		        };
		        this.nodeState = WeakMap_1.createWeakMap();
		        this.compiler = compiler;
		        this.app = app;
		    }
		    DomManager.prototype.applyBindings = function (model, rootNode) {
		        if (rootNode === undefined || rootNode.nodeType !== 1)
		            Utils_1.throwError("first parameter should be your model, second parameter should be a DOM node!");
		        if (this.isNodeBound(rootNode))
		            Utils_1.throwError("an element must not be bound multiple times!");
		        // create or update node state for root node
		        var state = this.getNodeState(rootNode);
		        if (state) {
		            state.model = model;
		        }
		        else {
		            state = this.createNodeState(model);
		            this.setNodeState(rootNode, state);
		        }
		        // calculate resulting data-context and apply bindings
		        var ctx = this.getDataContext(rootNode);
		        this.applyBindingsRecursive(ctx, rootNode);
		    };
		    DomManager.prototype.applyBindingsToDescendants = function (ctx, node) {
		        if (node.hasChildNodes()) {
		            for (var i = 0; i < node.childNodes.length; i++) {
		                var child = node.childNodes[i];
		                // only elements
		                if (child.nodeType !== 1)
		                    continue;
		                this.applyBindingsRecursive(ctx, child);
		            }
		        }
		    };
		    DomManager.prototype.cleanNode = function (rootNode) {
		        if (rootNode.nodeType !== 1)
		            return;
		        this.cleanNodeRecursive(rootNode);
		    };
		    DomManager.prototype.cleanDescendants = function (node) {
		        if (node.hasChildNodes()) {
		            for (var i = 0; i < node.childNodes.length; i++) {
		                var child = node.childNodes[i];
		                // only elements
		                if (child.nodeType !== 1)
		                    continue;
		                this.cleanNodeRecursive(child);
		                this.clearNodeState(child);
		            }
		        }
		    };
		    DomManager.prototype.getObjectLiteralTokens = function (value) {
		        value = value.trim();
		        if (value !== '' && this.isObjectLiteralString(value)) {
		            return this.compiler.parseObjectLiteral(value);
		        }
		        return [];
		    };
		    DomManager.prototype.compileBindingOptions = function (value, module) {
		        value = value.trim();
		        if (value === '') {
		            return null;
		        }
		        if (this.isObjectLiteralString(value)) {
		            var result = {};
		            var tokens = this.compiler.parseObjectLiteral(value);
		            var token;
		            for (var i = 0; i < tokens.length; i++) {
		                token = tokens[i];
		                result[token.key] = this.compileBindingOptions(token.value, module);
		            }
		            return result;
		        }
		        else {
		            // build compiler options
		            var options = Utils_1.extend(this.parserOptions, {});
		            options.filters = {};
		            // enrich with app filters
		            Utils_1.extend(this.app.filters(), options.filters);
		            // enrich with module filters
		            if (module && module.name != "app") {
		                Utils_1.extend(module.filters(), options.filters);
		            }
		            return this.compiler.compileExpression(value, options, this.expressionCache);
		        }
		    };
		    DomManager.prototype.getModuleContext = function (node) {
		        var state;
		        // collect model hierarchy
		        while (node) {
		            state = this.getNodeState(node);
		            if (state != null) {
		                if (state.module != null) {
		                    return state.module;
		                }
		            }
		            node = node.parentNode;
		        }
		        // default to app
		        return this.app;
		    };
		    DomManager.prototype.registerDataContextExtension = function (extension) {
		        this.dataContextExtensions.add(extension);
		    };
		    DomManager.prototype.getDataContext = function (node) {
		        var models = [];
		        var state = this.getNodeState(node);
		        // collect model hierarchy
		        var _node = node;
		        while (_node) {
		            state = state != null ? state : this.getNodeState(_node);
		            if (state != null) {
		                if (state.model != null) {
		                    models.push(state.model);
		                }
		            }
		            state = null;
		            _node = _node.parentNode;
		        }
		        var ctx;
		        if (models.length > 0) {
		            ctx = {
		                $data: models[0],
		                $root: models[models.length - 1],
		                $parent: models.length > 1 ? models[1] : null,
		                $parents: models.slice(1)
		            };
		        }
		        else {
		            ctx = {
		                $data: null,
		                $root: null,
		                $parent: null,
		                $parents: []
		            };
		        }
		        // extensions
		        this.dataContextExtensions.forEach(function (ext) { return ext(node, ctx); });
		        return ctx;
		    };
		    DomManager.prototype.createNodeState = function (model, module) {
		        return {
		            cleanup: new Rx.CompositeDisposable(),
		            model: model,
		            module: module,
		            isBound: false
		        };
		    };
		    DomManager.prototype.isNodeBound = function (node) {
		        var state = this.nodeState.get(node);
		        return state != null && !!state.isBound;
		    };
		    DomManager.prototype.setNodeState = function (node, state) {
		        this.nodeState.set(node, state);
		    };
		    DomManager.prototype.getNodeState = function (node) {
		        return this.nodeState.get(node);
		    };
		    DomManager.prototype.clearNodeState = function (node) {
		        var state = this.nodeState.get(node);
		        if (state != null) {
		            if (state.cleanup != null) {
		                state.cleanup.dispose();
		                state.cleanup = undefined;
		            }
		            state.model = undefined;
		            state.module = undefined;
		            // delete state itself
		            this.nodeState.delete(node);
		        }
		        // support external per-node cleanup
		        env.cleanExternalData(node);
		    };
		    DomManager.prototype.evaluateExpression = function (exp, ctx) {
		        var locals = this.createLocals(undefined, ctx);
		        var result = exp(ctx.$data, locals);
		        return result;
		    };
		    DomManager.prototype.expressionToObservable = function (exp, ctx, evalObs) {
		        var _this = this;
		        var captured = Set_1.createSet();
		        var locals;
		        var result;
		        // initial evaluation
		        try {
		            locals = this.createLocals(captured, ctx);
		            result = exp(ctx.$data, locals);
		            // diagnostics
		            if (evalObs)
		                evalObs.onNext(true);
		        }
		        catch (e) {
		            this.app.defaultExceptionHandler.onNext(e);
		            return Rx.Observable.return(undefined);
		        }
		        // Optimization: If the initial evaluation didn't touch any observables, treat it as constant expression
		        if (captured.size === 0) {
		            if (Utils_1.isRxObservable(result))
		                return result;
		            // wrap it
		            return Rx.Observable.return(result);
		        }
		        // create a subject that receives values from all dependencies
		        var allSeeingEye = new Rx.Subject();
		        // associate observables with subscriptions
		        var subs = Map_1.createMap();
		        // subscribe initial dependencies to subject
		        var arr = Set_1.setToArray(captured);
		        var length = arr.length;
		        var o;
		        for (var i = 0; i < length; i++) {
		            o = arr[i];
		            subs.set(o, o.replay(null, 1).refCount().subscribe(allSeeingEye));
		        }
		        var obs = Rx.Observable.create(function (observer) {
		            var innerDisp = allSeeingEye.subscribe(function (trigger) {
		                try {
		                    var capturedNew = Set_1.createSet();
		                    locals = _this.createLocals(capturedNew, ctx);
		                    // evaluate and produce next value
		                    result = exp(ctx.$data, locals);
		                    // house-keeping: let go of unused observables
		                    var arr_1 = Set_1.setToArray(captured);
		                    var length_1 = arr_1.length;
		                    for (var i = 0; i < length_1; i++) {
		                        o = arr_1[i];
		                        if (!capturedNew.has(o)) {
		                            var disp = subs.get(o);
		                            if (disp != null)
		                                disp.dispose();
		                            subs.delete(o);
		                        }
		                    }
		                    // add new ones
		                    arr_1 = Set_1.setToArray(capturedNew);
		                    length_1 = arr_1.length;
		                    for (var i = 0; i < length_1; i++) {
		                        o = arr_1[i];
		                        captured.add(o);
		                        if (!subs.has(o)) {
		                            subs.set(o, o.replay(null, 1).refCount().subscribe(allSeeingEye));
		                        }
		                    }
		                    // emit new value
		                    if (!Utils_1.isRxObservable(result)) {
		                        // wrap non-observable
		                        observer.onNext(Rx.Observable.return(result));
		                    }
		                    else {
		                        observer.onNext(result);
		                    }
		                    // diagnostics
		                    if (evalObs)
		                        evalObs.onNext(true);
		                }
		                catch (e) {
		                    _this.app.defaultExceptionHandler.onNext(e);
		                }
		            });
		            return Rx.Disposable.create(function () {
		                innerDisp.dispose();
		                // dispose subscriptions
		                subs.forEach(function (value, key, map) {
		                    if (value)
		                        value.dispose();
		                });
		                // cleanup
		                subs.clear();
		                subs = null;
		                captured.clear();
		                captured = null;
		                allSeeingEye.dispose();
		                allSeeingEye = null;
		                locals = null;
		            });
		        });
		        // prefix with initial result
		        var startValue = Utils_1.isRxObservable(result) ?
		            result :
		            Rx.Observable.return(result);
		        return obs.startWith(startValue).concatAll();
		    };
		    DomManager.prototype.applyBindingsInternal = function (ctx, el, module) {
		        var result = false;
		        // get or create elment-state
		        var state = this.getNodeState(el);
		        // create and set if necessary
		        if (!state) {
		            state = this.createNodeState();
		            this.setNodeState(el, state);
		        }
		        else if (state.isBound) {
		            Utils_1.throwError("an element may be bound multiple times!");
		        }
		        var _bindings;
		        var tagName = el.tagName.toLowerCase();
		        // check if tag represents a component
		        if (module.hasComponent(tagName) || this.app.hasComponent(tagName)) {
		            // when a component is referenced as custom-element, apply a virtual 'component' binding
		            var params = el.getAttribute(DomManager.paramsAttributename);
		            var componentReference;
		            if (params)
		                componentReference = "{ name: '" + tagName + "', params: { " + el.getAttribute(DomManager.paramsAttributename) + " }}";
		            else
		                componentReference = "{ name: '" + tagName + "' }";
		            _bindings = [{ key: 'component', value: componentReference }];
		        }
		        else {
		            // get definitions from attribute
		            _bindings = this.getBindingDefinitions(el);
		        }
		        if (_bindings != null && _bindings.length > 0) {
		            // lookup handlers
		            var bindings = _bindings.map(function (x) {
		                var handler = module.binding(x.key);
		                if (!handler)
		                    Utils_1.throwError("binding '{0}' has not been registered.", x.key);
		                return { handler: handler, value: x.value };
		            });
		            // sort by priority
		            bindings.sort(function (a, b) { return (b.handler.priority || 0) - (a.handler.priority || 0); });
		            // check if there's binding-handler competition for descendants (which is illegal)
		            var hd = bindings.filter(function (x) { return x.handler.controlsDescendants; }).map(function (x) { return "'" + x.value + "'"; });
		            if (hd.length > 1) {
		                Utils_1.throwError("bindings {0} are competing for descendants of target element!", hd.join(", "));
		            }
		            result = hd.length > 0;
		            // apply all bindings
		            for (var i = 0; i < bindings.length; i++) {
		                var binding = bindings[i];
		                var handler = binding.handler;
		                handler.applyBinding(el, binding.value, ctx, state, module);
		            }
		        }
		        // mark bound
		        state.isBound = true;
		        return result;
		    };
		    DomManager.prototype.isObjectLiteralString = function (str) {
		        return str[0] === "{" && str[str.length - 1] === "}";
		    };
		    DomManager.prototype.getBindingDefinitions = function (node) {
		        var bindingText = null;
		        if (node.nodeType === 1) {
		            // attempt to get definition from attribute
		            var attr = node.getAttribute(DomManager.bindingAttributeName);
		            if (attr) {
		                bindingText = attr;
		            }
		        }
		        // transform textual binding-definition into a key-value store where
		        // the key is the binding name and the value is its options
		        if (bindingText) {
		            bindingText = bindingText.trim();
		        }
		        if (bindingText)
		            return this.compiler.parseObjectLiteral(bindingText);
		        return null;
		    };
		    DomManager.prototype.applyBindingsRecursive = function (ctx, el, module) {
		        // "module" binding receiving first-class treatment here because it is considered part of the core
		        module = module || this.getModuleContext(el);
		        if (!this.applyBindingsInternal(ctx, el, module) && el.hasChildNodes()) {
		            // module binding might have updated state.module
		            var state = this.getNodeState(el);
		            if (state && state.module)
		                module = state.module;
		            // iterate over descendants
		            for (var i = 0; i < el.childNodes.length; i++) {
		                var child = el.childNodes[i];
		                // only elements
		                if (child.nodeType !== 1)
		                    continue;
		                this.applyBindingsRecursive(ctx, child, module);
		            }
		        }
		    };
		    DomManager.prototype.cleanNodeRecursive = function (node) {
		        if (node.hasChildNodes()) {
		            var length_2 = node.childNodes.length;
		            for (var i = 0; i < length_2; i++) {
		                var child = node.childNodes[i];
		                // only elements
		                if (child.nodeType !== 1)
		                    continue;
		                this.cleanNodeRecursive(child);
		            }
		        }
		        // clear parent after childs
		        this.clearNodeState(node);
		    };
		    DomManager.prototype.createLocals = function (captured, ctx) {
		        var locals = {};
		        var list;
		        var prop;
		        var result, target;
		        var hooks = {
		            readFieldHook: function (o, field) {
		                // handle "@propref" access-modifier
		                var noUnwrap = false;
		                if (field[0] === '@') {
		                    noUnwrap = true;
		                    field = field.substring(1);
		                }
		                result = o[field];
		                // intercept access to observable properties
		                if (!noUnwrap && Utils_1.isProperty(result)) {
		                    var prop_1 = result;
		                    // get the property's real value
		                    result = prop_1();
		                    // register observable
		                    if (captured)
		                        captured.add(prop_1.changed);
		                }
		                return result;
		            },
		            writeFieldHook: function (o, field, newValue) {
		                // ignore @propref access-modifier on writes
		                if (field[0] === '@') {
		                    field = field.substring(1);
		                }
		                target = o[field];
		                // intercept access to observable properties
		                if (Utils_1.isProperty(target)) {
		                    var prop_2 = target;
		                    // register observable
		                    if (captured)
		                        captured.add(prop_2.changed);
		                    // replace field assignment with property invocation
		                    prop_2(newValue);
		                }
		                else {
		                    o[field] = newValue;
		                }
		                return newValue;
		            },
		            readIndexHook: function (o, index) {
		                // recognize observable lists
		                if (ListSupport_1.isList(o)) {
		                    // translate indexer to list.get()
		                    list = o;
		                    result = list.get(index);
		                    // add collectionChanged to monitored observables
		                    if (captured)
		                        captured.add(list.listChanged);
		                }
		                else {
		                    result = o[index];
		                }
		                // intercept access to observable properties
		                if (Utils_1.isProperty(result)) {
		                    var prop_3 = result;
		                    // get the property's real value
		                    result = prop_3();
		                    // register observable
		                    if (captured)
		                        captured.add(prop_3.changed);
		                }
		                return result;
		            },
		            writeIndexHook: function (o, index, newValue) {
		                // recognize observable lists
		                if (ListSupport_1.isList(o)) {
		                    // translate indexer to list.get()
		                    list = o;
		                    target = list.get(index);
		                    // add collectionChanged to monitored observables
		                    if (captured)
		                        captured.add(list.listChanged);
		                    // intercept access to observable properties
		                    if (Utils_1.isProperty(target)) {
		                        prop = target;
		                        // register observable
		                        if (captured)
		                            captured.add(prop.changed);
		                        // replace field assignment with property invocation
		                        prop(newValue);
		                    }
		                    else {
		                        list.set(index, newValue);
		                    }
		                }
		                else {
		                    // intercept access to observable properties
		                    if (Utils_1.isProperty(o[index])) {
		                        prop = target[index];
		                        // register observable
		                        if (captured)
		                            captured.add(prop.changed);
		                        // replace field assignment with property invocation
		                        prop(newValue);
		                    }
		                    else {
		                        o[index] = newValue;
		                    }
		                }
		                return newValue;
		            }
		        };
		        // install property interceptor hooks
		        this.compiler.setRuntimeHooks(locals, hooks);
		        // injected context members into locals
		        var keys = Object.keys(ctx);
		        var length = keys.length;
		        for (var i = 0; i < length; i++) {
		            var key = keys[i];
		            locals[key] = ctx[key];
		        }
		        return locals;
		    };
		    //////////////////////////////////
		    // Implementation
		    DomManager.bindingAttributeName = "data-bind";
		    DomManager.paramsAttributename = "params";
		    return DomManager;
		})();
		exports.DomManager = DomManager;
		/**
		* Applies bindings to the specified node and all of its children using the specified data context.
		* @param {any} model The model to bind to
		* @param {Node} rootNode The node to be bound
		*/
		function applyBindings(model, node) {
		    Injector_1.injector.get(res.domManager).applyBindings(model, node || window.document.documentElement);
		}
		exports.applyBindings = applyBindings;
		/**
		* Removes and cleans up any binding-related state from the specified node and its descendants.
		* @param {Node} rootNode The node to be cleaned
		*/
		function cleanNode(node) {
		    Injector_1.injector.get(res.domManager).cleanNode(node);
		}
		exports.cleanNode = cleanNode;
		//# sourceMappingURL=DomManager.js.map

	/***/ },
	/* 12 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />
		/// <reference path="../Interfaces.ts" />
		var Oid_1 = __webpack_require__(13);
		"use strict";
		/**
		* This class emulates the semantics of a WeakMap.
		* Even though this implementation is indeed "weak", it has the drawback of
		* requiring manual housekeeping of entries otherwise they are kept forever.
		* @class
		*/
		var WeakMapEmulated = (function () {
		    function WeakMapEmulated() {
		        ////////////////////
		        /// Implementation
		        this.inner = {};
		    }
		    ////////////////////
		    /// IWeakMap
		    WeakMapEmulated.prototype.set = function (key, value) {
		        var oid = Oid_1.getOid(key);
		        this.inner[oid] = value;
		    };
		    WeakMapEmulated.prototype.get = function (key) {
		        var oid = Oid_1.getOid(key);
		        return this.inner[oid];
		    };
		    WeakMapEmulated.prototype.has = function (key) {
		        var oid = Oid_1.getOid(key);
		        return this.inner.hasOwnProperty(oid);
		    };
		    WeakMapEmulated.prototype.delete = function (key) {
		        var oid = Oid_1.getOid(key);
		        return delete this.inner[oid];
		    };
		    Object.defineProperty(WeakMapEmulated.prototype, "isEmulated", {
		        get: function () {
		            return true;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    return WeakMapEmulated;
		})();
		function isFunction(o) {
		    return typeof o === 'function';
		}
		var proto = window["WeakMap"] !== undefined ? WeakMap.prototype : undefined;
		var hasNativeSupport = isFunction(window["WeakMap"]) &&
		    isFunction(proto.set) && isFunction(proto.get) &&
		    isFunction(proto.delete) && isFunction(proto.has);
		/**
		* Creates a new WeakMap instance
		* @param {boolean} disableNativeSupport Force creation of an emulated implementation, regardless of browser native support.
		* @return {IWeakMap<TKey, T>} A new instance of a suitable IWeakMap implementation
		*/
		function createWeakMap(disableNativeSupport) {
		    if (disableNativeSupport || !hasNativeSupport) {
		        return new WeakMapEmulated();
		    }
		    return new WeakMap();
		}
		exports.createWeakMap = createWeakMap;
		//# sourceMappingURL=WeakMap.js.map

	/***/ },
	/* 13 */
	/***/ function(module, exports) {

		"use strict";
		var oid = 1;
		var oidPropertyName = "__wx_oid__" + (new Date).getTime();
		/**
		* Returns the objects unique id or assigns it if unassigned
		* @param {any} o
		*/
		function getOid(o) {
		    if (o == null)
		        return undefined;
		    var t = typeof o;
		    if (t === "boolean" || t === "number" || t === "string")
		        return (t + ":" + o);
		    // already set?
		    var result = o[oidPropertyName];
		    if (result !== undefined)
		        return result;
		    // assign new one
		    result = (oid++).toString();
		    // store as non-enumerable property to avoid confusing other libraries
		    Object.defineProperty(o, oidPropertyName, {
		        enumerable: false,
		        configurable: false,
		        writable: false,
		        value: result
		    });
		    return result;
		}
		exports.getOid = getOid;
		//# sourceMappingURL=Oid.js.map

	/***/ },
	/* 14 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />
		/// <reference path="../Interfaces.ts" />
		var Oid_1 = __webpack_require__(13);
		"use strict";
		/**
		* ES6 Set Shim
		* @class
		*/
		var SetEmulated = (function () {
		    function SetEmulated() {
		        ////////////////////
		        /// Implementation
		        this.values = [];
		        this.keys = {};
		    }
		    ////////////////////
		    /// ISet
		    SetEmulated.prototype.add = function (value) {
		        var key = Oid_1.getOid(value);
		        if (!this.keys[key]) {
		            this.values.push(value);
		            this.keys[key] = true;
		        }
		        return this;
		    };
		    SetEmulated.prototype.delete = function (value) {
		        var key = Oid_1.getOid(value);
		        if (this.keys[key]) {
		            var index = this.values.indexOf(value);
		            this.values.splice(index, 1);
		            delete this.keys[key];
		            return true;
		        }
		        return false;
		    };
		    SetEmulated.prototype.has = function (value) {
		        var key = Oid_1.getOid(value);
		        return this.keys.hasOwnProperty(key);
		    };
		    SetEmulated.prototype.clear = function () {
		        this.keys = {};
		        this.values.length = 0;
		    };
		    SetEmulated.prototype.forEach = function (callback, thisArg) {
		        this.values.forEach(callback, thisArg);
		    };
		    Object.defineProperty(SetEmulated.prototype, "size", {
		        get: function () {
		            return this.values.length;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(SetEmulated.prototype, "isEmulated", {
		        get: function () {
		            return true;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    return SetEmulated;
		})();
		function isFunction(o) {
		    return typeof o === 'function';
		}
		var proto = window["Set"] !== undefined ? Set.prototype : undefined;
		var hasNativeSupport = isFunction(window["Set"]) && isFunction(proto.forEach) &&
		    isFunction(proto.add) && isFunction(proto.clear) &&
		    isFunction(proto.delete) && isFunction(proto.has);
		/**
		* Creates a new Set instance
		* @param {boolean} disableNativeSupport Force creation of an emulated implementation, regardless of browser native support.
		* @return {ISet<T>} A new instance of a suitable ISet implementation
		*/
		function createSet(disableNativeSupport) {
		    if (disableNativeSupport || !hasNativeSupport) {
		        return new SetEmulated();
		    }
		    return new Set();
		}
		exports.createSet = createSet;
		/**
		* Extracts the values of a Set by invoking its forEach method and capturing the output
		*/
		function setToArray(src) {
		    var result = new Array();
		    src.forEach(function (x) { return result.push(x); });
		    return result;
		}
		exports.setToArray = setToArray;
		//# sourceMappingURL=Set.js.map

	/***/ },
	/* 15 */
	/***/ function(module, exports) {

		/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />
		/// <reference path="../Interfaces.ts" />
		"use strict";
		/**
		* ES6 Map Shim
		* @class
		*/
		var MapEmulated = (function () {
		    function MapEmulated() {
		        ////////////////////
		        /// Implementation
		        this.cacheSentinel = {};
		        this.keys = [];
		        this.values = [];
		        this.cache = this.cacheSentinel;
		    }
		    Object.defineProperty(MapEmulated.prototype, "size", {
		        ////////////////////
		        /// IMap
		        get: function () {
		            return this.keys.length;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    MapEmulated.prototype.has = function (key) {
		        if (key === this.cache) {
		            return true;
		        }
		        if (this.find(key) >= 0) {
		            this.cache = key;
		            return true;
		        }
		        return false;
		    };
		    MapEmulated.prototype.get = function (key) {
		        var index = this.find(key);
		        if (index >= 0) {
		            this.cache = key;
		            return this.values[index];
		        }
		        return undefined;
		    };
		    MapEmulated.prototype.set = function (key, value) {
		        this.delete(key);
		        this.keys.push(key);
		        this.values.push(value);
		        this.cache = key;
		        return this;
		    };
		    MapEmulated.prototype.delete = function (key) {
		        var index = this.find(key);
		        if (index >= 0) {
		            this.keys.splice(index, 1);
		            this.values.splice(index, 1);
		            this.cache = this.cacheSentinel;
		            return true;
		        }
		        return false;
		    };
		    MapEmulated.prototype.clear = function () {
		        this.keys.length = 0;
		        this.values.length = 0;
		        this.cache = this.cacheSentinel;
		    };
		    MapEmulated.prototype.forEach = function (callback, thisArg) {
		        var size = this.size;
		        for (var i = 0; i < size; ++i) {
		            var key = this.keys[i];
		            var value = this.values[i];
		            this.cache = key;
		            callback.call(this, value, key, this);
		        }
		    };
		    Object.defineProperty(MapEmulated.prototype, "isEmulated", {
		        get: function () {
		            return true;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    MapEmulated.prototype.find = function (key) {
		        var keys = this.keys;
		        var size = keys.length;
		        for (var i = 0; i < size; ++i) {
		            if (keys[i] === key) {
		                return i;
		            }
		        }
		        return -1;
		    };
		    return MapEmulated;
		})();
		function isFunction(o) {
		    return typeof o === 'function';
		}
		var proto = window["Map"] !== undefined ? Map.prototype : undefined;
		var hasNativeSupport = isFunction(window["Map"]) && isFunction(proto.forEach) &&
		    isFunction(proto.set) && isFunction(proto.clear) &&
		    isFunction(proto.delete) && isFunction(proto.has);
		/**
		* Creates a new WeakMap instance
		* @param {boolean} disableNativeSupport Force creation of an emulated implementation, regardless of browser native support.
		* @return {IWeakMap<TKey, T>} A new instance of a suitable IWeakMap implementation
		*/
		function createMap(disableNativeSupport) {
		    if (disableNativeSupport || !hasNativeSupport) {
		        return new MapEmulated();
		    }
		    return new Map();
		}
		exports.createMap = createMap;
		//# sourceMappingURL=Map.js.map

	/***/ },
	/* 16 */
	/***/ function(module, exports, __webpack_require__) {

		var WeakMap_1 = __webpack_require__(12);
		"use strict";
		var _window = window;
		var userAgent = _window.navigator.userAgent;
		var parseVersion = function (matches) {
		    if (matches) {
		        return parseFloat(matches[1]);
		    }
		    return undefined;
		};
		// Detect Opera
		if (_window.opera && _window.opera.version) {
		    exports.opera = { version: parseInt(_window.opera.version()) };
		}
		// Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
		// Note that, since IE 10 does not support conditional comments, the following logic only detects IE < 10.
		// Currently this is by design, since IE 10+ behaves correctly when treated as a standard browser.
		var version = document && (function () {
		    var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');
		    // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
		    while (div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
		        iElems[0]) { }
		    return version > 4 ? version : undefined;
		}());
		if (version) {
		    exports.ie = { version: version };
		    if (version < 10) {
		        // for IE9 and lower, provide an accessor for document scoped
		        // observables which allow monitoring the selectionchange event
		        var map = WeakMap_1.createWeakMap();
		        exports.ie.getSelectionChangeObservable = function (el) {
		            var doc = el.ownerDocument;
		            var result = map.get(doc);
		            if (result)
		                return result;
		            result = Rx.Observable.defer(function () {
		                return Rx.Observable.fromEvent(doc, 'selectionchange');
		            })
		                .select(function (x) { return doc; })
		                .publish()
		                .refCount();
		            map.set(doc, result);
		            return result;
		        };
		    }
		}
		// Detect Safari (not Chrome or WebKit)
		version = parseVersion(userAgent.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i));
		if (version) {
		    exports.safari = { version: version };
		}
		// Detect FF
		version = parseVersion(userAgent.match(/Firefox\/([^ ]*)/));
		if (version) {
		    exports.firefox = { version: version };
		}
		var hasES5 = typeof Array.isArray === "function" &&
		    typeof [].forEach === "function" &&
		    typeof [].map === "function" &&
		    typeof [].some === "function" &&
		    typeof [].indexOf === "function" &&
		    typeof Object.keys === "function" &&
		    typeof Object.defineProperty === "function";
		exports.isSupported = (!exports.ie || exports.ie.version >= 9) ||
		    (!exports.safari || exports.safari.version >= 5) ||
		    (!exports.firefox || exports.firefox.version >= 5) &&
		        hasES5;
		// Special support for jQuery here because it's so commonly used.
		exports.jQueryInstance = window["jQuery"];
		if (exports.jQueryInstance && (typeof exports.jQueryInstance['cleanData'] === "function")) {
		    exports.cleanExternalData = function (node) {
		        // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
		        // so notify it to tear down any resources associated with the node.
		        exports.jQueryInstance['cleanData']([node]);
		    };
		}
		else {
		    exports.cleanExternalData = function (node) { };
		}
		//# sourceMappingURL=Environment.js.map

	/***/ },
	/* 17 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var List_1 = __webpack_require__(18);
		var ListPaged_1 = __webpack_require__(22);
		"use strict";
		/**
		* Determines if target is an instance of a IObservableList
		* @param {any} target The object to test
		*/
		function isList(target) {
		    if (target == null)
		        return false;
		    return target instanceof List_1.ObservableList ||
		        target instanceof ListPaged_1.PagedObservableListProjection;
		}
		exports.isList = isList;
		//# sourceMappingURL=ListSupport.js.map

	/***/ },
	/* 18 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var Utils_1 = __webpack_require__(3);
		var Oid_1 = __webpack_require__(13);
		var IID_1 = __webpack_require__(5);
		var Lazy_1 = __webpack_require__(19);
		var ScheduledSubject_1 = __webpack_require__(20);
		var Events_1 = __webpack_require__(4);
		var RefCountDisposeWrapper_1 = __webpack_require__(21);
		var log = __webpack_require__(7);
		var Injector_1 = __webpack_require__(2);
		var res = __webpack_require__(6);
		var ListPaged_1 = __webpack_require__(22);
		"use strict";
		/**
		* ReactiveUI's awesome ReactiveList ported to Typescript
		* @class
		*/
		var ObservableList = (function () {
		    function ObservableList(initialContents, resetChangeThreshold, scheduler) {
		        if (resetChangeThreshold === void 0) { resetChangeThreshold = 0.3; }
		        if (scheduler === void 0) { scheduler = null; }
		        //////////////////////////
		        // Some array convenience members
		        this.push = this.add;
		        this.changeNotificationsSuppressed = 0;
		        this.propertyChangeWatchers = null;
		        this.resetChangeThreshold = 0;
		        this.resetSubCount = 0;
		        this.hasWhinedAboutNoResetSub = false;
		        this.readonlyExceptionMessage = "Derived collections cannot be modified.";
		        this.disposables = new Rx.CompositeDisposable();
		        this.app = Injector_1.injector.get(res.app);
		        this.setupRx(initialContents, resetChangeThreshold, scheduler);
		    }
		    //////////////////////////////////
		    // IUnknown implementation
		    ObservableList.prototype.queryInterface = function (iid) {
		        return iid === IID_1.default.IObservableList || iid === IID_1.default.IDisposable;
		    };
		    //////////////////////////////////
		    // IDisposable implementation
		    ObservableList.prototype.dispose = function () {
		        this.clearAllPropertyChangeWatchers();
		        this.disposables.dispose();
		    };
		    Object.defineProperty(ObservableList.prototype, "itemsAdded", {
		        ////////////////////
		        /// IObservableList<T>
		        get: function () {
		            if (!this._itemsAdded)
		                this._itemsAdded = this.itemsAddedSubject.value.asObservable();
		            return this._itemsAdded;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "beforeItemsAdded", {
		        get: function () {
		            if (!this._beforeItemsAdded)
		                this._beforeItemsAdded = this.beforeItemsAddedSubject.value.asObservable();
		            return this._beforeItemsAdded;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "itemsRemoved", {
		        get: function () {
		            if (!this._itemsRemoved)
		                this._itemsRemoved = this.itemsRemovedSubject.value.asObservable();
		            return this._itemsRemoved;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "beforeItemsRemoved", {
		        get: function () {
		            if (!this._beforeItemsRemoved)
		                this._beforeItemsRemoved = this.beforeItemsRemovedSubject.value.asObservable();
		            return this._beforeItemsRemoved;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "itemReplaced", {
		        get: function () {
		            if (!this._itemReplaced)
		                this._itemReplaced = this.itemReplacedSubject.value.asObservable();
		            return this._itemReplaced;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "beforeItemReplaced", {
		        get: function () {
		            if (!this._beforeItemReplaced)
		                this._beforeItemReplaced = this.beforeItemReplacedSubject.value.asObservable();
		            return this._beforeItemReplaced;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "beforeItemsMoved", {
		        get: function () {
		            if (!this._beforeItemsMoved)
		                this._beforeItemsMoved = this.beforeItemsMovedSubject.value.asObservable();
		            return this._beforeItemsMoved;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "itemsMoved", {
		        get: function () {
		            if (!this._itemsMoved)
		                this._itemsMoved = this.itemsMovedSubject.value.asObservable();
		            return this._itemsMoved;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "lengthChanging", {
		        get: function () {
		            var _this = this;
		            if (!this._lengthChanging)
		                this._lengthChanging = this.listChanging.select(function (_) {
		                    return _this.inner.length;
		                }).distinctUntilChanged();
		            return this._lengthChanging;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "lengthChanged", {
		        get: function () {
		            var _this = this;
		            if (!this._lengthChanged)
		                this._lengthChanged = this.listChanged.select(function (_) {
		                    return _this.inner.length;
		                }).distinctUntilChanged();
		            return this._lengthChanged;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "itemChanging", {
		        get: function () {
		            if (!this._itemChanging)
		                this._itemChanging = this.itemChangingSubject.value.asObservable();
		            return this._itemChanging;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "itemChanged", {
		        get: function () {
		            if (!this._itemChanged)
		                this._itemChanged = this.itemChangedSubject.value.asObservable();
		            return this._itemChanged;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "shouldReset", {
		        get: function () {
		            var _this = this;
		            return this.refcountSubscribers(this.listChanged.selectMany(function (x) { return !x ? Rx.Observable.empty() :
		                Rx.Observable.return(null); }), function (x) { return _this.resetSubCount += x; });
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "changeTrackingEnabled", {
		        get: function () {
		            return this.propertyChangeWatchers != null;
		        },
		        set: function (newValue) {
		            var _this = this;
		            if (this.propertyChangeWatchers != null && newValue)
		                return;
		            if (this.propertyChangeWatchers == null && !newValue)
		                return;
		            if (newValue) {
		                this.propertyChangeWatchers = {};
		                this.inner.forEach(function (x) { return _this.addItemToPropertyTracking(x); });
		            }
		            else {
		                this.clearAllPropertyChangeWatchers();
		                this.propertyChangeWatchers = null;
		            }
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(ObservableList.prototype, "isReadOnly", {
		        get: function () {
		            return false;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    ObservableList.prototype.addRange = function (items) {
		        var _this = this;
		        if (items == null) {
		            Utils_1.throwError("items");
		        }
		        var disp = this.isLengthAboveResetThreshold(items.length) ? this.suppressChangeNotifications() : Rx.Disposable.empty;
		        Utils_1.using(disp, function () {
		            // reset notification
		            if (!_this.areChangeNotificationsEnabled()) {
		                // this._inner.splice(this._inner.length, 0, items)
		                Array.prototype.push.apply(_this.inner, items);
		                if (_this.changeTrackingEnabled) {
		                    items.forEach(function (x) {
		                        _this.addItemToPropertyTracking(x);
		                    });
		                }
		            }
		            else {
		                var from = _this.inner.length; // need to capture this before "inner" gets modified
		                if (_this.beforeItemsAddedSubject.isValueCreated) {
		                    _this.beforeItemsAddedSubject.value.onNext({ items: items, from: from });
		                }
		                Array.prototype.push.apply(_this.inner, items);
		                if (_this.itemsAddedSubject.isValueCreated) {
		                    _this.itemsAddedSubject.value.onNext({ items: items, from: from });
		                }
		                if (_this.changeTrackingEnabled) {
		                    items.forEach(function (x) {
		                        _this.addItemToPropertyTracking(x);
		                    });
		                }
		            }
		        });
		    };
		    ObservableList.prototype.insertRange = function (index, items) {
		        var _this = this;
		        if (items == null) {
		            Utils_1.throwError("collection");
		        }
		        if (index > this.inner.length) {
		            Utils_1.throwError("index");
		        }
		        var disp = this.isLengthAboveResetThreshold(items.length) ? this.suppressChangeNotifications() : Rx.Disposable.empty;
		        Utils_1.using(disp, function () {
		            // reset notification
		            if (!_this.areChangeNotificationsEnabled()) {
		                // this._inner.splice(index, 0, items)
		                Array.prototype.splice.apply(_this.inner, [index, 0].concat(items));
		                if (_this.changeTrackingEnabled) {
		                    items.forEach(function (x) {
		                        _this.addItemToPropertyTracking(x);
		                    });
		                }
		            }
		            else {
		                if (_this.beforeItemsAddedSubject.isValueCreated) {
		                    _this.beforeItemsAddedSubject.value.onNext({ items: items, from: index });
		                }
		                Array.prototype.splice.apply(_this.inner, [index, 0].concat(items));
		                if (_this.itemsAddedSubject.isValueCreated) {
		                    _this.itemsAddedSubject.value.onNext({ items: items, from: index });
		                }
		                if (_this.changeTrackingEnabled) {
		                    items.forEach(function (x) {
		                        _this.addItemToPropertyTracking(x);
		                    });
		                }
		            }
		        });
		    };
		    ObservableList.prototype.removeAll = function (items) {
		        var _this = this;
		        if (items == null) {
		            Utils_1.throwError("items");
		        }
		        var disp = this.isLengthAboveResetThreshold(items.length) ?
		            this.suppressChangeNotifications() : Rx.Disposable.empty;
		        Utils_1.using(disp, function () {
		            // NB: If we don't do this, we'll break Collection<T>'s
		            // accounting of the length
		            items.forEach(function (x) { return _this.remove(x); });
		        });
		    };
		    ObservableList.prototype.removeRange = function (index, count) {
		        var _this = this;
		        var disp = this.isLengthAboveResetThreshold(count) ? this.suppressChangeNotifications() : Rx.Disposable.empty;
		        Utils_1.using(disp, function () {
		            // construct items
		            var items = _this.inner.slice(index, index + count);
		            // reset notification
		            if (!_this.areChangeNotificationsEnabled()) {
		                _this.inner.splice(index, count);
		                if (_this.changeTrackingEnabled) {
		                    items.forEach(function (x) {
		                        _this.removeItemFromPropertyTracking(x);
		                    });
		                }
		            }
		            else {
		                if (_this.beforeItemsRemovedSubject.isValueCreated) {
		                    _this.beforeItemsRemovedSubject.value.onNext({ items: items, from: index });
		                }
		                _this.inner.splice(index, count);
		                if (_this.changeTrackingEnabled) {
		                    items.forEach(function (x) {
		                        _this.removeItemFromPropertyTracking(x);
		                    });
		                }
		                if (_this.itemsRemovedSubject.isValueCreated) {
		                    _this.itemsRemovedSubject.value.onNext({ items: items, from: index });
		                }
		            }
		        });
		    };
		    ObservableList.prototype.toArray = function () {
		        return this.inner;
		    };
		    ObservableList.prototype.reset = function (contents) {
		        var _this = this;
		        if (contents == null) {
		            this.publishResetNotification();
		        }
		        else {
		            Utils_1.using(this.suppressChangeNotifications(), function (suppress) {
		                _this.clear();
		                _this.addRange(contents);
		            });
		        }
		    };
		    ObservableList.prototype.add = function (item) {
		        this.insertItem(this.inner.length, item);
		    };
		    ObservableList.prototype.clear = function () {
		        this.clearItems();
		    };
		    ObservableList.prototype.contains = function (item) {
		        return this.inner.indexOf(item) !== -1;
		    };
		    ObservableList.prototype.remove = function (item) {
		        var index = this.inner.indexOf(item);
		        if (index === -1)
		            return false;
		        this.removeItem(index);
		        return true;
		    };
		    ObservableList.prototype.indexOf = function (item) {
		        return this.inner.indexOf(item);
		    };
		    ObservableList.prototype.insert = function (index, item) {
		        this.insertItem(index, item);
		    };
		    ObservableList.prototype.removeAt = function (index) {
		        this.removeItem(index);
		    };
		    ObservableList.prototype.move = function (oldIndex, newIndex) {
		        this.moveItem(oldIndex, newIndex);
		    };
		    ObservableList.prototype.project = function () {
		        var args = Utils_1.args2Array(arguments);
		        var filter = args.shift();
		        if (filter != null && Utils_1.isRxObservable(filter)) {
		            return new ObservableListProjection(this, undefined, undefined, undefined, filter, args.shift());
		        }
		        var orderer = args.shift();
		        if (orderer != null && Utils_1.isRxObservable(orderer)) {
		            return new ObservableListProjection(this, filter, undefined, undefined, orderer, args.shift());
		        }
		        var selector = args.shift();
		        if (selector != null && Utils_1.isRxObservable(selector)) {
		            return new ObservableListProjection(this, filter, orderer, undefined, selector, args.shift());
		        }
		        return new ObservableListProjection(this, filter, orderer, selector, args.shift(), args.shift());
		    };
		    ObservableList.prototype.page = function (pageSize, currentPage, scheduler) {
		        return new ListPaged_1.PagedObservableListProjection(this, pageSize, currentPage, scheduler);
		    };
		    ObservableList.prototype.suppressChangeNotifications = function () {
		        var _this = this;
		        this.changeNotificationsSuppressed++;
		        if (!this.hasWhinedAboutNoResetSub && this.resetSubCount === 0 && !Utils_1.isInUnitTest()) {
		            log.hint("suppressChangeNotifications was called (perhaps via addRange), yet you do not have a subscription to shouldReset. This probably isn't what you want, as itemsAdded and friends will appear to 'miss' items");
		            this.hasWhinedAboutNoResetSub = true;
		        }
		        return Rx.Disposable.create(function () {
		            _this.changeNotificationsSuppressed--;
		            if (_this.changeNotificationsSuppressed === 0) {
		                _this.publishBeforeResetNotification();
		                _this.publishResetNotification();
		            }
		        });
		    };
		    ObservableList.prototype.get = function (index) {
		        return this.inner[index];
		    };
		    ObservableList.prototype.set = function (index, item) {
		        if (!this.areChangeNotificationsEnabled()) {
		            if (this.changeTrackingEnabled) {
		                this.removeItemFromPropertyTracking(this.inner[index]);
		                this.addItemToPropertyTracking(item);
		            }
		            this.inner[index] = item;
		            return;
		        }
		        if (this.beforeItemReplacedSubject.isValueCreated)
		            this.beforeItemReplacedSubject.value.onNext({ from: index, items: [item] });
		        if (this.changeTrackingEnabled) {
		            this.removeItemFromPropertyTracking(this.inner[index]);
		            this.addItemToPropertyTracking(item);
		        }
		        this.inner[index] = item;
		        if (this.itemReplacedSubject.isValueCreated)
		            this.itemReplacedSubject.value.onNext({ from: index, items: [item] });
		    };
		    ObservableList.prototype.sort = function (comparison) {
		        this.publishBeforeResetNotification();
		        this.inner.sort(comparison);
		        this.publishResetNotification();
		    };
		    ObservableList.prototype.forEach = function (callbackfn, thisArg) {
		        this.inner.forEach(callbackfn, thisArg);
		    };
		    ObservableList.prototype.map = function (callbackfn, thisArg) {
		        return this.inner.map(callbackfn, thisArg);
		    };
		    ObservableList.prototype.filter = function (callbackfn, thisArg) {
		        return this.inner.filter(callbackfn, thisArg);
		    };
		    ObservableList.prototype.some = function (callbackfn, thisArg) {
		        return this.inner.some(callbackfn, thisArg);
		    };
		    ObservableList.prototype.every = function (callbackfn, thisArg) {
		        return this.inner.every(callbackfn, thisArg);
		    };
		    ObservableList.prototype.setupRx = function (initialContents, resetChangeThreshold, scheduler) {
		        if (resetChangeThreshold === void 0) { resetChangeThreshold = 0.3; }
		        if (scheduler === void 0) { scheduler = null; }
		        scheduler = scheduler || Injector_1.injector.get(res.app).mainThreadScheduler;
		        this.resetChangeThreshold = resetChangeThreshold;
		        if (this.inner === undefined)
		            this.inner = new Array();
		        this.beforeItemsAddedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.itemsAddedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.beforeItemsRemovedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.itemsRemovedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.beforeItemReplacedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.itemReplacedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.resetSubject = new Rx.Subject();
		        this.beforeResetSubject = new Rx.Subject();
		        this.itemChangingSubject = new Lazy_1.default(function () {
		            return ScheduledSubject_1.createScheduledSubject(scheduler);
		        });
		        this.itemChangedSubject = new Lazy_1.default(function () {
		            return ScheduledSubject_1.createScheduledSubject(scheduler);
		        });
		        this.beforeItemsMovedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.itemsMovedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.listChanged = Rx.Observable.merge(this.itemsAdded.select(function (x) { return false; }), this.itemsRemoved.select(function (x) { return false; }), this.itemReplaced.select(function (x) { return false; }), this.itemsMoved.select(function (x) { return false; }), this.resetSubject.select(function (x) { return true; }))
		            .publish()
		            .refCount();
		        this.listChanging = Rx.Observable.merge(this.beforeItemsAdded.select(function (x) { return false; }), this.beforeItemsRemoved.select(function (x) { return false; }), this.beforeItemReplaced.select(function (x) { return false; }), this.beforeItemsMoved.select(function (x) { return false; }), this.beforeResetSubject.select(function (x) { return true; }))
		            .publish()
		            .refCount();
		        if (initialContents) {
		            Array.prototype.splice.apply(this.inner, [0, 0].concat(initialContents));
		        }
		        this.length = this.lengthChanged.toProperty(this.inner.length);
		        this.disposables.add(this.length);
		        this.isEmpty = this.lengthChanged
		            .select(function (x) { return (x === 0); })
		            .toProperty(this.inner.length === 0);
		        this.disposables.add(this.isEmpty);
		    };
		    ObservableList.prototype.areChangeNotificationsEnabled = function () {
		        return this.changeNotificationsSuppressed === 0;
		    };
		    ObservableList.prototype.insertItem = function (index, item) {
		        if (!this.areChangeNotificationsEnabled()) {
		            this.inner.splice(index, 0, item);
		            if (this.changeTrackingEnabled)
		                this.addItemToPropertyTracking(item);
		            return;
		        }
		        if (this.beforeItemsAddedSubject.isValueCreated)
		            this.beforeItemsAddedSubject.value.onNext({ items: [item], from: index });
		        this.inner.splice(index, 0, item);
		        if (this.itemsAddedSubject.isValueCreated)
		            this.itemsAddedSubject.value.onNext({ items: [item], from: index });
		        if (this.changeTrackingEnabled)
		            this.addItemToPropertyTracking(item);
		    };
		    ObservableList.prototype.removeItem = function (index) {
		        var item = this.inner[index];
		        if (!this.areChangeNotificationsEnabled()) {
		            this.inner.splice(index, 1);
		            if (this.changeTrackingEnabled)
		                this.removeItemFromPropertyTracking(item);
		            return;
		        }
		        if (this.beforeItemsRemovedSubject.isValueCreated)
		            this.beforeItemsRemovedSubject.value.onNext({ items: [item], from: index });
		        this.inner.splice(index, 1);
		        if (this.itemsRemovedSubject.isValueCreated)
		            this.itemsRemovedSubject.value.onNext({ items: [item], from: index });
		        if (this.changeTrackingEnabled)
		            this.removeItemFromPropertyTracking(item);
		    };
		    ObservableList.prototype.moveItem = function (oldIndex, newIndex) {
		        var item = this.inner[oldIndex];
		        if (!this.areChangeNotificationsEnabled()) {
		            this.inner.splice(oldIndex, 1);
		            this.inner.splice(newIndex, 0, item);
		            return;
		        }
		        var mi = { items: [item], from: oldIndex, to: newIndex };
		        if (this.beforeItemsMovedSubject.isValueCreated)
		            this.beforeItemsMovedSubject.value.onNext(mi);
		        this.inner.splice(oldIndex, 1);
		        this.inner.splice(newIndex, 0, item);
		        if (this.itemsMovedSubject.isValueCreated)
		            this.itemsMovedSubject.value.onNext(mi);
		    };
		    ObservableList.prototype.clearItems = function () {
		        if (!this.areChangeNotificationsEnabled()) {
		            this.inner.length = 0; // see http://stackoverflow.com/a/1232046/88513
		            if (this.changeTrackingEnabled)
		                this.clearAllPropertyChangeWatchers();
		            return;
		        }
		        this.publishBeforeResetNotification();
		        this.inner.length = 0; // see http://stackoverflow.com/a/1232046/88513
		        this.publishResetNotification();
		        if (this.changeTrackingEnabled)
		            this.clearAllPropertyChangeWatchers();
		    };
		    ObservableList.prototype.addItemToPropertyTracking = function (toTrack) {
		        var rcd = this.propertyChangeWatchers[Oid_1.getOid(toTrack)];
		        var self = this;
		        if (rcd) {
		            rcd.addRef();
		            return;
		        }
		        var changing = Utils_1.observeObject(toTrack, this.app.defaultExceptionHandler, true)
		            .select(function (i) { return new Events_1.PropertyChangedEventArgs(toTrack, i.propertyName); });
		        var changed = Utils_1.observeObject(toTrack, this.app.defaultExceptionHandler, false)
		            .select(function (i) { return new Events_1.PropertyChangedEventArgs(toTrack, i.propertyName); });
		        var disp = new Rx.CompositeDisposable(changing.where(function (_) { return self.areChangeNotificationsEnabled(); }).subscribe(function (x) { return self.itemChangingSubject.value.onNext(x); }), changed.where(function (_) { return self.areChangeNotificationsEnabled(); }).subscribe(function (x) { return self.itemChangedSubject.value.onNext(x); }));
		        this.propertyChangeWatchers[Oid_1.getOid(toTrack)] = new RefCountDisposeWrapper_1.default(Rx.Disposable.create(function () {
		            disp.dispose();
		            delete self.propertyChangeWatchers[Oid_1.getOid(toTrack)];
		        }));
		    };
		    ObservableList.prototype.removeItemFromPropertyTracking = function (toUntrack) {
		        var rcd = this.propertyChangeWatchers[Oid_1.getOid(toUntrack)];
		        if (rcd) {
		            rcd.release();
		        }
		    };
		    ObservableList.prototype.clearAllPropertyChangeWatchers = function () {
		        var _this = this;
		        if (this.propertyChangeWatchers != null) {
		            Object.keys(this.propertyChangeWatchers).forEach(function (x) {
		                _this.propertyChangeWatchers[x].release();
		            });
		            this.propertyChangeWatchers = null;
		        }
		    };
		    ObservableList.prototype.refcountSubscribers = function (input, block) {
		        return Rx.Observable.create(function (subj) {
		            block(1);
		            return new Rx.CompositeDisposable(input.subscribe(subj), Rx.Disposable.create(function () { return block(-1); }));
		        });
		    };
		    ObservableList.prototype.publishResetNotification = function () {
		        this.resetSubject.onNext(true);
		    };
		    ObservableList.prototype.publishBeforeResetNotification = function () {
		        this.beforeResetSubject.onNext(true);
		    };
		    ObservableList.prototype.isLengthAboveResetThreshold = function (toChangeLength) {
		        return toChangeLength / this.inner.length > this.resetChangeThreshold && toChangeLength > 10;
		    };
		    return ObservableList;
		})();
		exports.ObservableList = ObservableList;
		/**
		* Creates a new observable list with optional default contents
		* @param {Array<T>} initialContents The initial contents of the list
		* @param {number = 0.3} resetChangeThreshold
		*/
		function list(initialContents, resetChangeThreshold, scheduler) {
		    if (resetChangeThreshold === void 0) { resetChangeThreshold = 0.3; }
		    if (scheduler === void 0) { scheduler = null; }
		    return new ObservableList(initialContents, resetChangeThreshold, scheduler);
		}
		exports.list = list;
		var ObservableListProjection = (function (_super) {
		    __extends(ObservableListProjection, _super);
		    function ObservableListProjection(source, filter, orderer, selector, refreshTrigger, scheduler) {
		        _super.call(this);
		        // This list maps indices in this collection to their corresponding indices in the source collection.
		        this.indexToSourceIndexMap = [];
		        this.sourceCopy = [];
		        this.disp = new Rx.CompositeDisposable();
		        this.source = source;
		        this.selector = selector || (function (x) { return x; });
		        this._filter = filter;
		        this.orderer = orderer;
		        this.refreshTrigger = refreshTrigger;
		        this.scheduler = scheduler || Rx.Scheduler.immediate;
		        this.addAllItemsFromSourceCollection();
		        this.wireUpChangeNotifications();
		    }
		    Object.defineProperty(ObservableListProjection.prototype, "isReadOnly", {
		        //////////////////////////////////
		        // ObservableList overrides to enforce readonly contract
		        get: function () {
		            return true;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    ObservableListProjection.prototype.set = function (index, item) {
		        Utils_1.throwError(this.readonlyExceptionMessage);
		    };
		    ObservableListProjection.prototype.addRange = function (items) {
		        Utils_1.throwError(this.readonlyExceptionMessage);
		    };
		    ObservableListProjection.prototype.insertRange = function (index, items) {
		        Utils_1.throwError(this.readonlyExceptionMessage);
		    };
		    ObservableListProjection.prototype.removeAll = function (items) {
		        Utils_1.throwError(this.readonlyExceptionMessage);
		    };
		    ObservableListProjection.prototype.removeRange = function (index, count) {
		        Utils_1.throwError(this.readonlyExceptionMessage);
		    };
		    ObservableListProjection.prototype.add = function (item) {
		        Utils_1.throwError(this.readonlyExceptionMessage);
		    };
		    ObservableListProjection.prototype.clear = function () {
		        Utils_1.throwError(this.readonlyExceptionMessage);
		    };
		    ObservableListProjection.prototype.remove = function (item) {
		        Utils_1.throwError(this.readonlyExceptionMessage);
		        return undefined;
		    };
		    ObservableListProjection.prototype.insert = function (index, item) {
		        Utils_1.throwError(this.readonlyExceptionMessage);
		    };
		    ObservableListProjection.prototype.removeAt = function (index) {
		        Utils_1.throwError(this.readonlyExceptionMessage);
		    };
		    ObservableListProjection.prototype.move = function (oldIndex, newIndex) {
		        Utils_1.throwError(this.readonlyExceptionMessage);
		    };
		    ObservableListProjection.prototype.sort = function (comparison) {
		        Utils_1.throwError(this.readonlyExceptionMessage);
		    };
		    ObservableListProjection.prototype.reset = function () {
		        var _this = this;
		        Utils_1.using(_super.prototype.suppressChangeNotifications.call(this), function () {
		            _super.prototype.clear.call(_this);
		            _this.indexToSourceIndexMap = [];
		            _this.sourceCopy = [];
		            _this.addAllItemsFromSourceCollection();
		        });
		    };
		    //////////////////////////////////
		    // IDisposable implementation
		    ObservableListProjection.prototype.dispose = function () {
		        this.disp.dispose();
		        _super.prototype.dispose.call(this);
		    };
		    ObservableListProjection.prototype.referenceEquals = function (a, b) {
		        return Oid_1.getOid(a) === Oid_1.getOid(b);
		    };
		    ObservableListProjection.prototype.refresh = function () {
		        var length = this.sourceCopy.length;
		        var sourceCopyIds = this.sourceCopy.map(function (x) { return Oid_1.getOid(x); });
		        for (var i = 0; i < length; i++) {
		            this.onItemChanged(this.sourceCopy[i], sourceCopyIds);
		        }
		    };
		    ObservableListProjection.prototype.wireUpChangeNotifications = function () {
		        var _this = this;
		        this.disp.add(this.source.itemsAdded.observeOn(this.scheduler).subscribe(function (e) {
		            _this.onItemsAdded(e);
		        }));
		        this.disp.add(this.source.itemsRemoved.observeOn(this.scheduler).subscribe(function (e) {
		            _this.onItemsRemoved(e);
		        }));
		        this.disp.add(this.source.itemsMoved.observeOn(this.scheduler).subscribe(function (e) {
		            _this.onItemsMoved(e);
		        }));
		        this.disp.add(this.source.itemReplaced.observeOn(this.scheduler).subscribe(function (e) {
		            _this.onItemsReplaced(e);
		        }));
		        this.disp.add(this.source.shouldReset.observeOn(this.scheduler).subscribe(function (e) {
		            _this.reset();
		        }));
		        this.disp.add(this.source.itemChanged.select(function (x) { return x.sender; })
		            .observeOn(this.scheduler)
		            .subscribe(function (x) { return _this.onItemChanged(x); }));
		        if (this.refreshTrigger != null) {
		            this.disp.add(this.refreshTrigger.observeOn(this.scheduler).subscribe(function (_) { return _this.refresh(); }));
		        }
		    };
		    ObservableListProjection.prototype.onItemsAdded = function (e) {
		        this.shiftIndicesAtOrOverThreshold(e.from, e.items.length);
		        for (var i = 0; i < e.items.length; i++) {
		            var sourceItem = e.items[i];
		            this.sourceCopy.splice(e.from + i, 0, sourceItem);
		            if (this._filter && !this._filter(sourceItem)) {
		                continue;
		            }
		            var destinationItem = this.selector(sourceItem);
		            this.insertAndMap(e.from + i, destinationItem);
		        }
		    };
		    ObservableListProjection.prototype.onItemsRemoved = function (e) {
		        this.sourceCopy.splice(e.from, e.items.length);
		        for (var i = 0; i < e.items.length; i++) {
		            var destinationIndex = this.getIndexFromSourceIndex(e.from + i);
		            if (destinationIndex !== -1) {
		                this.removeAtInternal(destinationIndex);
		            }
		        }
		        var removedCount = e.items.length;
		        this.shiftIndicesAtOrOverThreshold(e.from + removedCount, -removedCount);
		    };
		    ObservableListProjection.prototype.onItemsMoved = function (e) {
		        if (e.items.length > 1) {
		            Utils_1.throwError("Derived collections doesn't support multi-item moves");
		        }
		        if (e.from === e.to) {
		            return;
		        }
		        var oldSourceIndex = e.from;
		        var newSourceIndex = e.to;
		        this.sourceCopy.splice(oldSourceIndex, 1);
		        this.sourceCopy.splice(newSourceIndex, 0, e.items[0]);
		        var currentDestinationIndex = this.getIndexFromSourceIndex(oldSourceIndex);
		        this.moveSourceIndexInMap(oldSourceIndex, newSourceIndex);
		        if (currentDestinationIndex === -1) {
		            return;
		        }
		        if (this.orderer == null) {
		            // We mirror the order of the source collection so we'll perform the same move operation
		            // as the source. As is the case with when we have an orderer we don't test whether or not
		            // the item should be included or not here. If it has been included at some point it'll
		            // stay included until onItemChanged picks up a change which filters it.
		            var newDestinationIndex = ObservableListProjection.newPositionForExistingItem2(this.indexToSourceIndexMap, newSourceIndex, currentDestinationIndex);
		            if (newDestinationIndex !== currentDestinationIndex) {
		                this.indexToSourceIndexMap.splice(currentDestinationIndex, 1);
		                this.indexToSourceIndexMap.splice(newDestinationIndex, 0, newSourceIndex);
		                _super.prototype.move.call(this, currentDestinationIndex, newDestinationIndex);
		            }
		            else {
		                this.indexToSourceIndexMap[currentDestinationIndex] = newSourceIndex;
		            }
		        }
		        else {
		            // TODO: Conceptually I feel like we shouldn't concern ourselves with ordering when we
		            // receive a Move notification. If it affects ordering it should be picked up by the
		            // onItemChange and resorted there instead.
		            this.indexToSourceIndexMap[currentDestinationIndex] = newSourceIndex;
		        }
		    };
		    ObservableListProjection.prototype.onItemsReplaced = function (e) {
		        var sourceOids = this.isLengthAboveResetThreshold(e.items.length) ?
		            this.sourceCopy.map(function (x) { return Oid_1.getOid(x); }) :
		            null;
		        for (var i = 0; i < e.items.length; i++) {
		            var sourceItem = e.items[i];
		            this.sourceCopy[e.from + i] = sourceItem;
		            if (sourceOids)
		                sourceOids[e.from + i] = Oid_1.getOid(sourceItem);
		            this.onItemChanged(sourceItem, sourceOids);
		        }
		    };
		    ObservableListProjection.prototype.onItemChanged = function (changedItem, sourceOids) {
		        var sourceIndices = this.indexOfAll(this.sourceCopy, changedItem, sourceOids);
		        var shouldBeIncluded = !this._filter || this._filter(changedItem);
		        var sourceIndicesLength = sourceIndices.length;
		        for (var i = 0; i < sourceIndicesLength; i++) {
		            var sourceIndex = sourceIndices[i];
		            var currentDestinationIndex = this.getIndexFromSourceIndex(sourceIndex);
		            var isIncluded = currentDestinationIndex >= 0;
		            if (isIncluded && !shouldBeIncluded) {
		                this.removeAtInternal(currentDestinationIndex);
		            }
		            else if (!isIncluded && shouldBeIncluded) {
		                this.insertAndMap(sourceIndex, this.selector(changedItem));
		            }
		            else if (isIncluded && shouldBeIncluded) {
		                // The item is already included and it should stay there but it's possible that the change that
		                // caused this event affects the ordering. This gets a little tricky so let's be verbose.
		                var newItem = this.selector(changedItem);
		                if (this.orderer == null) {
		                    // We don't have an orderer so we're currently using the source collection index for sorting
		                    // meaning that no item change will affect ordering. Look at our current item and see if it's
		                    // the exact (reference-wise) same object. If it is then we're done, if it's not (for example
		                    // if it's an integer) we'll issue a replace event so that subscribers get the new value.
		                    if (!this.referenceEquals(newItem, this.get(currentDestinationIndex))) {
		                        _super.prototype.set.call(this, currentDestinationIndex, newItem);
		                    }
		                }
		                else {
		                    // Don't be tempted to just use the orderer to compare the new item with the previous since
		                    // they'll almost certainly be equal (for reference types). We need to test whether or not the
		                    // new item can stay in the same position that the current item is in without comparing them.
		                    if (this.canItemStayAtPosition(newItem, currentDestinationIndex)) {
		                        // The new item should be in the same position as the current but there's no need to signal
		                        // that in case they are the same object.
		                        if (!this.referenceEquals(newItem, this.get(currentDestinationIndex))) {
		                            _super.prototype.set.call(this, currentDestinationIndex, newItem);
		                        }
		                    }
		                    else {
		                        // The change is forcing us to reorder. We'll use a move operation if the item hasn't
		                        // changed (ie it's the same object) and we'll implement it as a remove and add if the
		                        // object has changed (ie the selector is not an identity function).
		                        if (this.referenceEquals(newItem, this.get(currentDestinationIndex))) {
		                            var newDestinationIndex = this.newPositionForExistingItem(sourceIndex, currentDestinationIndex, newItem);
		                            // Debug.Assert(newDestinationIndex != currentDestinationIndex, "This can't be, canItemStayAtPosition said it this couldn't happen");
		                            this.indexToSourceIndexMap.splice(currentDestinationIndex, 1);
		                            this.indexToSourceIndexMap.splice(newDestinationIndex, 0, sourceIndex);
		                            _super.prototype.move.call(this, currentDestinationIndex, newDestinationIndex);
		                        }
		                        else {
		                            this.removeAtInternal(currentDestinationIndex);
		                            this.insertAndMap(sourceIndex, newItem);
		                        }
		                    }
		                }
		            }
		        }
		    };
		    /// <summary>
		    /// Gets a value indicating whether or not the item fits (sort-wise) at the provided index. The determination
		    /// is made by checking whether or not it's considered larger than or equal to the preceeding item and if
		    /// it's less than or equal to the succeeding item.
		    /// </summary>
		    ObservableListProjection.prototype.canItemStayAtPosition = function (item, currentIndex) {
		        var hasPrecedingItem = currentIndex > 0;
		        if (hasPrecedingItem) {
		            var isGreaterThanOrEqualToPrecedingItem = this.orderer(item, this.get(currentIndex - 1)) >= 0;
		            if (!isGreaterThanOrEqualToPrecedingItem) {
		                return false;
		            }
		        }
		        var hasSucceedingItem = currentIndex < this.length() - 1;
		        if (hasSucceedingItem) {
		            var isLessThanOrEqualToSucceedingItem = this.orderer(item, this.get(currentIndex + 1)) <= 0;
		            if (!isLessThanOrEqualToSucceedingItem) {
		                return false;
		            }
		        }
		        return true;
		    };
		    /// <summary>
		    /// Gets the index of the dervived item super. on it's originating element index in the source collection.
		    /// </summary>
		    ObservableListProjection.prototype.getIndexFromSourceIndex = function (sourceIndex) {
		        return this.indexToSourceIndexMap.indexOf(sourceIndex);
		    };
		    /// <summary>
		    /// Returns one or more positions in the source collection where the given item is found in source collection
		    /// </summary>
		    ObservableListProjection.prototype.indexOfAll = function (source, item, sourceOids) {
		        var indices = [];
		        var sourceIndex = 0;
		        var sourceLength = source.length;
		        if (sourceOids) {
		            var itemOid = Oid_1.getOid(item);
		            for (var i = 0; i < sourceLength; i++) {
		                var oid = sourceOids[i];
		                if (itemOid === oid) {
		                    indices.push(sourceIndex);
		                }
		                sourceIndex++;
		            }
		        }
		        else {
		            for (var i = 0; i < sourceLength; i++) {
		                var x = source[i];
		                if (this.referenceEquals(x, item)) {
		                    indices.push(sourceIndex);
		                }
		                sourceIndex++;
		            }
		        }
		        return indices;
		    };
		    /// <summary>
		    /// Increases (or decreases depending on move direction) all source indices between the source and destination
		    /// move indices.
		    /// </summary>
		    ObservableListProjection.prototype.moveSourceIndexInMap = function (oldSourceIndex, newSourceIndex) {
		        if (newSourceIndex > oldSourceIndex) {
		            // Item is moving towards the end of the list, everything between its current position and its
		            // new position needs to be shifted down one index
		            this.shiftSourceIndicesInRange(oldSourceIndex + 1, newSourceIndex + 1, -1);
		        }
		        else {
		            // Item is moving towards the front of the list, everything between its current position and its
		            // new position needs to be shifted up one index
		            this.shiftSourceIndicesInRange(newSourceIndex, oldSourceIndex, 1);
		        }
		    };
		    /// <summary>
		    /// Increases (or decreases) all source indices equal to or higher than the threshold. Represents an
		    /// insert or remove of one or more items in the source list thus causing all subsequent items to shift
		    /// up or down.
		    /// </summary>
		    ObservableListProjection.prototype.shiftIndicesAtOrOverThreshold = function (threshold, value) {
		        for (var i = 0; i < this.indexToSourceIndexMap.length; i++) {
		            if (this.indexToSourceIndexMap[i] >= threshold) {
		                this.indexToSourceIndexMap[i] += value;
		            }
		        }
		    };
		    /// <summary>
		    /// Increases (or decreases) all source indices within the range (lower inclusive, upper exclusive).
		    /// </summary>
		    ObservableListProjection.prototype.shiftSourceIndicesInRange = function (rangeStart, rangeStop, value) {
		        for (var i = 0; i < this.indexToSourceIndexMap.length; i++) {
		            var sourceIndex = this.indexToSourceIndexMap[i];
		            if (sourceIndex >= rangeStart && sourceIndex < rangeStop) {
		                this.indexToSourceIndexMap[i] += value;
		            }
		        }
		    };
		    ObservableListProjection.prototype.addAllItemsFromSourceCollection = function () {
		        // Debug.Assert(sourceCopy.length == 0, "Expected source copy to be empty");
		        var sourceIndex = 0;
		        var length = this.source.length();
		        for (var i = 0; i < length; i++) {
		            var sourceItem = this.source.get(i);
		            this.sourceCopy.push(sourceItem);
		            if (!this._filter || this._filter(sourceItem)) {
		                var destinationItem = this.selector(sourceItem);
		                this.insertAndMap(sourceIndex, destinationItem);
		            }
		            sourceIndex++;
		        }
		    };
		    ObservableListProjection.prototype.insertAndMap = function (sourceIndex, value) {
		        var destinationIndex = this.positionForNewItem(sourceIndex, value);
		        this.indexToSourceIndexMap.splice(destinationIndex, 0, sourceIndex);
		        _super.prototype.insert.call(this, destinationIndex, value);
		    };
		    ObservableListProjection.prototype.removeAtInternal = function (destinationIndex) {
		        this.indexToSourceIndexMap.splice(destinationIndex, 1);
		        _super.prototype.removeAt.call(this, destinationIndex);
		    };
		    ObservableListProjection.prototype.positionForNewItem = function (sourceIndex, value) {
		        // If we haven't got an orderer we'll simply match our items to that of the source collection.
		        return this.orderer == null
		            ? ObservableListProjection.positionForNewItemArray(this.indexToSourceIndexMap, sourceIndex, ObservableListProjection.defaultOrderer)
		            : ObservableListProjection.positionForNewItemArray2(this.inner, 0, this.inner.length, value, this.orderer);
		    };
		    ObservableListProjection.positionForNewItemArray = function (array, item, orderer) {
		        return ObservableListProjection.positionForNewItemArray2(array, 0, array.length, item, orderer);
		    };
		    ObservableListProjection.positionForNewItemArray2 = function (array, index, count, item, orderer) {
		        // Debug.Assert(index >= 0);
		        // Debug.Assert(count >= 0);
		        // Debug.Assert((list.length - index) >= count);
		        if (count === 0) {
		            return index;
		        }
		        if (count === 1) {
		            return orderer(array[index], item) >= 0 ? index : index + 1;
		        }
		        if (orderer(array[index], item) >= 1)
		            return index;
		        var low = index, hi = index + count - 1;
		        var cmp;
		        while (low <= hi) {
		            var mid = Math.floor(low + (hi - low) / 2);
		            cmp = orderer(array[mid], item);
		            if (cmp === 0) {
		                return mid;
		            }
		            if (cmp < 0) {
		                low = mid + 1;
		            }
		            else {
		                hi = mid - 1;
		            }
		        }
		        return low;
		    };
		    /// <summary>
		    /// Calculates a new destination for an updated item that's already in the list.
		    /// </summary>
		    ObservableListProjection.prototype.newPositionForExistingItem = function (sourceIndex, currentIndex, item) {
		        // If we haven't got an orderer we'll simply match our items to that of the source collection.
		        return this.orderer == null
		            ? ObservableListProjection.newPositionForExistingItem2(this.indexToSourceIndexMap, sourceIndex, currentIndex)
		            : ObservableListProjection.newPositionForExistingItem2(this.inner, item, currentIndex, this.orderer);
		    };
		    /// <summary>
		    /// Calculates a new destination for an updated item that's already in the list.
		    /// </summary>
		    ObservableListProjection.newPositionForExistingItem2 = function (array, item, currentIndex, orderer) {
		        // Since the item changed is most likely a value type we must refrain from ever comparing it to itself.
		        // We do this by figuring out how the updated item compares to its neighbors. By knowing if it's
		        // less than or greater than either one of its neighbors we can limit the search range to a range exlusive
		        // of the current index.
		        // Debug.Assert(list.length > 0);
		        if (array.length === 1) {
		            return 0;
		        }
		        var precedingIndex = currentIndex - 1;
		        var succeedingIndex = currentIndex + 1;
		        // The item on the preceding or succeeding index relative to currentIndex.
		        var comparand = array[precedingIndex >= 0 ? precedingIndex : succeedingIndex];
		        if (orderer == null) {
		            orderer = ObservableListProjection.defaultOrderer;
		        }
		        // Compare that to the (potentially) new value.
		        var cmp = orderer(item, comparand);
		        var min = 0;
		        var max = array.length;
		        if (cmp === 0) {
		            // The new value is equal to the preceding or succeeding item, it may stay at the current position
		            return currentIndex;
		        }
		        else if (cmp > 0) {
		            // The new value is greater than the preceding or succeeding item, limit the search to indices after
		            // the succeeding item.
		            min = succeedingIndex;
		        }
		        else {
		            // The new value is less than the preceding or succeeding item, limit the search to indices before
		            // the preceding item.
		            max = precedingIndex;
		        }
		        // Bail if the search range is invalid.
		        if (min === array.length || max < 0) {
		            return currentIndex;
		        }
		        var ix = ObservableListProjection.positionForNewItemArray2(array, min, max - min, item, orderer);
		        // If the item moves 'forward' in the collection we have to account for the index where
		        // the item currently resides getting removed first.
		        return ix >= currentIndex ? ix - 1 : ix;
		    };
		    ObservableListProjection.defaultOrderer = function (a, b) {
		        var result;
		        if (a == null && b == null)
		            result = 0;
		        else if (a == null)
		            result = -1;
		        else if (b == null)
		            result = 1;
		        else
		            result = a - b;
		        return result;
		    };
		    return ObservableListProjection;
		})(ObservableList);
		//# sourceMappingURL=List.js.map

	/***/ },
	/* 19 */
	/***/ function(module, exports) {

		"use strict";
		/**
		* .Net's Lazy<T>
		* @class
		*/
		var Lazy = (function () {
		    function Lazy(createValue) {
		        this.createValue = createValue;
		    }
		    Object.defineProperty(Lazy.prototype, "value", {
		        get: function () {
		            if (!this.isValueCreated) {
		                this.createdValue = this.createValue();
		                this.isValueCreated = true;
		            }
		            return this.createdValue;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    return Lazy;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = Lazy;
		//# sourceMappingURL=Lazy.js.map

	/***/ },
	/* 20 */
	/***/ function(module, exports, __webpack_require__) {

		var Utils_1 = __webpack_require__(3);
		"use strict";
		var ScheduledSubject = (function () {
		    function ScheduledSubject(scheduler, defaultObserver, defaultSubject) {
		        this._observerRefCount = 0;
		        this._defaultObserverSub = Rx.Disposable.empty;
		        this._scheduler = scheduler;
		        this._defaultObserver = defaultObserver;
		        this._subject = defaultSubject || new Rx.Subject();
		        if (defaultObserver != null) {
		            this._defaultObserverSub = this._subject
		                .observeOn(this._scheduler)
		                .subscribe(this._defaultObserver);
		        }
		    }
		    ScheduledSubject.prototype.dispose = function () {
		        if (Utils_1.isDisposable(this._subject)) {
		            this._subject.dispose();
		        }
		    };
		    ScheduledSubject.prototype.onCompleted = function () {
		        this._subject.onCompleted();
		    };
		    ScheduledSubject.prototype.onError = function (error) {
		        this._subject.onError(error);
		    };
		    ScheduledSubject.prototype.onNext = function (value) {
		        this._subject.onNext(value);
		    };
		    ScheduledSubject.prototype.subscribe = function (observer) {
		        var _this = this;
		        if (this._defaultObserverSub)
		            this._defaultObserverSub.dispose();
		        this._observerRefCount++;
		        return new Rx.CompositeDisposable(this._subject.observeOn(this._scheduler).subscribe(observer), Rx.Disposable.create(function () {
		            if ((--_this._observerRefCount) <= 0 && _this._defaultObserver != null) {
		                _this._defaultObserverSub = _this._subject.observeOn(_this._scheduler).subscribe(_this._defaultObserver);
		            }
		        }));
		    };
		    return ScheduledSubject;
		})();
		function createScheduledSubject(scheduler, defaultObserver, defaultSubject) {
		    var scheduled = new ScheduledSubject(scheduler, defaultObserver, defaultSubject);
		    var result = Utils_1.extend(scheduled, new Rx.Subject(), true);
		    return result;
		}
		exports.createScheduledSubject = createScheduledSubject;
		//# sourceMappingURL=ScheduledSubject.js.map

	/***/ },
	/* 21 */
	/***/ function(module, exports) {

		/// <reference path="../Interfaces.ts" />
		"use strict";
		var RefCountDisposeWrapper = (function () {
		    function RefCountDisposeWrapper(inner, initialRefCount) {
		        if (initialRefCount === void 0) { initialRefCount = 1; }
		        this.inner = inner;
		        this.refCount = initialRefCount;
		    }
		    RefCountDisposeWrapper.prototype.addRef = function () {
		        this.refCount++;
		    };
		    RefCountDisposeWrapper.prototype.release = function () {
		        if (--this.refCount === 0) {
		            this.inner.dispose();
		            this.inner = null;
		        }
		        return this.refCount;
		    };
		    RefCountDisposeWrapper.prototype.dispose = function () {
		        this.release();
		    };
		    return RefCountDisposeWrapper;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = RefCountDisposeWrapper;
		//# sourceMappingURL=RefCountDisposeWrapper.js.map

	/***/ },
	/* 22 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		var IID_1 = __webpack_require__(5);
		var Lazy_1 = __webpack_require__(19);
		var ScheduledSubject_1 = __webpack_require__(20);
		var Property_1 = __webpack_require__(8);
		"use strict";
		/**
		* PagedObservableListProjection implements a virtual paging projection over
		* an existing observable list. The class solely relies on index translation
		* and change notifications from its upstream source. It does not maintain data.
		* @class
		*/
		var PagedObservableListProjection = (function () {
		    function PagedObservableListProjection(source, pageSize, currentPage, scheduler) {
		        ////////////////////
		        // Implementation
		        this.disp = new Rx.CompositeDisposable();
		        this.changeNotificationsSuppressed = 0;
		        this.resetSubject = new Rx.Subject();
		        this.beforeResetSubject = new Rx.Subject();
		        this.updateLengthTrigger = new Rx.Subject();
		        this.source = source;
		        this.scheduler = scheduler || (Utils_1.isRxScheduler(currentPage) ? currentPage : Rx.Scheduler.immediate);
		        // IPagedObservableReadOnlyList
		        this.pageSize = Property_1.property(pageSize);
		        this.currentPage = Property_1.property(currentPage || 0);
		        var updateLengthTrigger = Rx.Observable.merge(this.updateLengthTrigger, source.lengthChanged)
		            .startWith(true)
		            .observeOn(Rx.Scheduler.immediate);
		        this.pageCount = Utils_1.whenAny(this.pageSize, updateLengthTrigger, function (ps, _) { return Math.ceil(source.length() / ps); })
		            .distinctUntilChanged()
		            .toProperty();
		        this.disp.add(this.pageCount);
		        // length
		        this.length = Utils_1.whenAny(this.currentPage, this.pageSize, updateLengthTrigger, function (cp, ps, _) { return Math.max(Math.min(source.length() - (ps * cp), ps), 0); })
		            .distinctUntilChanged()
		            .toProperty();
		        this.disp.add(this.length);
		        this.isEmpty = this.lengthChanged
		            .select(function (x) { return x === 0; })
		            .toProperty(this.length() === 0);
		        this.disp.add(this.isEmpty);
		        // isEmptyChanged
		        this.isEmptyChanged = Utils_1.whenAny(this.length, function (len) { return len == 0; })
		            .distinctUntilChanged();
		        // IObservableReadOnlyList
		        this.beforeItemsAddedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.itemsAddedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.beforeItemsRemovedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.itemsRemovedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.beforeItemReplacedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.itemReplacedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.itemChangingSubject = new Lazy_1.default(function () {
		            return ScheduledSubject_1.createScheduledSubject(scheduler);
		        });
		        this.itemChangedSubject = new Lazy_1.default(function () {
		            return ScheduledSubject_1.createScheduledSubject(scheduler);
		        });
		        this.beforeItemsMovedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        this.itemsMovedSubject = new Lazy_1.default(function () { return new Rx.Subject(); });
		        // shouldReset (short-circuit)
		        this.shouldReset = this.resetSubject.asObservable();
		        this.listChanged = Rx.Observable.merge(this.itemsAdded.select(function (x) { return false; }), this.itemsRemoved.select(function (x) { return false; }), this.itemReplaced.select(function (x) { return false; }), this.itemsMoved.select(function (x) { return false; }), this.resetSubject.select(function (x) { return true; }))
		            .publish()
		            .refCount();
		        this.listChanging = Rx.Observable.merge(this.beforeItemsAdded.select(function (x) { return false; }), this.beforeItemsRemoved.select(function (x) { return false; }), this.beforeItemReplaced.select(function (x) { return false; }), this.beforeItemsMoved.select(function (x) { return false; }), this.beforeResetSubject.select(function (x) { return true; }))
		            .publish()
		            .refCount();
		        this.wireUpChangeNotifications();
		    }
		    //////////////////////////////////
		    // IUnknown implementation
		    PagedObservableListProjection.prototype.queryInterface = function (iid) {
		        return iid === IID_1.default.IObservableList || iid === IID_1.default.IDisposable;
		    };
		    PagedObservableListProjection.prototype.get = function (index) {
		        index = this.pageSize() * this.currentPage() + index;
		        return this.source.get(index);
		    };
		    Object.defineProperty(PagedObservableListProjection.prototype, "isReadOnly", {
		        get: function () {
		            return true;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    PagedObservableListProjection.prototype.indexOf = function (item) {
		        return this.toArray().indexOf(item);
		    };
		    PagedObservableListProjection.prototype.contains = function (item) {
		        return this.indexOf(item) !== -1;
		    };
		    PagedObservableListProjection.prototype.toArray = function () {
		        var start = this.pageSize() * this.currentPage();
		        return this.source.toArray().slice(start, start + this.length());
		    };
		    PagedObservableListProjection.prototype.forEach = function (callbackfn, thisArg) {
		        this.toArray().forEach(callbackfn, thisArg);
		    };
		    PagedObservableListProjection.prototype.map = function (callbackfn, thisArg) {
		        return this.toArray().map(callbackfn, thisArg);
		    };
		    PagedObservableListProjection.prototype.filter = function (callbackfn, thisArg) {
		        return this.toArray().filter(callbackfn, thisArg);
		    };
		    PagedObservableListProjection.prototype.some = function (callbackfn, thisArg) {
		        return this.toArray().some(callbackfn, thisArg);
		    };
		    PagedObservableListProjection.prototype.every = function (callbackfn, thisArg) {
		        return this.toArray().every(callbackfn, thisArg);
		    };
		    PagedObservableListProjection.prototype.suppressChangeNotifications = function () {
		        var _this = this;
		        this.changeNotificationsSuppressed++;
		        return Rx.Disposable.create(function () {
		            _this.changeNotificationsSuppressed--;
		            if (_this.changeNotificationsSuppressed === 0) {
		                _this.publishBeforeResetNotification();
		                _this.publishResetNotification();
		            }
		        });
		    };
		    //////////////////////////////////
		    // IDisposable implementation
		    PagedObservableListProjection.prototype.dispose = function () {
		        this.disp.dispose();
		    };
		    Object.defineProperty(PagedObservableListProjection.prototype, "itemsAdded", {
		        get: function () {
		            if (!this._itemsAdded)
		                this._itemsAdded = this.itemsAddedSubject.value.asObservable();
		            return this._itemsAdded;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(PagedObservableListProjection.prototype, "beforeItemsAdded", {
		        get: function () {
		            if (!this._beforeItemsAdded)
		                this._beforeItemsAdded = this.beforeItemsAddedSubject.value.asObservable();
		            return this._beforeItemsAdded;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(PagedObservableListProjection.prototype, "itemsRemoved", {
		        get: function () {
		            if (!this._itemsRemoved)
		                this._itemsRemoved = this.itemsRemovedSubject.value.asObservable();
		            return this._itemsRemoved;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(PagedObservableListProjection.prototype, "beforeItemsRemoved", {
		        get: function () {
		            if (!this._beforeItemsRemoved)
		                this._beforeItemsRemoved = this.beforeItemsRemovedSubject.value.asObservable();
		            return this._beforeItemsRemoved;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(PagedObservableListProjection.prototype, "itemReplaced", {
		        get: function () {
		            if (!this._itemReplaced)
		                this._itemReplaced = this.itemReplacedSubject.value.asObservable();
		            return this._itemReplaced;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(PagedObservableListProjection.prototype, "beforeItemReplaced", {
		        get: function () {
		            if (!this._beforeItemReplaced)
		                this._beforeItemReplaced = this.beforeItemReplacedSubject.value.asObservable();
		            return this._beforeItemReplaced;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(PagedObservableListProjection.prototype, "beforeItemsMoved", {
		        get: function () {
		            if (!this._beforeItemsMoved)
		                this._beforeItemsMoved = this.beforeItemsMovedSubject.value.asObservable();
		            return this._beforeItemsMoved;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(PagedObservableListProjection.prototype, "itemsMoved", {
		        get: function () {
		            if (!this._itemsMoved)
		                this._itemsMoved = this.itemsMovedSubject.value.asObservable();
		            return this._itemsMoved;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(PagedObservableListProjection.prototype, "lengthChanging", {
		        get: function () {
		            if (!this._lengthChanging)
		                this._lengthChanging = this.length.changing.distinctUntilChanged();
		            return this._lengthChanging;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(PagedObservableListProjection.prototype, "lengthChanged", {
		        get: function () {
		            if (!this._lengthChanged)
		                this._lengthChanged = this.length.changed.distinctUntilChanged();
		            return this._lengthChanged;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    PagedObservableListProjection.prototype.wireUpChangeNotifications = function () {
		        var _this = this;
		        this.disp.add(this.source.itemsAdded.observeOn(this.scheduler).subscribe(function (e) {
		            // force immediate recalculation of length, pageCount etc.
		            _this.updateLengthTrigger.onNext(true);
		            _this.onItemsAdded(e);
		        }));
		        this.disp.add(this.source.itemsRemoved.observeOn(this.scheduler).subscribe(function (e) {
		            // force immediate recalculation of length, pageCount etc.
		            _this.updateLengthTrigger.onNext(true);
		            _this.onItemsRemoved(e);
		        }));
		        this.disp.add(this.source.itemsMoved.observeOn(this.scheduler).subscribe(function (e) {
		            _this.onItemsMoved(e);
		        }));
		        this.disp.add(this.source.itemReplaced.observeOn(this.scheduler).subscribe(function (e) {
		            _this.onItemsReplaced(e);
		        }));
		        this.disp.add(this.source.shouldReset.observeOn(this.scheduler).subscribe(function (e) {
		            // force immediate recalculation of length, pageCount etc.
		            _this.updateLengthTrigger.onNext(true);
		            _this.publishBeforeResetNotification();
		            _this.publishResetNotification();
		        }));
		        this.disp.add(Utils_1.whenAny(this.pageSize, this.currentPage, function (ps, cp) { return true; }).observeOn(this.scheduler).subscribe(function (e) {
		            _this.publishBeforeResetNotification();
		            _this.publishResetNotification();
		        }));
		    };
		    PagedObservableListProjection.prototype.getPageRange = function () {
		        var from = this.currentPage() * this.pageSize();
		        var result = { from: from, to: from + this.length() };
		        return result;
		    };
		    PagedObservableListProjection.prototype.publishResetNotification = function () {
		        this.resetSubject.onNext(true);
		    };
		    PagedObservableListProjection.prototype.publishBeforeResetNotification = function () {
		        this.beforeResetSubject.onNext(true);
		    };
		    PagedObservableListProjection.prototype.onItemsAdded = function (e) {
		        var page = this.getPageRange();
		        // items added beneath the window can be ignored
		        if (e.from > page.to)
		            return;
		        // adding items before the window results in a reset
		        if (e.from < page.from) {
		            this.publishBeforeResetNotification();
		            this.publishResetNotification();
		        }
		        else {
		            // compute relative start index
		            var from = e.from - page.from;
		            var numItems = Math.min(this.length() - from, e.items.length);
		            // limit items
		            var items = e.items.length !== numItems ? e.items.slice(0, numItems) : e.items;
		            // emit translated notifications
		            var er = { from: from, items: items };
		            if (this.beforeItemsAddedSubject.isValueCreated)
		                this.beforeItemsAddedSubject.value.onNext(er);
		            if (this.itemsAddedSubject.isValueCreated)
		                this.itemsAddedSubject.value.onNext(er);
		        }
		    };
		    PagedObservableListProjection.prototype.onItemsRemoved = function (e) {
		        var page = this.getPageRange();
		        // items added beneath the window can be ignored
		        if (e.from > page.to)
		            return;
		        // adding items before the window results in a reset
		        if (e.from < page.from) {
		            this.publishBeforeResetNotification();
		            this.publishResetNotification();
		        }
		        else {
		            // compute relative start index
		            var from = e.from - page.from;
		            var numItems = Math.min(this.length() - from, e.items.length);
		            // limit items
		            var items = e.items.length !== numItems ? e.items.slice(0, numItems) : e.items;
		            // emit translated notifications
		            var er = { from: from, items: items };
		            if (this.beforeItemsRemovedSubject.isValueCreated)
		                this.beforeItemsRemovedSubject.value.onNext(er);
		            if (this.itemsRemovedSubject.isValueCreated)
		                this.itemsRemovedSubject.value.onNext(er);
		        }
		    };
		    PagedObservableListProjection.prototype.onItemsMoved = function (e) {
		        var page = this.getPageRange();
		        var from = 0, to = 0;
		        var er;
		        // a move completely above or below the window should be ignored
		        if (e.from >= page.to && e.to >= page.to ||
		            e.from < page.from && e.to < page.from) {
		            return;
		        }
		        // from-index inside page?
		        if (e.from >= page.from && e.from < page.to) {
		            // to-index as well?
		            if (e.to >= page.from && e.to < page.to) {
		                // item was moved inside the page
		                from = e.from - page.from;
		                to = e.to - page.from;
		                er = { from: from, to: to, items: e.items };
		                if (this.beforeItemsMovedSubject.isValueCreated)
		                    this.beforeItemsMovedSubject.value.onNext(er);
		                if (this.itemsMovedSubject.isValueCreated)
		                    this.itemsMovedSubject.value.onNext(er);
		                return;
		            }
		            else if (e.to >= page.to) {
		                // item was moved out of the page somewhere below window
		                var lastValidIndex = this.length() - 1;
		                // generate removed notification
		                from = e.from - page.from;
		                if (from !== lastValidIndex) {
		                    er = { from: from, items: e.items };
		                    if (this.beforeItemsRemovedSubject.isValueCreated)
		                        this.beforeItemsRemovedSubject.value.onNext(er);
		                    if (this.itemsRemovedSubject.isValueCreated)
		                        this.itemsRemovedSubject.value.onNext(er);
		                    // generate fake-add notification for last item in page
		                    from = this.length() - 1;
		                    er = { from: from, items: [this.get(from)] };
		                    if (this.beforeItemsAddedSubject.isValueCreated)
		                        this.beforeItemsAddedSubject.value.onNext(er);
		                    if (this.itemsAddedSubject.isValueCreated)
		                        this.itemsAddedSubject.value.onNext(er);
		                }
		                else {
		                    // generate fake-replace notification for last item in page
		                    from = this.length() - 1;
		                    er = { from: from, items: [this.get(from)] };
		                    if (this.beforeItemReplacedSubject.isValueCreated)
		                        this.beforeItemReplacedSubject.value.onNext(er);
		                    if (this.itemReplacedSubject.isValueCreated)
		                        this.itemReplacedSubject.value.onNext(er);
		                }
		                return;
		            }
		        }
		        // reset in all other cases
		        this.publishBeforeResetNotification();
		        this.publishResetNotification();
		    };
		    PagedObservableListProjection.prototype.onItemsReplaced = function (e) {
		        var page = this.getPageRange();
		        // items replaced outside the window can be ignored
		        if (e.from > page.to || e.from < page.from)
		            return;
		        // compute relative start index
		        var from = e.from - page.from;
		        // emit translated notifications
		        var er = { from: from, items: e.items };
		        if (this.beforeItemReplacedSubject.isValueCreated)
		            this.beforeItemReplacedSubject.value.onNext(er);
		        if (this.itemReplacedSubject.isValueCreated)
		            this.itemReplacedSubject.value.onNext(er);
		    };
		    return PagedObservableListProjection;
		})();
		exports.PagedObservableListProjection = PagedObservableListProjection;
		//# sourceMappingURL=ListPaged.js.map

	/***/ },
	/* 23 */
	/***/ function(module, exports) {

		/// <reference path="../Interfaces.ts" />
		"use strict";
		/**
		* Html Template Engine based on JQuery's parseHTML
		* NOTE: This version does not support scripts in templates!
		*/
		var rsingleTag = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, rtagName = /<([\w:-]+)/, rhtml = /<|&#?\w+;/, rscriptType = /^$|\/(?:java|ecma)script/i, 
		// We have to close these tags to support XHTML (#13200)
		wrapMap = {
		    // Support: IE9
		    option: [1, "<select multiple='multiple'>", "</select>"],
		    thead: [1, "<table>", "</table>"],
		    // Some of the following wrappers are not fully defined, because
		    // their parent elements (except for "table" element) could be omitted
		    // since browser parsers are smart enough to auto-insert them
		    // Support: Android 2.3
		    // Android browser doesn't auto-insert colgroup
		    col: [2, "<table><colgroup>", "</colgroup></table>"],
		    // Auto-insert "tbody" element
		    tr: [2, "<table>", "</table>"],
		    // Auto-insert "tbody" and "tr" elements
		    td: [3, "<table>", "</table>"],
		    _default: [0, "", ""]
		};
		// Support: IE9
		wrapMap.optgroup = wrapMap.option;
		wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
		wrapMap.th = wrapMap.td;
		var supportsCreateHTMLDocument = (function () {
		    var doc = document.implementation.createHTMLDocument("");
		    // Support: Node with jsdom<=1.5.0+
		    // jsdom's document created via the above method doesn't contain the body
		    if (!doc.body) {
		        return false;
		    }
		    doc.body.innerHTML = "<form></form><form></form>";
		    return doc.body.childNodes.length === 2;
		})();
		function merge(first, second) {
		    var len = +second.length, j = 0, i = first.length;
		    for (; j < len; j++) {
		        first[i++] = second[j];
		    }
		    first.length = i;
		    return first;
		}
		function buildFragment(elems, context) {
		    var elem, tmp, tag, wrap, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length;
		    for (; i < l; i++) {
		        elem = elems[i];
		        if (elem || elem === 0) {
		            // Add nodes directly
		            if (typeof elem === "object") {
		                // Support: Android<4.1, PhantomJS<2
		                // push.apply(_, arraylike) throws on ancient WebKit
		                merge(nodes, elem.nodeType ? [elem] : elem);
		            }
		            else if (!rhtml.test(elem)) {
		                nodes.push(context.createTextNode(elem));
		            }
		            else {
		                tmp = tmp || fragment.appendChild(context.createElement("div"));
		                // Deserialize a standard representation
		                tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
		                wrap = wrapMap[tag] || wrapMap._default;
		                tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
		                // Descend through wrappers to the right content
		                j = wrap[0];
		                while (j--) {
		                    tmp = tmp.lastChild;
		                }
		                // Support: Android<4.1, PhantomJS<2
		                // push.apply(_, arraylike) throws on ancient WebKit
		                merge(nodes, tmp.childNodes);
		                // Remember the top-level container
		                tmp = fragment.firstChild;
		                // Ensure the created nodes are orphaned (#12392)
		                tmp.textContent = "";
		            }
		        }
		    }
		    // Remove wrapper from fragment
		    fragment.textContent = "";
		    i = 0;
		    while ((elem = nodes[i++])) {
		        // filter out scripts
		        if (elem.nodeType !== 1 || elem.tagName.toLowerCase() !== "script" || !rscriptType.test(elem.type || "")) {
		            fragment.appendChild(elem);
		        }
		    }
		    return fragment;
		}
		var HtmlTemplateEngine = (function () {
		    function HtmlTemplateEngine() {
		    }
		    HtmlTemplateEngine.prototype.parse = function (data) {
		        // document.implementation stops scripts or inline event handlers from being executed immediately
		        var context = supportsCreateHTMLDocument ? document.implementation.createHTMLDocument("") : document;
		        var parsed = rsingleTag.exec(data);
		        // Single tag
		        if (parsed) {
		            return [context.createElement(parsed[1])];
		        }
		        parsed = buildFragment([data], context);
		        var result = merge([], parsed.childNodes);
		        return result;
		    };
		    return HtmlTemplateEngine;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = HtmlTemplateEngine;
		//# sourceMappingURL=HtmlTemplateEngine.js.map

	/***/ },
	/* 24 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		var Command_1 = __webpack_require__(25);
		"use strict";
		var CommandBinding = (function () {
		    function CommandBinding(domManager, app) {
		        this.priority = 0;
		        this.domManager = domManager;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    CommandBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("command-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var compiled = this.domManager.compileBindingOptions(options, module);
		        var el = node;
		        var exp;
		        var cmdObservable;
		        var paramObservable;
		        var cleanup;
		        var isAnchor = el.tagName.toLowerCase() === "a";
		        var event = "click";
		        function doCleanup() {
		            if (cleanup) {
		                cleanup.dispose();
		                cleanup = null;
		            }
		        }
		        if (typeof compiled === "function") {
		            exp = compiled;
		            cmdObservable = this.domManager.expressionToObservable(exp, ctx);
		        }
		        else {
		            var opt = compiled;
		            exp = opt.command;
		            cmdObservable = this.domManager.expressionToObservable(exp, ctx);
		            if (opt.parameter) {
		                exp = opt.parameter;
		                paramObservable = this.domManager.expressionToObservable(exp, ctx);
		            }
		        }
		        if (paramObservable == null) {
		            paramObservable = Rx.Observable.return(undefined);
		        }
		        state.cleanup.add(Rx.Observable
		            .combineLatest(cmdObservable, paramObservable, function (cmd, param) { return ({ cmd: cmd, param: param }); })
		            .subscribe(function (x) {
		            try {
		                doCleanup();
		                cleanup = new Rx.CompositeDisposable();
		                if (x.cmd != null) {
		                    if (!Command_1.isCommand(x.cmd))
		                        Utils_1.throwError("Command-Binding only supports binding to a command!");
		                    // disabled handling if supported by element
		                    if (Utils_1.elementCanBeDisabled(el)) {
		                        // initial update
		                        el.disabled = !x.cmd.canExecute(x.param);
		                        // listen to changes
		                        cleanup.add(x.cmd.canExecuteObservable.subscribe(function (canExecute) {
		                            el.disabled = !canExecute;
		                        }));
		                    }
		                    // handle input events
		                    cleanup.add(Rx.Observable.fromEvent(el, "click").subscribe(function (e) {
		                        // verify that the command can actually execute since we cannot disable
		                        // all elements - only form elements such as buttons
		                        if (x.cmd.canExecute(x.param)) {
		                            x.cmd.execute(x.param);
		                        }
		                        // prevent default for anchors
		                        if (isAnchor) {
		                            e.preventDefault();
		                        }
		                    }));
		                }
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            el = null;
		            // nullify locals
		            doCleanup();
		        }));
		    };
		    CommandBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    return CommandBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = CommandBinding;
		//# sourceMappingURL=Command.js.map

	/***/ },
	/* 25 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var IID_1 = __webpack_require__(5);
		var Utils_1 = __webpack_require__(3);
		var Injector_1 = __webpack_require__(2);
		var res = __webpack_require__(6);
		"use strict";
		var Command = (function () {
		    /// <summary>
		    /// Don't use this directly, use commandXYZ instead
		    /// </summary>
		    function Command(canExecute, executeAsync, scheduler) {
		        var _this = this;
		        this.resultsSubject = new Rx.Subject();
		        this.isExecutingSubject = new Rx.Subject();
		        this.inflightCount = 0;
		        this.canExecuteLatest = false;
		        this.scheduler = scheduler || Injector_1.injector.get(res.app).mainThreadScheduler;
		        this.func = executeAsync;
		        // setup canExecute
		        var canExecuteObs = canExecute
		            .combineLatest(this.isExecutingSubject.startWith(false), function (ce, ie) { return ce && !ie; })
		            .catch(function (ex) {
		            _this.exceptionsSubject.onNext(ex);
		            return Rx.Observable.return(false);
		        })
		            .do(function (x) {
		            _this.canExecuteLatest = x;
		        })
		            .startWith(this.canExecuteLatest)
		            .distinctUntilChanged()
		            .publish();
		        this.canExecuteDisp = canExecuteObs.connect();
		        this.canExecuteObservable = canExecuteObs;
		        // setup thrownExceptions
		        this.exceptionsSubject = new Rx.Subject();
		        this.thrownExceptions = this.exceptionsSubject.asObservable();
		        this.exceptionsSubject
		            .observeOn(this.scheduler)
		            .subscribe(Injector_1.injector.get(res.app).defaultExceptionHandler);
		    }
		    //////////////////////////////////
		    // wx.IUnknown implementation
		    Command.prototype.queryInterface = function (iid) {
		        return iid === IID_1.default.ICommand || iid === IID_1.default.IDisposable;
		    };
		    //////////////////////////////////
		    // IDisposable implementation
		    Command.prototype.dispose = function () {
		        var disp = this.canExecuteDisp;
		        if (disp != null)
		            disp.dispose();
		    };
		    Object.defineProperty(Command.prototype, "isExecuting", {
		        get: function () {
		            return this.isExecutingSubject.startWith(this.inflightCount > 0);
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Object.defineProperty(Command.prototype, "results", {
		        get: function () {
		            return this.resultsSubject.asObservable();
		        },
		        enumerable: true,
		        configurable: true
		    });
		    Command.prototype.canExecute = function (parameter) {
		        return this.canExecuteLatest;
		    };
		    Command.prototype.execute = function (parameter) {
		        this.executeAsync(parameter)
		            .catch(Rx.Observable.empty())
		            .subscribe();
		    };
		    Command.prototype.executeAsync = function (parameter) {
		        var self = this;
		        var ret = this.canExecute(parameter) ? Rx.Observable.create(function (subj) {
		            if (++self.inflightCount === 1) {
		                self.isExecutingSubject.onNext(true);
		            }
		            var decrement = new Rx.SerialDisposable();
		            decrement.setDisposable(Rx.Disposable.create(function () {
		                if (--self.inflightCount === 0) {
		                    self.isExecutingSubject.onNext(false);
		                }
		            }));
		            var disp = self.func(parameter)
		                .observeOn(self.scheduler)
		                .do(function (_) { }, function (e) { return decrement.setDisposable(Rx.Disposable.empty); }, function () { return decrement.setDisposable(Rx.Disposable.empty); })
		                .do(function (x) { return self.resultsSubject.onNext(x); }, function (x) { return self.exceptionsSubject.onNext(x); })
		                .subscribe(subj);
		            return new Rx.CompositeDisposable(disp, decrement);
		        }) : Rx.Observable.throw(new Error("canExecute currently forbids execution"));
		        return ret
		            .publish()
		            .refCount();
		    };
		    return Command;
		})();
		exports.Command = Command;
		var internal;
		(function (internal) {
		    internal.commandConstructor = Command;
		})(internal = exports.internal || (exports.internal = {}));
		// factory method implementation
		function command() {
		    var args = Utils_1.args2Array(arguments);
		    var canExecute;
		    var execute;
		    var scheduler;
		    var thisArg;
		    if (Utils_1.isFunction(args[0])) {
		        // first overload
		        execute = args.shift();
		        canExecute = Utils_1.isRxObservable(args[0]) ? args.shift() : Rx.Observable.return(true);
		        scheduler = Utils_1.isRxScheduler(args[0]) ? args.shift() : undefined;
		        thisArg = args.shift();
		        if (thisArg != null)
		            execute = execute.bind(thisArg);
		        return asyncCommand(canExecute, function (parameter) {
		            return Rx.Observable.create(function (obs) {
		                try {
		                    execute(parameter);
		                    obs.onNext(null);
		                    obs.onCompleted();
		                }
		                catch (e) {
		                    obs.onError(e);
		                }
		                return Rx.Disposable.empty;
		            });
		        }, scheduler);
		    }
		    // second overload
		    canExecute = args.shift() || Rx.Observable.return(true);
		    scheduler = Utils_1.isRxScheduler(args[0]) ? args.shift() : undefined;
		    return new Command(canExecute, function (x) { return Rx.Observable.return(x); }, scheduler);
		}
		exports.command = command;
		// factory method implementation
		function asyncCommand() {
		    var args = Utils_1.args2Array(arguments);
		    var canExecute;
		    var executeAsync;
		    var scheduler;
		    var thisArg;
		    if (Utils_1.isFunction(args[0])) {
		        // second overload
		        executeAsync = args.shift();
		        scheduler = Utils_1.isRxScheduler(args[0]) ? args.shift() : undefined;
		        thisArg = args.shift();
		        if (thisArg != null)
		            executeAsync = executeAsync.bind(thisArg);
		        return new Command(Rx.Observable.return(true), executeAsync, scheduler);
		    }
		    // first overload
		    canExecute = args.shift();
		    executeAsync = args.shift();
		    scheduler = Utils_1.isRxScheduler(args[0]) ? args.shift() : undefined;
		    return new Command(canExecute, executeAsync, scheduler);
		}
		exports.asyncCommand = asyncCommand;
		/**
		* Determines if target is an instance of a ICommand
		* @param {any} target
		*/
		function isCommand(target) {
		    if (target == null)
		        return false;
		    return target instanceof Command ||
		        Utils_1.queryInterface(target, IID_1.default.ICommand);
		}
		exports.isCommand = isCommand;
		//# sourceMappingURL=Command.js.map

	/***/ },
	/* 26 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		var Module_1 = __webpack_require__(9);
		"use strict";
		var ModuleBinding = (function () {
		    function ModuleBinding(domManager, app) {
		        this.priority = 100;
		        this.controlsDescendants = true;
		        this.domManager = domManager;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    ModuleBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("module-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var self = this;
		        var exp = this.domManager.compileBindingOptions(options, module);
		        var obs = this.domManager.expressionToObservable(exp, ctx);
		        var initialApply = true;
		        var cleanup;
		        function doCleanup() {
		            if (cleanup) {
		                cleanup.dispose();
		                cleanup = null;
		            }
		        }
		        // backup inner HTML
		        var template = new Array();
		        // subscribe
		        state.cleanup.add(obs.subscribe(function (x) {
		            try {
		                doCleanup();
		                cleanup = new Rx.CompositeDisposable();
		                var value = Utils_1.unwrapProperty(x);
		                var moduleNames;
		                var disp = undefined;
		                // split names
		                if (value) {
		                    value = value.trim();
		                    moduleNames = value.split(" ").filter(function (x) { return x; });
		                }
		                if (moduleNames.length > 0) {
		                    var observables = moduleNames.map(function (x) { return Module_1.loadModule(x); });
		                    disp = Rx.Observable.combineLatest(observables, function (_) { return Utils_1.args2Array(arguments); }).subscribe(function (modules) {
		                        try {
		                            // create intermediate module
		                            var moduleName = (module || _this.app).name + "+" + moduleNames.join("+");
		                            var merged = new Module_1.Module(moduleName);
		                            // merge modules into intermediate
		                            merged.merge(module || _this.app);
		                            modules.forEach(function (x) { return merged.merge(x); });
		                            // done
		                            self.applyValue(el, merged, template, ctx, state, initialApply);
		                            initialApply = false;
		                        }
		                        catch (e) {
		                            _this.app.defaultExceptionHandler.onNext(e);
		                        }
		                    });
		                    if (disp != null)
		                        cleanup.add(disp);
		                }
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            obs = null;
		            self = null;
		        }));
		    };
		    ModuleBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    ModuleBinding.prototype.applyValue = function (el, module, template, ctx, state, initialApply) {
		        if (initialApply) {
		            // clone to template
		            for (var i = 0; i < el.childNodes.length; i++) {
		                template.push(el.childNodes[i].cloneNode(true));
		            }
		        }
		        state.module = module;
		        // clean first
		        this.domManager.cleanDescendants(el);
		        // clear
		        while (el.firstChild) {
		            el.removeChild(el.firstChild);
		        }
		        // clone nodes and inject
		        for (var i = 0; i < template.length; i++) {
		            var node = template[i].cloneNode(true);
		            el.appendChild(node);
		        }
		        this.domManager.applyBindingsToDescendants(ctx, el);
		    };
		    return ModuleBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = ModuleBinding;
		//# sourceMappingURL=Module.js.map

	/***/ },
	/* 27 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var Utils_1 = __webpack_require__(3);
		"use strict";
		var IfBinding = (function () {
		    function IfBinding(domManager, app) {
		        this.priority = 50;
		        this.controlsDescendants = true;
		        ////////////////////
		        // Implementation
		        this.inverse = false;
		        this.domManager = domManager;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    IfBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("if-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var compiled = this.domManager.compileBindingOptions(options, module);
		        var el = node;
		        var self = this;
		        var initialApply = true;
		        var exp;
		        var animations = {};
		        var cleanup;
		        function doCleanup() {
		            if (cleanup) {
		                cleanup.dispose();
		                cleanup = null;
		            }
		        }
		        if (typeof compiled === "object") {
		            var opt = compiled;
		            exp = opt.condition;
		            // extract animations
		            if (opt.enter) {
		                animations.enter = this.domManager.evaluateExpression(opt.enter, ctx);
		                if (typeof animations.enter === "string") {
		                    animations.enter = module.animation(animations.enter);
		                }
		            }
		            if (opt.leave) {
		                animations.leave = this.domManager.evaluateExpression(opt.leave, ctx);
		                if (typeof animations.leave === "string") {
		                    animations.leave = module.animation(animations.leave);
		                }
		            }
		        }
		        else {
		            exp = compiled;
		        }
		        var obs = this.domManager.expressionToObservable(exp, ctx);
		        // backup inner HTML
		        var template = new Array();
		        // subscribe
		        state.cleanup.add(obs.subscribe(function (x) {
		            try {
		                doCleanup();
		                cleanup = new Rx.CompositeDisposable();
		                cleanup.add(self.applyValue(el, Utils_1.unwrapProperty(x), template, ctx, animations, initialApply));
		                initialApply = false;
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            obs = null;
		            el = null;
		            self = null;
		            // nullify locals
		            template = null;
		        }));
		    };
		    IfBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    IfBinding.prototype.applyValue = function (el, value, template, ctx, animations, initialApply) {
		        var _this = this;
		        var leaveAnimation = animations.leave;
		        var enterAnimation = animations.enter;
		        var self = this;
		        var obs = undefined;
		        if (initialApply) {
		            // clone to template
		            for (var i = 0; i < el.childNodes.length; i++) {
		                template.push(el.childNodes[i].cloneNode(true));
		            }
		            // clear
		            while (el.firstChild) {
		                el.removeChild(el.firstChild);
		            }
		        }
		        var oldElements = Utils_1.nodeChildrenToArray(el);
		        value = this.inverse ? !value : value;
		        function removeOldElements() {
		            oldElements.forEach(function (x) {
		                self.domManager.cleanNode(x);
		                el.removeChild(x);
		            });
		        }
		        if (oldElements.length > 0) {
		            if (leaveAnimation) {
		                leaveAnimation.prepare(oldElements);
		                obs = leaveAnimation.run(oldElements)
		                    .continueWith(function () { return leaveAnimation.complete(oldElements); })
		                    .continueWith(removeOldElements);
		            }
		            else {
		                removeOldElements();
		            }
		        }
		        if (value) {
		            var nodes = template.map(function (x) { return x.cloneNode(true); });
		            if (obs) {
		                obs = obs.continueWith(function () {
		                    if (enterAnimation)
		                        enterAnimation.prepare(nodes);
		                    for (var i = 0; i < template.length; i++) {
		                        el.appendChild(nodes[i]);
		                    }
		                    _this.domManager.applyBindingsToDescendants(ctx, el);
		                });
		                if (enterAnimation) {
		                    obs = enterAnimation.run(nodes)
		                        .continueWith(function () { return enterAnimation.complete(nodes); });
		                }
		            }
		            else {
		                if (enterAnimation)
		                    enterAnimation.prepare(nodes);
		                for (var i = 0; i < template.length; i++) {
		                    el.appendChild(nodes[i]);
		                }
		                this.domManager.applyBindingsToDescendants(ctx, el);
		                if (enterAnimation) {
		                    obs = enterAnimation.run(nodes)
		                        .continueWith(function () { return enterAnimation.complete(nodes); });
		                }
		            }
		        }
		        return obs ? (obs.subscribe() || Rx.Disposable.empty) : Rx.Disposable.empty;
		    };
		    return IfBinding;
		})();
		exports.IfBinding = IfBinding;
		var NotIfBinding = (function (_super) {
		    __extends(NotIfBinding, _super);
		    function NotIfBinding(domManager, app) {
		        _super.call(this, domManager, app);
		        this.inverse = true;
		    }
		    return NotIfBinding;
		})(IfBinding);
		exports.NotIfBinding = NotIfBinding;
		//# sourceMappingURL=If.js.map

	/***/ },
	/* 28 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var Utils_1 = __webpack_require__(3);
		var BindingBase_1 = __webpack_require__(29);
		"use strict";
		var CssBinding = (function (_super) {
		    __extends(CssBinding, _super);
		    function CssBinding(domManager, app) {
		        _super.call(this, domManager, app, true);
		    }
		    CssBinding.prototype.applyValue = function (el, value, key) {
		        var classes;
		        if (key !== "") {
		            classes = key.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
		            if (classes.length) {
		                Utils_1.toggleCssClass.apply(null, [el, !!value].concat(classes));
		            }
		        }
		        else {
		            var state = this.domManager.getNodeState(el);
		            // if we have previously added classes, remove them
		            if (state.cssBindingPreviousDynamicClasses != null) {
		                Utils_1.toggleCssClass.apply(null, [el, false].concat(state.cssBindingPreviousDynamicClasses));
		                state.cssBindingPreviousDynamicClasses = null;
		            }
		            if (value) {
		                classes = value.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
		                if (classes.length) {
		                    Utils_1.toggleCssClass.apply(null, [el, true].concat(classes));
		                    state.cssBindingPreviousDynamicClasses = classes;
		                }
		            }
		        }
		    };
		    return CssBinding;
		})(BindingBase_1.MultiOneWayBindingBase);
		exports.CssBinding = CssBinding;
		var AttrBinding = (function (_super) {
		    __extends(AttrBinding, _super);
		    function AttrBinding(domManager, app) {
		        _super.call(this, domManager, app);
		        this.priority = 5;
		    }
		    AttrBinding.prototype.applyValue = function (el, value, key) {
		        // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
		        // when someProp is a "no value"-like value (strictly null, false, or undefined)
		        // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
		        var toRemove = (value === false) || (value === null) || (value === undefined);
		        if (toRemove)
		            el.removeAttribute(key);
		        else {
		            el.setAttribute(key, value.toString());
		        }
		    };
		    return AttrBinding;
		})(BindingBase_1.MultiOneWayBindingBase);
		exports.AttrBinding = AttrBinding;
		var StyleBinding = (function (_super) {
		    __extends(StyleBinding, _super);
		    function StyleBinding(domManager, app) {
		        _super.call(this, domManager, app);
		    }
		    StyleBinding.prototype.applyValue = function (el, value, key) {
		        if (value === null || value === undefined || value === false) {
		            // Empty string removes the value, whereas null/undefined have no effect
		            value = "";
		        }
		        el.style[key] = value;
		    };
		    return StyleBinding;
		})(BindingBase_1.MultiOneWayBindingBase);
		exports.StyleBinding = StyleBinding;
		//# sourceMappingURL=MultiOneWay.js.map

	/***/ },
	/* 29 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		"use strict";
		/**
		* Base class for one-way bindings that take a single expression and apply the result to one or more target elements
		* @class
		*/
		var SingleOneWayBindingBase = (function () {
		    function SingleOneWayBindingBase(domManager, app) {
		        this.priority = 0;
		        this.domManager = domManager;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    SingleOneWayBindingBase.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var self = this;
		        var exp = this.domManager.compileBindingOptions(options, module);
		        var obs = this.domManager.expressionToObservable(exp, ctx);
		        // subscribe
		        state.cleanup.add(obs.subscribe(function (x) {
		            try {
		                self.applyValue(el, Utils_1.unwrapProperty(x));
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            el = null;
		            obs = null;
		            self = null;
		        }));
		    };
		    SingleOneWayBindingBase.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    SingleOneWayBindingBase.prototype.applyValue = function (el, value) {
		        Utils_1.throwError("you need to override this method!");
		    };
		    return SingleOneWayBindingBase;
		})();
		exports.SingleOneWayBindingBase = SingleOneWayBindingBase;
		/**
		* Base class for one-way bindings that take multiple expressions defined as object literal and apply the result to one or more target elements
		* @class
		*/
		var MultiOneWayBindingBase = (function () {
		    function MultiOneWayBindingBase(domManager, app, supportsDynamicValues) {
		        if (supportsDynamicValues === void 0) { supportsDynamicValues = false; }
		        this.priority = 0;
		        this.supportsDynamicValues = false;
		        this.domManager = domManager;
		        this.app = app;
		        this.supportsDynamicValues = supportsDynamicValues;
		    }
		    ////////////////////
		    // wx.IBinding
		    MultiOneWayBindingBase.prototype.applyBinding = function (node, options, ctx, state, module) {
		        if (node.nodeType !== 1)
		            Utils_1.throwError("binding only operates on elements!");
		        var compiled = this.domManager.compileBindingOptions(options, module);
		        if (compiled == null || (typeof compiled !== "object" && !this.supportsDynamicValues))
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var observables = new Array();
		        var obs;
		        var exp;
		        var keys = Object.keys(compiled);
		        var key;
		        if (typeof compiled === "function") {
		            exp = compiled;
		            obs = this.domManager.expressionToObservable(exp, ctx);
		            observables.push(["", obs]);
		        }
		        else {
		            for (var i = 0; i < keys.length; i++) {
		                key = keys[i];
		                var value = compiled[key];
		                exp = value;
		                obs = this.domManager.expressionToObservable(exp, ctx);
		                observables.push([key, obs]);
		            }
		        }
		        // subscribe
		        for (var i = 0; i < observables.length; i++) {
		            key = observables[i][0];
		            obs = observables[i][1];
		            this.subscribe(el, obs, key, state);
		        }
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            el = null;
		            keys = null;
		            // nullify locals
		            observables = null;
		        }));
		    };
		    MultiOneWayBindingBase.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    MultiOneWayBindingBase.prototype.subscribe = function (el, obs, key, state) {
		        var _this = this;
		        state.cleanup.add(obs.subscribe(function (x) {
		            try {
		                _this.applyValue(el, Utils_1.unwrapProperty(x), key);
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		    };
		    MultiOneWayBindingBase.prototype.applyValue = function (el, key, value) {
		        Utils_1.throwError("you need to override this method!");
		    };
		    return MultiOneWayBindingBase;
		})();
		exports.MultiOneWayBindingBase = MultiOneWayBindingBase;
		//# sourceMappingURL=BindingBase.js.map

	/***/ },
	/* 30 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var __extends = (this && this.__extends) || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		var Utils_1 = __webpack_require__(3);
		var BindingBase_1 = __webpack_require__(29);
		"use strict";
		////////////////////
		// Bindings
		var TextBinding = (function (_super) {
		    __extends(TextBinding, _super);
		    function TextBinding(domManager, app) {
		        _super.call(this, domManager, app);
		    }
		    TextBinding.prototype.applyValue = function (el, value) {
		        if ((value === null) || (value === undefined))
		            value = "";
		        el.textContent = value;
		    };
		    return TextBinding;
		})(BindingBase_1.SingleOneWayBindingBase);
		exports.TextBinding = TextBinding;
		var VisibleBinding = (function (_super) {
		    __extends(VisibleBinding, _super);
		    function VisibleBinding(domManager, app) {
		        _super.call(this, domManager, app);
		        this.inverse = false;
		        this.inverse = false;
		        this.priority = 10;
		    }
		    VisibleBinding.prototype.configure = function (_options) {
		        var options = _options;
		        VisibleBinding.useCssClass = options.useCssClass;
		        VisibleBinding.hiddenClass = options.hiddenClass;
		    };
		    ////////////////////
		    // implementation
		    VisibleBinding.prototype.applyValue = function (el, value) {
		        value = this.inverse ? !value : value;
		        if (!VisibleBinding.useCssClass) {
		            if (!value) {
		                el.style.display = "none";
		            }
		            else {
		                el.style.display = "";
		            }
		        }
		        else {
		            Utils_1.toggleCssClass(el, !value, VisibleBinding.hiddenClass);
		        }
		    };
		    return VisibleBinding;
		})(BindingBase_1.SingleOneWayBindingBase);
		exports.VisibleBinding = VisibleBinding;
		var HiddenBinding = (function (_super) {
		    __extends(HiddenBinding, _super);
		    function HiddenBinding(domManager, app) {
		        _super.call(this, domManager, app);
		        this.inverse = true;
		    }
		    return HiddenBinding;
		})(VisibleBinding);
		exports.HiddenBinding = HiddenBinding;
		var HtmlBinding = (function (_super) {
		    __extends(HtmlBinding, _super);
		    function HtmlBinding(domManager, app) {
		        _super.call(this, domManager, app);
		    }
		    HtmlBinding.prototype.applyValue = function (el, value) {
		        if ((value === null) || (value === undefined))
		            value = "";
		        el.innerHTML = value;
		    };
		    return HtmlBinding;
		})(BindingBase_1.SingleOneWayBindingBase);
		exports.HtmlBinding = HtmlBinding;
		var DisableBinding = (function (_super) {
		    __extends(DisableBinding, _super);
		    function DisableBinding(domManager, app) {
		        _super.call(this, domManager, app);
		        this.inverse = false;
		        this.inverse = false;
		    }
		    ////////////////////
		    // implementation
		    DisableBinding.prototype.applyValue = function (el, value) {
		        value = this.inverse ? !value : value;
		        if (Utils_1.elementCanBeDisabled(el)) {
		            el.disabled = value;
		        }
		    };
		    return DisableBinding;
		})(BindingBase_1.SingleOneWayBindingBase);
		exports.DisableBinding = DisableBinding;
		var EnableBinding = (function (_super) {
		    __extends(EnableBinding, _super);
		    function EnableBinding(domManager, app) {
		        _super.call(this, domManager, app);
		        this.inverse = true;
		    }
		    return EnableBinding;
		})(DisableBinding);
		exports.EnableBinding = EnableBinding;
		//# sourceMappingURL=SingleOneWay.js.map

	/***/ },
	/* 31 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../RxExtensions.d.ts" />
		var Utils_1 = __webpack_require__(3);
		var VirtualChildNodes_1 = __webpack_require__(32);
		var RefCountDisposeWrapper_1 = __webpack_require__(21);
		var Injector_1 = __webpack_require__(2);
		var ListSupport_1 = __webpack_require__(17);
		"use strict";
		var ForEachBinding = (function () {
		    function ForEachBinding(domManager, app) {
		        this.priority = 40;
		        this.controlsDescendants = true;
		        this.domManager = domManager;
		        this.app = app;
		        // hook into getDataContext() to map state['index'] to ctx['$index']
		        domManager.registerDataContextExtension(function (node, ctx) {
		            var state = domManager.getNodeState(node);
		            ctx.$index = state.index;
		        });
		    }
		    ////////////////////
		    // wx.IBinding
		    ForEachBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("forEach binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("** invalid binding options!");
		        var compiled = this.domManager.compileBindingOptions(options, module);
		        var el = node;
		        var self = this;
		        var initialApply = true;
		        var cleanup = null;
		        var hooks;
		        var exp;
		        var setProxyFunc;
		        var animations = {};
		        if (typeof compiled === "object" && compiled.hasOwnProperty("data")) {
		            var opt = compiled;
		            exp = opt.data;
		            // extract animations
		            if (opt.itemEnter) {
		                animations.itemEnter = this.domManager.evaluateExpression(opt.itemEnter, ctx);
		                if (typeof animations.itemEnter === "string") {
		                    animations.itemEnter = module.animation(animations.itemEnter);
		                }
		            }
		            if (opt.itemLeave) {
		                animations.itemLeave = this.domManager.evaluateExpression(opt.itemLeave, ctx);
		                if (typeof animations.itemLeave === "string") {
		                    animations.itemLeave = module.animation(animations.itemLeave);
		                }
		            }
		            if (opt.hooks) {
		                // extract hooks
		                hooks = this.domManager.evaluateExpression(opt.hooks, ctx);
		            }
		            // optionally resolve hooks if passed as string identifier
		            if (typeof hooks === "string")
		                hooks = Injector_1.injector.get(hooks);
		            if (opt['debug']) {
		                if (opt['debug']['setProxyFunc']) {
		                    setProxyFunc = this.domManager.evaluateExpression(opt['debug']['setProxyFunc'], ctx);
		                }
		            }
		        }
		        else {
		            exp = compiled;
		        }
		        var obs = this.domManager.expressionToObservable(exp, ctx);
		        // add own disposables
		        state.cleanup.add(Rx.Disposable.create(function () {
		            if (cleanup) {
		                cleanup.dispose();
		                cleanup = null;
		            }
		        }));
		        // backup inner HTML
		        var template = new Array();
		        // subscribe
		        state.cleanup.add(obs.subscribe(function (x) {
		            try {
		                if (cleanup) {
		                    cleanup.dispose();
		                }
		                cleanup = new Rx.CompositeDisposable();
		                self.applyValue(el, x, hooks, animations, template, ctx, initialApply, cleanup, setProxyFunc);
		                initialApply = false;
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            obs = null;
		            el = null;
		            self = null;
		            // nullify locals
		            template = null;
		            hooks = null;
		        }));
		    };
		    ForEachBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    ForEachBinding.prototype.createIndexPropertyForNode = function (proxy, child, startIndex, trigger, templateLength) {
		        return Rx.Observable.defer(function () {
		            return Rx.Observable.create(function (obs) {
		                return trigger.subscribe(function (_) {
		                    // recalculate index from node position within parent
		                    var index = proxy.childNodes.indexOf(child);
		                    index /= templateLength;
		                    obs.onNext(index);
		                });
		            });
		        })
		            .toProperty(startIndex);
		    };
		    ForEachBinding.prototype.appendAllRows = function (proxy, list, ctx, template, hooks, animations, indexTrigger, isInitial) {
		        var length = list.length();
		        for (var i = 0; i < length; i++) {
		            this.appendRow(proxy, i, list.get(i), ctx, template, hooks, animations, indexTrigger, isInitial);
		        }
		    };
		    ForEachBinding.prototype.appendRow = function (proxy, index, item, ctx, template, hooks, animations, indexTrigger, isInitial) {
		        var nodes = Utils_1.cloneNodeArray(template);
		        var _index = index;
		        var enterAnimation = animations.itemEnter;
		        var cbData = {
		            item: item
		        };
		        if (indexTrigger) {
		            _index = this.createIndexPropertyForNode(proxy, nodes[0], index, indexTrigger, template.length);
		            cbData.indexDisp = new RefCountDisposeWrapper_1.default(_index, 0);
		        }
		        cbData.index = _index;
		        if (enterAnimation != null)
		            enterAnimation.prepare(nodes);
		        proxy.appendChilds(nodes, cbData);
		        if (hooks) {
		            if (hooks.afterRender)
		                hooks.afterRender(nodes, item);
		            if (!isInitial && hooks.afterAdd)
		                hooks.afterAdd(nodes, item, index);
		        }
		        if (enterAnimation) {
		            var disp = enterAnimation.run(nodes)
		                .continueWith(function () { return enterAnimation.complete(nodes); })
		                .subscribe(function (x) {
		                if (disp != null)
		                    disp.dispose();
		            });
		        }
		    };
		    ForEachBinding.prototype.insertRow = function (proxy, index, item, ctx, template, hooks, animations, indexTrigger) {
		        var templateLength = template.length;
		        var enterAnimation = animations.itemEnter;
		        var nodes = Utils_1.cloneNodeArray(template);
		        var _index = this.createIndexPropertyForNode(proxy, nodes[0], index, indexTrigger, template.length);
		        if (enterAnimation != null)
		            enterAnimation.prepare(nodes);
		        proxy.insertChilds(index * templateLength, nodes, {
		            index: _index,
		            item: item,
		            indexDisp: new RefCountDisposeWrapper_1.default(_index, 0)
		        });
		        if (hooks) {
		            if (hooks.afterRender)
		                hooks.afterRender(nodes, item);
		            if (hooks.afterAdd)
		                hooks.afterAdd(nodes, item, index);
		        }
		        if (enterAnimation) {
		            var disp = enterAnimation.run(nodes)
		                .continueWith(function () { return enterAnimation.complete(nodes); })
		                .subscribe(function (x) {
		                if (disp != null)
		                    disp.dispose();
		            });
		        }
		    };
		    ForEachBinding.prototype.removeRow = function (proxy, index, item, template, hooks, animations) {
		        var templateLength = template.length;
		        var el = proxy.targetNode;
		        var nodes = proxy.removeChilds(index * templateLength, templateLength, true);
		        var leaveAnimation = animations.itemLeave;
		        function removeNodes() {
		            for (var i = 0; i < templateLength; i++) {
		                el.removeChild(nodes[i]);
		            }
		        }
		        if (hooks && hooks.beforeRemove) {
		            hooks.beforeRemove(nodes, item, index);
		        }
		        else {
		            if (leaveAnimation != null) {
		                leaveAnimation.prepare(nodes);
		                var disp = leaveAnimation.run(nodes)
		                    .continueWith(function () { return leaveAnimation.complete(nodes); })
		                    .continueWith(removeNodes)
		                    .subscribe(function (x) {
		                    if (disp != null)
		                        disp.dispose();
		                });
		            }
		            else {
		                removeNodes();
		            }
		        }
		    };
		    ForEachBinding.prototype.moveRow = function (proxy, from, to, item, template, hooks, animations, indexTrigger) {
		        var templateLength = template.length;
		        var el = proxy.targetNode;
		        var nodes = proxy.removeChilds(from * templateLength, templateLength, true);
		        var leaveAnimation = animations.itemLeave;
		        var enterAnimation = animations.itemEnter;
		        var combined = [];
		        var obs;
		        var self = this;
		        if (hooks && hooks.beforeMove) {
		            hooks.beforeMove(nodes, item, from);
		        }
		        function removeNodes() {
		            for (var i = 0; i < templateLength; i++) {
		                el.removeChild(nodes[i]);
		            }
		        }
		        function createRow() {
		            // create new row
		            nodes = Utils_1.cloneNodeArray(template);
		            var _index = self.createIndexPropertyForNode(proxy, nodes[0], from, indexTrigger, template.length);
		            if (enterAnimation != null)
		                enterAnimation.prepare(nodes);
		            proxy.insertChilds(templateLength * to, nodes, {
		                index: _index,
		                item: item,
		                indexDisp: new RefCountDisposeWrapper_1.default(_index, 0)
		            });
		            if (hooks && hooks.afterMove) {
		                hooks.afterMove(nodes, item, from);
		            }
		        }
		        // construct leave-observable
		        if (leaveAnimation) {
		            leaveAnimation.prepare(nodes);
		            obs = leaveAnimation.run(nodes)
		                .continueWith(function () { return leaveAnimation.complete(nodes); })
		                .continueWith(removeNodes);
		        }
		        else {
		            obs = Rx.Observable.startDeferred(removeNodes);
		        }
		        combined.push(obs);
		        // construct enter-observable
		        obs = Rx.Observable.startDeferred(createRow);
		        if (enterAnimation) {
		            obs = obs.continueWith(enterAnimation.run(nodes))
		                .continueWith(function () { return enterAnimation.complete(nodes); });
		        }
		        combined.push(obs);
		        // optimize return
		        if (combined.length > 1)
		            obs = Rx.Observable.combineLatest(combined, Utils_1.noop).take(1);
		        else if (combined.length === 1)
		            obs = combined[0].take(1);
		        var disp = obs.subscribe(function (x) {
		            if (disp != null)
		                disp.dispose();
		        });
		    };
		    ForEachBinding.prototype.rebindRow = function (proxy, index, item, template, indexTrigger) {
		        var templateLength = template.length;
		        var _index = this.createIndexPropertyForNode(proxy, proxy.childNodes[(index * templateLength)], index, indexTrigger, template.length);
		        var indexDisp = new RefCountDisposeWrapper_1.default(_index, 0);
		        for (var i = 0; i < template.length; i++) {
		            var node = proxy.childNodes[(index * templateLength) + i];
		            if (node.nodeType === 1) {
		                this.domManager.cleanNode(node);
		                var state = this.domManager.createNodeState(item);
		                state.index = _index;
		                indexDisp.addRef();
		                state.cleanup.add(indexDisp);
		                this.domManager.setNodeState(node, state);
		                this.domManager.applyBindings(item, node);
		            }
		        }
		    };
		    ForEachBinding.prototype.observeList = function (proxy, ctx, template, cleanup, list, hooks, animations, indexTrigger) {
		        var _this = this;
		        var i;
		        var length;
		        cleanup.add(indexTrigger);
		        // initial insert
		        this.appendAllRows(proxy, list, ctx, template, hooks, animations, indexTrigger, true);
		        // track changes
		        cleanup.add(list.itemsAdded.subscribe(function (e) {
		            length = e.items.length;
		            if (e.from === list.length()) {
		                for (var i_1 = 0; i_1 < length; i_1++) {
		                    _this.appendRow(proxy, i_1 + e.from, e.items[i_1], ctx, template, hooks, animations, indexTrigger, false);
		                }
		            }
		            else {
		                for (var i_2 = 0; i_2 < e.items.length; i_2++) {
		                    _this.insertRow(proxy, i_2 + e.from, e.items[i_2], ctx, template, hooks, animations, indexTrigger);
		                }
		            }
		            indexTrigger.onNext(true);
		        }));
		        cleanup.add(list.itemsRemoved.subscribe(function (e) {
		            length = e.items.length;
		            for (var i_3 = 0; i_3 < length; i_3++) {
		                _this.removeRow(proxy, i_3 + e.from, e.items[i_3], template, hooks, animations);
		            }
		            indexTrigger.onNext(true);
		        }));
		        cleanup.add(list.itemsMoved.subscribe(function (e) {
		            _this.moveRow(proxy, e.from, e.to, e.items[0], template, hooks, animations, indexTrigger);
		            indexTrigger.onNext(true);
		        }));
		        cleanup.add(list.itemReplaced.subscribe(function (e) {
		            _this.rebindRow(proxy, e.from, e.items[0], template, indexTrigger);
		            indexTrigger.onNext(true);
		        }));
		        cleanup.add(list.shouldReset.subscribe(function (e) {
		            proxy.clear();
		            _this.appendAllRows(proxy, list, ctx, template, hooks, animations, indexTrigger, false);
		            indexTrigger.onNext(true);
		        }));
		    };
		    ForEachBinding.prototype.applyValue = function (el, value, hooks, animations, template, ctx, initialApply, cleanup, setProxyFunc) {
		        var i, length;
		        if (initialApply) {
		            // clone to template
		            length = el.childNodes.length;
		            for (var i_4 = 0; i_4 < length; i_4++) {
		                template.push(el.childNodes[i_4].cloneNode(true));
		            }
		        }
		        // perform initial clear
		        while (el.firstChild) {
		            el.removeChild(el.firstChild);
		        }
		        if (template.length === 0)
		            return; // nothing to do
		        var proxy;
		        var self = this;
		        var recalcIndextrigger;
		        function nodeInsertCB(node, callbackData) {
		            var item = callbackData.item;
		            var index = callbackData.index;
		            var indexDisp = callbackData.indexDisp;
		            if (node.nodeType === 1) {
		                // propagate index to state
		                var state = (self.domManager.getNodeState(node) || self.domManager.createNodeState());
		                state.model = item;
		                state.index = index;
		                self.domManager.setNodeState(node, state);
		                if (recalcIndextrigger != null && indexDisp != null) {
		                    indexDisp.addRef();
		                    state.cleanup.add(indexDisp);
		                }
		                self.domManager.applyBindings(item, node);
		            }
		        }
		        function nodeRemoveCB(node) {
		            if (node.nodeType === 1) {
		                self.domManager.cleanNode(node);
		            }
		        }
		        proxy = new VirtualChildNodes_1.default(el, false, nodeInsertCB, nodeRemoveCB);
		        if (setProxyFunc)
		            setProxyFunc(proxy);
		        cleanup.add(Rx.Disposable.create(function () {
		            proxy = null;
		        }));
		        if (Array.isArray(value)) {
		            var arr = value;
		            // iterate once and be done with it
		            length = arr.length;
		            for (var i_5 = 0; i_5 < length; i_5++) {
		                this.appendRow(proxy, i_5, arr[i_5], ctx, template, hooks, animations, undefined, true);
		            }
		        }
		        else if (ListSupport_1.isList(value)) {
		            var list = value;
		            recalcIndextrigger = new Rx.Subject();
		            this.observeList(proxy, ctx, template, cleanup, list, hooks, animations, recalcIndextrigger);
		        }
		        else {
		            Utils_1.throwError("forEach-Binding: value must be either array or observable list");
		        }
		    };
		    return ForEachBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = ForEachBinding;
		//# sourceMappingURL=ForEach.js.map

	/***/ },
	/* 32 */
	/***/ function(module, exports) {

		"use strict";
		/**
		* VirtualChildNodes implements consisent and predictable manipulation
		* of a DOM Node's childNodes collection regardless its the true contents
		* @class
		**/
		var VirtualChildNodes = (function () {
		    function VirtualChildNodes(targetNode, initialSyncToTarget, insertCB, removeCB) {
		        this.childNodes = [];
		        this.targetNode = targetNode;
		        this.insertCB = insertCB;
		        this.removeCB = removeCB;
		        if (initialSyncToTarget) {
		            for (var i = 0; i < targetNode.childNodes.length; i++) {
		                this.childNodes.push(targetNode.childNodes[i]);
		            }
		        }
		    }
		    VirtualChildNodes.prototype.appendChilds = function (nodes, callbackData) {
		        var length = nodes.length;
		        // append to proxy array
		        if (nodes.length > 1)
		            Array.prototype.push.apply(this.childNodes, nodes);
		        else
		            this.childNodes.push(nodes[0]);
		        // append to DOM
		        for (var i = 0; i < length; i++) {
		            this.targetNode.appendChild(nodes[i]);
		        }
		        // callback
		        if (this.insertCB) {
		            for (var i = 0; i < length; i++) {
		                this.insertCB(nodes[i], callbackData);
		            }
		        }
		    };
		    VirtualChildNodes.prototype.insertChilds = function (index, nodes, callbackData) {
		        if (index === this.childNodes.length) {
		            this.appendChilds(nodes, callbackData);
		        }
		        else {
		            var refNode = this.childNodes[index];
		            var length_1 = nodes.length;
		            // insert into proxy array
		            Array.prototype.splice.apply(this.childNodes, [index, 0].concat(nodes));
		            // insert into DOM
		            for (var i = 0; i < length_1; i++) {
		                this.targetNode.insertBefore(nodes[i], refNode);
		            }
		            // callback
		            if (this.insertCB) {
		                for (var i = 0; i < length_1; i++) {
		                    this.insertCB(nodes[i], callbackData);
		                }
		            }
		        }
		    };
		    VirtualChildNodes.prototype.removeChilds = function (index, count, keepDom) {
		        var node;
		        if (count === 0)
		            return [];
		        // extract removed nodes
		        var nodes = this.childNodes.slice(index, index + count);
		        // remove from proxy array
		        this.childNodes.splice(index, count);
		        if (!keepDom) {
		            // remove from DOM
		            var length_2 = nodes.length;
		            for (var i = 0; i < length_2; i++) {
		                node = nodes[i];
		                if (this.removeCB)
		                    this.removeCB(node);
		                this.targetNode.removeChild(node);
		            }
		        }
		        return nodes;
		    };
		    VirtualChildNodes.prototype.clear = function () {
		        // remove from DOM
		        var length = this.childNodes.length;
		        var node;
		        for (var i = 0; i < length; i++) {
		            node = this.childNodes[i];
		            if (this.removeCB)
		                this.removeCB(node);
		            this.targetNode.removeChild(node);
		        }
		        // reset proxy array
		        this.childNodes = [];
		    };
		    return VirtualChildNodes;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = VirtualChildNodes;
		//# sourceMappingURL=VirtualChildNodes.js.map

	/***/ },
	/* 33 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		var Command_1 = __webpack_require__(25);
		"use strict";
		var EventBinding = (function () {
		    function EventBinding(domManager, app) {
		        this.priority = 0;
		        this.domManager = domManager;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    EventBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("event-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        // create an observable for each event handler value
		        var tokens = this.domManager.getObjectLiteralTokens(options);
		        tokens.forEach(function (token) {
		            _this.wireEvent(el, token.value, token.key, ctx, state, module);
		        });
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            el = null;
		            // nullify locals
		        }));
		    };
		    EventBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    EventBinding.prototype.wireEvent = function (el, value, eventName, ctx, state, module) {
		        var _this = this;
		        var exp = this.domManager.compileBindingOptions(value, module);
		        var command;
		        var commandParameter = undefined;
		        var obs = Rx.Observable.fromEvent(el, eventName);
		        if (typeof exp === "function") {
		            var handler = this.domManager.evaluateExpression(exp, ctx);
		            handler = Utils_1.unwrapProperty(handler);
		            if (Utils_1.isFunction(handler)) {
		                state.cleanup.add(obs.subscribe(function (e) {
		                    handler.apply(ctx.$data, [ctx, e]);
		                }));
		            }
		            else {
		                if (Command_1.isCommand(handler)) {
		                    command = handler;
		                    state.cleanup.add(obs.subscribe(function (_) {
		                        command.execute(undefined);
		                    }));
		                }
		                else {
		                    // assumed to be an Rx.Observer
		                    var observer = handler;
		                    // subscribe event directly to observer
		                    state.cleanup.add(obs.subscribe(observer));
		                }
		            }
		        }
		        else if (typeof exp === "object") {
		            var opt = exp;
		            command = this.domManager.evaluateExpression(opt.command, ctx);
		            command = Utils_1.unwrapProperty(command);
		            if (exp.hasOwnProperty("parameter"))
		                commandParameter = this.domManager.evaluateExpression(opt.parameter, ctx);
		            state.cleanup.add(obs.subscribe(function (_) {
		                try {
		                    command.execute(commandParameter);
		                }
		                catch (e) {
		                    _this.app.defaultExceptionHandler.onNext(e);
		                }
		            }));
		        }
		        else {
		            Utils_1.throwError("invalid binding options");
		        }
		    };
		    return EventBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = EventBinding;
		//# sourceMappingURL=Event.js.map

	/***/ },
	/* 34 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		var res = __webpack_require__(6);
		"use strict";
		var ValueBinding = (function () {
		    function ValueBinding(domManager, app) {
		        this.priority = 5;
		        this.domManager = domManager;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    ValueBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("value-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var tag = el.tagName.toLowerCase();
		        if (tag !== 'input' && tag !== 'option' && tag !== 'select' && tag !== 'textarea')
		            Utils_1.throwError("value-binding only operates on checkboxes and radio-buttons");
		        var storeValueInNodeState = (tag === 'input' && el.type === 'radio') || tag === 'option';
		        var prop;
		        var cleanup;
		        var exp = this.domManager.compileBindingOptions(options, module);
		        function doCleanup() {
		            if (cleanup) {
		                cleanup.dispose();
		                cleanup = null;
		            }
		        }
		        function updateElement(domManager, value) {
		            if (storeValueInNodeState)
		                setNodeValue(el, value, domManager);
		            else {
		                if ((value === null) || (value === undefined))
		                    value = "";
		                el.value = value;
		            }
		        }
		        // options is supposed to be a field-access path
		        state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (model) {
		            try {
		                if (!Utils_1.isProperty(model)) {
		                    // initial and final update
		                    updateElement(_this.domManager, model);
		                }
		                else {
		                    doCleanup();
		                    cleanup = new Rx.CompositeDisposable();
		                    // update on property change
		                    prop = model;
		                    cleanup.add(prop.changed.subscribe(function (x) {
		                        updateElement(_this.domManager, x);
		                    }));
		                    // initial update
		                    updateElement(_this.domManager, prop());
		                    // don't attempt to updated computed properties
		                    if (!prop.source) {
		                        cleanup.add(Rx.Observable.fromEvent(el, 'change').subscribe(function (e) {
		                            try {
		                                if (storeValueInNodeState)
		                                    prop(getNodeValue(el, _this.domManager));
		                                else
		                                    prop(el.value);
		                            }
		                            catch (e) {
		                                _this.app.defaultExceptionHandler.onNext(e);
		                            }
		                        }));
		                    }
		                }
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            el = null;
		            // nullify locals
		            doCleanup();
		        }));
		    };
		    ValueBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    return ValueBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = ValueBinding;
		/**
		 * For certain elements such as select and input type=radio we store
		 * the real element value in NodeState if it is anything other than a
		 * string. This method returns that value.
		 * @param {Node} node
		 * @param {IDomManager} domManager
		 */
		function getNodeValue(node, domManager) {
		    var state = domManager.getNodeState(node);
		    if (state != null && state[res.hasValueBindingValue]) {
		        return state[res.valueBindingValue];
		    }
		    return node.value;
		}
		exports.getNodeValue = getNodeValue;
		/**
		 * Associate a value with an element. Either by using its value-attribute
		 * or storing it in NodeState
		 * @param {Node} node
		 * @param {any} value
		 * @param {IDomManager} domManager
		 */
		function setNodeValue(node, value, domManager) {
		    if ((value === null) || (value === undefined))
		        value = "";
		    var state = domManager.getNodeState(node);
		    if (typeof value === "string") {
		        // Update the element only if the element and model are different. On some browsers, updating the value
		        // will move the cursor to the end of the input, which would be bad while the user is typing.
		        if (node.value !== value) {
		            node.value = value;
		            // clear state since value is stored in attribute
		            if (state != null && state[res.hasValueBindingValue]) {
		                state[res.hasValueBindingValue] = false;
		                state[res.valueBindingValue] = undefined;
		            }
		        }
		    }
		    else {
		        // get or create state
		        if (state == null) {
		            state = this.createNodeState();
		            this.setNodeState(node, state);
		        }
		        // store value
		        state[res.valueBindingValue] = value;
		        state[res.hasValueBindingValue] = true;
		    }
		}
		exports.setNodeValue = setNodeValue;
		//# sourceMappingURL=Value.js.map

	/***/ },
	/* 35 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		var BindingSupport_1 = __webpack_require__(36);
		"use strict";
		var HasFocusBinding = (function () {
		    function HasFocusBinding(domManager, app) {
		        this.priority = -1;
		        this.domManager = domManager;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    HasFocusBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("hasFocus-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var prop;
		        var cleanup;
		        var compiled = this.domManager.compileBindingOptions(options, module);
		        var exp;
		        var delay = 0;
		        if (typeof compiled === "object" && compiled.hasOwnProperty("property")) {
		            var opt = compiled;
		            exp = opt.property;
		            delay = this.domManager.evaluateExpression(opt.delay, ctx);
		            // convert boolean to number
		            if (typeof delay === "boolean")
		                delay = delay ? 1 : 0;
		        }
		        else {
		            exp = compiled;
		        }
		        function doCleanup() {
		            if (cleanup) {
		                cleanup.dispose();
		                cleanup = null;
		            }
		        }
		        function handleElementFocusChange(isFocused) {
		            // If possible, ignore which event was raised and determine focus state using activeElement,
		            // as this avoids phantom focus/blur events raised when changing tabs in modern browsers.
		            var ownerDoc = el.ownerDocument;
		            if ("activeElement" in ownerDoc) {
		                var active;
		                try {
		                    active = ownerDoc.activeElement;
		                }
		                catch (e) {
		                    // IE9 throws if you access activeElement during page load (see issue #703)
		                    active = ownerDoc.body;
		                }
		                isFocused = (active === el);
		            }
		            prop(isFocused);
		        }
		        function updateElement(value) {
		            if (value) {
		                // Note: If the element is currently hidden, we schedule the focus change
		                // to occur "soonish". Technically this is a hack because it hides the fact
		                // that we make tricky assumption about the presence of a "visible" binding
		                // on the same element who's subscribe handler runs after us
		                if (delay === 0 && el.style.display !== 'none') {
		                    el.focus();
		                }
		                else {
		                    Rx.Observable.timer(delay).subscribe(function () {
		                        el.focus();
		                    });
		                }
		            }
		            else {
		                el.blur();
		            }
		        }
		        // options is supposed to be a @propref
		        state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (model) {
		            try {
		                if (!Utils_1.isProperty(model)) {
		                    BindingSupport_1.emitPropRefHint("HasFocus", options);
		                    // initial and final update
		                    updateElement(model);
		                }
		                else {
		                    doCleanup();
		                    cleanup = new Rx.CompositeDisposable();
		                    // update on property change
		                    prop = model;
		                    cleanup.add(prop.changed.subscribe(function (x) {
		                        updateElement(x);
		                    }));
		                    // initial update
		                    updateElement(prop());
		                    // don't attempt to updated computed properties
		                    if (!prop.source) {
		                        cleanup.add(Rx.Observable.merge(_this.getFocusEventObservables(el)).subscribe(function (hasFocus) {
		                            handleElementFocusChange(hasFocus);
		                        }));
		                    }
		                }
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            el = null;
		            // nullify locals
		            doCleanup();
		        }));
		    };
		    HasFocusBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    HasFocusBinding.prototype.getFocusEventObservables = function (el) {
		        var result = [];
		        result.push(Rx.Observable.fromEvent(el, 'focus').select(function (x) { return true; }));
		        result.push(Rx.Observable.fromEvent(el, 'focusin').select(function (x) { return true; }));
		        result.push(Rx.Observable.fromEvent(el, 'blur').select(function (x) { return false; }));
		        result.push(Rx.Observable.fromEvent(el, 'focusout').select(function (x) { return false; }));
		        return result;
		    };
		    return HasFocusBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = HasFocusBinding;
		//# sourceMappingURL=HasFocus.js.map

	/***/ },
	/* 36 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var log = __webpack_require__(7);
		"use strict";
		function emitPropRefHint(bindingName, bindingString) {
		    var msg = bindingName + "-Binding: You have passed a property instead of a propRef to a Two-Way binding. This is most likely not what you want because the binding won't be able to update your model when your view changes - Solution: Prefix your property with an @-symbol - Binding-Expression [\"" + bindingString + "\"]";
		    log.hint(msg);
		}
		exports.emitPropRefHint = emitPropRefHint;
		//# sourceMappingURL=BindingSupport.js.map

	/***/ },
	/* 37 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		"use strict";
		var WithBinding = (function () {
		    function WithBinding(domManager, app) {
		        this.priority = 50;
		        this.controlsDescendants = true;
		        this.domManager = domManager;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    WithBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("with-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var self = this;
		        var exp = this.domManager.compileBindingOptions(options, module);
		        var obs = this.domManager.expressionToObservable(exp, ctx);
		        // subscribe
		        state.cleanup.add(obs.subscribe(function (x) {
		            try {
		                self.applyValue(el, Utils_1.unwrapProperty(x), state);
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            obs = null;
		            el = null;
		            self = null;
		            // nullify locals
		        }));
		    };
		    WithBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    WithBinding.prototype.applyValue = function (el, value, state) {
		        state.model = value;
		        var ctx = this.domManager.getDataContext(el);
		        this.domManager.cleanDescendants(el);
		        this.domManager.applyBindingsToDescendants(ctx, el);
		    };
		    return WithBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = WithBinding;
		//# sourceMappingURL=With.js.map

	/***/ },
	/* 38 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		var BindingSupport_1 = __webpack_require__(36);
		"use strict";
		var CheckedBinding = (function () {
		    function CheckedBinding(domManager, app) {
		        this.priority = 0;
		        this.domManager = domManager;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    CheckedBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("checked-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var tag = el.tagName.toLowerCase();
		        var isCheckBox = el.type === 'checkbox';
		        var isRadioButton = el.type === 'radio';
		        if (tag !== 'input' || (!isCheckBox && !isRadioButton))
		            Utils_1.throwError("checked-binding only operates on checkboxes and radio-buttons");
		        var exp = this.domManager.compileBindingOptions(options, module);
		        var prop;
		        var cleanup;
		        function doCleanup() {
		            if (cleanup) {
		                cleanup.dispose();
		                cleanup = null;
		            }
		        }
		        function updateElement(value) {
		            el.checked = value;
		        }
		        state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (model) {
		            try {
		                if (!Utils_1.isProperty(model)) {
		                    BindingSupport_1.emitPropRefHint("Checked", options);
		                    // initial and final update
		                    updateElement(model);
		                }
		                else {
		                    doCleanup();
		                    cleanup = new Rx.CompositeDisposable();
		                    // update on property change
		                    prop = model;
		                    cleanup.add(prop.changed.subscribe(function (x) {
		                        updateElement(x);
		                    }));
		                    // initial update
		                    updateElement(prop());
		                    // don't attempt to updated computed properties
		                    if (!prop.source) {
		                        // wire change-events depending on browser and version
		                        var events = _this.getCheckedEventObservables(el);
		                        cleanup.add(Rx.Observable.merge(events).subscribe(function (e) {
		                            try {
		                                prop(el.checked);
		                            }
		                            catch (e) {
		                                _this.app.defaultExceptionHandler.onNext(e);
		                            }
		                        }));
		                    }
		                }
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            el = null;
		            // nullify locals
		            doCleanup();
		        }));
		    };
		    CheckedBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    CheckedBinding.prototype.getCheckedEventObservables = function (el) {
		        var result = [];
		        result.push(Rx.Observable.fromEvent(el, 'click'));
		        result.push(Rx.Observable.fromEvent(el, 'change'));
		        return result;
		    };
		    return CheckedBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = CheckedBinding;
		//# sourceMappingURL=Checked.js.map

	/***/ },
	/* 39 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		var Command_1 = __webpack_require__(25);
		"use strict";
		var keysByCode = {
		    8: 'backspace',
		    9: 'tab',
		    13: 'enter',
		    27: 'esc',
		    32: 'space',
		    33: 'pageup',
		    34: 'pagedown',
		    35: 'end',
		    36: 'home',
		    37: 'left',
		    38: 'up',
		    39: 'right',
		    40: 'down',
		    45: 'insert',
		    46: 'delete'
		};
		var KeyPressBinding = (function () {
		    function KeyPressBinding(domManager, app) {
		        this.priority = 0;
		        this.domManager = domManager;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    KeyPressBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("keyPress-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        // create an observable for key combination
		        var tokens = this.domManager.getObjectLiteralTokens(options);
		        var obs = Rx.Observable.fromEvent(el, "keydown")
		            .where(function (x) { return !x.repeat; })
		            .publish()
		            .refCount();
		        tokens.forEach(function (token) {
		            var keyDesc = token.key;
		            var combination, combinations = [];
		            // parse key combinations
		            keyDesc.split(' ').forEach(function (variation) {
		                combination = {
		                    expression: keyDesc,
		                    keys: {}
		                };
		                variation.split('-').forEach(function (value) {
		                    combination.keys[value.trim()] = true;
		                });
		                combinations.push(combination);
		            });
		            _this.wireKey(token.value, obs, combinations, ctx, state, module);
		        });
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            el = null;
		            // nullify locals
		        }));
		    };
		    KeyPressBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    KeyPressBinding.prototype.testCombination = function (combination, event) {
		        var metaPressed = !!(event.metaKey && !event.ctrlKey);
		        var altPressed = !!event.altKey;
		        var ctrlPressed = !!event.ctrlKey;
		        var shiftPressed = !!event.shiftKey;
		        var keyCode = event.keyCode;
		        var metaRequired = !!combination.keys.meta;
		        var altRequired = !!combination.keys.alt;
		        var ctrlRequired = !!combination.keys.ctrl;
		        var shiftRequired = !!combination.keys.shift;
		        // normalize keycodes
		        if ((!shiftPressed || shiftRequired) && keyCode >= 65 && keyCode <= 90)
		            keyCode = keyCode + 32;
		        var mainKeyPressed = combination.keys[keysByCode[keyCode]] || combination.keys[keyCode.toString()] || combination.keys[String.fromCharCode(keyCode)];
		        return (mainKeyPressed &&
		            (metaRequired === metaPressed) &&
		            (altRequired === altPressed) &&
		            (ctrlRequired === ctrlPressed) &&
		            (shiftRequired === shiftPressed));
		    };
		    KeyPressBinding.prototype.testCombinations = function (combinations, event) {
		        for (var i = 0; i < combinations.length; i++) {
		            if (this.testCombination(combinations[i], event))
		                return true;
		        }
		        return false;
		    };
		    KeyPressBinding.prototype.wireKey = function (value, obs, combinations, ctx, state, module) {
		        var _this = this;
		        var exp = this.domManager.compileBindingOptions(value, module);
		        var command;
		        var commandParameter = undefined;
		        if (typeof exp === "function") {
		            var handler = this.domManager.evaluateExpression(exp, ctx);
		            handler = Utils_1.unwrapProperty(handler);
		            if (!Command_1.isCommand(handler)) {
		                state.cleanup.add(obs.where(function (e) { return _this.testCombinations(combinations, e); }).subscribe(function (e) {
		                    try {
		                        handler.apply(ctx.$data, [ctx]);
		                        e.preventDefault();
		                    }
		                    catch (e) {
		                        _this.app.defaultExceptionHandler.onNext(e);
		                    }
		                }));
		            }
		            else {
		                command = handler;
		                state.cleanup.add(obs.where(function (e) { return _this.testCombinations(combinations, e); }).subscribe(function (e) {
		                    try {
		                        command.execute(undefined);
		                        e.preventDefault();
		                    }
		                    catch (e) {
		                        _this.app.defaultExceptionHandler.onNext(e);
		                    }
		                }));
		            }
		        }
		        else if (typeof exp === "object") {
		            command = this.domManager.evaluateExpression(exp.command, ctx);
		            command = Utils_1.unwrapProperty(command);
		            if (exp.hasOwnProperty("parameter"))
		                commandParameter = this.domManager.evaluateExpression(exp.parameter, ctx);
		            state.cleanup.add(obs.where(function (e) { return _this.testCombinations(combinations, e); }).subscribe(function (e) {
		                try {
		                    command.execute(commandParameter);
		                    e.preventDefault();
		                }
		                catch (e) {
		                    _this.app.defaultExceptionHandler.onNext(e);
		                }
		            }));
		        }
		        else {
		            Utils_1.throwError("invalid binding options");
		        }
		    };
		    return KeyPressBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = KeyPressBinding;
		//# sourceMappingURL=KeyPress.js.map

	/***/ },
	/* 40 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		var env = __webpack_require__(16);
		var BindingSupport_1 = __webpack_require__(36);
		"use strict";
		var TextInputBinding = (function () {
		    function TextInputBinding(domManager, app) {
		        this.priority = 0;
		        this.domManager = domManager;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    TextInputBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("textInput-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var tag = el.tagName.toLowerCase();
		        var isTextArea = tag === "textarea";
		        if (tag !== 'input' && tag !== 'textarea')
		            Utils_1.throwError("textInput-binding can only be applied to input or textarea elements");
		        var exp = this.domManager.compileBindingOptions(options, module);
		        var prop;
		        var propertySubscription;
		        var eventSubscription;
		        var previousElementValue;
		        function updateElement(value) {
		            if (value === null || value === undefined) {
		                value = "";
		            }
		            // Update the element only if the element and model are different. On some browsers, updating the value
		            // will move the cursor to the end of the input, which would be bad while the user is typing.
		            if (el.value !== value) {
		                previousElementValue = value; // Make sure we ignore events (propertychange) that result from updating the value
		                el.value = value;
		            }
		        }
		        function doCleanup() {
		            if (propertySubscription) {
		                propertySubscription.dispose();
		                propertySubscription = null;
		            }
		            if (eventSubscription) {
		                eventSubscription.dispose();
		                eventSubscription = null;
		            }
		        }
		        state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (src) {
		            try {
		                if (!Utils_1.isProperty(src)) {
		                    BindingSupport_1.emitPropRefHint("TextInput", options);
		                    // initial and final update
		                    updateElement(src);
		                }
		                else {
		                    doCleanup();
		                    // update on property change
		                    prop = src;
		                    propertySubscription = prop.changed.subscribe(function (x) {
		                        updateElement(x);
		                    });
		                    // initial update
		                    updateElement(prop());
		                    // don't attempt to updated computed properties
		                    if (!prop.source) {
		                        // wire change-events depending on browser and version
		                        var events = _this.getTextInputEventObservables(el, isTextArea);
		                        eventSubscription = Rx.Observable.merge(events).subscribe(function (e) {
		                            try {
		                                prop(el.value);
		                            }
		                            catch (e) {
		                                _this.app.defaultExceptionHandler.onNext(e);
		                            }
		                        });
		                    }
		                }
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            el = null;
		            // nullify locals
		            doCleanup();
		        }));
		    };
		    TextInputBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    TextInputBinding.prototype.getTextInputEventObservables = function (el, isTextArea) {
		        var result = [];
		        if (env.ie && env.ie.version < 10) {
		            if (env.ie.version <= 9) {
		                // Internet Explorer 9 doesn't fire the 'input' event when deleting text, including using
		                // the backspace, delete, or ctrl-x keys, clicking the 'x' to clear the input, dragging text
		                // out of the field, and cutting or deleting text using the context menu. 'selectionchange'
		                // can detect all of those except dragging text out of the field, for which we use 'dragend'.
		                result.push(env.ie.getSelectionChangeObservable(el).where(function (doc) { return doc.activeElement === el; }));
		                result.push(Rx.Observable.fromEvent(el, 'dragend'));
		                // IE 9 does support 'input', but since it doesn't fire it when
		                // using autocomplete, we'll use 'propertychange' for it also.
		                result.push(Rx.Observable.fromEvent(el, 'input'));
		                result.push(Rx.Observable.fromEvent(el, 'propertychange').where(function (e) { return e.propertyName === 'value'; }));
		            }
		        }
		        else {
		            // All other supported browsers support the 'input' event, which fires whenever the content of the element is changed
		            // through the user interface.
		            result.push(Rx.Observable.fromEvent(el, 'input'));
		            if (env.safari && env.safari.version < 5 && isTextArea) {
		                // Safari <5 doesn't fire the 'input' event for <textarea> elements (it does fire 'textInput'
		                // but only when typing). So we'll just catch as much as we can with keydown, cut, and paste.
		                result.push(Rx.Observable.fromEvent(el, 'keydown'));
		                result.push(Rx.Observable.fromEvent(el, 'paste'));
		                result.push(Rx.Observable.fromEvent(el, 'cut'));
		            }
		            else if (env.opera && env.opera.version < 11) {
		                // Opera 10 doesn't always fire the 'input' event for cut, paste, undo & drop operations.
		                // We can try to catch some of those using 'keydown'.
		                result.push(Rx.Observable.fromEvent(el, 'keydown'));
		            }
		            else if (env.firefox && env.firefox.version < 4.0) {
		                // Firefox <= 3.6 doesn't fire the 'input' event when text is filled in through autocomplete
		                result.push(Rx.Observable.fromEvent(el, 'DOMAutoComplete'));
		                // Firefox <=3.5 doesn't fire the 'input' event when text is dropped into the input.
		                result.push(Rx.Observable.fromEvent(el, 'dragdrop')); // <3.5
		                result.push(Rx.Observable.fromEvent(el, 'drop')); // 3.5
		            }
		        }
		        // Bind to the change event so that we can catch programmatic updates of the value that fire this event.
		        result.push(Rx.Observable.fromEvent(el, 'change'));
		        return result;
		    };
		    return TextInputBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = TextInputBinding;
		//# sourceMappingURL=TextInput.js.map

	/***/ },
	/* 41 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		var Value_1 = __webpack_require__(34);
		var ListSupport_1 = __webpack_require__(17);
		var BindingSupport_1 = __webpack_require__(36);
		"use strict";
		var impls = new Array();
		var RadioSingleSelectionImpl = (function () {
		    function RadioSingleSelectionImpl(domManager) {
		        this.domManager = domManager;
		    }
		    RadioSingleSelectionImpl.prototype.supports = function (el, model) {
		        return (el.tagName.toLowerCase() === 'input' &&
		            el.getAttribute("type") === 'radio') &&
		            !ListSupport_1.isList(model);
		    };
		    RadioSingleSelectionImpl.prototype.observeElement = function (el) {
		        return Rx.Observable.merge(Rx.Observable.fromEvent(el, 'click'), Rx.Observable.fromEvent(el, 'change'));
		    };
		    RadioSingleSelectionImpl.prototype.observeModel = function (model) {
		        if (Utils_1.isProperty(model)) {
		            var prop = model;
		            return prop.changed;
		        }
		        return Rx.Observable.never();
		    };
		    RadioSingleSelectionImpl.prototype.updateElement = function (el, model) {
		        var input = el;
		        input.checked = Value_1.getNodeValue(input, this.domManager) == Utils_1.unwrapProperty(model);
		    };
		    RadioSingleSelectionImpl.prototype.updateModel = function (el, model, e) {
		        var input = el;
		        if (input.checked) {
		            model(Value_1.getNodeValue(input, this.domManager));
		        }
		    };
		    return RadioSingleSelectionImpl;
		})();
		var OptionSingleSelectionImpl = (function () {
		    function OptionSingleSelectionImpl(domManager) {
		        this.domManager = domManager;
		    }
		    OptionSingleSelectionImpl.prototype.supports = function (el, model) {
		        return el.tagName.toLowerCase() === 'select' &&
		            !ListSupport_1.isList(model);
		    };
		    OptionSingleSelectionImpl.prototype.observeElement = function (el) {
		        return Rx.Observable.fromEvent(el, 'change');
		    };
		    OptionSingleSelectionImpl.prototype.observeModel = function (model) {
		        if (Utils_1.isProperty(model)) {
		            var prop = model;
		            return prop.changed;
		        }
		        return Rx.Observable.never();
		    };
		    OptionSingleSelectionImpl.prototype.updateElement = function (el, model) {
		        var select = el;
		        var value = Utils_1.unwrapProperty(model);
		        var length = select.options.length;
		        if (value == null) {
		            select.selectedIndex = -1;
		        }
		        else {
		            for (var i = 0; i < length; i++) {
		                var option = select.options[i];
		                if (Value_1.getNodeValue(option, this.domManager) == value) {
		                    select.selectedIndex = i;
		                    break;
		                }
		            }
		        }
		    };
		    OptionSingleSelectionImpl.prototype.updateModel = function (el, model, e) {
		        var select = el;
		        // selected-value comes from the option at selectedIndex
		        var value = select.selectedIndex !== -1 ?
		            Value_1.getNodeValue(select.options[select.selectedIndex], this.domManager) :
		            undefined;
		        model(value);
		    };
		    return OptionSingleSelectionImpl;
		})();
		var SelectedValueBinding = (function () {
		    function SelectedValueBinding(domManager, app) {
		        this.priority = 0;
		        this.domManager = domManager;
		        this.app = app;
		        impls.push(new RadioSingleSelectionImpl(domManager));
		        impls.push(new OptionSingleSelectionImpl(domManager));
		    }
		    ////////////////////
		    // wx.IBinding
		    SelectedValueBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("selectedValue-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var impl;
		        var implCleanup;
		        var exp = this.domManager.compileBindingOptions(options, module);
		        function cleanupImpl() {
		            if (implCleanup) {
		                implCleanup.dispose();
		                implCleanup = null;
		            }
		        }
		        // options is supposed to be a field-access path
		        state.cleanup.add(this.domManager.expressionToObservable(exp, ctx).subscribe(function (model) {
		            try {
		                cleanupImpl();
		                // lookup implementation
		                impl = undefined;
		                for (var i = 0; i < impls.length; i++) {
		                    if (impls[i].supports(el, model)) {
		                        impl = impls[i];
		                        break;
		                    }
		                }
		                if (!impl)
		                    Utils_1.throwError("selectedValue-binding does not support this combination of bound element and model!");
		                implCleanup = new Rx.CompositeDisposable();
		                // initial update
		                impl.updateElement(el, model);
		                // update on model change
		                implCleanup.add(impl.observeModel(model).subscribe(function (x) {
		                    try {
		                        impl.updateElement(el, model);
		                    }
		                    catch (e) {
		                        _this.app.defaultExceptionHandler.onNext(e);
		                    }
		                }));
		                // wire change-events
		                if (Utils_1.isProperty(model)) {
		                    implCleanup.add(impl.observeElement(el).subscribe(function (e) {
		                        try {
		                            impl.updateModel(el, model, e);
		                        }
		                        catch (e) {
		                            _this.app.defaultExceptionHandler.onNext(e);
		                        }
		                    }));
		                }
		                else {
		                    BindingSupport_1.emitPropRefHint("SelectedValue", options);
		                }
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            el = null;
		            // nullify locals
		            cleanupImpl();
		        }));
		    };
		    SelectedValueBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    return SelectedValueBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = SelectedValueBinding;
		//# sourceMappingURL=SelectedValue.js.map

	/***/ },
	/* 42 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		"use strict";
		var ComponentBinding = (function () {
		    function ComponentBinding(domManager, app) {
		        this.priority = 30;
		        this.controlsDescendants = true;
		        this.domManager = domManager;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    ComponentBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("component-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var compiled = this.domManager.compileBindingOptions(options, module);
		        var opt = compiled;
		        var exp;
		        var componentNameObservable;
		        var componentParams = {};
		        var cleanup;
		        function doCleanup() {
		            if (cleanup) {
		                cleanup.dispose();
		                cleanup = null;
		            }
		        }
		        if (typeof compiled === "function") {
		            exp = compiled;
		            componentNameObservable = this.domManager.expressionToObservable(exp, ctx);
		        }
		        else {
		            // collect component-name observable
		            componentNameObservable = this.domManager.expressionToObservable(opt.name, ctx);
		            // collect params observables
		            if (opt.params) {
		                if (Utils_1.isFunction(opt.params)) {
		                    // opt params is object passed by value (probably $componentParams from view-binding)
		                    componentParams = this.domManager.evaluateExpression(opt.params, ctx);
		                }
		                else if (typeof opt.params === "object") {
		                    Object.keys(opt.params).forEach(function (x) {
		                        componentParams[x] = _this.domManager.evaluateExpression(opt.params[x], ctx);
		                    });
		                }
		                else {
		                    Utils_1.throwError("invalid component-params");
		                }
		            }
		        }
		        // subscribe to any input changes
		        state.cleanup.add(componentNameObservable.subscribe(function (componentName) {
		            try {
		                doCleanup();
		                cleanup = new Rx.CompositeDisposable();
		                // lookup component
		                var obs = module.loadComponent(componentName, componentParams);
		                var disp = undefined;
		                if (obs == null)
		                    Utils_1.throwError("component '{0}' is not registered with current module-context", componentName);
		                disp = obs.subscribe(function (component) {
		                    // loader cleanup
		                    if (disp != null) {
		                        disp.dispose();
		                        disp = undefined;
		                    }
		                    // auto-dispose view-model
		                    if (component.viewModel) {
		                        if (Utils_1.isDisposable(component.viewModel)) {
		                            cleanup.add(component.viewModel);
		                        }
		                    }
		                    // done
		                    _this.applyTemplate(component, el, ctx, state, component.template, component.viewModel);
		                });
		                if (disp != null)
		                    cleanup.add(disp);
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		            compiled = null;
		            doCleanup();
		        }));
		    };
		    ComponentBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    ComponentBinding.prototype.applyTemplate = function (component, el, ctx, state, template, vm) {
		        if (template) {
		            // clear
		            while (el.firstChild) {
		                this.domManager.cleanNode(el.firstChild);
		                el.removeChild(el.firstChild);
		            }
		            // clone template and inject
		            for (var i = 0; i < template.length; i++) {
		                var node = template[i].cloneNode(true);
		                el.appendChild(node);
		            }
		        }
		        if (vm) {
		            state.model = vm;
		            // refresh context
		            ctx = this.domManager.getDataContext(el);
		        }
		        // invoke preBindingInit
		        if (vm && component.preBindingInit && vm.hasOwnProperty(component.preBindingInit)) {
		            vm[component.preBindingInit].call(vm, el);
		        }
		        // done
		        this.domManager.applyBindingsToDescendants(ctx, el);
		        // invoke postBindingInit
		        if (vm && component.postBindingInit && vm.hasOwnProperty(component.postBindingInit)) {
		            vm[component.postBindingInit].call(vm, el);
		        }
		    };
		    return ComponentBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = ComponentBinding;
		//# sourceMappingURL=Component.js.map

	/***/ },
	/* 43 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		"use strict";
		var StateActiveBinding = (function () {
		    function StateActiveBinding(domManager, router, app) {
		        this.priority = 5;
		        this.domManager = domManager;
		        this.router = router;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    StateActiveBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("stateActive-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var compiled = this.domManager.compileBindingOptions(options, module);
		        var exp;
		        var observables = [];
		        var opt = compiled;
		        var paramsKeys = [];
		        var stateName;
		        var stateParams;
		        var cssClass = "active";
		        observables.push(this.router.current.changed.startWith(this.router.current()));
		        if (typeof compiled === "function") {
		            exp = compiled;
		            observables.push(this.domManager.expressionToObservable(exp, ctx));
		        }
		        else {
		            // collect state-name observable
		            observables.push(this.domManager.expressionToObservable(opt.name, ctx));
		            // collect params observables
		            if (opt.params) {
		                Object.keys(opt.params).forEach(function (x) {
		                    paramsKeys.push(x);
		                    observables.push(_this.domManager.expressionToObservable(opt.params[x], ctx));
		                });
		            }
		            if (opt.cssClass) {
		                cssClass = this.domManager.evaluateExpression(opt.cssClass, ctx);
		            }
		        }
		        // subscribe to any input changes
		        state.cleanup.add(Rx.Observable.combineLatest(observables, function (_) { return Utils_1.args2Array(arguments); }).subscribe(function (latest) {
		            try {
		                // first element is the current state
		                var currentState = latest.shift();
		                // second element is the state-name
		                stateName = Utils_1.unwrapProperty(latest.shift());
		                // subsequent entries are latest param values
		                stateParams = {};
		                for (var i = 0; i < paramsKeys.length; i++) {
		                    stateParams[paramsKeys[i]] = Utils_1.unwrapProperty(latest[i]);
		                }
		                var active = _this.router.includes(stateName, stateParams);
		                var classes = cssClass.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
		                if (classes.length) {
		                    Utils_1.toggleCssClass.apply(null, [el, active].concat(classes));
		                }
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify locals
		            observables = null;
		            compiled = null;
		            stateName = null;
		            stateParams = null;
		            opt = null;
		            paramsKeys = null;
		        }));
		    };
		    StateActiveBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    return StateActiveBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = StateActiveBinding;
		//# sourceMappingURL=StateActive.js.map

	/***/ },
	/* 44 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		"use strict";
		var ViewBinding = (function () {
		    function ViewBinding(domManager, router, app) {
		        this.priority = 1000;
		        this.controlsDescendants = true;
		        this.domManager = domManager;
		        this.router = router;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    ViewBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("view-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var compiled = this.domManager.compileBindingOptions(options, module);
		        var viewName = this.domManager.evaluateExpression(compiled, ctx);
		        var currentConfig;
		        var cleanup;
		        function doCleanup() {
		            if (cleanup) {
		                cleanup.dispose();
		                cleanup = null;
		            }
		        }
		        if (viewName == null || typeof viewName !== "string")
		            Utils_1.throwError("views must be named!");
		        // subscribe to router-state changes
		        state.cleanup.add(this.router.current.changed.startWith(this.router.current()).subscribe(function (newState) {
		            try {
		                doCleanup();
		                cleanup = new Rx.CompositeDisposable();
		                var config = _this.router.getViewComponent(viewName);
		                if (config != null) {
		                    if (!Utils_1.isEqual(currentConfig, config)) {
		                        cleanup.add(_this.applyTemplate(viewName, config.component, currentConfig ? currentConfig.component : undefined, config.params, config.animations, el, ctx, module));
		                        currentConfig = config;
		                    }
		                }
		                else {
		                    cleanup.add(_this.applyTemplate(viewName, null, currentConfig ? currentConfig.component : undefined, null, currentConfig ? currentConfig.animations : {}, el, ctx, module));
		                    currentConfig = {};
		                }
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify common locals
		        }));
		    };
		    ViewBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    ViewBinding.prototype.applyTemplate = function (viewName, componentName, previousComponentName, componentParams, animations, el, ctx, module) {
		        var _this = this;
		        var self = this;
		        var oldElements = Utils_1.nodeChildrenToArray(el);
		        var combined = [];
		        var obs;
		        function removeOldElements() {
		            oldElements.forEach(function (x) {
		                self.domManager.cleanNode(x);
		                el.removeChild(x);
		            });
		        }
		        function instantiateComponent(animation) {
		            // extend the data-context
		            ctx.$componentParams = componentParams;
		            // create component container element
		            var container = document.createElement("div");
		            var binding = Utils_1.formatString("component: { name: '{0}', params: $componentParams }", componentName);
		            container.setAttribute("data-bind", binding);
		            // prepare container for animation
		            if (animation != null)
		                animation.prepare(container);
		            // now insert it
		            el.appendChild(container);
		            // and apply bindings
		            self.domManager.applyBindings(ctx, container);
		        }
		        // construct leave-observable
		        if (oldElements.length > 0) {
		            var leaveAnimation;
		            if (animations && animations.leave) {
		                if (typeof animations.leave === "string") {
		                    leaveAnimation = module.animation(animations.leave);
		                }
		                else {
		                    leaveAnimation = animations.leave;
		                }
		            }
		            if (leaveAnimation) {
		                leaveAnimation.prepare(oldElements);
		                obs = leaveAnimation.run(oldElements)
		                    .continueWith(function () { return leaveAnimation.complete(oldElements); })
		                    .continueWith(removeOldElements);
		            }
		            else {
		                obs = Rx.Observable.startDeferred(removeOldElements);
		            }
		            combined.push(obs);
		        }
		        // construct enter-observable
		        if (componentName != null) {
		            var enterAnimation;
		            if (animations && animations.enter) {
		                if (typeof animations.enter === "string") {
		                    enterAnimation = module.animation(animations.enter);
		                }
		                else {
		                    enterAnimation = animations.enter;
		                }
		            }
		            obs = Rx.Observable.startDeferred(function () { return instantiateComponent(enterAnimation); });
		            if (enterAnimation) {
		                obs = obs.continueWith(enterAnimation.run(el.childNodes))
		                    .continueWith(function () { return enterAnimation.complete(el.childNodes); });
		            }
		            // notify world
		            obs = obs.continueWith(function () {
		                var transition = {
		                    view: viewName,
		                    fromComponent: previousComponentName,
		                    toComponent: componentName
		                };
		                var ri = _this.router;
		                ri.viewTransitionsSubject.onNext(transition);
		            });
		            combined.push(obs);
		        }
		        // optimize return
		        if (combined.length > 1)
		            obs = Rx.Observable.combineLatest(combined, Utils_1.noop).take(1);
		        else if (combined.length === 1)
		            obs = combined[0].take(1);
		        else
		            obs = null;
		        // no-op return
		        return obs ? (obs.subscribe() || Rx.Disposable.empty) : Rx.Disposable.empty;
		    };
		    return ViewBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = ViewBinding;
		//# sourceMappingURL=View.js.map

	/***/ },
	/* 45 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		"use strict";
		var StateRefBinding = (function () {
		    function StateRefBinding(domManager, router, app) {
		        this.priority = 5;
		        this.domManager = domManager;
		        this.router = router;
		        this.app = app;
		    }
		    ////////////////////
		    // wx.IBinding
		    StateRefBinding.prototype.applyBinding = function (node, options, ctx, state, module) {
		        var _this = this;
		        if (node.nodeType !== 1)
		            Utils_1.throwError("stateRef-binding only operates on elements!");
		        if (options == null)
		            Utils_1.throwError("invalid binding-options!");
		        var el = node;
		        var isAnchor = el.tagName.toLowerCase() === "a";
		        var anchor = isAnchor ? el : undefined;
		        var compiled = this.domManager.compileBindingOptions(options, module);
		        var exp;
		        var observables = [];
		        var opt = compiled;
		        var paramsKeys = [];
		        var stateName;
		        var stateParams;
		        if (typeof compiled === "function") {
		            exp = compiled;
		            observables.push(this.domManager.expressionToObservable(exp, ctx));
		        }
		        else {
		            // collect state-name observable
		            observables.push(this.domManager.expressionToObservable(opt.name, ctx));
		            // collect params observables
		            if (opt.params) {
		                Object.keys(opt.params).forEach(function (x) {
		                    paramsKeys.push(x);
		                    observables.push(_this.domManager.expressionToObservable(opt.params[x], ctx));
		                });
		            }
		        }
		        // subscribe to any input changes
		        state.cleanup.add(Rx.Observable.combineLatest(observables, function (_) { return Utils_1.args2Array(arguments); }).subscribe(function (latest) {
		            try {
		                // first element is always the state-name
		                stateName = Utils_1.unwrapProperty(latest.shift());
		                // subsequent entries are latest param values
		                stateParams = {};
		                for (var i = 0; i < paramsKeys.length; i++) {
		                    stateParams[paramsKeys[i]] = Utils_1.unwrapProperty(latest[i]);
		                }
		                if (anchor != null) {
		                    anchor.href = _this.router.url(stateName, stateParams);
		                }
		            }
		            catch (e) {
		                _this.app.defaultExceptionHandler.onNext(e);
		            }
		        }));
		        // subscribe to anchor's click event
		        state.cleanup.add(Rx.Observable.fromEvent(el, "click").subscribe(function (e) {
		            e.preventDefault();
		            // initiate state change using latest name and params
		            _this.router.go(stateName, stateParams, { location: true });
		        }));
		        // release closure references to GC
		        state.cleanup.add(Rx.Disposable.create(function () {
		            // nullify args
		            node = null;
		            options = null;
		            ctx = null;
		            state = null;
		            // nullify locals
		            observables = null;
		            compiled = null;
		            stateName = null;
		            stateParams = null;
		            opt = null;
		            paramsKeys = null;
		        }));
		    };
		    StateRefBinding.prototype.configure = function (options) {
		        // intentionally left blank
		    };
		    return StateRefBinding;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = StateRefBinding;
		//# sourceMappingURL=StateRef.js.map

	/***/ },
	/* 46 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		"use strict";
		var templateCache = {};
		var SelectComponent = (function () {
		    function SelectComponent(htmlTemplateEngine) {
		        var _this = this;
		        this.template = function (params) {
		            //console.log(JSON.stringify(params));
		            return _this.buildTemplate(params);
		        };
		        this.viewModel = function (params) {
		            var opt = params;
		            return {
		                items: params.items,
		                selectedValue: params.selectedValue,
		                hooks: { afterRender: opt.afterRender }
		            };
		        };
		        this.htmlTemplateEngine = htmlTemplateEngine;
		    }
		    SelectComponent.prototype.buildTemplate = function (params) {
		        var result;
		        var key = undefined;
		        var nodes;
		        // check cache
		        if (!params.noCache) {
		            key = (params.name != null ? params.name : "") + "-" +
		                (params.itemText != null ? params.itemText : "") + "-" +
		                (params.itemValue != null ? params.itemValue : "") + "-" +
		                (params.itemClass != null ? params.itemClass : "") + "-" +
		                (params.cssClass != null ? params.cssClass : "") + "-" +
		                (params.selectedValue != null ? "true" : "false") + "-" +
		                (params.multiple ? "true" : "false") + "-" +
		                (params.required ? "true" : "false") + "-" +
		                (params.autofocus ? "true" : "false") + "-" +
		                (params.size ? params.size.toString() : "0");
		            nodes = templateCache[key];
		            if (nodes != null) {
		                //console.log("cache hit", key, result);
		                return nodes;
		            }
		        }
		        // base-template
		        result = '<select class="wx-select{2}" data-bind="{0}"><option data-bind="{1}"></option></select>';
		        var bindings = [];
		        var attrs = [];
		        var itemBindings = [];
		        var itemAttrs = [];
		        bindings.push({ key: "foreach", value: "{ data: items, hooks: hooks }" });
		        // cssClass
		        if (params.cssClass !== undefined)
		            params.cssClass = ' ' + params.cssClass;
		        else
		            params.cssClass = '';
		        // selection (two-way)
		        if (params.selectedValue)
		            bindings.push({ key: "selectedValue", value: "@selectedValue" });
		        // name
		        if (params.name) {
		            attrs.push({ key: 'name', value: params.name });
		        }
		        // multi-select
		        if (params.multiple) {
		            attrs.push({ key: 'multiple', value: "true" });
		        }
		        // size
		        if (params.size !== undefined) {
		            attrs.push({ key: 'size', value: params.size.toString() });
		        }
		        // required
		        if (params.required) {
		            attrs.push({ key: 'required', value: "true" });
		        }
		        // required
		        if (params.autofocus) {
		            attrs.push({ key: 'autofocus', value: "true" });
		        }
		        // assemble attr-binding
		        if (attrs.length)
		            bindings.push({ key: "attr", value: "{ " + attrs.map(function (x) { return x.key + ": " + x.value; }).join(", ") + " }" });
		        // value
		        itemBindings.push({ key: "value", value: params.itemValue || "$data" });
		        // label
		        itemBindings.push({ key: 'text', value: params.itemText || "$data" });
		        // per-item css class
		        if (params.itemClass) {
		            itemAttrs.push({ key: 'class', value: "'" + params.itemClass + "'" });
		        }
		        // assemble attr-binding
		        if (itemAttrs.length)
		            itemBindings.push({ key: "attr", value: "{ " + itemAttrs.map(function (x) { return x.key + ": " + x.value; }).join(", ") + " }" });
		        // assemble all bindings
		        var bindingString = bindings.map(function (x) { return x.key + ": " + x.value; }).join(", ");
		        var itemBindingString = itemBindings.map(function (x) { return x.key + ": " + x.value; }).join(", ");
		        // assemble template
		        result = Utils_1.formatString(result, bindingString, itemBindingString, params.cssClass);
		        //console.log(result);
		        // store
		        if (!params.noCache) {
		            templateCache[key] = result;
		        }
		        // app.templateEngine can be altered by developer therefore we make sure to parse using HtmlTemplateEngine
		        nodes = this.htmlTemplateEngine.parse(result);
		        return nodes;
		    };
		    return SelectComponent;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = SelectComponent;
		//# sourceMappingURL=Select.js.map

	/***/ },
	/* 47 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		"use strict";
		var groupId = 0;
		var templateCache = {};
		var RadioGroupComponent = (function () {
		    function RadioGroupComponent(htmlTemplateEngine) {
		        var _this = this;
		        this.template = function (params) {
		            return _this.buildTemplate(params);
		        };
		        this.viewModel = function (params) {
		            var opt = params;
		            var groupName = opt.groupName != null ?
		                opt.groupName :
		                Utils_1.formatString("wx-radiogroup-{0}", groupId++);
		            return {
		                items: params.items,
		                selectedValue: params.selectedValue,
		                groupName: groupName,
		                hooks: { afterRender: params.afterRender }
		            };
		        };
		        this.htmlTemplateEngine = htmlTemplateEngine;
		    }
		    RadioGroupComponent.prototype.buildTemplate = function (params) {
		        var result;
		        var key = undefined;
		        var nodes;
		        // check cache
		        if (!params.noCache) {
		            key = (params.itemText != null ? params.itemText : "") + "-" +
		                (params.itemValue != null ? params.itemValue : "") + "-" +
		                (params.itemClass != null ? params.itemClass : "") + "-" +
		                (params.selectedValue != null ? "true" : "false");
		            nodes = templateCache[key];
		            if (nodes != null) {
		                //console.log("cache hit", key, result);
		                return nodes;
		            }
		        }
		        // base-template
		        result = '<div class="wx-radiogroup" data-bind="{0}"><input type="radio" data-bind="{1}"/>{2}</div>';
		        var bindings = [];
		        var attrs = [];
		        var itemBindings = [];
		        var itemAttrs = [];
		        var perItemExtraMarkup = "";
		        bindings.push({ key: "foreach", value: "{ data: items, hooks: hooks }" });
		        // assemble attr-binding
		        if (attrs.length)
		            bindings.push({ key: "attr", value: "{ " + attrs.map(function (x) { return x.key + ": " + x.value; }).join(", ") + " }" });
		        // value
		        itemBindings.push({ key: "value", value: params.itemValue || "$data" });
		        // name
		        itemAttrs.push({ key: 'name', value: "$parent.groupName" });
		        // selection (two-way)
		        if (params.selectedValue) {
		            itemBindings.push({ key: "selectedValue", value: "$parent.@selectedValue" });
		        }
		        // label
		        if (params.itemText) {
		            perItemExtraMarkup += Utils_1.formatString('<label data-bind="text: {0}, attr: { for: {1} }"></label>', params.itemText, "$parent.groupName + '-' + $index");
		            itemAttrs.push({ key: 'id', value: "$parent.groupName + '-' + $index" });
		        }
		        // per-item css class
		        if (params.itemClass) {
		            itemAttrs.push({ key: 'class', value: "'" + params.itemClass + "'" });
		        }
		        // assemble attr-binding
		        if (itemAttrs.length)
		            itemBindings.push({ key: "attr", value: "{ " + itemAttrs.map(function (x) { return x.key + ": " + x.value; }).join(", ") + " }" });
		        // assemble all bindings
		        var bindingString = bindings.map(function (x) { return x.key + ": " + x.value; }).join(", ");
		        var itemBindingString = itemBindings.map(function (x) { return x.key + ": " + x.value; }).join(", ");
		        // assemble template
		        result = Utils_1.formatString(result, bindingString, itemBindingString, perItemExtraMarkup);
		        // store
		        if (!params.noCache) {
		            templateCache[key] = result;
		        }
		        // app.templateEngine can be altered by developer therefore we make sure to parse using HtmlTemplateEngine
		        nodes = this.htmlTemplateEngine.parse(result);
		        return nodes;
		    };
		    return RadioGroupComponent;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = RadioGroupComponent;
		//# sourceMappingURL=RadioGroup.js.map

	/***/ },
	/* 48 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		var Property_1 = __webpack_require__(8);
		var RouteMatcher_1 = __webpack_require__(49);
		"use strict";
		var Router = (function () {
		    function Router(domManager, app) {
		        var _this = this;
		        this.current = Property_1.property();
		        //////////////////////////////////
		        // Implementation
		        this.states = {};
		        this.pathSeparator = ".";
		        this.parentPathDirective = "^";
		        this.rootStateName = "$";
		        this.validPathRegExp = /^[a-zA-Z]([\w-_]*$)/;
		        this.viewTransitionsSubject = new Rx.Subject();
		        this.domManager = domManager;
		        this.app = app;
		        this.viewTransitions = this.viewTransitionsSubject.asObservable();
		        this.reset(false);
		        // monitor navigation history
		        app.history.onPopState.subscribe(function (e) {
		            try {
		                // certain versions of WebKit raise an empty popstate event on page-load
		                if (e && e.state) {
		                    var state = e.state;
		                    var stateName = state.stateName;
		                    if (stateName != null) {
		                        // enter state using extracted params
		                        _this.go(stateName, state.params, { location: false });
		                        // update title
		                        app.title(state.title);
		                    }
		                }
		            }
		            catch (e) {
		                app.defaultExceptionHandler.onNext(e);
		            }
		        });
		        // monitor title changes
		        app.title.changed.subscribe(function (x) {
		            document.title = x;
		            if (_this.current() != null)
		                _this.replaceHistoryState(_this.current(), x);
		        });
		    }
		    //////////////////////////////////
		    // IRouter
		    Router.prototype.state = function (config) {
		        this.registerStateInternal(config);
		        return this;
		    };
		    Router.prototype.updateCurrentStateParams = function (withParamsAction) {
		        var _current = this.current();
		        withParamsAction(_current.params);
		        this.replaceHistoryState(_current, this.app.title());
		    };
		    Router.prototype.go = function (to, params, options) {
		        to = this.mapPath(to);
		        if (this.states[to] == null)
		            Utils_1.throwError("state '{0}' is not registered", to);
		        this.activateState(to, params, options);
		    };
		    Router.prototype.get = function (state) {
		        return this.states[state];
		    };
		    Router.prototype.is = function (state, params, options) {
		        var _current = this.current();
		        var isActive = _current.name === state;
		        params = params || {};
		        if (isActive) {
		            var currentParamsKeys = Object.keys(_current.params);
		            var paramsKeys = Object.keys(params);
		            if (currentParamsKeys.length === paramsKeys.length) {
		                for (var i = 0; i < paramsKeys.length; i++) {
		                    if (_current.params[paramsKeys[i]] != params[paramsKeys[i]]) {
		                        isActive = false;
		                        break;
		                    }
		                }
		            }
		            else {
		                isActive = false;
		            }
		        }
		        return isActive;
		    };
		    Router.prototype.includes = function (state, params, options) {
		        var _current = this.current();
		        var isActive = _current.name.indexOf(state) === 0;
		        params = params || {};
		        if (isActive) {
		            var currentParamsKeys = Object.keys(_current.params);
		            var paramsKeys = Object.keys(params);
		            paramsKeys = paramsKeys.length <= currentParamsKeys.length ?
		                paramsKeys : currentParamsKeys;
		            for (var i = 0; i < paramsKeys.length; i++) {
		                if (_current.params[paramsKeys[i]] != params[paramsKeys[i]]) {
		                    isActive = false;
		                    break;
		                }
		            }
		        }
		        return isActive;
		    };
		    Router.prototype.url = function (state, params) {
		        state = this.mapPath(state);
		        var route = this.getAbsoluteRouteForState(state);
		        if (route != null)
		            return route.stringify(params);
		        return null;
		    };
		    Router.prototype.reset = function (enterRootState) {
		        if (enterRootState === void 0) { enterRootState = true; }
		        this.states = {};
		        // Implicit root state that is always present
		        this.root = this.registerStateInternal({
		            name: this.rootStateName,
		            url: RouteMatcher_1.route("/")
		        });
		        if (enterRootState)
		            this.go(this.rootStateName, {}, { location: 2 /* replace */ });
		    };
		    Router.prototype.sync = function (url) {
		        if (url == null)
		            url = this.app.history.location.pathname; // + app.history.location.search;
		        // iterate over registered states to find matching uri
		        var keys = Object.keys(this.states);
		        var length = keys.length;
		        var params;
		        for (var i = 0; i < length; i++) {
		            var state = this.states[keys[i]];
		            var route_1 = this.getAbsoluteRouteForState(state.name);
		            if ((params = route_1.parse(url)) != null) {
		                this.go(state.name, params, { location: 2 /* replace */ });
		                return;
		            }
		        }
		        // not found, enter root state as fallback
		        if (this.current() == null)
		            this.reload();
		    };
		    Router.prototype.reload = function () {
		        var state;
		        var params;
		        // reload current state or enter inital root state
		        if (this.current() != null) {
		            state = this.current().name;
		            params = this.current().params;
		        }
		        else {
		            state = this.rootStateName;
		            params = {};
		        }
		        this.go(state, params, { force: true, location: 2 /* replace */ });
		    };
		    Router.prototype.getViewComponent = function (viewName) {
		        var _current = this.current();
		        var result = undefined;
		        if (_current.views != null) {
		            var component = _current.views[viewName];
		            var stateParams = {};
		            if (component != null) {
		                result = {};
		                if (typeof component === "object") {
		                    result.component = component.component;
		                    result.params = component.params || {};
		                    result.animations = component.animations;
		                }
		                else {
		                    result.component = component;
		                    result.params = {};
		                    result.animations = undefined;
		                }
		                // ensure that only parameters configured at state level surface at view-level
		                var parameterNames = this.getViewParameterNamesFromStateConfig(viewName, result.component);
		                parameterNames.forEach(function (x) {
		                    if (_current.params.hasOwnProperty(x)) {
		                        stateParams[x] = _current.params[x];
		                    }
		                });
		                // merge state params into component params
		                result.params = Utils_1.extend(stateParams, result.params);
		            }
		        }
		        return result;
		    };
		    Router.prototype.registerStateInternal = function (state) {
		        var _this = this;
		        var parts = state.name.split(this.pathSeparator);
		        if (state.name !== this.rootStateName) {
		            // validate name
		            if (parts.forEach(function (path) {
		                if (!_this.validPathRegExp.test(path)) {
		                    Utils_1.throwError("invalid state-path '{0}' (a state-path must start with a character, optionally followed by one or more alphanumeric characters, dashes or underscores)");
		                }
		            }))
		                ;
		        }
		        // wrap and store
		        state = Utils_1.extend(state, {});
		        this.states[state.name] = state;
		        if (state.url != null) {
		            // create route from string
		            if (typeof state.url === "string") {
		                state.url = RouteMatcher_1.route(state.url);
		            }
		        }
		        else {
		            // derive relative route from name
		            if (state.name !== this.rootStateName)
		                state.url = RouteMatcher_1.route(parts[parts.length - 1]);
		            else
		                state.url = RouteMatcher_1.route("/");
		        }
		        // detect root-state override
		        if (state.name === this.rootStateName)
		            this.root = state;
		        return state;
		    };
		    Router.prototype.pushHistoryState = function (state, title) {
		        var hs = {
		            stateName: state.name,
		            params: state.params,
		            title: title != null ? title : document.title
		        };
		        this.app.history.pushState(hs, "", state.url);
		    };
		    Router.prototype.replaceHistoryState = function (state, title) {
		        var hs = {
		            stateName: state.name,
		            params: state.params,
		            title: title != null ? title : document.title
		        };
		        this.app.history.replaceState(hs, "", state.url);
		    };
		    Router.prototype.mapPath = function (path) {
		        // child-relative
		        if (path.indexOf(this.pathSeparator) === 0) {
		            return this.current().name + path;
		        }
		        else if (path.indexOf(this.parentPathDirective) === 0) {
		            // parent-relative
		            var parent_1 = this.current().name;
		            // can't go further up than root
		            if (parent_1 === this.rootStateName)
		                return parent_1;
		            // test parents and siblings until one is found that is registered
		            var parts = parent_1.split(this.pathSeparator);
		            for (var i = parts.length - 1; i > 0; i--) {
		                var tmp = parts.slice(0, i).join(this.pathSeparator);
		                // check if parent or sibling relative to current parent exists
		                if (this.get(tmp) || this.get(tmp + path.substr(1))) {
		                    path = tmp + path.substr(1);
		                    return path;
		                }
		            }
		            // make it root relative
		            path = this.rootStateName + path.substr(1);
		            return path;
		        }
		        return path;
		    };
		    Router.prototype.getStateHierarchy = function (name) {
		        var parts = name.split(this.pathSeparator);
		        var stateName = "";
		        var result = [];
		        var state;
		        if (name !== this.rootStateName)
		            result.push(this.root);
		        for (var i = 0; i < parts.length; i++) {
		            if (i > 0)
		                stateName += this.pathSeparator + parts[i];
		            else
		                stateName = parts[i];
		            state = this.states[stateName];
		            // if not registered, introduce fake state to keep hierarchy intact
		            if (state == null) {
		                state = {
		                    name: stateName,
		                    url: RouteMatcher_1.route(stateName)
		                };
		            }
		            result.push(state);
		        }
		        return result;
		    };
		    Router.prototype.getAbsoluteRouteForState = function (name, hierarchy) {
		        hierarchy = hierarchy != null ? hierarchy : this.getStateHierarchy(name);
		        var result = null;
		        hierarchy.forEach(function (state) {
		            // concat urls
		            if (result != null) {
		                var route_2 = state.url;
		                // individual states may use absolute urls as well
		                if (!route_2.isAbsolute)
		                    result = result.concat(state.url);
		                else
		                    result = route_2;
		            }
		            else {
		                result = state.url;
		            }
		        });
		        return result;
		    };
		    Router.prototype.activateState = function (to, params, options) {
		        var hierarchy = this.getStateHierarchy(to);
		        var stateViews = {};
		        var stateParams = {};
		        hierarchy.forEach(function (state) {
		            // merge views
		            if (state.views != null) {
		                Utils_1.extend(state.views, stateViews);
		            }
		            // merge params
		            if (state.params != null) {
		                Utils_1.extend(state.params, stateParams);
		            }
		        });
		        // merge param overrides
		        if (params) {
		            Utils_1.extend(params, stateParams);
		        }
		        // construct resulting state
		        var route = this.getAbsoluteRouteForState(to, hierarchy);
		        var state = Utils_1.extend(this.states[to], {});
		        state.url = route.stringify(params);
		        state.views = stateViews;
		        state.params = stateParams;
		        // perform deep equal against current state
		        var _current = this.current();
		        if ((options && options.force) || _current == null ||
		            _current.name !== to ||
		            !Utils_1.isEqual(_current.params, state.params)) {
		            // reset views used by previous state that are unused by new state
		            if (_current != null && _current.views != null && state.views != null) {
		                Object.keys(_current.views).forEach(function (x) {
		                    if (!state.views.hasOwnProperty(x)) {
		                        state.views[x] = null;
		                    }
		                });
		            }
		            // update history
		            if (options && options.location) {
		                if (options.location === 2 /* replace */)
		                    this.replaceHistoryState(state, this.app.title());
		                else
		                    this.pushHistoryState(state, this.app.title());
		            }
		            if (_current != null) {
		                if (_current.onLeave)
		                    _current.onLeave(this.get(_current.name), _current.params);
		            }
		            // activate
		            this.current(state);
		            if (state.onEnter)
		                state.onEnter(this.get(state.name), params);
		        }
		    };
		    Router.prototype.getViewParameterNamesFromStateConfig = function (view, component) {
		        var hierarchy = this.getStateHierarchy(this.current().name);
		        var stateParams = {};
		        var result = [];
		        var config;
		        var index = -1;
		        // walk the hierarchy backward to figure out when the component was introduced at the specified view-slot
		        for (var i = hierarchy.length; i--; i >= 0) {
		            config = hierarchy[i];
		            if (config.views && config.views[view]) {
		                var other = config.views[view];
		                if (typeof other === "object") {
		                    other = other.component;
		                }
		                if (other === component) {
		                    index = i; // found but keep looking
		                }
		            }
		        }
		        if (index !== -1) {
		            config = hierarchy[index];
		            // truncate hierarchy and merge params
		            hierarchy = hierarchy.slice(0, index + 1);
		            hierarchy.forEach(function (state) {
		                // merge params
		                if (state.params != null) {
		                    Utils_1.extend(state.params, stateParams);
		                }
		            });
		            // extract resulting property names
		            result = Object.keys(stateParams);
		            // append any route-params
		            result = result.concat(config.url.params);
		        }
		        return result;
		    };
		    return Router;
		})();
		exports.Router = Router;
		//# sourceMappingURL=Router.js.map

	/***/ },
	/* 49 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		/*
		 * JavaScript Route Matcher
		 * http://benalman.com/
		 *
		 * Copyright (c) 2011 "Cowboy" Ben Alman
		 * Dual licensed under the MIT and GPL licenses.
		 * http://benalman.com/about/license/
		 */
		"use strict";
		// Characters to be escaped with \. RegExp borrowed from the Backbone router
		// but escaped (note: unnecessarily) to keep JSHint from complaining.
		var reEscape = /[\-\[\]{}()+?.,\\\^$|#\s]/g;
		// Match named :param or *splat placeholders.
		var reParam = /([:*])(\w+)/g;
		var RouteMatcher = (function () {
		    // Pass in a route string (or RegExp) plus an optional map of rules, and get
		    // back an object with .parse and .stringify methods.
		    function RouteMatcher(route, rules) {
		        var _this = this;
		        // store
		        this.route = route;
		        this.rules = rules;
		        // Object to be returned. The public API.
		        // Matched param or splat names, in order
		        this.params = [];
		        // Route matching RegExp.
		        var re = route;
		        // Build route RegExp from passed string.
		        if (typeof route === "string") {
		            // Escape special chars.
		            re = re.replace(reEscape, "\\$&");
		            // Replace any :param or *splat with the appropriate capture group.
		            re = re.replace(reParam, function (_, mode, name) {
		                _this.params.push(name);
		                // :param should capture until the next / or EOL, while *splat should
		                // capture until the next :param, *splat, or EOL.
		                return mode === ":" ? "([^/]*)" : "(.*)";
		            });
		            // Add ^/$ anchors and create the actual RegExp.
		            re = new RegExp("^" + re + "$");
		            // Match the passed url against the route, returning an object of params
		            // and values.
		            this.parse = function (url) {
		                var i = 0;
		                var param, value;
		                var params = {};
		                var matches = url.match(re);
		                // If no matches, return null.
		                if (!matches) {
		                    return null;
		                }
		                // Add all matched :param / *splat values into the params object.
		                while (i < _this.params.length) {
		                    param = _this.params[i++];
		                    value = matches[i];
		                    // If a rule exists for this param and it doesn't validate, return null.
		                    if (rules && param in rules && !_this.validateRule(rules[param], value)) {
		                        return null;
		                    }
		                    params[param] = value;
		                }
		                return params;
		            };
		            // Build path by inserting the given params into the route.
		            this.stringify = function (params) {
		                params = params || {};
		                var param, re;
		                var result = route;
		                // Insert each passed param into the route string. Note that this loop
		                // doesn't check .hasOwnProperty because this script doesn't support
		                // modifications to Object.prototype.
		                for (param in params) {
		                    re = new RegExp("[:*]" + param + "\\b");
		                    result = result.replace(re, params[param]);
		                }
		                // Missing params should be replaced with empty string.
		                return result.replace(reParam, "");
		            };
		        }
		        else {
		            // RegExp route was passed. This is super-simple.
		            this.parse = function (url) {
		                var matches = url.match(re);
		                return matches && { captures: matches.slice(1) };
		            };
		            // There's no meaningful way to stringify based on a RegExp route, so
		            // return empty string.
		            this.stringify = function () { return ""; };
		        }
		    }
		    RouteMatcher.prototype.stripTrailingSlash = function (route) {
		        if (route.length === 0 || route === "/" || route.lastIndexOf("/") !== route.length - 1)
		            return route;
		        return route.substr(0, route.length - 1);
		    };
		    Object.defineProperty(RouteMatcher.prototype, "isAbsolute", {
		        get: function () {
		            return this.route.indexOf("/") === 0;
		        },
		        enumerable: true,
		        configurable: true
		    });
		    RouteMatcher.prototype.concat = function (route) {
		        var other = route;
		        var a = this.stripTrailingSlash(this.route);
		        var b = this.stripTrailingSlash(other.route);
		        var rules = null;
		        // check for conflicting rules
		        if (other.rules) {
		            if (this.rules) {
		                Object.keys(this.rules).forEach(function (rule) {
		                    if (other.rules.hasOwnProperty(rule)) {
		                        Utils_1.throwError("route '{0}' and '{1}' have conflicting rule '{2}", a, b, rule);
		                    }
		                });
		                rules = Utils_1.extend(this.rules, Utils_1.extend(other.rules, {}));
		            }
		            else {
		                rules = Utils_1.extend(other.rules, {});
		            }
		        }
		        else if (this.rules) {
		            rules = Utils_1.extend(this.rules, {});
		        }
		        if (a === "/")
		            a = "";
		        return new RouteMatcher(a + "/" + b, rules);
		    };
		    // Test to see if a value matches the corresponding rule.
		    RouteMatcher.prototype.validateRule = function (rule, value) {
		        // For a given rule, get the first letter of the string name of its
		        // constructor function. "R" -> RegExp, "F" -> Function (these shouldn't
		        // conflict with any other types one might specify). Note: instead of
		        // getting .toString from a new object {} or Object.prototype, I'm assuming
		        // that exports will always be an object, and using its .toString method.
		        // Bad idea? Let me know by filing an issue
		        var type = this.toString.call(rule).charAt(8);
		        // If regexp, match. If function, invoke. Otherwise, compare. Note that ==
		        // is used because type coercion is needed, as `value` will always be a
		        // string, but `rule` might not.
		        return type === "R" ? rule.test(value) : type === "F" ? rule(value) : rule == value;
		    };
		    return RouteMatcher;
		})();
		exports.RouteMatcher = RouteMatcher;
		function route(route, rules) {
		    return new RouteMatcher(route, rules);
		}
		exports.route = route;
		//# sourceMappingURL=RouteMatcher.js.map

	/***/ },
	/* 50 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var ScheduledSubject_1 = __webpack_require__(20);
		// ReactiveUI's MessageBus
		"use strict";
		var MessageBus = (function () {
		    function MessageBus() {
		        //////////////////////////////////
		        // Implementation
		        this.messageBus = {};
		        this.schedulerMappings = {};
		    }
		    //////////////////////////////////
		    // IMessageBus
		    MessageBus.prototype.listen = function (contract) {
		        return this.setupSubjectIfNecessary(contract).skip(1);
		    };
		    MessageBus.prototype.isRegistered = function (contract) {
		        return this.messageBus.hasOwnProperty(contract);
		    };
		    MessageBus.prototype.registerMessageSource = function (source, contract) {
		        return source.subscribe(this.setupSubjectIfNecessary(contract));
		    };
		    MessageBus.prototype.sendMessage = function (message, contract) {
		        this.setupSubjectIfNecessary(contract).onNext(message);
		    };
		    MessageBus.prototype.registerScheduler = function (scheduler, contract) {
		        this.schedulerMappings[contract] = scheduler;
		    };
		    MessageBus.prototype.setupSubjectIfNecessary = function (contract) {
		        var ret = this.messageBus[contract];
		        if (ret == null) {
		            ret = ScheduledSubject_1.createScheduledSubject(this.getScheduler(contract), null, new Rx.BehaviorSubject(undefined));
		            this.messageBus[contract] = ret;
		        }
		        return ret;
		    };
		    MessageBus.prototype.getScheduler = function (contract) {
		        var scheduler = this.schedulerMappings[contract];
		        return scheduler || Rx.Scheduler.currentThread;
		    };
		    return MessageBus;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = MessageBus;
		//# sourceMappingURL=MessageBus.js.map

	/***/ },
	/* 51 */
	/***/ function(module, exports) {

		"use strict";
		/**
		 * Simple http client inspired by https://github.com/radiosilence/xr
		 */
		var HttpClient = (function () {
		    function HttpClient() {
		        this.config = {};
		    }
		    HttpClient.prototype.res = function (xhr) {
		        return {
		            status: xhr.status,
		            response: xhr.response,
		            xhr: xhr
		        };
		    };
		    HttpClient.prototype.assign = function (l) {
		        var rs = [];
		        for (var _i = 1; _i < arguments.length; _i++) {
		            rs[_i - 1] = arguments[_i];
		        }
		        for (var i in rs) {
		            if (!{}.hasOwnProperty.call(rs, i))
		                continue;
		            var r = rs[i];
		            if (typeof r !== 'object')
		                continue;
		            for (var k in r) {
		                if (!{}.hasOwnProperty.call(r, k))
		                    continue;
		                l[k] = r[k];
		            }
		        }
		        return l;
		    };
		    HttpClient.prototype.promise = function (args, fn) {
		        return ((args && args.promise)
		            ? args.promise
		            : (this.config.promise || HttpClient.defaults.promise))(fn);
		    };
		    HttpClient.prototype.configure = function (opts) {
		        this.config = this.assign({}, this.config, opts);
		    };
		    HttpClient.prototype.request = function (options) {
		        var _this = this;
		        return this.promise(options, function (resolve, reject) {
		            var opts = _this.assign({}, HttpClient.defaults, _this.config, options);
		            var xhr = opts.xmlHttpRequest();
		            if (typeof opts.url !== "string" || opts.url.length === 0)
		                reject(new Error("HttpClient: Please provide a request url"));
		            if (!HttpClient.Methods.hasOwnProperty(opts.method.toUpperCase()))
		                reject(new Error("HttpClient: Unrecognized http-method: " + opts.method));
		            var requestUrl = opts.url;
		            if (opts.params) {
		                requestUrl += requestUrl.indexOf('?') !== -1 ? (requestUrl[requestUrl.length - 1] != '&' ? '&' : '') : '?';
		                // append request parameters
		                requestUrl += Object.getOwnPropertyNames(opts.params).map(function (x) { return (x + "=" + opts.params[x]); }).join('&');
		            }
		            xhr.open(opts.method.toUpperCase(), requestUrl, true);
		            xhr.addEventListener(HttpClient.Events.LOAD, function () {
		                if (xhr.status >= 200 && xhr.status < 300) {
		                    var data_1 = null;
		                    if (xhr.responseText) {
		                        data_1 = opts.raw === true
		                            ? xhr.responseText : opts.load(xhr.responseText);
		                    }
		                    resolve(data_1);
		                }
		                else {
		                    reject(_this.res(xhr));
		                }
		            });
		            xhr.addEventListener(HttpClient.Events.ABORT, function () { return reject(_this.res(xhr)); });
		            xhr.addEventListener(HttpClient.Events.ERROR, function () { return reject(_this.res(xhr)); });
		            xhr.addEventListener(HttpClient.Events.TIMEOUT, function () { return reject(_this.res(xhr)); });
		            for (var k in opts.headers) {
		                if (!{}.hasOwnProperty.call(opts.headers, k))
		                    continue;
		                xhr.setRequestHeader(k, opts.headers[k]);
		            }
		            for (var k in opts.events) {
		                if (!{}.hasOwnProperty.call(opts.events, k))
		                    continue;
		                xhr.addEventListener(k, opts.events[k].bind(null, xhr), false);
		            }
		            var data = (typeof opts.data === 'object' && !opts.raw)
		                ? opts.dump(opts.data)
		                : opts.data;
		            if (data !== undefined)
		                xhr.send(data);
		            else
		                xhr.send();
		        });
		    };
		    HttpClient.prototype.get = function (url, params, options) {
		        var opts = { url: url, method: HttpClient.Methods.GET, params: params };
		        return this.request(this.assign(opts, options));
		    };
		    HttpClient.prototype.put = function (url, data, options) {
		        var opts = { url: url, method: HttpClient.Methods.PUT, data: data };
		        return this.request(this.assign(opts, options));
		    };
		    HttpClient.prototype.post = function (url, data, options) {
		        var opts = { url: url, method: HttpClient.Methods.POST, data: data };
		        return this.request(this.assign(opts, options));
		    };
		    HttpClient.prototype.patch = function (url, data, options) {
		        var opts = { url: url, method: HttpClient.Methods.PATCH, data: data };
		        return this.request(this.assign(opts, options));
		    };
		    HttpClient.prototype.delete = function (url, options) {
		        var opts = { url: url, method: HttpClient.Methods.DELETE };
		        return this.request(this.assign(opts, options));
		    };
		    HttpClient.prototype.options = function (url, options) {
		        var opts = { url: url, method: HttpClient.Methods.OPTIONS };
		        return this.request(this.assign(opts, options));
		    };
		    HttpClient.Methods = {
		        GET: 'get',
		        POST: 'post',
		        PUT: 'put',
		        DELETE: 'delete',
		        PATCH: 'patch',
		        OPTIONS: 'options'
		    };
		    HttpClient.Events = {
		        READY_STATE_CHANGE: 'readystatechange',
		        LOAD_START: 'loadstart',
		        PROGRESS: 'progress',
		        ABORT: 'abort',
		        ERROR: 'error',
		        LOAD: 'load',
		        TIMEOUT: 'timeout',
		        LOAD_END: 'loadend'
		    };
		    HttpClient.defaults = {
		        method: HttpClient.Methods.GET,
		        data: undefined,
		        headers: {
		            'Accept': 'application/json',
		            'Content-Type': 'application/json'
		        },
		        dump: JSON.stringify,
		        load: JSON.parse,
		        xmlHttpRequest: function () { return new XMLHttpRequest(); },
		        promise: function (fn) { return new Promise(fn); }
		    };
		    return HttpClient;
		})();
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.default = HttpClient;
		/**
		* Provides editable configuration defaults for all newly created HttpClient instances.
		**/
		function getHttpClientDefaultConfig() {
		    return HttpClient.defaults;
		}
		exports.getHttpClientDefaultConfig = getHttpClientDefaultConfig;
		//# sourceMappingURL=HttpClient.js.map

	/***/ },
	/* 52 */
	/***/ function(module, exports) {

		exports.version = '1.4.4';
		//# sourceMappingURL=Version.js.map

	/***/ },
	/* 53 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="./Interfaces.ts" />
		var _this = this;
		var Utils_1 = __webpack_require__(3);
		var IID_1 = __webpack_require__(5);
		var ScheduledSubject_1 = __webpack_require__(20);
		var Injector_1 = __webpack_require__(2);
		var res = __webpack_require__(6);
		"use strict";
		var RxObsConstructor = Rx.Observable; // this hack is neccessary because the .d.ts for RxJs declares Observable as an interface)
		/**
		* Creates an read-only observable property with an optional default value from the current (this) observable
		* (Note: This is the equivalent to Knockout's ko.computed)
		* @param {T} initialValue? Optional initial value, valid until the observable produces a value
		*/
		function toProperty(initialValue, scheduler) {
		    scheduler = scheduler || Rx.Scheduler.currentThread;
		    // initialize accessor function (read-only)
		    var accessor = function propertyAccessor(newVal) {
		        if (arguments.length > 0) {
		            Utils_1.throwError("attempt to write to a read-only observable property");
		        }
		        return accessor.value;
		    };
		    //////////////////////////////////
		    // wx.IUnknown implementation
		    accessor.queryInterface = function (iid) {
		        return iid === IID_1.default.IObservableProperty || iid === IID_1.default.IDisposable;
		    };
		    //////////////////////////////////
		    // IDisposable implementation
		    accessor.dispose = function () {
		        if (accessor.sub) {
		            accessor.sub.dispose();
		            accessor.sub = null;
		        }
		    };
		    //////////////////////////////////
		    // IObservableProperty<T> implementation
		    accessor.value = initialValue;
		    // setup observables
		    accessor.changedSubject = new Rx.Subject();
		    accessor.changed = accessor.changedSubject.asObservable();
		    accessor.changingSubject = new Rx.Subject();
		    accessor.changing = accessor.changingSubject.asObservable();
		    accessor.source = this;
		    accessor.thrownExceptions = ScheduledSubject_1.createScheduledSubject(scheduler, Injector_1.injector.get(res.app).defaultExceptionHandler);
		    //////////////////////////////////
		    // implementation
		    var firedInitial = false;
		    accessor.sub = this
		        .distinctUntilChanged()
		        .subscribe(function (x) {
		        // Suppress a non-change between initialValue and the first value
		        // from a Subscribe
		        if (firedInitial && x === accessor.value) {
		            return;
		        }
		        firedInitial = true;
		        accessor.changingSubject.onNext(x);
		        accessor.value = x;
		        accessor.changedSubject.onNext(x);
		    }, function (x) { return accessor.thrownExceptions.onNext(x); });
		    return accessor;
		}
		RxObsConstructor.prototype.toProperty = toProperty;
		RxObsConstructor.prototype.continueWith = function () {
		    var args = Utils_1.args2Array(arguments);
		    var val = args.shift();
		    var obs = undefined;
		    if (Utils_1.isRxObservable(val)) {
		        obs = val;
		    }
		    else if (Utils_1.isFunction(val)) {
		        var action = val;
		        obs = Rx.Observable.startDeferred(action);
		    }
		    return this.selectMany(function (_) { return obs; });
		};
		RxObsConstructor.prototype.invokeCommand = function (command) {
		    // see the ReactiveUI project for the inspiration behind this function:
		    // https://github.com/reactiveui/ReactiveUI/blob/master/ReactiveUI/ReactiveCommand.cs#L511
		    return _this
		        .debounce(function (x) { return command.canExecuteObservable.startWith(command.canExecute(x)).where(function (b) { return b; }).select(function (x) { return 0; }); })
		        .select(function (x) { return command.executeAsync(x).catch(Rx.Observable.empty()); })
		        .switch()
		        .subscribe();
		};
		RxObsConstructor.startDeferred = function (action) {
		    return Rx.Observable.defer(function () {
		        return Rx.Observable.create(function (observer) {
		            var cancelled = false;
		            if (!cancelled)
		                action();
		            observer.onNext(undefined);
		            observer.onCompleted();
		            return Rx.Disposable.create(function () { return cancelled = true; });
		        });
		    });
		};
		function install() {
		    // deliberately left blank
		}
		exports.install = install;
		//# sourceMappingURL=RxExtensions.js.map

	/***/ },
	/* 54 */
	/***/ function(module, exports, __webpack_require__) {

		/// <reference path="../Interfaces.ts" />
		var Utils_1 = __webpack_require__(3);
		"use strict";
		function toElementList(element) {
		    var nodes;
		    if (element instanceof Node || element instanceof HTMLElement)
		        nodes = [element];
		    else if (Array.isArray(element))
		        nodes = element;
		    else if (element instanceof NodeList)
		        nodes = Utils_1.nodeListToArray(element);
		    else
		        Utils_1.throwError("invalid argument: element");
		    var elements = nodes.filter(function (x) { return x.nodeType === 1; });
		    return elements;
		}
		function parseTimingValue(x) {
		    // it's always safe to consider only second values and omit `ms` values since
		    // getComputedStyle will always handle the conversion for us
		    if (x.charAt(x.length - 1) === "s") {
		        x = x.substring(0, x.length - 1);
		    }
		    var value = parseFloat(x) || 0;
		    return value;
		}
		function getMaximumTransitionDuration(el) {
		    var str = getComputedStyle(el)["transitionDuration"];
		    var maxValue = 0;
		    var values = str.split(/\s*,\s*/);
		    values.forEach(function (x) {
		        var value = parseTimingValue(x);
		        maxValue = maxValue ? Math.max(value, maxValue) : value;
		    });
		    return maxValue * 1000;
		}
		function getMaximumTransitionDelay(el) {
		    var str = getComputedStyle(el)["transitionDelay"];
		    var maxValue = 0;
		    var values = str.split(/\s*,\s*/);
		    values.forEach(function (x) {
		        var value = Math.max(0, parseTimingValue(x));
		        maxValue = maxValue ? Math.max(value, maxValue) : value;
		    });
		    return maxValue * 1000;
		}
		function getKeyframeAnimationDuration(el) {
		    var durationStr = getComputedStyle(el)["animationDuration"] || getComputedStyle(el)["webkitAnimationDuration"] || "0s";
		    var delayStr = getComputedStyle(el)["animationDelay"] || getComputedStyle(el)["webkitAnimationDelay"] || "0s";
		    var duration = parseTimingValue(durationStr);
		    var delay = parseTimingValue(delayStr);
		    return (duration + delay) * 1000;
		}
		function scriptedAnimation(run, prepare, complete) {
		    var result = {};
		    if (prepare) {
		        result.prepare = function (nodes, params) {
		            var elements = toElementList(nodes);
		            elements.forEach(function (x) { return prepare(x, params); });
		        };
		    }
		    else {
		        result.prepare = Utils_1.noop;
		    }
		    result.run = function (nodes, params) {
		        return Rx.Observable.defer(function () {
		            var elements = toElementList(nodes);
		            if (elements.length === 0)
		                return Rx.Observable.return(undefined);
		            return Rx.Observable.combineLatest(elements.map(function (x) { return run(x, params); }), Utils_1.noop);
		        });
		    };
		    if (complete) {
		        result.complete = function (nodes, params) {
		            var elements = toElementList(nodes);
		            elements.forEach(function (x) { return complete(x, params); });
		        };
		    }
		    else {
		        result.complete = Utils_1.noop;
		    }
		    return result;
		}
		function cssTransitionAnimation(prepare, run, complete) {
		    var result = {};
		    var prepToAdd;
		    var prepToRemove;
		    var runToAdd;
		    var runToRemove;
		    var completeToAdd;
		    var completeToRemove;
		    if (prepare) {
		        var prepIns;
		        if (typeof prepare === "string") {
		            prepare = prepare.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
		        }
		        if (typeof prepare[0] === "string") {
		            // convert into wx.IAnimationCssClassInstruction
		            prepIns = prepare.map(function (x) { return { css: x, add: true }; });
		        }
		        else {
		            prepIns = prepare;
		        }
		        prepToAdd = prepIns.filter(function (x) { return x.add; }).map(function (x) { return x.css; });
		        prepToRemove = prepIns.filter(function (x) { return !x.add || x.remove; }).map(function (x) { return x.css; });
		        result.prepare = function (nodes, params) {
		            var elements = toElementList(nodes);
		            if (prepToAdd && prepToAdd.length)
		                elements.forEach(function (x) { return Utils_1.toggleCssClass.apply(null, [x, true].concat(prepToAdd)); });
		            if (prepToRemove && prepToRemove.length)
		                elements.forEach(function (x) { return Utils_1.toggleCssClass.apply(null, [x, false].concat(prepToRemove)); });
		        };
		    }
		    var runIns;
		    if (typeof run === "string") {
		        run = run.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
		    }
		    if (typeof run[0] === "string") {
		        // convert into wx.IAnimationCssClassInstruction
		        runIns = run.map(function (x) { return { css: x, add: true }; });
		    }
		    else {
		        runIns = run;
		    }
		    runToAdd = runIns.filter(function (x) { return x.add; }).map(function (x) { return x.css; });
		    runToRemove = runIns.filter(function (x) { return !x.add || x.remove; }).map(function (x) { return x.css; });
		    result.run = function (nodes, params) {
		        return Rx.Observable.defer(function () {
		            var elements = toElementList(nodes);
		            if (elements.length === 0)
		                return Rx.Observable.return(undefined);
		            var obs = Rx.Observable.combineLatest(elements.map(function (x) {
		                var duration = Math.max(getMaximumTransitionDuration(x) + getMaximumTransitionDelay(x), getKeyframeAnimationDuration(x));
		                return Rx.Observable.timer(duration);
		            }), Utils_1.noop);
		            // defer animation-start to avoid problems with transitions on freshly added elements
		            Rx.Observable.timer(1).subscribe(function () {
		                if (runToAdd && runToAdd.length)
		                    elements.forEach(function (x) { return Utils_1.toggleCssClass.apply(null, [x, true].concat(runToAdd)); });
		                if (runToRemove && runToRemove.length)
		                    elements.forEach(function (x) { return Utils_1.toggleCssClass.apply(null, [x, false].concat(runToRemove)); });
		            });
		            return obs;
		        });
		    };
		    var completeIns;
		    if (complete) {
		        if (typeof complete === "string") {
		            complete = complete.split(/\s+/).map(function (x) { return x.trim(); }).filter(function (x) { return x; });
		        }
		        if (typeof complete[0] === "string") {
		            // convert into wx.IAnimationCssClassInstruction
		            completeIns = complete.map(function (x) { return { css: x, add: true }; });
		        }
		        else {
		            completeIns = complete;
		        }
		        completeToAdd = completeIns.filter(function (x) { return x.add; }).map(function (x) { return x.css; });
		        completeToRemove = completeIns.filter(function (x) { return !x.add || x.remove; }).map(function (x) { return x.css; });
		    }
		    else {
		        // default to remove classes added during prepare & run stages
		        completeToRemove = [];
		        if (prepToAdd && prepToAdd.length)
		            completeToRemove = completeToRemove.concat(prepToAdd);
		        if (runToAdd && runToAdd.length)
		            completeToRemove = completeToRemove.concat(runToAdd);
		    }
		    result.complete = function (nodes, params) {
		        var elements = toElementList(nodes);
		        if (completeToAdd && completeToAdd.length)
		            elements.forEach(function (x) { return Utils_1.toggleCssClass.apply(null, [x, true].concat(completeToAdd)); });
		        if (completeToRemove && completeToRemove.length)
		            elements.forEach(function (x) { return Utils_1.toggleCssClass.apply(null, [x, false].concat(completeToRemove)); });
		    };
		    return result;
		}
		function animation() {
		    var args = Utils_1.args2Array(arguments);
		    var val = args.shift();
		    if (typeof val === "function") {
		        return scriptedAnimation(val, args.shift(), args.shift());
		    }
		    return cssTransitionAnimation(val, args.shift(), args.shift());
		}
		exports.animation = animation;
		//# sourceMappingURL=Animation.js.map

	/***/ }
	/******/ ])
	});
	;
	//# sourceMappingURL=web.rx.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(6);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js?sourceMap!./index.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js?sourceMap!./index.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "* {\n  outline: 0px; }\n", ""]);

	// exports


/***/ },
/* 7 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js?sourceMap!./photon.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js?sourceMap!./photon.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "@charset \"UTF-8\";\naudio,\ncanvas,\nprogress,\nvideo {\n  vertical-align: baseline; }\n\naudio:not([controls]) {\n  display: none; }\n\na:active,\na:hover {\n  outline: 0; }\n\nabbr[title] {\n  border-bottom: 1px dotted; }\n\nb,\nstrong {\n  font-weight: bold; }\n\ndfn {\n  font-style: italic; }\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\nsmall {\n  font-size: 80%; }\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\npre {\n  overflow: auto; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  font: inherit;\n  margin: 0; }\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  box-sizing: content-box; }\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\nlegend {\n  border: 0;\n  padding: 0; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n\n* {\n  cursor: default;\n  -webkit-user-drag: text;\n  -webkit-user-select: none;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box; }\n\nhtml {\n  height: 100%;\n  width: 100%;\n  overflow: hidden; }\n\nbody {\n  height: 100%;\n  padding: 0;\n  margin: 0;\n  font-family: system, -apple-system, \".SFNSDisplay-Regular\", \"Helvetica Neue\", Helvetica, \"Segoe UI\", sans-serif;\n  font-size: 13px;\n  line-height: 1.6;\n  color: #333;\n  background-color: transparent; }\n\nhr {\n  margin: 15px 0;\n  overflow: hidden;\n  background: transparent;\n  border: 0;\n  border-bottom: 1px solid #ddd; }\n\nh1, h2, h3, h4, h5, h6 {\n  margin-top: 20px;\n  margin-bottom: 10px;\n  font-weight: 500;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n\nh1 {\n  font-size: 36px; }\n\nh2 {\n  font-size: 30px; }\n\nh3 {\n  font-size: 24px; }\n\nh4 {\n  font-size: 18px; }\n\nh5 {\n  font-size: 14px; }\n\nh6 {\n  font-size: 12px; }\n\n.window {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex;\n  flex-direction: column;\n  background-color: #fff; }\n\n.window-content {\n  position: relative;\n  overflow-y: auto;\n  display: flex;\n  flex: 1; }\n\n.selectable-text {\n  cursor: text;\n  -webkit-user-select: text; }\n\n.text-center {\n  text-align: center; }\n\n.text-right {\n  text-align: right; }\n\n.text-left {\n  text-align: left; }\n\n.pull-left {\n  float: left; }\n\n.pull-right {\n  float: right; }\n\n.padded {\n  padding: 10px; }\n\n.padded-less {\n  padding: 5px; }\n\n.padded-more {\n  padding: 20px; }\n\n.padded-vertically {\n  padding-top: 10px;\n  padding-bottom: 10px; }\n\n.padded-vertically-less {\n  padding-top: 5px;\n  padding-bottom: 5px; }\n\n.padded-vertically-more {\n  padding-top: 20px;\n  padding-bottom: 20px; }\n\n.padded-horizontally {\n  padding-right: 10px;\n  padding-left: 10px; }\n\n.padded-horizontally-less {\n  padding-right: 5px;\n  padding-left: 5px; }\n\n.padded-horizontally-more {\n  padding-right: 20px;\n  padding-left: 20px; }\n\n.padded-top {\n  padding-top: 10px; }\n\n.padded-top-less {\n  padding-top: 5px; }\n\n.padded-top-more {\n  padding-top: 20px; }\n\n.padded-bottom {\n  padding-bottom: 10px; }\n\n.padded-bottom-less {\n  padding-bottom: 5px; }\n\n.padded-bottom-more {\n  padding-bottom: 20px; }\n\n.sidebar {\n  background-color: #f5f5f4; }\n\n.draggable {\n  -webkit-app-region: drag; }\n\n.not-draggable {\n  -webkit-app-region: no-drag; }\n\n.clearfix:before, .clearfix:after {\n  display: table;\n  content: \" \"; }\n\n.clearfix:after {\n  clear: both; }\n\n.btn {\n  display: inline-block;\n  padding: 3px 8px;\n  margin-bottom: 0;\n  font-size: 12px;\n  line-height: 1.4;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: middle;\n  cursor: default;\n  background-image: none;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06);\n  -webkit-app-region: no-drag; }\n  .btn:focus {\n    outline: none;\n    box-shadow: none; }\n\n.btn-mini {\n  padding: 2px 6px; }\n\n.btn-large {\n  padding: 6px 12px; }\n\n.btn-form {\n  padding-right: 20px;\n  padding-left: 20px; }\n\n.btn-default {\n  color: #333;\n  border-top-color: #c2c0c2;\n  border-right-color: #c2c0c2;\n  border-bottom-color: #a19fa1;\n  border-left-color: #c2c0c2;\n  background-color: #fcfcfc;\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fcfcfc), color-stop(100%, #f1f1f1));\n  background-image: -webkit-linear-gradient(top, #fcfcfc 0%, #f1f1f1 100%);\n  background-image: linear-gradient(to bottom, #fcfcfc 0%, #f1f1f1 100%); }\n  .btn-default:active {\n    background-color: #ddd;\n    background-image: none; }\n\n.btn-primary,\n.btn-positive,\n.btn-negative,\n.btn-warning {\n  color: #fff;\n  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); }\n\n.btn-primary {\n  border-color: #388df8;\n  border-bottom-color: #0866dc;\n  background-color: #6eb4f7;\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #6eb4f7), color-stop(100%, #1a82fb));\n  background-image: -webkit-linear-gradient(top, #6eb4f7 0%, #1a82fb 100%);\n  background-image: linear-gradient(to bottom, #6eb4f7 0%, #1a82fb 100%); }\n  .btn-primary:active {\n    background-color: #3e9bf4;\n    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #3e9bf4), color-stop(100%, #0469de));\n    background-image: -webkit-linear-gradient(top, #3e9bf4 0%, #0469de 100%);\n    background-image: linear-gradient(to bottom, #3e9bf4 0%, #0469de 100%); }\n\n.btn-positive {\n  border-color: #29a03b;\n  border-bottom-color: #248b34;\n  background-color: #5bd46d;\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #5bd46d), color-stop(100%, #29a03b));\n  background-image: -webkit-linear-gradient(top, #5bd46d 0%, #29a03b 100%);\n  background-image: linear-gradient(to bottom, #5bd46d 0%, #29a03b 100%); }\n  .btn-positive:active {\n    background-color: #34c84a;\n    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #34c84a), color-stop(100%, #248b34));\n    background-image: -webkit-linear-gradient(top, #34c84a 0%, #248b34 100%);\n    background-image: linear-gradient(to bottom, #34c84a 0%, #248b34 100%); }\n\n.btn-negative {\n  border-color: #fb2f29;\n  border-bottom-color: #fb1710;\n  background-color: #fd918d;\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fd918d), color-stop(100%, #fb2f29));\n  background-image: -webkit-linear-gradient(top, #fd918d 0%, #fb2f29 100%);\n  background-image: linear-gradient(to bottom, #fd918d 0%, #fb2f29 100%); }\n  .btn-negative:active {\n    background-color: #fc605b;\n    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fc605b), color-stop(100%, #fb1710));\n    background-image: -webkit-linear-gradient(top, #fc605b 0%, #fb1710 100%);\n    background-image: linear-gradient(to bottom, #fc605b 0%, #fb1710 100%); }\n\n.btn-warning {\n  border-color: #fcaa0e;\n  border-bottom-color: #ee9d02;\n  background-color: #fece72;\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fece72), color-stop(100%, #fcaa0e));\n  background-image: -webkit-linear-gradient(top, #fece72 0%, #fcaa0e 100%);\n  background-image: linear-gradient(to bottom, #fece72 0%, #fcaa0e 100%); }\n  .btn-warning:active {\n    background-color: #fdbc40;\n    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fdbc40), color-stop(100%, #ee9d02));\n    background-image: -webkit-linear-gradient(top, #fdbc40 0%, #ee9d02 100%);\n    background-image: linear-gradient(to bottom, #fdbc40 0%, #ee9d02 100%); }\n\n.btn .icon {\n  float: left;\n  width: 14px;\n  height: 14px;\n  margin-top: 1px;\n  margin-bottom: 1px;\n  color: #737475;\n  font-size: 14px;\n  line-height: 1; }\n\n.btn .icon-text {\n  margin-right: 5px; }\n\n.btn-dropdown:after {\n  font-family: \"photon-entypo\";\n  margin-left: 5px;\n  content: '\\E873'; }\n\n.btn-group {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n  -webkit-app-region: no-drag; }\n  .btn-group .btn {\n    position: relative;\n    float: left; }\n    .btn-group .btn:focus, .btn-group .btn:active {\n      z-index: 2; }\n    .btn-group .btn.active {\n      z-index: 3; }\n\n.btn-group .btn + .btn,\n.btn-group .btn + .btn-group,\n.btn-group .btn-group + .btn,\n.btn-group .btn-group + .btn-group {\n  margin-left: -1px; }\n\n.btn-group > .btn:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0; }\n\n.btn-group > .btn:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.btn-group > .btn:not(:first-child):not(:last-child) {\n  border-radius: 0; }\n\n.btn-group .btn + .btn {\n  border-left: 1px solid #c2c0c2; }\n\n.btn-group .btn + .btn.active {\n  border-left: 0; }\n\n.btn-group .active {\n  color: #fff;\n  border: 1px solid transparent;\n  background-color: #6d6c6d;\n  background-image: none; }\n\n.btn-group .active .icon {\n  color: #fff; }\n\n.toolbar {\n  min-height: 22px;\n  box-shadow: inset 0 1px 0 #f5f4f5;\n  background-color: #e8e6e8;\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #e8e6e8), color-stop(100%, #d1cfd1));\n  background-image: -webkit-linear-gradient(top, #e8e6e8 0%, #d1cfd1 100%);\n  background-image: linear-gradient(to bottom, #e8e6e8 0%, #d1cfd1 100%); }\n  .toolbar:before, .toolbar:after {\n    display: table;\n    content: \" \"; }\n  .toolbar:after {\n    clear: both; }\n\n.toolbar-header {\n  border-bottom: 1px solid #c2c0c2; }\n  .toolbar-header .title {\n    margin-top: 1px; }\n\n.toolbar-footer {\n  border-top: 1px solid #c2c0c2;\n  -webkit-app-region: drag; }\n\n.title {\n  margin: 0;\n  font-size: 12px;\n  font-weight: 400;\n  text-align: center;\n  color: #555;\n  cursor: default; }\n\n.toolbar-borderless {\n  border-top: 0;\n  border-bottom: 0; }\n\n.toolbar-actions {\n  margin-top: 4px;\n  margin-bottom: 3px;\n  padding-right: 3px;\n  padding-left: 3px;\n  padding-bottom: 3px;\n  -webkit-app-region: drag; }\n  .toolbar-actions:before, .toolbar-actions:after {\n    display: table;\n    content: \" \"; }\n  .toolbar-actions:after {\n    clear: both; }\n  .toolbar-actions > .btn,\n  .toolbar-actions > .btn-group {\n    margin-left: 4px;\n    margin-right: 4px; }\n\nlabel {\n  display: inline-block;\n  font-size: 13px;\n  margin-bottom: 5px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n\ninput[type=\"search\"] {\n  box-sizing: border-box; }\n\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  margin: 4px 0 0;\n  line-height: normal; }\n\n.form-control {\n  display: inline-block;\n  width: 100%;\n  min-height: 25px;\n  padding: 5px 10px;\n  font-size: 13px;\n  line-height: 1.6;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  outline: none;\n  -webkit-app-region: no-drag; }\n  .form-control:focus {\n    border-color: #6db3fd;\n    box-shadow: 3px 3px 0 #6db3fd, -3px -3px 0 #6db3fd, -3px 3px 0 #6db3fd, 3px -3px 0 #6db3fd; }\n\ntextarea {\n  height: auto; }\n\n.form-group {\n  margin-bottom: 10px; }\n\n.radio,\n.checkbox {\n  position: relative;\n  display: block;\n  margin-top: 10px;\n  margin-bottom: 10px; }\n  .radio label,\n  .checkbox label {\n    padding-left: 20px;\n    margin-bottom: 0;\n    font-weight: normal; }\n\n.radio input[type=\"radio\"],\n.radio-inline input[type=\"radio\"],\n.checkbox input[type=\"checkbox\"],\n.checkbox-inline input[type=\"checkbox\"] {\n  position: absolute;\n  margin-left: -20px;\n  margin-top: 4px; }\n\n.form-actions .btn {\n  margin-right: 10px; }\n  .form-actions .btn:last-child {\n    margin-right: 0; }\n\n.pane-group {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  display: flex; }\n\n.pane {\n  position: relative;\n  overflow-y: auto;\n  flex: 1;\n  border-left: 1px solid #ddd; }\n  .pane:first-child {\n    border-left: 0; }\n\n.pane-sm {\n  max-width: 220px;\n  min-width: 150px; }\n\n.pane-mini {\n  width: 80px;\n  flex: none; }\n\n.pane-one-fourth {\n  width: 25%;\n  flex: none; }\n\n.pane-one-third {\n  width: 33.3%;\n  flex: none; }\n\nimg {\n  -webkit-user-drag: text; }\n\n.img-circle {\n  border-radius: 50%; }\n\n.img-rounded {\n  border-radius: 4px; }\n\n.list-group {\n  width: 100%;\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n  .list-group * {\n    margin: 0;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis; }\n\n.list-group-item {\n  padding: 10px;\n  font-size: 12px;\n  color: #414142;\n  border-top: 1px solid #ddd; }\n  .list-group-item:first-child {\n    border-top: 0; }\n  .list-group-item.active, .list-group-item.selected {\n    color: #fff;\n    background-color: #116cd6; }\n\n.list-group-header {\n  padding: 10px; }\n\n.media-object {\n  margin-top: 3px; }\n\n.media-object.pull-left {\n  margin-right: 10px; }\n\n.media-object.pull-right {\n  margin-left: 10px; }\n\n.media-body {\n  overflow: hidden; }\n\n.nav-group {\n  font-size: 14px; }\n\n.nav-group-item {\n  padding: 2px 10px 2px 25px;\n  display: block;\n  color: #333;\n  text-decoration: none;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n  .nav-group-item:active, .nav-group-item.active {\n    background-color: #dcdfe1; }\n  .nav-group-item .icon {\n    width: 19px;\n    height: 18px;\n    float: left;\n    color: #737475;\n    margin-top: -3px;\n    margin-right: 7px;\n    font-size: 18px;\n    text-align: center; }\n\n.nav-group-title {\n  margin: 0;\n  padding: 10px 10px 2px;\n  font-size: 12px;\n  font-weight: 500;\n  color: #666666; }\n\n@font-face {\n  font-family: \"photon-entypo\";\n  src: url(" + __webpack_require__(11) + ");\n  src: url(" + __webpack_require__(11) + "?#iefix) format(\"eot\"), url(" + __webpack_require__(12) + ") format(\"woff\"), url(" + __webpack_require__(13) + ") format(\"truetype\");\n  font-weight: normal;\n  font-style: normal; }\n\n.icon:before {\n  position: relative;\n  display: inline-block;\n  font-family: \"photon-entypo\";\n  speak: none;\n  font-size: 100%;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.icon-note:before {\n  content: '\\E800'; }\n\n/* '' */\n.icon-note-beamed:before {\n  content: '\\E801'; }\n\n/* '' */\n.icon-music:before {\n  content: '\\E802'; }\n\n/* '' */\n.icon-search:before {\n  content: '\\E803'; }\n\n/* '' */\n.icon-flashlight:before {\n  content: '\\E804'; }\n\n/* '' */\n.icon-mail:before {\n  content: '\\E805'; }\n\n/* '' */\n.icon-heart:before {\n  content: '\\E806'; }\n\n/* '' */\n.icon-heart-empty:before {\n  content: '\\E807'; }\n\n/* '' */\n.icon-star:before {\n  content: '\\E808'; }\n\n/* '' */\n.icon-star-empty:before {\n  content: '\\E809'; }\n\n/* '' */\n.icon-user:before {\n  content: '\\E80A'; }\n\n/* '' */\n.icon-users:before {\n  content: '\\E80B'; }\n\n/* '' */\n.icon-user-add:before {\n  content: '\\E80C'; }\n\n/* '' */\n.icon-video:before {\n  content: '\\E80D'; }\n\n/* '' */\n.icon-picture:before {\n  content: '\\E80E'; }\n\n/* '' */\n.icon-camera:before {\n  content: '\\E80F'; }\n\n/* '' */\n.icon-layout:before {\n  content: '\\E810'; }\n\n/* '' */\n.icon-menu:before {\n  content: '\\E811'; }\n\n/* '' */\n.icon-check:before {\n  content: '\\E812'; }\n\n/* '' */\n.icon-cancel:before {\n  content: '\\E813'; }\n\n/* '' */\n.icon-cancel-circled:before {\n  content: '\\E814'; }\n\n/* '' */\n.icon-cancel-squared:before {\n  content: '\\E815'; }\n\n/* '' */\n.icon-plus:before {\n  content: '\\E816'; }\n\n/* '' */\n.icon-plus-circled:before {\n  content: '\\E817'; }\n\n/* '' */\n.icon-plus-squared:before {\n  content: '\\E818'; }\n\n/* '' */\n.icon-minus:before {\n  content: '\\E819'; }\n\n/* '' */\n.icon-minus-circled:before {\n  content: '\\E81A'; }\n\n/* '' */\n.icon-minus-squared:before {\n  content: '\\E81B'; }\n\n/* '' */\n.icon-help:before {\n  content: '\\E81C'; }\n\n/* '' */\n.icon-help-circled:before {\n  content: '\\E81D'; }\n\n/* '' */\n.icon-info:before {\n  content: '\\E81E'; }\n\n/* '' */\n.icon-info-circled:before {\n  content: '\\E81F'; }\n\n/* '' */\n.icon-back:before {\n  content: '\\E820'; }\n\n/* '' */\n.icon-home:before {\n  content: '\\E821'; }\n\n/* '' */\n.icon-link:before {\n  content: '\\E822'; }\n\n/* '' */\n.icon-attach:before {\n  content: '\\E823'; }\n\n/* '' */\n.icon-lock:before {\n  content: '\\E824'; }\n\n/* '' */\n.icon-lock-open:before {\n  content: '\\E825'; }\n\n/* '' */\n.icon-eye:before {\n  content: '\\E826'; }\n\n/* '' */\n.icon-tag:before {\n  content: '\\E827'; }\n\n/* '' */\n.icon-bookmark:before {\n  content: '\\E828'; }\n\n/* '' */\n.icon-bookmarks:before {\n  content: '\\E829'; }\n\n/* '' */\n.icon-flag:before {\n  content: '\\E82A'; }\n\n/* '' */\n.icon-thumbs-up:before {\n  content: '\\E82B'; }\n\n/* '' */\n.icon-thumbs-down:before {\n  content: '\\E82C'; }\n\n/* '' */\n.icon-download:before {\n  content: '\\E82D'; }\n\n/* '' */\n.icon-upload:before {\n  content: '\\E82E'; }\n\n/* '' */\n.icon-upload-cloud:before {\n  content: '\\E82F'; }\n\n/* '' */\n.icon-reply:before {\n  content: '\\E830'; }\n\n/* '' */\n.icon-reply-all:before {\n  content: '\\E831'; }\n\n/* '' */\n.icon-forward:before {\n  content: '\\E832'; }\n\n/* '' */\n.icon-quote:before {\n  content: '\\E833'; }\n\n/* '' */\n.icon-code:before {\n  content: '\\E834'; }\n\n/* '' */\n.icon-export:before {\n  content: '\\E835'; }\n\n/* '' */\n.icon-pencil:before {\n  content: '\\E836'; }\n\n/* '' */\n.icon-feather:before {\n  content: '\\E837'; }\n\n/* '' */\n.icon-print:before {\n  content: '\\E838'; }\n\n/* '' */\n.icon-retweet:before {\n  content: '\\E839'; }\n\n/* '' */\n.icon-keyboard:before {\n  content: '\\E83A'; }\n\n/* '' */\n.icon-comment:before {\n  content: '\\E83B'; }\n\n/* '' */\n.icon-chat:before {\n  content: '\\E83C'; }\n\n/* '' */\n.icon-bell:before {\n  content: '\\E83D'; }\n\n/* '' */\n.icon-attention:before {\n  content: '\\E83E'; }\n\n/* '' */\n.icon-alert:before {\n  content: '\\E83F'; }\n\n/* '' */\n.icon-vcard:before {\n  content: '\\E840'; }\n\n/* '' */\n.icon-address:before {\n  content: '\\E841'; }\n\n/* '' */\n.icon-location:before {\n  content: '\\E842'; }\n\n/* '' */\n.icon-map:before {\n  content: '\\E843'; }\n\n/* '' */\n.icon-direction:before {\n  content: '\\E844'; }\n\n/* '' */\n.icon-compass:before {\n  content: '\\E845'; }\n\n/* '' */\n.icon-cup:before {\n  content: '\\E846'; }\n\n/* '' */\n.icon-trash:before {\n  content: '\\E847'; }\n\n/* '' */\n.icon-doc:before {\n  content: '\\E848'; }\n\n/* '' */\n.icon-docs:before {\n  content: '\\E849'; }\n\n/* '' */\n.icon-doc-landscape:before {\n  content: '\\E84A'; }\n\n/* '' */\n.icon-doc-text:before {\n  content: '\\E84B'; }\n\n/* '' */\n.icon-doc-text-inv:before {\n  content: '\\E84C'; }\n\n/* '' */\n.icon-newspaper:before {\n  content: '\\E84D'; }\n\n/* '' */\n.icon-book-open:before {\n  content: '\\E84E'; }\n\n/* '' */\n.icon-book:before {\n  content: '\\E84F'; }\n\n/* '' */\n.icon-folder:before {\n  content: '\\E850'; }\n\n/* '' */\n.icon-archive:before {\n  content: '\\E851'; }\n\n/* '' */\n.icon-box:before {\n  content: '\\E852'; }\n\n/* '' */\n.icon-rss:before {\n  content: '\\E853'; }\n\n/* '' */\n.icon-phone:before {\n  content: '\\E854'; }\n\n/* '' */\n.icon-cog:before {\n  content: '\\E855'; }\n\n/* '' */\n.icon-tools:before {\n  content: '\\E856'; }\n\n/* '' */\n.icon-share:before {\n  content: '\\E857'; }\n\n/* '' */\n.icon-shareable:before {\n  content: '\\E858'; }\n\n/* '' */\n.icon-basket:before {\n  content: '\\E859'; }\n\n/* '' */\n.icon-bag:before {\n  content: '\\E85A'; }\n\n/* '' */\n.icon-calendar:before {\n  content: '\\E85B'; }\n\n/* '' */\n.icon-login:before {\n  content: '\\E85C'; }\n\n/* '' */\n.icon-logout:before {\n  content: '\\E85D'; }\n\n/* '' */\n.icon-mic:before {\n  content: '\\E85E'; }\n\n/* '' */\n.icon-mute:before {\n  content: '\\E85F'; }\n\n/* '' */\n.icon-sound:before {\n  content: '\\E860'; }\n\n/* '' */\n.icon-volume:before {\n  content: '\\E861'; }\n\n/* '' */\n.icon-clock:before {\n  content: '\\E862'; }\n\n/* '' */\n.icon-hourglass:before {\n  content: '\\E863'; }\n\n/* '' */\n.icon-lamp:before {\n  content: '\\E864'; }\n\n/* '' */\n.icon-light-down:before {\n  content: '\\E865'; }\n\n/* '' */\n.icon-light-up:before {\n  content: '\\E866'; }\n\n/* '' */\n.icon-adjust:before {\n  content: '\\E867'; }\n\n/* '' */\n.icon-block:before {\n  content: '\\E868'; }\n\n/* '' */\n.icon-resize-full:before {\n  content: '\\E869'; }\n\n/* '' */\n.icon-resize-small:before {\n  content: '\\E86A'; }\n\n/* '' */\n.icon-popup:before {\n  content: '\\E86B'; }\n\n/* '' */\n.icon-publish:before {\n  content: '\\E86C'; }\n\n/* '' */\n.icon-window:before {\n  content: '\\E86D'; }\n\n/* '' */\n.icon-arrow-combo:before {\n  content: '\\E86E'; }\n\n/* '' */\n.icon-down-circled:before {\n  content: '\\E86F'; }\n\n/* '' */\n.icon-left-circled:before {\n  content: '\\E870'; }\n\n/* '' */\n.icon-right-circled:before {\n  content: '\\E871'; }\n\n/* '' */\n.icon-up-circled:before {\n  content: '\\E872'; }\n\n/* '' */\n.icon-down-open:before {\n  content: '\\E873'; }\n\n/* '' */\n.icon-left-open:before {\n  content: '\\E874'; }\n\n/* '' */\n.icon-right-open:before {\n  content: '\\E875'; }\n\n/* '' */\n.icon-up-open:before {\n  content: '\\E876'; }\n\n/* '' */\n.icon-down-open-mini:before {\n  content: '\\E877'; }\n\n/* '' */\n.icon-left-open-mini:before {\n  content: '\\E878'; }\n\n/* '' */\n.icon-right-open-mini:before {\n  content: '\\E879'; }\n\n/* '' */\n.icon-up-open-mini:before {\n  content: '\\E87A'; }\n\n/* '' */\n.icon-down-open-big:before {\n  content: '\\E87B'; }\n\n/* '' */\n.icon-left-open-big:before {\n  content: '\\E87C'; }\n\n/* '' */\n.icon-right-open-big:before {\n  content: '\\E87D'; }\n\n/* '' */\n.icon-up-open-big:before {\n  content: '\\E87E'; }\n\n/* '' */\n.icon-down:before {\n  content: '\\E87F'; }\n\n/* '' */\n.icon-left:before {\n  content: '\\E880'; }\n\n/* '' */\n.icon-right:before {\n  content: '\\E881'; }\n\n/* '' */\n.icon-up:before {\n  content: '\\E882'; }\n\n/* '' */\n.icon-down-dir:before {\n  content: '\\E883'; }\n\n/* '' */\n.icon-left-dir:before {\n  content: '\\E884'; }\n\n/* '' */\n.icon-right-dir:before {\n  content: '\\E885'; }\n\n/* '' */\n.icon-up-dir:before {\n  content: '\\E886'; }\n\n/* '' */\n.icon-down-bold:before {\n  content: '\\E887'; }\n\n/* '' */\n.icon-left-bold:before {\n  content: '\\E888'; }\n\n/* '' */\n.icon-right-bold:before {\n  content: '\\E889'; }\n\n/* '' */\n.icon-up-bold:before {\n  content: '\\E88A'; }\n\n/* '' */\n.icon-down-thin:before {\n  content: '\\E88B'; }\n\n/* '' */\n.icon-left-thin:before {\n  content: '\\E88C'; }\n\n/* '' */\n.icon-right-thin:before {\n  content: '\\E88D'; }\n\n/* '' */\n.icon-up-thin:before {\n  content: '\\E88E'; }\n\n/* '' */\n.icon-ccw:before {\n  content: '\\E88F'; }\n\n/* '' */\n.icon-cw:before {\n  content: '\\E890'; }\n\n/* '' */\n.icon-arrows-ccw:before {\n  content: '\\E891'; }\n\n/* '' */\n.icon-level-down:before {\n  content: '\\E892'; }\n\n/* '' */\n.icon-level-up:before {\n  content: '\\E893'; }\n\n/* '' */\n.icon-shuffle:before {\n  content: '\\E894'; }\n\n/* '' */\n.icon-loop:before {\n  content: '\\E895'; }\n\n/* '' */\n.icon-switch:before {\n  content: '\\E896'; }\n\n/* '' */\n.icon-play:before {\n  content: '\\E897'; }\n\n/* '' */\n.icon-stop:before {\n  content: '\\E898'; }\n\n/* '' */\n.icon-pause:before {\n  content: '\\E899'; }\n\n/* '' */\n.icon-record:before {\n  content: '\\E89A'; }\n\n/* '' */\n.icon-to-end:before {\n  content: '\\E89B'; }\n\n/* '' */\n.icon-to-start:before {\n  content: '\\E89C'; }\n\n/* '' */\n.icon-fast-forward:before {\n  content: '\\E89D'; }\n\n/* '' */\n.icon-fast-backward:before {\n  content: '\\E89E'; }\n\n/* '' */\n.icon-progress-0:before {\n  content: '\\E89F'; }\n\n/* '' */\n.icon-progress-1:before {\n  content: '\\E8A0'; }\n\n/* '' */\n.icon-progress-2:before {\n  content: '\\E8A1'; }\n\n/* '' */\n.icon-progress-3:before {\n  content: '\\E8A2'; }\n\n/* '' */\n.icon-target:before {\n  content: '\\E8A3'; }\n\n/* '' */\n.icon-palette:before {\n  content: '\\E8A4'; }\n\n/* '' */\n.icon-list:before {\n  content: '\\E8A5'; }\n\n/* '' */\n.icon-list-add:before {\n  content: '\\E8A6'; }\n\n/* '' */\n.icon-signal:before {\n  content: '\\E8A7'; }\n\n/* '' */\n.icon-trophy:before {\n  content: '\\E8A8'; }\n\n/* '' */\n.icon-battery:before {\n  content: '\\E8A9'; }\n\n/* '' */\n.icon-back-in-time:before {\n  content: '\\E8AA'; }\n\n/* '' */\n.icon-monitor:before {\n  content: '\\E8AB'; }\n\n/* '' */\n.icon-mobile:before {\n  content: '\\E8AC'; }\n\n/* '' */\n.icon-network:before {\n  content: '\\E8AD'; }\n\n/* '' */\n.icon-cd:before {\n  content: '\\E8AE'; }\n\n/* '' */\n.icon-inbox:before {\n  content: '\\E8AF'; }\n\n/* '' */\n.icon-install:before {\n  content: '\\E8B0'; }\n\n/* '' */\n.icon-globe:before {\n  content: '\\E8B1'; }\n\n/* '' */\n.icon-cloud:before {\n  content: '\\E8B2'; }\n\n/* '' */\n.icon-cloud-thunder:before {\n  content: '\\E8B3'; }\n\n/* '' */\n.icon-flash:before {\n  content: '\\E8B4'; }\n\n/* '' */\n.icon-moon:before {\n  content: '\\E8B5'; }\n\n/* '' */\n.icon-flight:before {\n  content: '\\E8B6'; }\n\n/* '' */\n.icon-paper-plane:before {\n  content: '\\E8B7'; }\n\n/* '' */\n.icon-leaf:before {\n  content: '\\E8B8'; }\n\n/* '' */\n.icon-lifebuoy:before {\n  content: '\\E8B9'; }\n\n/* '' */\n.icon-mouse:before {\n  content: '\\E8BA'; }\n\n/* '' */\n.icon-briefcase:before {\n  content: '\\E8BB'; }\n\n/* '' */\n.icon-suitcase:before {\n  content: '\\E8BC'; }\n\n/* '' */\n.icon-dot:before {\n  content: '\\E8BD'; }\n\n/* '' */\n.icon-dot-2:before {\n  content: '\\E8BE'; }\n\n/* '' */\n.icon-dot-3:before {\n  content: '\\E8BF'; }\n\n/* '' */\n.icon-brush:before {\n  content: '\\E8C0'; }\n\n/* '' */\n.icon-magnet:before {\n  content: '\\E8C1'; }\n\n/* '' */\n.icon-infinity:before {\n  content: '\\E8C2'; }\n\n/* '' */\n.icon-erase:before {\n  content: '\\E8C3'; }\n\n/* '' */\n.icon-chart-pie:before {\n  content: '\\E8C4'; }\n\n/* '' */\n.icon-chart-line:before {\n  content: '\\E8C5'; }\n\n/* '' */\n.icon-chart-bar:before {\n  content: '\\E8C6'; }\n\n/* '' */\n.icon-chart-area:before {\n  content: '\\E8C7'; }\n\n/* '' */\n.icon-tape:before {\n  content: '\\E8C8'; }\n\n/* '' */\n.icon-graduation-cap:before {\n  content: '\\E8C9'; }\n\n/* '' */\n.icon-language:before {\n  content: '\\E8CA'; }\n\n/* '' */\n.icon-ticket:before {\n  content: '\\E8CB'; }\n\n/* '' */\n.icon-water:before {\n  content: '\\E8CC'; }\n\n/* '' */\n.icon-droplet:before {\n  content: '\\E8CD'; }\n\n/* '' */\n.icon-air:before {\n  content: '\\E8CE'; }\n\n/* '' */\n.icon-credit-card:before {\n  content: '\\E8CF'; }\n\n/* '' */\n.icon-floppy:before {\n  content: '\\E8D0'; }\n\n/* '' */\n.icon-clipboard:before {\n  content: '\\E8D1'; }\n\n/* '' */\n.icon-megaphone:before {\n  content: '\\E8D2'; }\n\n/* '' */\n.icon-database:before {\n  content: '\\E8D3'; }\n\n/* '' */\n.icon-drive:before {\n  content: '\\E8D4'; }\n\n/* '' */\n.icon-bucket:before {\n  content: '\\E8D5'; }\n\n/* '' */\n.icon-thermometer:before {\n  content: '\\E8D6'; }\n\n/* '' */\n.icon-key:before {\n  content: '\\E8D7'; }\n\n/* '' */\n.icon-flow-cascade:before {\n  content: '\\E8D8'; }\n\n/* '' */\n.icon-flow-branch:before {\n  content: '\\E8D9'; }\n\n/* '' */\n.icon-flow-tree:before {\n  content: '\\E8DA'; }\n\n/* '' */\n.icon-flow-line:before {\n  content: '\\E8DB'; }\n\n/* '' */\n.icon-flow-parallel:before {\n  content: '\\E8DC'; }\n\n/* '' */\n.icon-rocket:before {\n  content: '\\E8DD'; }\n\n/* '' */\n.icon-gauge:before {\n  content: '\\E8DE'; }\n\n/* '' */\n.icon-traffic-cone:before {\n  content: '\\E8DF'; }\n\n/* '' */\n.icon-cc:before {\n  content: '\\E8E0'; }\n\n/* '' */\n.icon-cc-by:before {\n  content: '\\E8E1'; }\n\n/* '' */\n.icon-cc-nc:before {\n  content: '\\E8E2'; }\n\n/* '' */\n.icon-cc-nc-eu:before {\n  content: '\\E8E3'; }\n\n/* '' */\n.icon-cc-nc-jp:before {\n  content: '\\E8E4'; }\n\n/* '' */\n.icon-cc-sa:before {\n  content: '\\E8E5'; }\n\n/* '' */\n.icon-cc-nd:before {\n  content: '\\E8E6'; }\n\n/* '' */\n.icon-cc-pd:before {\n  content: '\\E8E7'; }\n\n/* '' */\n.icon-cc-zero:before {\n  content: '\\E8E8'; }\n\n/* '' */\n.icon-cc-share:before {\n  content: '\\E8E9'; }\n\n/* '' */\n.icon-cc-remix:before {\n  content: '\\E8EA'; }\n\n/* '' */\n.icon-github:before {\n  content: '\\E8EB'; }\n\n/* '' */\n.icon-github-circled:before {\n  content: '\\E8EC'; }\n\n/* '' */\n.icon-flickr:before {\n  content: '\\E8ED'; }\n\n/* '' */\n.icon-flickr-circled:before {\n  content: '\\E8EE'; }\n\n/* '' */\n.icon-vimeo:before {\n  content: '\\E8EF'; }\n\n/* '' */\n.icon-vimeo-circled:before {\n  content: '\\E8F0'; }\n\n/* '' */\n.icon-twitter:before {\n  content: '\\E8F1'; }\n\n/* '' */\n.icon-twitter-circled:before {\n  content: '\\E8F2'; }\n\n/* '' */\n.icon-facebook:before {\n  content: '\\E8F3'; }\n\n/* '' */\n.icon-facebook-circled:before {\n  content: '\\E8F4'; }\n\n/* '' */\n.icon-facebook-squared:before {\n  content: '\\E8F5'; }\n\n/* '' */\n.icon-gplus:before {\n  content: '\\E8F6'; }\n\n/* '' */\n.icon-gplus-circled:before {\n  content: '\\E8F7'; }\n\n/* '' */\n.icon-pinterest:before {\n  content: '\\E8F8'; }\n\n/* '' */\n.icon-pinterest-circled:before {\n  content: '\\E8F9'; }\n\n/* '' */\n.icon-tumblr:before {\n  content: '\\E8FA'; }\n\n/* '' */\n.icon-tumblr-circled:before {\n  content: '\\E8FB'; }\n\n/* '' */\n.icon-linkedin:before {\n  content: '\\E8FC'; }\n\n/* '' */\n.icon-linkedin-circled:before {\n  content: '\\E8FD'; }\n\n/* '' */\n.icon-dribbble:before {\n  content: '\\E8FE'; }\n\n/* '' */\n.icon-dribbble-circled:before {\n  content: '\\E8FF'; }\n\n/* '' */\n.icon-stumbleupon:before {\n  content: '\\E900'; }\n\n/* '' */\n.icon-stumbleupon-circled:before {\n  content: '\\E901'; }\n\n/* '' */\n.icon-lastfm:before {\n  content: '\\E902'; }\n\n/* '' */\n.icon-lastfm-circled:before {\n  content: '\\E903'; }\n\n/* '' */\n.icon-rdio:before {\n  content: '\\E904'; }\n\n/* '' */\n.icon-rdio-circled:before {\n  content: '\\E905'; }\n\n/* '' */\n.icon-spotify:before {\n  content: '\\E906'; }\n\n/* '' */\n.icon-spotify-circled:before {\n  content: '\\E907'; }\n\n/* '' */\n.icon-qq:before {\n  content: '\\E908'; }\n\n/* '' */\n.icon-instagram:before {\n  content: '\\E909'; }\n\n/* '' */\n.icon-dropbox:before {\n  content: '\\E90A'; }\n\n/* '' */\n.icon-evernote:before {\n  content: '\\E90B'; }\n\n/* '' */\n.icon-flattr:before {\n  content: '\\E90C'; }\n\n/* '' */\n.icon-skype:before {\n  content: '\\E90D'; }\n\n/* '' */\n.icon-skype-circled:before {\n  content: '\\E90E'; }\n\n/* '' */\n.icon-renren:before {\n  content: '\\E90F'; }\n\n/* '' */\n.icon-sina-weibo:before {\n  content: '\\E910'; }\n\n/* '' */\n.icon-paypal:before {\n  content: '\\E911'; }\n\n/* '' */\n.icon-picasa:before {\n  content: '\\E912'; }\n\n/* '' */\n.icon-soundcloud:before {\n  content: '\\E913'; }\n\n/* '' */\n.icon-mixi:before {\n  content: '\\E914'; }\n\n/* '' */\n.icon-behance:before {\n  content: '\\E915'; }\n\n/* '' */\n.icon-google-circles:before {\n  content: '\\E916'; }\n\n/* '' */\n.icon-vkontakte:before {\n  content: '\\E917'; }\n\n/* '' */\n.icon-smashing:before {\n  content: '\\E918'; }\n\n/* '' */\n.icon-sweden:before {\n  content: '\\E919'; }\n\n/* '' */\n.icon-db-shape:before {\n  content: '\\E91A'; }\n\n/* '' */\n.icon-logo-db:before {\n  content: '\\E91B'; }\n\n/* '' */\ntable {\n  width: 100%;\n  border: 0;\n  border-collapse: separate;\n  font-size: 12px;\n  text-align: left; }\n\nthead {\n  background-color: #f5f5f4; }\n\ntbody {\n  background-color: #fff; }\n\n.table-striped tr:nth-child(even) {\n  background-color: #f5f5f4; }\n\ntr:active,\n.table-striped tr:active:nth-child(even) {\n  color: #fff;\n  background-color: #116cd6; }\n\nthead tr:active {\n  color: #333;\n  background-color: #f5f5f4; }\n\nth {\n  font-weight: normal;\n  border-right: 1px solid #ddd;\n  border-bottom: 1px solid #ddd; }\n\nth,\ntd {\n  padding: 2px 15px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n  th:last-child,\n  td:last-child {\n    border-right: 0; }\n\n.tab-group {\n  margin-top: -1px;\n  display: flex;\n  border-top: 1px solid #989698;\n  border-bottom: 1px solid #989698; }\n\n.tab-item {\n  position: relative;\n  flex: 1;\n  padding: 3px;\n  font-size: 12px;\n  text-align: center;\n  border-left: 1px solid #989698;\n  background-color: #b8b6b8;\n  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #b8b6b8), color-stop(100%, #b0aeb0));\n  background-image: -webkit-linear-gradient(top, #b8b6b8 0%, #b0aeb0 100%);\n  background-image: linear-gradient(to bottom, #b8b6b8 0%, #b0aeb0 100%); }\n  .tab-item:first-child {\n    border-left: 0; }\n  .tab-item.active {\n    background-color: #d4d2d4;\n    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #d4d2d4), color-stop(100%, #cccacc));\n    background-image: -webkit-linear-gradient(top, #d4d2d4 0%, #cccacc 100%);\n    background-image: linear-gradient(to bottom, #d4d2d4 0%, #cccacc 100%); }\n  .tab-item .icon-close-tab {\n    position: absolute;\n    top: 50%;\n    left: 5px;\n    width: 15px;\n    height: 15px;\n    font-size: 15px;\n    line-height: 15px;\n    text-align: center;\n    color: #666;\n    opacity: 0;\n    transition: opacity .1s linear, background-color .1s linear;\n    border-radius: 3px;\n    transform: translateY(-50%);\n    z-index: 10; }\n  .tab-item:after {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    content: \"\";\n    background-color: rgba(0, 0, 0, 0.08);\n    opacity: 0;\n    transition: opacity .1s linear;\n    z-index: 1; }\n  .tab-item:hover:not(.active):after {\n    opacity: 1; }\n  .tab-item:hover .icon-close-tab {\n    opacity: 1; }\n  .tab-item .icon-close-tab:hover {\n    background-color: rgba(0, 0, 0, 0.08); }\n\n.tab-item-fixed {\n  flex: none;\n  padding: 3px 10px; }\n", ""]);

	// exports


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "2614e058b2dcb9d6e2e964730d795540.eot";

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "bf614256dbc49f4bf2cf786706bb0712.woff";

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "1382c29cdb72f6c99043675d6e13b625.ttf";

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(15);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js?sourceMap!./font-awesome.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js?sourceMap!./font-awesome.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "@charset \"UTF-8\";\n/*!\n *  Font Awesome 4.5.0 by @davegandy - http://fontawesome.io - @fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */\n/* FONT PATH\n * -------------------------- */\n@font-face {\n  font-family: 'FontAwesome';\n  src: url(" + __webpack_require__(16) + ");\n  src: url(" + __webpack_require__(17) + "?#iefix&v=4.5.0) format(\"embedded-opentype\"), url(" + __webpack_require__(18) + ") format(\"woff2\"), url(" + __webpack_require__(19) + ") format(\"woff\"), url(" + __webpack_require__(20) + ") format(\"truetype\"), url(" + __webpack_require__(21) + "#fontawesomeregular) format(\"svg\");\n  font-weight: normal;\n  font-style: normal; }\n\n.fa {\n  display: inline-block;\n  font: normal normal normal 14px / 1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n/* makes the font 33% larger relative to the icon container */\n.fa-lg {\n  font-size: 1.33333em;\n  line-height: 0.75em;\n  vertical-align: -15%; }\n\n.fa-2x {\n  font-size: 2em; }\n\n.fa-3x {\n  font-size: 3em; }\n\n.fa-4x {\n  font-size: 4em; }\n\n.fa-5x {\n  font-size: 5em; }\n\n.fa-fw {\n  width: 1.28571em;\n  text-align: center; }\n\n.fa-ul {\n  padding-left: 0;\n  margin-left: 2.14286em;\n  list-style-type: none; }\n  .fa-ul > li {\n    position: relative; }\n\n.fa-li {\n  position: absolute;\n  left: -2.14286em;\n  width: 2.14286em;\n  top: 0.14286em;\n  text-align: center; }\n  .fa-li.fa-lg {\n    left: -1.85714em; }\n\n.fa-border {\n  padding: .2em .25em .15em;\n  border: solid 0.08em #eee;\n  border-radius: .1em; }\n\n.fa-pull-left {\n  float: left; }\n\n.fa-pull-right {\n  float: right; }\n\n.fa.fa-pull-left {\n  margin-right: .3em; }\n\n.fa.fa-pull-right {\n  margin-left: .3em; }\n\n/* Deprecated as of 4.4.0 */\n.pull-right {\n  float: right; }\n\n.pull-left {\n  float: left; }\n\n.fa.pull-left {\n  margin-right: .3em; }\n\n.fa.pull-right {\n  margin-left: .3em; }\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n  animation: fa-spin 2s infinite linear; }\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n  animation: fa-spin 1s infinite steps(8); }\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg); } }\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg); } }\n\n.fa-rotate-90 {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);\n  -webkit-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  transform: rotate(90deg); }\n\n.fa-rotate-180 {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\n  -webkit-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  transform: rotate(180deg); }\n\n.fa-rotate-270 {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);\n  -webkit-transform: rotate(270deg);\n  -ms-transform: rotate(270deg);\n  transform: rotate(270deg); }\n\n.fa-flip-horizontal {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=0);\n  -webkit-transform: scale(-1, 1);\n  -ms-transform: scale(-1, 1);\n  transform: scale(-1, 1); }\n\n.fa-flip-vertical {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\n  -webkit-transform: scale(1, -1);\n  -ms-transform: scale(1, -1);\n  transform: scale(1, -1); }\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical {\n  filter: none; }\n\n.fa-stack {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  line-height: 2em;\n  vertical-align: middle; }\n\n.fa-stack-1x, .fa-stack-2x {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  text-align: center; }\n\n.fa-stack-1x {\n  line-height: inherit; }\n\n.fa-stack-2x {\n  font-size: 2em; }\n\n.fa-inverse {\n  color: #fff; }\n\n/* Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen\n   readers do not read off random characters that represent icons */\n.fa-glass:before {\n  content: \"\\F000\"; }\n\n.fa-music:before {\n  content: \"\\F001\"; }\n\n.fa-search:before {\n  content: \"\\F002\"; }\n\n.fa-envelope-o:before {\n  content: \"\\F003\"; }\n\n.fa-heart:before {\n  content: \"\\F004\"; }\n\n.fa-star:before {\n  content: \"\\F005\"; }\n\n.fa-star-o:before {\n  content: \"\\F006\"; }\n\n.fa-user:before {\n  content: \"\\F007\"; }\n\n.fa-film:before {\n  content: \"\\F008\"; }\n\n.fa-th-large:before {\n  content: \"\\F009\"; }\n\n.fa-th:before {\n  content: \"\\F00A\"; }\n\n.fa-th-list:before {\n  content: \"\\F00B\"; }\n\n.fa-check:before {\n  content: \"\\F00C\"; }\n\n.fa-remove:before,\n.fa-close:before,\n.fa-times:before {\n  content: \"\\F00D\"; }\n\n.fa-search-plus:before {\n  content: \"\\F00E\"; }\n\n.fa-search-minus:before {\n  content: \"\\F010\"; }\n\n.fa-power-off:before {\n  content: \"\\F011\"; }\n\n.fa-signal:before {\n  content: \"\\F012\"; }\n\n.fa-gear:before,\n.fa-cog:before {\n  content: \"\\F013\"; }\n\n.fa-trash-o:before {\n  content: \"\\F014\"; }\n\n.fa-home:before {\n  content: \"\\F015\"; }\n\n.fa-file-o:before {\n  content: \"\\F016\"; }\n\n.fa-clock-o:before {\n  content: \"\\F017\"; }\n\n.fa-road:before {\n  content: \"\\F018\"; }\n\n.fa-download:before {\n  content: \"\\F019\"; }\n\n.fa-arrow-circle-o-down:before {\n  content: \"\\F01A\"; }\n\n.fa-arrow-circle-o-up:before {\n  content: \"\\F01B\"; }\n\n.fa-inbox:before {\n  content: \"\\F01C\"; }\n\n.fa-play-circle-o:before {\n  content: \"\\F01D\"; }\n\n.fa-rotate-right:before,\n.fa-repeat:before {\n  content: \"\\F01E\"; }\n\n.fa-refresh:before {\n  content: \"\\F021\"; }\n\n.fa-list-alt:before {\n  content: \"\\F022\"; }\n\n.fa-lock:before {\n  content: \"\\F023\"; }\n\n.fa-flag:before {\n  content: \"\\F024\"; }\n\n.fa-headphones:before {\n  content: \"\\F025\"; }\n\n.fa-volume-off:before {\n  content: \"\\F026\"; }\n\n.fa-volume-down:before {\n  content: \"\\F027\"; }\n\n.fa-volume-up:before {\n  content: \"\\F028\"; }\n\n.fa-qrcode:before {\n  content: \"\\F029\"; }\n\n.fa-barcode:before {\n  content: \"\\F02A\"; }\n\n.fa-tag:before {\n  content: \"\\F02B\"; }\n\n.fa-tags:before {\n  content: \"\\F02C\"; }\n\n.fa-book:before {\n  content: \"\\F02D\"; }\n\n.fa-bookmark:before {\n  content: \"\\F02E\"; }\n\n.fa-print:before {\n  content: \"\\F02F\"; }\n\n.fa-camera:before {\n  content: \"\\F030\"; }\n\n.fa-font:before {\n  content: \"\\F031\"; }\n\n.fa-bold:before {\n  content: \"\\F032\"; }\n\n.fa-italic:before {\n  content: \"\\F033\"; }\n\n.fa-text-height:before {\n  content: \"\\F034\"; }\n\n.fa-text-width:before {\n  content: \"\\F035\"; }\n\n.fa-align-left:before {\n  content: \"\\F036\"; }\n\n.fa-align-center:before {\n  content: \"\\F037\"; }\n\n.fa-align-right:before {\n  content: \"\\F038\"; }\n\n.fa-align-justify:before {\n  content: \"\\F039\"; }\n\n.fa-list:before {\n  content: \"\\F03A\"; }\n\n.fa-dedent:before,\n.fa-outdent:before {\n  content: \"\\F03B\"; }\n\n.fa-indent:before {\n  content: \"\\F03C\"; }\n\n.fa-video-camera:before {\n  content: \"\\F03D\"; }\n\n.fa-photo:before,\n.fa-image:before,\n.fa-picture-o:before {\n  content: \"\\F03E\"; }\n\n.fa-pencil:before {\n  content: \"\\F040\"; }\n\n.fa-map-marker:before {\n  content: \"\\F041\"; }\n\n.fa-adjust:before {\n  content: \"\\F042\"; }\n\n.fa-tint:before {\n  content: \"\\F043\"; }\n\n.fa-edit:before,\n.fa-pencil-square-o:before {\n  content: \"\\F044\"; }\n\n.fa-share-square-o:before {\n  content: \"\\F045\"; }\n\n.fa-check-square-o:before {\n  content: \"\\F046\"; }\n\n.fa-arrows:before {\n  content: \"\\F047\"; }\n\n.fa-step-backward:before {\n  content: \"\\F048\"; }\n\n.fa-fast-backward:before {\n  content: \"\\F049\"; }\n\n.fa-backward:before {\n  content: \"\\F04A\"; }\n\n.fa-play:before {\n  content: \"\\F04B\"; }\n\n.fa-pause:before {\n  content: \"\\F04C\"; }\n\n.fa-stop:before {\n  content: \"\\F04D\"; }\n\n.fa-forward:before {\n  content: \"\\F04E\"; }\n\n.fa-fast-forward:before {\n  content: \"\\F050\"; }\n\n.fa-step-forward:before {\n  content: \"\\F051\"; }\n\n.fa-eject:before {\n  content: \"\\F052\"; }\n\n.fa-chevron-left:before {\n  content: \"\\F053\"; }\n\n.fa-chevron-right:before {\n  content: \"\\F054\"; }\n\n.fa-plus-circle:before {\n  content: \"\\F055\"; }\n\n.fa-minus-circle:before {\n  content: \"\\F056\"; }\n\n.fa-times-circle:before {\n  content: \"\\F057\"; }\n\n.fa-check-circle:before {\n  content: \"\\F058\"; }\n\n.fa-question-circle:before {\n  content: \"\\F059\"; }\n\n.fa-info-circle:before {\n  content: \"\\F05A\"; }\n\n.fa-crosshairs:before {\n  content: \"\\F05B\"; }\n\n.fa-times-circle-o:before {\n  content: \"\\F05C\"; }\n\n.fa-check-circle-o:before {\n  content: \"\\F05D\"; }\n\n.fa-ban:before {\n  content: \"\\F05E\"; }\n\n.fa-arrow-left:before {\n  content: \"\\F060\"; }\n\n.fa-arrow-right:before {\n  content: \"\\F061\"; }\n\n.fa-arrow-up:before {\n  content: \"\\F062\"; }\n\n.fa-arrow-down:before {\n  content: \"\\F063\"; }\n\n.fa-mail-forward:before,\n.fa-share:before {\n  content: \"\\F064\"; }\n\n.fa-expand:before {\n  content: \"\\F065\"; }\n\n.fa-compress:before {\n  content: \"\\F066\"; }\n\n.fa-plus:before {\n  content: \"\\F067\"; }\n\n.fa-minus:before {\n  content: \"\\F068\"; }\n\n.fa-asterisk:before {\n  content: \"\\F069\"; }\n\n.fa-exclamation-circle:before {\n  content: \"\\F06A\"; }\n\n.fa-gift:before {\n  content: \"\\F06B\"; }\n\n.fa-leaf:before {\n  content: \"\\F06C\"; }\n\n.fa-fire:before {\n  content: \"\\F06D\"; }\n\n.fa-eye:before {\n  content: \"\\F06E\"; }\n\n.fa-eye-slash:before {\n  content: \"\\F070\"; }\n\n.fa-warning:before,\n.fa-exclamation-triangle:before {\n  content: \"\\F071\"; }\n\n.fa-plane:before {\n  content: \"\\F072\"; }\n\n.fa-calendar:before {\n  content: \"\\F073\"; }\n\n.fa-random:before {\n  content: \"\\F074\"; }\n\n.fa-comment:before {\n  content: \"\\F075\"; }\n\n.fa-magnet:before {\n  content: \"\\F076\"; }\n\n.fa-chevron-up:before {\n  content: \"\\F077\"; }\n\n.fa-chevron-down:before {\n  content: \"\\F078\"; }\n\n.fa-retweet:before {\n  content: \"\\F079\"; }\n\n.fa-shopping-cart:before {\n  content: \"\\F07A\"; }\n\n.fa-folder:before {\n  content: \"\\F07B\"; }\n\n.fa-folder-open:before {\n  content: \"\\F07C\"; }\n\n.fa-arrows-v:before {\n  content: \"\\F07D\"; }\n\n.fa-arrows-h:before {\n  content: \"\\F07E\"; }\n\n.fa-bar-chart-o:before,\n.fa-bar-chart:before {\n  content: \"\\F080\"; }\n\n.fa-twitter-square:before {\n  content: \"\\F081\"; }\n\n.fa-facebook-square:before {\n  content: \"\\F082\"; }\n\n.fa-camera-retro:before {\n  content: \"\\F083\"; }\n\n.fa-key:before {\n  content: \"\\F084\"; }\n\n.fa-gears:before,\n.fa-cogs:before {\n  content: \"\\F085\"; }\n\n.fa-comments:before {\n  content: \"\\F086\"; }\n\n.fa-thumbs-o-up:before {\n  content: \"\\F087\"; }\n\n.fa-thumbs-o-down:before {\n  content: \"\\F088\"; }\n\n.fa-star-half:before {\n  content: \"\\F089\"; }\n\n.fa-heart-o:before {\n  content: \"\\F08A\"; }\n\n.fa-sign-out:before {\n  content: \"\\F08B\"; }\n\n.fa-linkedin-square:before {\n  content: \"\\F08C\"; }\n\n.fa-thumb-tack:before {\n  content: \"\\F08D\"; }\n\n.fa-external-link:before {\n  content: \"\\F08E\"; }\n\n.fa-sign-in:before {\n  content: \"\\F090\"; }\n\n.fa-trophy:before {\n  content: \"\\F091\"; }\n\n.fa-github-square:before {\n  content: \"\\F092\"; }\n\n.fa-upload:before {\n  content: \"\\F093\"; }\n\n.fa-lemon-o:before {\n  content: \"\\F094\"; }\n\n.fa-phone:before {\n  content: \"\\F095\"; }\n\n.fa-square-o:before {\n  content: \"\\F096\"; }\n\n.fa-bookmark-o:before {\n  content: \"\\F097\"; }\n\n.fa-phone-square:before {\n  content: \"\\F098\"; }\n\n.fa-twitter:before {\n  content: \"\\F099\"; }\n\n.fa-facebook-f:before,\n.fa-facebook:before {\n  content: \"\\F09A\"; }\n\n.fa-github:before {\n  content: \"\\F09B\"; }\n\n.fa-unlock:before {\n  content: \"\\F09C\"; }\n\n.fa-credit-card:before {\n  content: \"\\F09D\"; }\n\n.fa-feed:before,\n.fa-rss:before {\n  content: \"\\F09E\"; }\n\n.fa-hdd-o:before {\n  content: \"\\F0A0\"; }\n\n.fa-bullhorn:before {\n  content: \"\\F0A1\"; }\n\n.fa-bell:before {\n  content: \"\\F0F3\"; }\n\n.fa-certificate:before {\n  content: \"\\F0A3\"; }\n\n.fa-hand-o-right:before {\n  content: \"\\F0A4\"; }\n\n.fa-hand-o-left:before {\n  content: \"\\F0A5\"; }\n\n.fa-hand-o-up:before {\n  content: \"\\F0A6\"; }\n\n.fa-hand-o-down:before {\n  content: \"\\F0A7\"; }\n\n.fa-arrow-circle-left:before {\n  content: \"\\F0A8\"; }\n\n.fa-arrow-circle-right:before {\n  content: \"\\F0A9\"; }\n\n.fa-arrow-circle-up:before {\n  content: \"\\F0AA\"; }\n\n.fa-arrow-circle-down:before {\n  content: \"\\F0AB\"; }\n\n.fa-globe:before {\n  content: \"\\F0AC\"; }\n\n.fa-wrench:before {\n  content: \"\\F0AD\"; }\n\n.fa-tasks:before {\n  content: \"\\F0AE\"; }\n\n.fa-filter:before {\n  content: \"\\F0B0\"; }\n\n.fa-briefcase:before {\n  content: \"\\F0B1\"; }\n\n.fa-arrows-alt:before {\n  content: \"\\F0B2\"; }\n\n.fa-group:before,\n.fa-users:before {\n  content: \"\\F0C0\"; }\n\n.fa-chain:before,\n.fa-link:before {\n  content: \"\\F0C1\"; }\n\n.fa-cloud:before {\n  content: \"\\F0C2\"; }\n\n.fa-flask:before {\n  content: \"\\F0C3\"; }\n\n.fa-cut:before,\n.fa-scissors:before {\n  content: \"\\F0C4\"; }\n\n.fa-copy:before,\n.fa-files-o:before {\n  content: \"\\F0C5\"; }\n\n.fa-paperclip:before {\n  content: \"\\F0C6\"; }\n\n.fa-save:before,\n.fa-floppy-o:before {\n  content: \"\\F0C7\"; }\n\n.fa-square:before {\n  content: \"\\F0C8\"; }\n\n.fa-navicon:before,\n.fa-reorder:before,\n.fa-bars:before {\n  content: \"\\F0C9\"; }\n\n.fa-list-ul:before {\n  content: \"\\F0CA\"; }\n\n.fa-list-ol:before {\n  content: \"\\F0CB\"; }\n\n.fa-strikethrough:before {\n  content: \"\\F0CC\"; }\n\n.fa-underline:before {\n  content: \"\\F0CD\"; }\n\n.fa-table:before {\n  content: \"\\F0CE\"; }\n\n.fa-magic:before {\n  content: \"\\F0D0\"; }\n\n.fa-truck:before {\n  content: \"\\F0D1\"; }\n\n.fa-pinterest:before {\n  content: \"\\F0D2\"; }\n\n.fa-pinterest-square:before {\n  content: \"\\F0D3\"; }\n\n.fa-google-plus-square:before {\n  content: \"\\F0D4\"; }\n\n.fa-google-plus:before {\n  content: \"\\F0D5\"; }\n\n.fa-money:before {\n  content: \"\\F0D6\"; }\n\n.fa-caret-down:before {\n  content: \"\\F0D7\"; }\n\n.fa-caret-up:before {\n  content: \"\\F0D8\"; }\n\n.fa-caret-left:before {\n  content: \"\\F0D9\"; }\n\n.fa-caret-right:before {\n  content: \"\\F0DA\"; }\n\n.fa-columns:before {\n  content: \"\\F0DB\"; }\n\n.fa-unsorted:before,\n.fa-sort:before {\n  content: \"\\F0DC\"; }\n\n.fa-sort-down:before,\n.fa-sort-desc:before {\n  content: \"\\F0DD\"; }\n\n.fa-sort-up:before,\n.fa-sort-asc:before {\n  content: \"\\F0DE\"; }\n\n.fa-envelope:before {\n  content: \"\\F0E0\"; }\n\n.fa-linkedin:before {\n  content: \"\\F0E1\"; }\n\n.fa-rotate-left:before,\n.fa-undo:before {\n  content: \"\\F0E2\"; }\n\n.fa-legal:before,\n.fa-gavel:before {\n  content: \"\\F0E3\"; }\n\n.fa-dashboard:before,\n.fa-tachometer:before {\n  content: \"\\F0E4\"; }\n\n.fa-comment-o:before {\n  content: \"\\F0E5\"; }\n\n.fa-comments-o:before {\n  content: \"\\F0E6\"; }\n\n.fa-flash:before,\n.fa-bolt:before {\n  content: \"\\F0E7\"; }\n\n.fa-sitemap:before {\n  content: \"\\F0E8\"; }\n\n.fa-umbrella:before {\n  content: \"\\F0E9\"; }\n\n.fa-paste:before,\n.fa-clipboard:before {\n  content: \"\\F0EA\"; }\n\n.fa-lightbulb-o:before {\n  content: \"\\F0EB\"; }\n\n.fa-exchange:before {\n  content: \"\\F0EC\"; }\n\n.fa-cloud-download:before {\n  content: \"\\F0ED\"; }\n\n.fa-cloud-upload:before {\n  content: \"\\F0EE\"; }\n\n.fa-user-md:before {\n  content: \"\\F0F0\"; }\n\n.fa-stethoscope:before {\n  content: \"\\F0F1\"; }\n\n.fa-suitcase:before {\n  content: \"\\F0F2\"; }\n\n.fa-bell-o:before {\n  content: \"\\F0A2\"; }\n\n.fa-coffee:before {\n  content: \"\\F0F4\"; }\n\n.fa-cutlery:before {\n  content: \"\\F0F5\"; }\n\n.fa-file-text-o:before {\n  content: \"\\F0F6\"; }\n\n.fa-building-o:before {\n  content: \"\\F0F7\"; }\n\n.fa-hospital-o:before {\n  content: \"\\F0F8\"; }\n\n.fa-ambulance:before {\n  content: \"\\F0F9\"; }\n\n.fa-medkit:before {\n  content: \"\\F0FA\"; }\n\n.fa-fighter-jet:before {\n  content: \"\\F0FB\"; }\n\n.fa-beer:before {\n  content: \"\\F0FC\"; }\n\n.fa-h-square:before {\n  content: \"\\F0FD\"; }\n\n.fa-plus-square:before {\n  content: \"\\F0FE\"; }\n\n.fa-angle-double-left:before {\n  content: \"\\F100\"; }\n\n.fa-angle-double-right:before {\n  content: \"\\F101\"; }\n\n.fa-angle-double-up:before {\n  content: \"\\F102\"; }\n\n.fa-angle-double-down:before {\n  content: \"\\F103\"; }\n\n.fa-angle-left:before {\n  content: \"\\F104\"; }\n\n.fa-angle-right:before {\n  content: \"\\F105\"; }\n\n.fa-angle-up:before {\n  content: \"\\F106\"; }\n\n.fa-angle-down:before {\n  content: \"\\F107\"; }\n\n.fa-desktop:before {\n  content: \"\\F108\"; }\n\n.fa-laptop:before {\n  content: \"\\F109\"; }\n\n.fa-tablet:before {\n  content: \"\\F10A\"; }\n\n.fa-mobile-phone:before,\n.fa-mobile:before {\n  content: \"\\F10B\"; }\n\n.fa-circle-o:before {\n  content: \"\\F10C\"; }\n\n.fa-quote-left:before {\n  content: \"\\F10D\"; }\n\n.fa-quote-right:before {\n  content: \"\\F10E\"; }\n\n.fa-spinner:before {\n  content: \"\\F110\"; }\n\n.fa-circle:before {\n  content: \"\\F111\"; }\n\n.fa-mail-reply:before,\n.fa-reply:before {\n  content: \"\\F112\"; }\n\n.fa-github-alt:before {\n  content: \"\\F113\"; }\n\n.fa-folder-o:before {\n  content: \"\\F114\"; }\n\n.fa-folder-open-o:before {\n  content: \"\\F115\"; }\n\n.fa-smile-o:before {\n  content: \"\\F118\"; }\n\n.fa-frown-o:before {\n  content: \"\\F119\"; }\n\n.fa-meh-o:before {\n  content: \"\\F11A\"; }\n\n.fa-gamepad:before {\n  content: \"\\F11B\"; }\n\n.fa-keyboard-o:before {\n  content: \"\\F11C\"; }\n\n.fa-flag-o:before {\n  content: \"\\F11D\"; }\n\n.fa-flag-checkered:before {\n  content: \"\\F11E\"; }\n\n.fa-terminal:before {\n  content: \"\\F120\"; }\n\n.fa-code:before {\n  content: \"\\F121\"; }\n\n.fa-mail-reply-all:before,\n.fa-reply-all:before {\n  content: \"\\F122\"; }\n\n.fa-star-half-empty:before,\n.fa-star-half-full:before,\n.fa-star-half-o:before {\n  content: \"\\F123\"; }\n\n.fa-location-arrow:before {\n  content: \"\\F124\"; }\n\n.fa-crop:before {\n  content: \"\\F125\"; }\n\n.fa-code-fork:before {\n  content: \"\\F126\"; }\n\n.fa-unlink:before,\n.fa-chain-broken:before {\n  content: \"\\F127\"; }\n\n.fa-question:before {\n  content: \"\\F128\"; }\n\n.fa-info:before {\n  content: \"\\F129\"; }\n\n.fa-exclamation:before {\n  content: \"\\F12A\"; }\n\n.fa-superscript:before {\n  content: \"\\F12B\"; }\n\n.fa-subscript:before {\n  content: \"\\F12C\"; }\n\n.fa-eraser:before {\n  content: \"\\F12D\"; }\n\n.fa-puzzle-piece:before {\n  content: \"\\F12E\"; }\n\n.fa-microphone:before {\n  content: \"\\F130\"; }\n\n.fa-microphone-slash:before {\n  content: \"\\F131\"; }\n\n.fa-shield:before {\n  content: \"\\F132\"; }\n\n.fa-calendar-o:before {\n  content: \"\\F133\"; }\n\n.fa-fire-extinguisher:before {\n  content: \"\\F134\"; }\n\n.fa-rocket:before {\n  content: \"\\F135\"; }\n\n.fa-maxcdn:before {\n  content: \"\\F136\"; }\n\n.fa-chevron-circle-left:before {\n  content: \"\\F137\"; }\n\n.fa-chevron-circle-right:before {\n  content: \"\\F138\"; }\n\n.fa-chevron-circle-up:before {\n  content: \"\\F139\"; }\n\n.fa-chevron-circle-down:before {\n  content: \"\\F13A\"; }\n\n.fa-html5:before {\n  content: \"\\F13B\"; }\n\n.fa-css3:before {\n  content: \"\\F13C\"; }\n\n.fa-anchor:before {\n  content: \"\\F13D\"; }\n\n.fa-unlock-alt:before {\n  content: \"\\F13E\"; }\n\n.fa-bullseye:before {\n  content: \"\\F140\"; }\n\n.fa-ellipsis-h:before {\n  content: \"\\F141\"; }\n\n.fa-ellipsis-v:before {\n  content: \"\\F142\"; }\n\n.fa-rss-square:before {\n  content: \"\\F143\"; }\n\n.fa-play-circle:before {\n  content: \"\\F144\"; }\n\n.fa-ticket:before {\n  content: \"\\F145\"; }\n\n.fa-minus-square:before {\n  content: \"\\F146\"; }\n\n.fa-minus-square-o:before {\n  content: \"\\F147\"; }\n\n.fa-level-up:before {\n  content: \"\\F148\"; }\n\n.fa-level-down:before {\n  content: \"\\F149\"; }\n\n.fa-check-square:before {\n  content: \"\\F14A\"; }\n\n.fa-pencil-square:before {\n  content: \"\\F14B\"; }\n\n.fa-external-link-square:before {\n  content: \"\\F14C\"; }\n\n.fa-share-square:before {\n  content: \"\\F14D\"; }\n\n.fa-compass:before {\n  content: \"\\F14E\"; }\n\n.fa-toggle-down:before,\n.fa-caret-square-o-down:before {\n  content: \"\\F150\"; }\n\n.fa-toggle-up:before,\n.fa-caret-square-o-up:before {\n  content: \"\\F151\"; }\n\n.fa-toggle-right:before,\n.fa-caret-square-o-right:before {\n  content: \"\\F152\"; }\n\n.fa-euro:before,\n.fa-eur:before {\n  content: \"\\F153\"; }\n\n.fa-gbp:before {\n  content: \"\\F154\"; }\n\n.fa-dollar:before,\n.fa-usd:before {\n  content: \"\\F155\"; }\n\n.fa-rupee:before,\n.fa-inr:before {\n  content: \"\\F156\"; }\n\n.fa-cny:before,\n.fa-rmb:before,\n.fa-yen:before,\n.fa-jpy:before {\n  content: \"\\F157\"; }\n\n.fa-ruble:before,\n.fa-rouble:before,\n.fa-rub:before {\n  content: \"\\F158\"; }\n\n.fa-won:before,\n.fa-krw:before {\n  content: \"\\F159\"; }\n\n.fa-bitcoin:before,\n.fa-btc:before {\n  content: \"\\F15A\"; }\n\n.fa-file:before {\n  content: \"\\F15B\"; }\n\n.fa-file-text:before {\n  content: \"\\F15C\"; }\n\n.fa-sort-alpha-asc:before {\n  content: \"\\F15D\"; }\n\n.fa-sort-alpha-desc:before {\n  content: \"\\F15E\"; }\n\n.fa-sort-amount-asc:before {\n  content: \"\\F160\"; }\n\n.fa-sort-amount-desc:before {\n  content: \"\\F161\"; }\n\n.fa-sort-numeric-asc:before {\n  content: \"\\F162\"; }\n\n.fa-sort-numeric-desc:before {\n  content: \"\\F163\"; }\n\n.fa-thumbs-up:before {\n  content: \"\\F164\"; }\n\n.fa-thumbs-down:before {\n  content: \"\\F165\"; }\n\n.fa-youtube-square:before {\n  content: \"\\F166\"; }\n\n.fa-youtube:before {\n  content: \"\\F167\"; }\n\n.fa-xing:before {\n  content: \"\\F168\"; }\n\n.fa-xing-square:before {\n  content: \"\\F169\"; }\n\n.fa-youtube-play:before {\n  content: \"\\F16A\"; }\n\n.fa-dropbox:before {\n  content: \"\\F16B\"; }\n\n.fa-stack-overflow:before {\n  content: \"\\F16C\"; }\n\n.fa-instagram:before {\n  content: \"\\F16D\"; }\n\n.fa-flickr:before {\n  content: \"\\F16E\"; }\n\n.fa-adn:before {\n  content: \"\\F170\"; }\n\n.fa-bitbucket:before {\n  content: \"\\F171\"; }\n\n.fa-bitbucket-square:before {\n  content: \"\\F172\"; }\n\n.fa-tumblr:before {\n  content: \"\\F173\"; }\n\n.fa-tumblr-square:before {\n  content: \"\\F174\"; }\n\n.fa-long-arrow-down:before {\n  content: \"\\F175\"; }\n\n.fa-long-arrow-up:before {\n  content: \"\\F176\"; }\n\n.fa-long-arrow-left:before {\n  content: \"\\F177\"; }\n\n.fa-long-arrow-right:before {\n  content: \"\\F178\"; }\n\n.fa-apple:before {\n  content: \"\\F179\"; }\n\n.fa-windows:before {\n  content: \"\\F17A\"; }\n\n.fa-android:before {\n  content: \"\\F17B\"; }\n\n.fa-linux:before {\n  content: \"\\F17C\"; }\n\n.fa-dribbble:before {\n  content: \"\\F17D\"; }\n\n.fa-skype:before {\n  content: \"\\F17E\"; }\n\n.fa-foursquare:before {\n  content: \"\\F180\"; }\n\n.fa-trello:before {\n  content: \"\\F181\"; }\n\n.fa-female:before {\n  content: \"\\F182\"; }\n\n.fa-male:before {\n  content: \"\\F183\"; }\n\n.fa-gittip:before,\n.fa-gratipay:before {\n  content: \"\\F184\"; }\n\n.fa-sun-o:before {\n  content: \"\\F185\"; }\n\n.fa-moon-o:before {\n  content: \"\\F186\"; }\n\n.fa-archive:before {\n  content: \"\\F187\"; }\n\n.fa-bug:before {\n  content: \"\\F188\"; }\n\n.fa-vk:before {\n  content: \"\\F189\"; }\n\n.fa-weibo:before {\n  content: \"\\F18A\"; }\n\n.fa-renren:before {\n  content: \"\\F18B\"; }\n\n.fa-pagelines:before {\n  content: \"\\F18C\"; }\n\n.fa-stack-exchange:before {\n  content: \"\\F18D\"; }\n\n.fa-arrow-circle-o-right:before {\n  content: \"\\F18E\"; }\n\n.fa-arrow-circle-o-left:before {\n  content: \"\\F190\"; }\n\n.fa-toggle-left:before,\n.fa-caret-square-o-left:before {\n  content: \"\\F191\"; }\n\n.fa-dot-circle-o:before {\n  content: \"\\F192\"; }\n\n.fa-wheelchair:before {\n  content: \"\\F193\"; }\n\n.fa-vimeo-square:before {\n  content: \"\\F194\"; }\n\n.fa-turkish-lira:before,\n.fa-try:before {\n  content: \"\\F195\"; }\n\n.fa-plus-square-o:before {\n  content: \"\\F196\"; }\n\n.fa-space-shuttle:before {\n  content: \"\\F197\"; }\n\n.fa-slack:before {\n  content: \"\\F198\"; }\n\n.fa-envelope-square:before {\n  content: \"\\F199\"; }\n\n.fa-wordpress:before {\n  content: \"\\F19A\"; }\n\n.fa-openid:before {\n  content: \"\\F19B\"; }\n\n.fa-institution:before,\n.fa-bank:before,\n.fa-university:before {\n  content: \"\\F19C\"; }\n\n.fa-mortar-board:before,\n.fa-graduation-cap:before {\n  content: \"\\F19D\"; }\n\n.fa-yahoo:before {\n  content: \"\\F19E\"; }\n\n.fa-google:before {\n  content: \"\\F1A0\"; }\n\n.fa-reddit:before {\n  content: \"\\F1A1\"; }\n\n.fa-reddit-square:before {\n  content: \"\\F1A2\"; }\n\n.fa-stumbleupon-circle:before {\n  content: \"\\F1A3\"; }\n\n.fa-stumbleupon:before {\n  content: \"\\F1A4\"; }\n\n.fa-delicious:before {\n  content: \"\\F1A5\"; }\n\n.fa-digg:before {\n  content: \"\\F1A6\"; }\n\n.fa-pied-piper:before {\n  content: \"\\F1A7\"; }\n\n.fa-pied-piper-alt:before {\n  content: \"\\F1A8\"; }\n\n.fa-drupal:before {\n  content: \"\\F1A9\"; }\n\n.fa-joomla:before {\n  content: \"\\F1AA\"; }\n\n.fa-language:before {\n  content: \"\\F1AB\"; }\n\n.fa-fax:before {\n  content: \"\\F1AC\"; }\n\n.fa-building:before {\n  content: \"\\F1AD\"; }\n\n.fa-child:before {\n  content: \"\\F1AE\"; }\n\n.fa-paw:before {\n  content: \"\\F1B0\"; }\n\n.fa-spoon:before {\n  content: \"\\F1B1\"; }\n\n.fa-cube:before {\n  content: \"\\F1B2\"; }\n\n.fa-cubes:before {\n  content: \"\\F1B3\"; }\n\n.fa-behance:before {\n  content: \"\\F1B4\"; }\n\n.fa-behance-square:before {\n  content: \"\\F1B5\"; }\n\n.fa-steam:before {\n  content: \"\\F1B6\"; }\n\n.fa-steam-square:before {\n  content: \"\\F1B7\"; }\n\n.fa-recycle:before {\n  content: \"\\F1B8\"; }\n\n.fa-automobile:before,\n.fa-car:before {\n  content: \"\\F1B9\"; }\n\n.fa-cab:before,\n.fa-taxi:before {\n  content: \"\\F1BA\"; }\n\n.fa-tree:before {\n  content: \"\\F1BB\"; }\n\n.fa-spotify:before {\n  content: \"\\F1BC\"; }\n\n.fa-deviantart:before {\n  content: \"\\F1BD\"; }\n\n.fa-soundcloud:before {\n  content: \"\\F1BE\"; }\n\n.fa-database:before {\n  content: \"\\F1C0\"; }\n\n.fa-file-pdf-o:before {\n  content: \"\\F1C1\"; }\n\n.fa-file-word-o:before {\n  content: \"\\F1C2\"; }\n\n.fa-file-excel-o:before {\n  content: \"\\F1C3\"; }\n\n.fa-file-powerpoint-o:before {\n  content: \"\\F1C4\"; }\n\n.fa-file-photo-o:before,\n.fa-file-picture-o:before,\n.fa-file-image-o:before {\n  content: \"\\F1C5\"; }\n\n.fa-file-zip-o:before,\n.fa-file-archive-o:before {\n  content: \"\\F1C6\"; }\n\n.fa-file-sound-o:before,\n.fa-file-audio-o:before {\n  content: \"\\F1C7\"; }\n\n.fa-file-movie-o:before,\n.fa-file-video-o:before {\n  content: \"\\F1C8\"; }\n\n.fa-file-code-o:before {\n  content: \"\\F1C9\"; }\n\n.fa-vine:before {\n  content: \"\\F1CA\"; }\n\n.fa-codepen:before {\n  content: \"\\F1CB\"; }\n\n.fa-jsfiddle:before {\n  content: \"\\F1CC\"; }\n\n.fa-life-bouy:before,\n.fa-life-buoy:before,\n.fa-life-saver:before,\n.fa-support:before,\n.fa-life-ring:before {\n  content: \"\\F1CD\"; }\n\n.fa-circle-o-notch:before {\n  content: \"\\F1CE\"; }\n\n.fa-ra:before,\n.fa-rebel:before {\n  content: \"\\F1D0\"; }\n\n.fa-ge:before,\n.fa-empire:before {\n  content: \"\\F1D1\"; }\n\n.fa-git-square:before {\n  content: \"\\F1D2\"; }\n\n.fa-git:before {\n  content: \"\\F1D3\"; }\n\n.fa-y-combinator-square:before,\n.fa-yc-square:before,\n.fa-hacker-news:before {\n  content: \"\\F1D4\"; }\n\n.fa-tencent-weibo:before {\n  content: \"\\F1D5\"; }\n\n.fa-qq:before {\n  content: \"\\F1D6\"; }\n\n.fa-wechat:before,\n.fa-weixin:before {\n  content: \"\\F1D7\"; }\n\n.fa-send:before,\n.fa-paper-plane:before {\n  content: \"\\F1D8\"; }\n\n.fa-send-o:before,\n.fa-paper-plane-o:before {\n  content: \"\\F1D9\"; }\n\n.fa-history:before {\n  content: \"\\F1DA\"; }\n\n.fa-circle-thin:before {\n  content: \"\\F1DB\"; }\n\n.fa-header:before {\n  content: \"\\F1DC\"; }\n\n.fa-paragraph:before {\n  content: \"\\F1DD\"; }\n\n.fa-sliders:before {\n  content: \"\\F1DE\"; }\n\n.fa-share-alt:before {\n  content: \"\\F1E0\"; }\n\n.fa-share-alt-square:before {\n  content: \"\\F1E1\"; }\n\n.fa-bomb:before {\n  content: \"\\F1E2\"; }\n\n.fa-soccer-ball-o:before,\n.fa-futbol-o:before {\n  content: \"\\F1E3\"; }\n\n.fa-tty:before {\n  content: \"\\F1E4\"; }\n\n.fa-binoculars:before {\n  content: \"\\F1E5\"; }\n\n.fa-plug:before {\n  content: \"\\F1E6\"; }\n\n.fa-slideshare:before {\n  content: \"\\F1E7\"; }\n\n.fa-twitch:before {\n  content: \"\\F1E8\"; }\n\n.fa-yelp:before {\n  content: \"\\F1E9\"; }\n\n.fa-newspaper-o:before {\n  content: \"\\F1EA\"; }\n\n.fa-wifi:before {\n  content: \"\\F1EB\"; }\n\n.fa-calculator:before {\n  content: \"\\F1EC\"; }\n\n.fa-paypal:before {\n  content: \"\\F1ED\"; }\n\n.fa-google-wallet:before {\n  content: \"\\F1EE\"; }\n\n.fa-cc-visa:before {\n  content: \"\\F1F0\"; }\n\n.fa-cc-mastercard:before {\n  content: \"\\F1F1\"; }\n\n.fa-cc-discover:before {\n  content: \"\\F1F2\"; }\n\n.fa-cc-amex:before {\n  content: \"\\F1F3\"; }\n\n.fa-cc-paypal:before {\n  content: \"\\F1F4\"; }\n\n.fa-cc-stripe:before {\n  content: \"\\F1F5\"; }\n\n.fa-bell-slash:before {\n  content: \"\\F1F6\"; }\n\n.fa-bell-slash-o:before {\n  content: \"\\F1F7\"; }\n\n.fa-trash:before {\n  content: \"\\F1F8\"; }\n\n.fa-copyright:before {\n  content: \"\\F1F9\"; }\n\n.fa-at:before {\n  content: \"\\F1FA\"; }\n\n.fa-eyedropper:before {\n  content: \"\\F1FB\"; }\n\n.fa-paint-brush:before {\n  content: \"\\F1FC\"; }\n\n.fa-birthday-cake:before {\n  content: \"\\F1FD\"; }\n\n.fa-area-chart:before {\n  content: \"\\F1FE\"; }\n\n.fa-pie-chart:before {\n  content: \"\\F200\"; }\n\n.fa-line-chart:before {\n  content: \"\\F201\"; }\n\n.fa-lastfm:before {\n  content: \"\\F202\"; }\n\n.fa-lastfm-square:before {\n  content: \"\\F203\"; }\n\n.fa-toggle-off:before {\n  content: \"\\F204\"; }\n\n.fa-toggle-on:before {\n  content: \"\\F205\"; }\n\n.fa-bicycle:before {\n  content: \"\\F206\"; }\n\n.fa-bus:before {\n  content: \"\\F207\"; }\n\n.fa-ioxhost:before {\n  content: \"\\F208\"; }\n\n.fa-angellist:before {\n  content: \"\\F209\"; }\n\n.fa-cc:before {\n  content: \"\\F20A\"; }\n\n.fa-shekel:before,\n.fa-sheqel:before,\n.fa-ils:before {\n  content: \"\\F20B\"; }\n\n.fa-meanpath:before {\n  content: \"\\F20C\"; }\n\n.fa-buysellads:before {\n  content: \"\\F20D\"; }\n\n.fa-connectdevelop:before {\n  content: \"\\F20E\"; }\n\n.fa-dashcube:before {\n  content: \"\\F210\"; }\n\n.fa-forumbee:before {\n  content: \"\\F211\"; }\n\n.fa-leanpub:before {\n  content: \"\\F212\"; }\n\n.fa-sellsy:before {\n  content: \"\\F213\"; }\n\n.fa-shirtsinbulk:before {\n  content: \"\\F214\"; }\n\n.fa-simplybuilt:before {\n  content: \"\\F215\"; }\n\n.fa-skyatlas:before {\n  content: \"\\F216\"; }\n\n.fa-cart-plus:before {\n  content: \"\\F217\"; }\n\n.fa-cart-arrow-down:before {\n  content: \"\\F218\"; }\n\n.fa-diamond:before {\n  content: \"\\F219\"; }\n\n.fa-ship:before {\n  content: \"\\F21A\"; }\n\n.fa-user-secret:before {\n  content: \"\\F21B\"; }\n\n.fa-motorcycle:before {\n  content: \"\\F21C\"; }\n\n.fa-street-view:before {\n  content: \"\\F21D\"; }\n\n.fa-heartbeat:before {\n  content: \"\\F21E\"; }\n\n.fa-venus:before {\n  content: \"\\F221\"; }\n\n.fa-mars:before {\n  content: \"\\F222\"; }\n\n.fa-mercury:before {\n  content: \"\\F223\"; }\n\n.fa-intersex:before,\n.fa-transgender:before {\n  content: \"\\F224\"; }\n\n.fa-transgender-alt:before {\n  content: \"\\F225\"; }\n\n.fa-venus-double:before {\n  content: \"\\F226\"; }\n\n.fa-mars-double:before {\n  content: \"\\F227\"; }\n\n.fa-venus-mars:before {\n  content: \"\\F228\"; }\n\n.fa-mars-stroke:before {\n  content: \"\\F229\"; }\n\n.fa-mars-stroke-v:before {\n  content: \"\\F22A\"; }\n\n.fa-mars-stroke-h:before {\n  content: \"\\F22B\"; }\n\n.fa-neuter:before {\n  content: \"\\F22C\"; }\n\n.fa-genderless:before {\n  content: \"\\F22D\"; }\n\n.fa-facebook-official:before {\n  content: \"\\F230\"; }\n\n.fa-pinterest-p:before {\n  content: \"\\F231\"; }\n\n.fa-whatsapp:before {\n  content: \"\\F232\"; }\n\n.fa-server:before {\n  content: \"\\F233\"; }\n\n.fa-user-plus:before {\n  content: \"\\F234\"; }\n\n.fa-user-times:before {\n  content: \"\\F235\"; }\n\n.fa-hotel:before,\n.fa-bed:before {\n  content: \"\\F236\"; }\n\n.fa-viacoin:before {\n  content: \"\\F237\"; }\n\n.fa-train:before {\n  content: \"\\F238\"; }\n\n.fa-subway:before {\n  content: \"\\F239\"; }\n\n.fa-medium:before {\n  content: \"\\F23A\"; }\n\n.fa-yc:before,\n.fa-y-combinator:before {\n  content: \"\\F23B\"; }\n\n.fa-optin-monster:before {\n  content: \"\\F23C\"; }\n\n.fa-opencart:before {\n  content: \"\\F23D\"; }\n\n.fa-expeditedssl:before {\n  content: \"\\F23E\"; }\n\n.fa-battery-4:before,\n.fa-battery-full:before {\n  content: \"\\F240\"; }\n\n.fa-battery-3:before,\n.fa-battery-three-quarters:before {\n  content: \"\\F241\"; }\n\n.fa-battery-2:before,\n.fa-battery-half:before {\n  content: \"\\F242\"; }\n\n.fa-battery-1:before,\n.fa-battery-quarter:before {\n  content: \"\\F243\"; }\n\n.fa-battery-0:before,\n.fa-battery-empty:before {\n  content: \"\\F244\"; }\n\n.fa-mouse-pointer:before {\n  content: \"\\F245\"; }\n\n.fa-i-cursor:before {\n  content: \"\\F246\"; }\n\n.fa-object-group:before {\n  content: \"\\F247\"; }\n\n.fa-object-ungroup:before {\n  content: \"\\F248\"; }\n\n.fa-sticky-note:before {\n  content: \"\\F249\"; }\n\n.fa-sticky-note-o:before {\n  content: \"\\F24A\"; }\n\n.fa-cc-jcb:before {\n  content: \"\\F24B\"; }\n\n.fa-cc-diners-club:before {\n  content: \"\\F24C\"; }\n\n.fa-clone:before {\n  content: \"\\F24D\"; }\n\n.fa-balance-scale:before {\n  content: \"\\F24E\"; }\n\n.fa-hourglass-o:before {\n  content: \"\\F250\"; }\n\n.fa-hourglass-1:before,\n.fa-hourglass-start:before {\n  content: \"\\F251\"; }\n\n.fa-hourglass-2:before,\n.fa-hourglass-half:before {\n  content: \"\\F252\"; }\n\n.fa-hourglass-3:before,\n.fa-hourglass-end:before {\n  content: \"\\F253\"; }\n\n.fa-hourglass:before {\n  content: \"\\F254\"; }\n\n.fa-hand-grab-o:before,\n.fa-hand-rock-o:before {\n  content: \"\\F255\"; }\n\n.fa-hand-stop-o:before,\n.fa-hand-paper-o:before {\n  content: \"\\F256\"; }\n\n.fa-hand-scissors-o:before {\n  content: \"\\F257\"; }\n\n.fa-hand-lizard-o:before {\n  content: \"\\F258\"; }\n\n.fa-hand-spock-o:before {\n  content: \"\\F259\"; }\n\n.fa-hand-pointer-o:before {\n  content: \"\\F25A\"; }\n\n.fa-hand-peace-o:before {\n  content: \"\\F25B\"; }\n\n.fa-trademark:before {\n  content: \"\\F25C\"; }\n\n.fa-registered:before {\n  content: \"\\F25D\"; }\n\n.fa-creative-commons:before {\n  content: \"\\F25E\"; }\n\n.fa-gg:before {\n  content: \"\\F260\"; }\n\n.fa-gg-circle:before {\n  content: \"\\F261\"; }\n\n.fa-tripadvisor:before {\n  content: \"\\F262\"; }\n\n.fa-odnoklassniki:before {\n  content: \"\\F263\"; }\n\n.fa-odnoklassniki-square:before {\n  content: \"\\F264\"; }\n\n.fa-get-pocket:before {\n  content: \"\\F265\"; }\n\n.fa-wikipedia-w:before {\n  content: \"\\F266\"; }\n\n.fa-safari:before {\n  content: \"\\F267\"; }\n\n.fa-chrome:before {\n  content: \"\\F268\"; }\n\n.fa-firefox:before {\n  content: \"\\F269\"; }\n\n.fa-opera:before {\n  content: \"\\F26A\"; }\n\n.fa-internet-explorer:before {\n  content: \"\\F26B\"; }\n\n.fa-tv:before,\n.fa-television:before {\n  content: \"\\F26C\"; }\n\n.fa-contao:before {\n  content: \"\\F26D\"; }\n\n.fa-500px:before {\n  content: \"\\F26E\"; }\n\n.fa-amazon:before {\n  content: \"\\F270\"; }\n\n.fa-calendar-plus-o:before {\n  content: \"\\F271\"; }\n\n.fa-calendar-minus-o:before {\n  content: \"\\F272\"; }\n\n.fa-calendar-times-o:before {\n  content: \"\\F273\"; }\n\n.fa-calendar-check-o:before {\n  content: \"\\F274\"; }\n\n.fa-industry:before {\n  content: \"\\F275\"; }\n\n.fa-map-pin:before {\n  content: \"\\F276\"; }\n\n.fa-map-signs:before {\n  content: \"\\F277\"; }\n\n.fa-map-o:before {\n  content: \"\\F278\"; }\n\n.fa-map:before {\n  content: \"\\F279\"; }\n\n.fa-commenting:before {\n  content: \"\\F27A\"; }\n\n.fa-commenting-o:before {\n  content: \"\\F27B\"; }\n\n.fa-houzz:before {\n  content: \"\\F27C\"; }\n\n.fa-vimeo:before {\n  content: \"\\F27D\"; }\n\n.fa-black-tie:before {\n  content: \"\\F27E\"; }\n\n.fa-fonticons:before {\n  content: \"\\F280\"; }\n\n.fa-reddit-alien:before {\n  content: \"\\F281\"; }\n\n.fa-edge:before {\n  content: \"\\F282\"; }\n\n.fa-credit-card-alt:before {\n  content: \"\\F283\"; }\n\n.fa-codiepie:before {\n  content: \"\\F284\"; }\n\n.fa-modx:before {\n  content: \"\\F285\"; }\n\n.fa-fort-awesome:before {\n  content: \"\\F286\"; }\n\n.fa-usb:before {\n  content: \"\\F287\"; }\n\n.fa-product-hunt:before {\n  content: \"\\F288\"; }\n\n.fa-mixcloud:before {\n  content: \"\\F289\"; }\n\n.fa-scribd:before {\n  content: \"\\F28A\"; }\n\n.fa-pause-circle:before {\n  content: \"\\F28B\"; }\n\n.fa-pause-circle-o:before {\n  content: \"\\F28C\"; }\n\n.fa-stop-circle:before {\n  content: \"\\F28D\"; }\n\n.fa-stop-circle-o:before {\n  content: \"\\F28E\"; }\n\n.fa-shopping-bag:before {\n  content: \"\\F290\"; }\n\n.fa-shopping-basket:before {\n  content: \"\\F291\"; }\n\n.fa-hashtag:before {\n  content: \"\\F292\"; }\n\n.fa-bluetooth:before {\n  content: \"\\F293\"; }\n\n.fa-bluetooth-b:before {\n  content: \"\\F294\"; }\n\n.fa-percent:before {\n  content: \"\\F295\"; }\n", ""]);

	// exports


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "32400f4e08932a94d8bfd2422702c446.eot";

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "32400f4e08932a94d8bfd2422702c446.eot";

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "db812d8a70a4e88e888744c1c9a27e89.woff2";

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "a35720c2fed2c7f043bc7e4ffb45e073.woff";

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "a3de2170e4e9df77161ea5d3f31b2668.ttf";

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "f775f9cca88e21d45bebe185b27c0e5b.svg";

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = {
		"name": "ciste-web-content",
		"version": "0.0.1",
		"description": "",
		"main": "src/index.js",
		"scripts": {
			"test": "echo \"Error: no test specified\" && exit 1",
			"start": "open 'http://localhost:8080/webpack-dev-server/'; npm run watch",
			"watch": "webpack-dev-server --progress --colors",
			"build": "webpack --progress --colors"
		},
		"keywords": [],
		"author": "SASAKI, Shunsuke",
		"license": "Apache-2.0",
		"dependencies": {
			"rx": "^4.0.7",
			"webrx": "^1.4.4"
		},
		"devDependencies": {
			"clean-webpack-plugin": "^0.1.8",
			"copy-webpack-plugin": "^1.1.1",
			"css-loader": "^0.23.1",
			"file-loader": "^0.8.5",
			"html-loader": "^0.4.0",
			"json-loader": "^0.5.4",
			"node-sass": "^3.4.2",
			"sass-loader": "^3.1.2",
			"style-loader": "^0.13.0",
			"url-loader": "^0.5.7",
			"webpack": "^1.12.12",
			"webpack-dev-server": "^1.14.1"
		}
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict"

	Rx = __webpack_require__(1)
	wx = __webpack_require__(4)

	class NaviViewModel {
		constructor(params) {
			console.dir(params)
		}
	}

	module.exports = NaviViewModel


/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = "<div><i class=\"fa fa-fw fa-question\"></i>ほげ</div>\n";

/***/ }
/******/ ]);