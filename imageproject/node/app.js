const express = require('express')
  , bodyParser = require('body-parser')
  , app = module.exports = express()
  // ,   router = require('./routes/index')
  , a = require('await-to-js')
  // ,   dotenv = require('dotenv')
  , cors = require('cors')
  , http = require('http').Server(app)
  , io = require('socket.io')(http)
  , login = require('facebook-chat-api')
  , utils = require('./utils/utils')
  , fs = require('fs')
  , exec = require('child_process').exec;


const api = {
  init: async () => { // function to initialize backend
    app.use(cors())
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    http.listen(3001, function () { // start socket server listener
      console.log('listening on *:3001');
    });

    io.on('connection', function (socket) { // when a new client connects
      console.log('a user connected');
      socket.on('login', data => { // when a user attempts to login
        login({email: data.email, password: data.password}, (err, api) => { // login to facebook
          if (err) throw err
          const id = api.getCurrentUserID() // after logging in - get user's fb id
          api.getUserInfo(id, (err, user_data) => { // from users facebook id, get his info
            console.log(id)
            console.log(user_data)
            const user = user_data[id]
            user['id'] = id

            socket.emit('successLogin', {state: api.getAppState(), user: user}) // tell the frontend that the user has successfully logged in
              // send the user the session data
          })

          api.listen((err, message) => { // listen for messages from facebook
            console.log('new message')
            console.log(message)
            api.getUserInfo(message.senderID, (info_err, sender_data) => { // get the user data of who sent me a message - photo, name, etc
              console.log(info_err)
              console.log(sender_data)
              sender_data = sender_data[message.senderID]
              if (message.attachments && message.attachments.length) { // if he sent me a photo (safe mode)
                api.resolvePhotoUrl(message.attachments[0].ID, (err, result) => { // get the photo url
                  console.log(err)
                  console.log(result)
                  utils.download_image(result, 'test2.png', data => { // download the image
                    exec('python ./Final.py 2 test2.png test3.png', (error, stdout, stderr) => { // decrypt the image
                      console.log(error)
                      console.log(stdout)
                      console.log(stderr)
                      socket.emit("newMessage", { // emit the text from the image into a new message sent to this user
                        message: stdout,
                        userId: message.senderID,
                        userAvatar: sender_data.thumbSrc,
                        userName: sender_data.name
                      })
                    })
                  })
                })

              } else if (message.body) { // else if there is no photo ( safe mode is OFF )
                socket.emit("newMessage", { // emit a new message to the user, with the message that was sent
                  message: message.body,
                  userId: message.senderID,
                  userAvatar: sender_data.thumbSrc,
                  userName: sender_data.name
                })
              }
            })

            // if(message.body) {
            //   api.sendMessage(message.body, message.threadID, (err, messageInfo) => {
            //     if(err) return console.error(err);
            //
            //     api.deleteMessage(messageInfo.messageID);
            //   });
            // }
          });

        });
      })
      socket.on('newConversation', data => { // called when a user tries to initiate a new conversation
        login({appState: data.api}, (err, api) => { // call fb login function, but with same state - fb session
          api.getUserID(data.data.username, (err, userdata) => { // get user id of person who is searched for
            exec("python ./Final.py 1 test.png " + '"' + data.data.body + '"' + " test1.png", (error, stdout, stderr) => { // encrypt message to be sent to this user
              console.log(error)
              console.log(stdout)
              console.log(stderr)
              api.sendMessage({attachment: fs.createReadStream('test1.png')}, userdata[0].userID, (err, messageInfo) => { // send encrypted msg in image
                if (err) {
                  console.log(err)
                }
                console.log(messageInfo)
                socket.emit('messageSent', {userID: data.userID})
                // socket.emit("newMessage", {
                //   message: data.data.body,
                //   userId: messageInfo.senderID,
                //   userAvatar: data.data.avatar
                // })
                socket.emit('newConversationSuccessful', {user: userdata[0], message: data.data.body}) // tell frontend that creating a conversation was successful
              })
            })
            // api.sendMessage(data.data.body, userdata[0].userID, (err, messageInfo) => {
            //   if (err) {
            //     console.log(err)
            //   }
            //   console.log(messageInfo)
            //   console.log(userdata)
            //   socket.emit('newConversationSuccessful', {user: userdata[0], message: messageInfo})
            // })
          })
        })
      })

      socket.on('sendMessage', data => { // frontend wants to send a new msg
        // utils.download_image(data.message.userAvatar, 'test.png', () => {
        login({appState: data.api}, (err, api) => { // get session
          if (data.is_safe) { // if user wants to send in safe mode
            exec("python ./Final.py 1 test.png " + '"' + data.message.message + '"' + " test1.png", (error, stdout, stderr) => { // encrypt
              console.log(error)
              console.log(stdout)
              console.log(stderr)
              api.sendMessage({attachment: fs.createReadStream('test1.png')}, data.message.toUserId, (err, messageInfo) => { //send encrypted
                if (err) {
                  console.log(err)
                }
                console.log(messageInfo)
                socket.emit('messageSent', {userID: data.userID})
              })
            })
          } else { // not safe mode - send plain text
            api.sendMessage(data.message.message, data.message.toUserId, (err, messageInfo) => {
              if (err) {
                console.log(err)
              }
              console.log(messageInfo)
              socket.emit('messageSent', {userID: data.userID})
            })
          }



        })
        // })

      })

      // socket.on('search', data => {
      //   login({appState: data.api}, (err, api) => {
      //     api
      //   })
      // })


    })


    // app.use('/api', router)

    // let [db_err, db] = await a.to(database.connect('master'))
    // if (db_err) throw db_err


    app.listen(3000, () => {
      console.log('App is listening on port 3000')
    })
  },

  app: app
}

api.init()


module.exports = api.app;
