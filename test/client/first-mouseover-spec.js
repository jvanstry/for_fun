require('../setup.js');

function triggerEvent(target, eventName){
  var event = document.createEvent('Event');
  event.initEvent(eventName, true, true);
  target.dispatchEvent(event);
}

var targets, target1, target1Rect, target3, target3Rect;

describe('after first mouseOver', function(){
  var tooltip, tooltipRect;

  before(function(done){
    targets = document.getElementsByClassName("target");
    // target 1 is in top left; target 3 bottom middle
    target1 = document.getElementById("target1");
    target1Rect = target1.getBoundingClientRect();

    target3 = document.getElementById("target3");
    target3Rect = target3.getBoundingClientRect();

    triggerEvent(target3, 'mouseover');

    tooltip = document.getElementsByClassName("tooltip")[1];
    tooltipRect = tooltip.getBoundingClientRect();

    done();
  });

  it('should place a tooltip div just above moused over element', function(done){
    var closenessOnBottomOfTarget = target3Rect.top - tooltipRect.bottom;
    var isJustUnder = closenessOnBottomOfTarget > 0 && closenessOnBottomOfTarget < 20; 

    expect(isJustUnder).to.be.true;

    done();
  });

  it('should center the tooltip div horizontally', function(done){
    var leftOverflow = target3Rect.left - tooltipRect.left;
    var rightOverflow = tooltipRect.right - target3Rect.right;

    var isMostlyCentered = Math.abs(leftOverflow - rightOverflow) < 5

    expect(isMostlyCentered).to.be.true;
    done();
  });

  it('should change innerText of tooltip to data-info attribute', function(done){
    var message = tooltip.innerText;
    expect(message).to.equal("Information for target3");

    done();
  });
});
