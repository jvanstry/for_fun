describe('after first mouseOver', function(){
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
