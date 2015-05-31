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

