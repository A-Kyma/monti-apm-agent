Tinytest.add(
  'Kadira Send - Kadira._getSendFunction',
  function (test) {
    var func = Kadira._getSendFunction();
    if(Meteor.isServer) {
      test.equal(func, Kadira._serverSend);
    } else {
      test.equal(func, Kadira._clientSend);
    }
  }
  );

if (Meteor.isClient) {
  Tinytest.addAsync(
    'Kadira Send - send data',
    function (test, done) {
      var endPoint = 'http://localhost:8808/echo';
      var payload = {aa: 10};
      var func = Kadira._getSendFunction();
      func(endPoint, payload, function(err, res) {
        test.equal(err, null);
        test.equal(res.data, {echo: payload});
        test.equal(res.statusCode, 200);
        done();
      });
    }
  );

  Tinytest.addAsync(
    'Kadira Send - Kadira.send with path',
    function (test, done) {
      var payload = {aa: 10};
      var newKadiraOptions = {endpoint: 'http://localhost:8808'};
      withKadiraOptions(newKadiraOptions, function() {
        Kadira.send(payload, '/echo', function(err, data) {
          test.equal(err, null);
          test.equal(data, {echo: payload});
          done();
        });
      });
    }
  );

  Tinytest.addAsync(
    'Kadira Send - Kadira.send with path (but no begining slash)',
    function (test, done) {
      var payload = {aa: 10};
      var newKadiraOptions = {endpoint: 'http://localhost:8808'};
      withKadiraOptions(newKadiraOptions, function() {
        Kadira.send(payload, 'echo', function(err, data) {
          test.equal(err, null);
          test.equal(data, {echo: payload});
          done();
        });
      });
    }
  );
}

function withKadiraOptions(options, f) {
  var orginalOptions = Kadira.options;
  Kadira.options = options;
  f();
  Kadira.options = orginalOptions;
};
