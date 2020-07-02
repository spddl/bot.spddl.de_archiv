// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar("d69d6a2f2c9643ae810205c5b194cb70");

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");