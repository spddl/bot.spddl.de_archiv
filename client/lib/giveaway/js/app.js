'use strict';
angular.module("myApp", ['services']).controller("myCtrl", function($scope, Socket) {

  Socket.emit('loadArray')
   Socket.on('giveaway_start', function(go) {
     //console.log('Socket.on: giveaway_start '+go)
     //console.dir('Socket.on: giveaway_start  '+JSON.stringify(go, undefined, 2));
   })

   Socket.on('giveaway_array', function(data) {
     //console.log('Socket.on: giveaway_array '+data)
     //console.dir('Socket.on: giveaway_array  '+JSON.stringify(data, undefined, 2));
     $scope.users = data;
   });

  Socket.on('uptime', function(uptime) { // wird von der Server.js aufgerufen
       uptime = new Date(new Date().getTime() - uptime * 1000)
       $scope.uptime = uptime.toLocaleString()
  });

  Socket.on('memoryUsage', function(memoryUsage) { // wird von der Server.js aufgerufen
    memoryUsage = memoryUsage.replace(/{/g, ' ')
    $scope.memoryUsage = memoryUsage.replace(/}/g, ' ')
  });

  $scope.startGiveaway = function() {
      Socket.emit('startGiveaway')
  };

  $scope.endGiveaway = function() {
      Socket.emit('endGiveaway')
  };

  $scope.getUptime = function() {
      Socket.emit('uptime')
  };

  $scope.getMemoryUsage = function() {
      Socket.emit('memoryUsage')
  };

});
