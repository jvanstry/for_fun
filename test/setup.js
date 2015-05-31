process.env.NODE_ENV = 'test';

var chai = require('chai');

global.expect = chai.expect;

global.triggerEvent = function triggerEvent(target, eventName){
  var event = document.createEvent('Event');
  event.initEvent(eventName, true, true);
  target.dispatchEvent(event);
}

before(function(done){
  global.targets = document.getElementsByClassName("target");
  // target 1 is in top left; target 3 bottom middle
  global.target1 = document.getElementById("target1");
  global.target1Rect = target1.getBoundingClientRect();
  global.target3 = document.getElementById("target3");
  global.target3Rect = target3.getBoundingClientRect();

  triggerEvent(target3, 'mouseover');

  global.tooltip = document.getElementsByClassName("tooltip")[1];
  global.tooltipRect = tooltip.getBoundingClientRect();

  done();
});

var stringify = JSON.stringify;

before(function() {
  JSON.stringify = function(obj) {
    var seen = [];

    return stringify(obj, function(key, val) {
     if (typeof val === "object") {
        if (seen.indexOf(val) >= 0) { return; }
        seen.push(val);
      }
      return val;
    });
  };
});

after(function() {
    JSON.stringify = stringify;
});