(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var library = require("./javascripts/application.js");
var domready = require("domready");

domready(function () {
    exports.hi = "poop";
});
},{"./javascripts/application.js":3,"domready":2}],2:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }

});

},{}],3:[function(require,module,exports){
// $(document).ready(function(){
//   partOne();


// })
var domready = require("domready");

domready(function () {
  exports.hi = "Hello, World";
});


// function partOne() {
//   $('.target').mouseover(function(e){
//     var $elementMousedOver = $(this);
//     var info = $elementMousedOver.data('info');

//     var $tooltip = $($('.tooltip')[0]);
//     $tooltip.text(info);

//     var position = $elementMousedOver.position();

//     $tooltip.css({
//       position:  'absolute',
//       top:       position.top + 2 * $elementMousedOver.height(),
//       left:      position.left
//     });

//     $elementMousedOver.after($tooltip);
//     $tooltip.show();

//     var timeOfInitialDisplay = Date.now();

//     $elementMousedOver.mouseout(function(e2){
//       $tooltip.hide();
//       var timeDisplayed = Date.now() - timeOfInitialDisplay;
//       var targetId = $(this).attr("id");

//       var newItem = new ListItem(targetId, timeDisplayed, info);

//       displayEvents.push(newItem);

//       displayEvents.sort(function(first, second){
//         if(first.timeDisplayed > second.timeDisplayed) {
//           return -1;
//         }else if (second.timeDisplayed > first.timeDisplayed) {
//           return 1;
//         }

//         return 0;
//       });

//       $('.eventStrings').remove();

//       displayEvents.forEach(function(el, i){
//         el.appendToDom();
//       });

//       $('.bluetrue').css('color', 'blue');
//     });
//   });
// };

// function ListItem(target, timeDisplayed, data) {
//   this.target = target;
//   this.timeDisplayed = timeDisplayed;
//   this.data = data;
//   this.blue = timeDisplayed > 1200;

//   this.htmlString = '<p class="eventStrings"><span class="blue' + this.blue + '">' 
//     + this.timeDisplayed + '</span>ms,' + this.target + ' ' + this.data + '</p>';
// };

// ListItem.prototype.toDomElement = function(){
//   return $(this.htmlString);
// }

// ListItem.prototype.appendToDom = function() {
//   var jqueryObj = $(this.htmlString);

//   $('#event-list').appendTo(jqueryObj);
// }

},{"domready":2}]},{},[1]);
