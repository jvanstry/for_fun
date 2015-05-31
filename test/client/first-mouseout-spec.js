console.log(mochaPhantomJS);

describe('after first mouseout event', function(done){
  before(function(done){
    // triggerEvent(target3, 'mouseout')
    

    done()
  });

  it('should work', function(done){
    this.timeout(600);
    var displayStyle = tooltip.style.display;
    var tooltips = document.getElementsByClassName("tooltip");


    console.log(displayStyle, "logged it"); 

    expect(tooltips.length).to.equal(1);

    done()
  })
});