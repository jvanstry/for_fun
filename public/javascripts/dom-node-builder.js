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


