var helper = require("node-red-node-test-helper");
var lowerNode = require("../fr24.js");

describe('flightradar24 Node', function () {

  afterEach(function () {
    helper.unload();
  });

  it('should be loaded', function (done) {
    var flow = [{ id: "n1", type: "fr24", north:"0", west:"-50", south:"-40", east:"-30" }];
    helper.load(lowerNode, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property('north', '0');
      done();
    });
  });

});