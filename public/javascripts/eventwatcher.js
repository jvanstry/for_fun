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