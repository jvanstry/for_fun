require('../setup.js');
var hi = require('../../public/javascripts/application.js');

describe('A test', function(){
  it('should wire up', function(done){
    expect(hi.hi).to.equal("Hello, World");
    done();
  });

  it('should run', function(done){
    placeOnWindow(15);

    expect(window.number).to.equal(15);
    done();
  });
});

function placeOnWindow(number){
  window.number = number;
}