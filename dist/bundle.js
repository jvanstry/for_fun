(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
var Tooltip = require("./javascripts/tooltip.js");
var eventWatcher = require("./javascripts/eventwatcher.js");
var MouseEventList = require("./javascripts/mouse-event-list.js");
var mouseEventList = new MouseEventList();

targets = document.getElementsByClassName("target");

process.nextTick(function(){
  eventWatcher.addListeners(targets);

  eventWatcher.once("mouseover", function(){
    var initNode = document.getElementById("init-tooltip");

    if(initNode.remove){
      initNode.remove();
    }
  });

  eventWatcher.on("mouseover", function(time, data, target){
    var tooltip = new Tooltip(target, time, data, this);

    mouseEventList.addTooltip(tooltip);

    this.currentTooltip = tooltip;
    this.mouseHovering = true;
  });

  eventWatcher.on("mouseout", function(timeOut){
    this.mouseHovering = false;
    Tooltip.prototype.addTimeOfMouseOut.call(this.currentTooltip, timeOut);

    mouseEventList.display();
  });

  eventWatcher.on("display-starting", function(){
    this.displayInProgress = true;
  });

  eventWatcher.on("display-ending", function(){
    this.displayInProgress = false;

    if (this.mouseHovering) {
      this.currentTooltip.display();
    }
  }); 
});
}).call(this,require('_process'))
},{"./javascripts/eventwatcher.js":5,"./javascripts/mouse-event-list.js":6,"./javascripts/tooltip.js":7,"_process":3}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){
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
            currentQueue[queueIndex].run();
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

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
exports.createTextNode = function(innerText){
  var textNode = document.createTextNode(innerText);

  return textNode;
}

exports.createSpanNode = function(className, innerText){
  var span = document.createElement("span");
  span.className = className;
  span.innerText = innerText;

  return span;
}

exports.createDivNode = function(className, innerText){
  var div= document.createElement("div");
  div.className = className;

  if(innerText){
    div.innerText = innerText;
  }

  return div;
}



},{}],5:[function(require,module,exports){
var Tooltip = require('./tooltip.js');
var EventEmitter = require('events').EventEmitter;

exports.displayInProgress = false;
exports.mouseHovering = false;

exports.mouseOver = function(e){
  var data = e.target.getAttribute('data-info');
  var target = e.target.getAttribute("Id");

  exports.emit("mouseover", Date.now(), data, target);

  e.target.addEventListener("mouseout", exports.mouseOut, false)
}

exports.mouseOut = function(e){
  e.target.removeEventListener(e.type, arguments.callee);
  exports.emit("mouseout", Date.now());
}

exports.addListeners = function(targets){
  for(var i = 0; i < targets.length; i++) {
    targets[i].addEventListener("mouseover", exports.mouseOver, false);
  }
}

function emitter(obj) {
  // mixin EventEmitter prototype into exports obj
  for (var prop in EventEmitter.prototype) {
      Object.defineProperty(obj, prop, {
          configurable: true,
          writable: true,
          value: EventEmitter.prototype[prop]
      });
  }

  ["domain", "_events", "_maxListeners"].forEach(function(prop) {
      Object.defineProperty(obj, prop, {
          configurable: true,
          writable: true,
          value: undefined
      });
  });

  EventEmitter.call(obj);

  return obj;
}

emitter(exports);
},{"./tooltip.js":7,"events":2}],6:[function(require,module,exports){
function MouseEventList(){
  this.tooltips = []; 
}

MouseEventList.prototype.addTooltip = function(tooltip){
  this.tooltips.push(tooltip);
}

MouseEventList.prototype.order = function(){
  this.tooltips.sort(function(first, second){
    if(first.timeHovered > second.timeHovered) {
      return -1;
    }else if (second.timeHovered > first.timeHovered) {
      return 1;
    }
    return 0;
  });
}

MouseEventList.prototype.display = function(){
  this.removeOldListItems();

  this.order();

  this.tooltips.forEach(function(tooltip){
    var appendPoint = document.getElementById("event-list");
    var listNode = tooltip.toListNode();

    appendPoint.appendChild(listNode);
  });
}

MouseEventList.prototype.removeOldListItems = function(){
  var listItems = document.getElementsByClassName("list-item");
  var listItemsLength = listItems.length;

  for(var i = listItemsLength; i > 0; i--){
    listItems[i - 1].remove();
  }
}

module.exports = MouseEventList;
},{}],7:[function(require,module,exports){
var domNodeBuilder = require('./dom-node-builder.js');

function Tooltip(target, timeShown, data, eventWatcher) {
  this.target = target;
  this.timeShown = timeShown;
  this.data = data;
  this.className = "tooltip";
  this.blue;
  this.timeHovered;
  this.eventWatcher = eventWatcher;

  if (!this.eventWatcher.displayInProgress) {
    this.display();
  }
};

Tooltip.prototype.display = function(){
  this.eventWatcher.emit('display-starting');

  var node = this.toPopupNode();

  var appendPoint = document.getElementById(this.target);
  var rect = appendPoint.getBoundingClientRect();

  node.style.height = '20px';
  node.style.width = '210px';
  node.style.position = 'absolute';

  if (rect.left < 50){
    node.style.left = rect.left +'px';
  }else{
    var middle = (rect.right + rect.left) / 2;
    node.style.left = (middle - 105) + 'px';
  }

  if (rect.top > 25){
    node.style.top = (rect.top - 40) + 'px';
  }else{
    node.style.top = (rect.bottom + 5) + 'px';
  }

  document.body.appendChild(node);

  var self = this;
  setTimeout(function(){
    self.removeDisplay();
  }, 500);
}

Tooltip.prototype.removeDisplay = function(){
  var tooltip = document.getElementsByClassName(this.className)[0];

  if(tooltip.remove)
    tooltip.remove();

  this.eventWatcher.emit('display-ending');
}

Tooltip.prototype.addTimeOfMouseOut = function(timeOut){
  this.timeHovered = timeOut - this.timeShown;
  this.blue = this.timeHovered > 1200;
}

Tooltip.prototype.toPopupNode = function(){
  var tooltipNode = domNodeBuilder.createDivNode(this.className, this.data);

  return tooltipNode;
}

Tooltip.prototype.toListNode = function(){
  var tooltipNode = domNodeBuilder.createDivNode("list-item");

  var timeSpan = domNodeBuilder.createSpanNode("blue" + this.blue, this.timeHovered);
  if(this.blue) {
    timeSpan.style.color = 'blue';
  }


  var textNode = domNodeBuilder.createTextNode("ms, ");

  var targetSpan = domNodeBuilder.createSpanNode("event-display", this.target);
  targetSpan.style.fontWeight = 'bold';

  var textNode2 = domNodeBuilder.createTextNode(", " + this.data);

  tooltipNode.appendChild(timeSpan)
  tooltipNode.appendChild(textNode)
  tooltipNode.appendChild(targetSpan)
  tooltipNode.appendChild(textNode2);

  return tooltipNode;
}

module.exports = Tooltip;


},{"./dom-node-builder.js":4}]},{},[1]);
