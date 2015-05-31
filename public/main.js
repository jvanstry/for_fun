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