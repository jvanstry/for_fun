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

    console.log(listNode, "LIST NODE");

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