var io = require('socket.io-client');
var readcommand = require('readcommand');

// check for the host ip & the port number in the arguments
if (process.argv.length == 4 && !isNaN(process.argv[3])) {
 var socket = io.connect('http://' + process.argv[2] + ':' + process.argv[3], {
  reconnect: true
 });
} else {
 console.log('Please provide a correct port number');
 process.exit(1);
}


//client.js

// Add a connect listener
socket.on('connect', function() {
 console.log('connected to ' + process.argv[2] + ' ' + process.argv[3]);


 socket.on('GS', function(data) {
  console.log(data);
  if (data.includes("first")) {
   var player = 0;
  } else {
   var player = 1;
  }
  var sigints = 0;

  readcommand.loop(function(err, args, str, next) {
   if (err && err.code !== 'SIGINT') {
    throw err;
   } else if (err) {
    if (sigints === 1) {
     process.exit(0);
    } else {
     sigints++;
     console.log('Press ^C again to exit.');
     return next();
    }
   } else {
    sigints = 0;
   }
   // send move
   socket.emit('move', {
    player: player,
    move: args[0]
   });
   return next();
  });
 });
});

socket.on('accepted', function(board) {
 printBoard(board);
});
socket.on('GE', function(data) {
 if (data == 'tied') {
  console.log('Game is tied');
 } else {
  if (!data) {
   console.log('Game won by first player');
  } else {
   console.log('Game won by second player');
  }
 }
 socket.disconnect();
 process.exit(1);
});

// print boeard
function printBoard(board) {
 //var i;
 //var j;
 //for (i = 0; i < 3; i++) {
 //  for (j = 0; i < 3; j++)
 //    console.log(board[i+j]);
 //	console.log('\n');

 //  }
 console.log('\n');
 console.log(board[0], board[1], board[2]);
 console.log('\n');
 console.log(board[3], board[4], board[5]);
 console.log('\n');
 console.log(board[6], board[7], board[8]);
}
