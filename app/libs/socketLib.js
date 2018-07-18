/**
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require("./tokenLib.js");
const check = require("./checkLib.js");
const response = require('./responseLib')
const ChatModel = mongoose.model('Chat');
const ChatRoomModel = mongoose.model('ChatRoomModel');

const redisLib = require("./redisLib.js");



let setServer = (server) => {

    //let allOnlineUsers = []

    let io = socketio.listen(server);

    let myIo = io.of('/')

    myIo.on('connection', (socket) => {
        socket.removeAllListeners();
        console.log("on connection--emitting verify user");

        socket.emit("verifyUser", "");

        // code to verify the user and make him online

        socket.on('set-user', (authToken) => {

            console.log("set-user event listened in socketLib.")
            tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                }
                else {

                    console.log("user is verified..setting details");
                    let currentUser = user.data;
                    // setting socket user id 
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    let key = currentUser.userId
                    let value = fullName

                    let setUserOnline = redisLib.setANewOnlineUserInHash("onlineUsers2", key, value, (err, result) => {
                        if (err) {
                            console.log(`some error occurred`)
                        } else {
                            // getting online users list.

                            redisLib.getAllUsersInAHash('onlineUsers2', (err, result) => {
                                console.log(`--- inside getAllUsersInAHas function ---`)
                                if (err) {
                                    console.log(err)
                                } else {

                                    console.log(`${fullName} is online`);
                                    // setting room name
                                    socket.room = 'edChat'
                                    // joining chat-group room.
                                    socket.join(socket.room)
                                    socket.to(socket.room).broadcast.emit('online-user-list', result);


                                }
                            })
                        }
                    })



                    // let userObj = {userId:currentUser.userId,fullName:fullName}
                    // allOnlineUsers.push(userObj)
                    // console.log(allOnlineUsers)




                }


            })

        }) // end of listening set-user event


        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected ....");
            // console.log(socket.connectorName);
            console.log(socket.userId);


            // var removeIndex = allOnlineUsers.map(function (user) { return user.userId; }).indexOf(socket.userId);
            // allOnlineUsers.splice(removeIndex, 1)
            // console.log(allOnlineUsers)

            if (socket.userId) {
                redisLib.deleteUserFromHash('onlineUsers2', socket.userId)
                console.log("delete user");
                redisLib.deleteUserFromChatRoomHash('currentChatRoom2',socket.nickName)
                console.log("delete user from chat room");
                redisLib.getAllUsersInAHash('onlineUsers2', (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.leave(socket.room)
                        socket.to(socket.room).broadcast.emit('online-user-list', result);


                    }
                })

                redisLib.getAllUserFromChatRoomInHash('currentChatRoom2', (err, result2) => {
                    console.log(`--- inside get user from current chat room function ---`)
                    if (err) {
                        console.log(err)
                    } else {

                        console.log(result2)
                        // setting room name
                        // socket.room = 'edChat'
                        // joining chat-group room.
                        // socket.join(socket.room)
                       // socket.leave(socket.room)
            // socket.emit('all-users-in-paricular-chat-room', result2);
                       io.sockets.emit('all-users-in-paricular-chat-room',result2);
                       // socket.emit('all-users-in-paricular-chat-room', result2);
                        // myIo.emit('all-chat-rooms',result2);

                    }
                })
            }
        }) // end of on disconnect


        socket.on('chat-msg', (data) => {
            console.log("socket chat-msg called")
            data['chatId'] = shortid.generate()
           

            // event to save chat.
            setTimeout(function () {

                eventEmitter.emit('save-chat', data);

            }, 2000)
            console.log(data);
         io.sockets.emit(data.receiverName, data)
          // socket.to(socket.room).broadcast.emit(data.receiverName, data);

        });

        socket.on('typing', (fullName) => {

            socket.to(socket.room).broadcast.emit('typing', fullName);

        });

        socket.on('new-chat-room', (data) => {

            console.log("new-chat-room event listened")


            let key = data.name
            let value = data.createdBy

            let setUserOnline = redisLib.setChatRoomInHash("chatRooms2", key, value, (err, result1) => {
                if (err) {
                    console.log(`some error occurred`)
                } else {
                    // getting online users list.

                    redisLib.getChatRoomFromHash('chatRooms2', (err, result2) => {
                        console.log(`--- inside getAllChatRoomInAHash function ---`)
                        if (err) {
                            console.log(err)
                        } else {

                            console.log(`Chat Room - ${value} is created`);
                            console.log(result2)
                            // setting room name
                            // socket.room = 'edChat'
                            // joining chat-group room.
                            // socket.join(socket.room)
                    //  socket.emit('all-chat-rooms', result2);

                    io.sockets.emit('all-chat-rooms',result2);
                                               // myIo.emit('all-chat-rooms',result2);

                        }
                    })
                }
            })






        })


        socket.on('existing-chat-rooms', (data) => {
            console.log("existing-chat-rooms event listened")

            redisLib.getChatRoomFromHash('chatRooms2', (err, result2) => {
                console.log(`--- inside getAllChatRoomInAHash function ---`)
                if (err) {
                    console.log(err)
                } else {

                    io.sockets.emit('all-chat-rooms', result2);

                }
            })


        })


        socket.on('delete-chat-room', (data) => {

            redisLib.deleteChatRoomFromHash('chatRooms2', data, (err, result) => {
                if (err) {
                    console.log("Error while deleteing chat room");
                } else {
                    redisLib.getChatRoomFromHash('chatRooms2', (err, result2) => {
                        console.log(`--- inside getAllChatRoomInAHash function ---`)
                        if (err) {
                            console.log(err)
                        } else {
                            // setting room name
                            // socket.room = 'edChat'
                            // joining chat-group room.
                            // socket.join(socket.room)
                //  socket.emit('all-chat-rooms', result2);
                io.sockets.emit('all-chat-rooms',result2);
                            // myIo.emit('all-chat-rooms',result2);

                        }
                    })
                }
            })
        })

        socket.on('edit-chat-room', (data) => {

            redisLib.deleteChatRoomFromHash('chatRooms2', data.oldChatRoom, (err, result) => {
                if (err) {
                    console.log("Error while deleteing for editing chat room");
                } else {

                    let key = data.name
                    let value = data.createdBy

                    let setUserOnline = redisLib.setChatRoomInHash("chatRooms2", key, value, (err, result1) => {
                        if (err) {
                            console.log(`some error occurred`)
                        } else {
                            // getting online users list.

                            redisLib.getChatRoomFromHash('chatRooms2', (err, result2) => {
                                console.log(`--- inside getAllChatRoomInAHash function ---`)
                                if (err) {
                                    console.log(err)
                                } else {

                                    console.log(`Chat Room - ${value} is created`);
                                    console.log(result2)
                                    // setting room name
                                    // socket.room = 'edChat'
                                    // joining chat-group room.
                                    // socket.join(socket.room)
                        //  socket.emit('all-chat-rooms', result2);
                        io.sockets.emit('all-chat-rooms',result2);
                                    // myIo.emit('all-chat-rooms',result2);

                                }
                            })
                        }
                    })
                }
            })
        })


        socket.on('join-chat-room', (data) => {

            console.log("join chat room event is listening")
            let key = data.nickName
            let value = data.chatRoom
            socket.nickName = data.nickName;
            let setUserOnline = redisLib.setAUserToChatRoomInHash("currentChatRoom2", key, value, (err, result1) => {
                if (err) {
                    console.log(`some error occurred`)
                } else {
                    // getting online users list.

                    redisLib.getAllUserFromChatRoomInHash('currentChatRoom2', (err, result2) => {
                        console.log(`--- inside get user from current chat room function ---`)
                        if (err) {
                            console.log(err)
                        } else {

                            console.log(result2)
                            // setting room name
                         socket.room = value;
                            // joining chat-group room.
                             socket.join(socket.room)
                            // client.join(socket.room);
                          //  socket.join(value)
            //  socket.emit('all-users-in-paricular-chat-room', result2);
                            io.sockets.emit('all-users-in-paricular-chat-room', result2);
                           // socket.emit('all-users-in-paricular-chat-room', result2);
                            // myIo.emit('all-chat-rooms',result2);

                        }
                    })
                }
            })


        })

        socket.on('existing-users-in-chat-room', (data) => {
            console.log("existing-users-in-chat-room event is listening")

            redisLib.getAllUserFromChatRoomInHash('currentChatRoom2', (err, result2) => {
                console.log(`--- inside get user from current chat room function 2---`)
                if (err) {
                    console.log(err)
                } else {

                    console.log(result2)
                    // setting room name
               //  socket.room = data;
                    // joining chat-group room.
                    // socket.join(socket.room)
                  //  socket.join(data)
                  //  socket.emit('all-users-in-paricular-chat-room', result2);
                    io.sockets.emit('all-users-in-paricular-chat-room', result2);
                   // socket.emit('all-users-in-paricular-chat-room', result2);
                    // myIo.emit('all-chat-rooms',result2);

                }
            })


        })
    });

}





// database operations are kept outside of socket.io code.

// saving chats to database.
eventEmitter.on('save-chat', (data) => {

    // let today = Date.now();

    let newChat = new ChatRoomModel({

        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        message: data.message,
        chatRoom: data.chatRoom,
        createdOn: data.createdOn

    });

    newChat.save((err, result) => {
        if (err) {
            console.log(`error occurred: ${err}`);
        }
        else if (result == undefined || result == null || result == "") {
            console.log("Chat Is Not Saved.");
        }
        else {
            console.log("Chat Saved.");
            console.log(result);
        }
    });

}); // end of saving chat.

///redis code 




module.exports = {
    setServer: setServer
}
