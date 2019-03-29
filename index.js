var express = require("express");
var app = express();
var fs = require('fs');
var https = require('https');

var connectionArray = [];

//同步读取密钥和签名证书
var options = {
    key:fs.readFileSync('./keys/private.pem'),
    cert:fs.readFileSync('./keys/file.crt')
}

var httpsServer = https.createServer(options,app);
var io = require("socket.io")(httpsServer);

function sendUserList() {
  var userList = [];
  connectionArray.forEach(function(s) {
    userList.push({
      id: s.id,
      username: s.username
    });
  });
  connectionArray.forEach(function(s) {
    s.emit("userList", userList);
  });
}
app.use(express.static("views"));

io.on("connection", function(socket) {
  console.log("a user connected");
  connectionArray.push(socket);
  socket.emit("id", socket.id);
  socket.on("chat message", function(msg) {
    io.emit("chat message", msg);
  });
  socket.on("username", function(username) {
    console.log('set username ' + username);
    socket.username = username;
    sendUserList();
  });
  socket.on("disconnect", function() {
    console.log("user disconnected");
    connectionArray = connectionArray.filter(function (el) {
      return el.id !== socket.id;
    });
    sendUserList();
  });
  socket.on('message', function (msg) {
    for (let index = 0; index < connectionArray.length; index++) {
      const element = connectionArray[index];
      if (element.id === msg.target) {
        element.emit('message', msg);
      }
    }
  });
});

httpsServer.listen(3002, function() {
  console.log("listening on *:3002");
});

