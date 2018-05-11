const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const login = require('facebook-chat-api')


// Create simple echo bot
login({email: "", password: "FB_PASSWORD"}, (err, api) => {
  if(err) return console.error(err);

  api.listen((err, message) => {
    api.sendMessage(message.body, message.threadID);
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
});
