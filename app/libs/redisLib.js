//redis lib
const check = require("./checkLib.js");
const redis = require('redis');
let client = redis.createClient();

client.on('connect', () => {

    console.log("Redis connection successfully opened");

});

let getAllUsersInAHash = (hashName, callback) => {
    

    client.HGETALL(hashName, (err, result) => {
        

        if (err) {

            console.log(err);
            callback(err, null)

        } else if (check.isEmpty(result)) {

            console.log("online user list is empty");
            console.log(result)

            callback(null, {})

        } else {

            console.log(result);
            callback(null, result)

        }
    });


}// end get all users in a hash

// function to set new online user.
let setANewOnlineUserInHash = (hashName, key, value, callback) => {
    console.log("setting user online in redis")
    client.HMSET(hashName, [
        key, value
    ], (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null)
        } else {

            console.log("user has been set in the hash map");
            console.log(result)
            callback(null, result)
        }
    });


}// end set a new online user in hash

let deleteUserFromHash = (hashName,key)=>{

    client.HDEL(hashName,key);
    return true;

}// end delete user from hash


// function to set new chat room in redis hash
let setANewChatRoomInHash = (hashName, key, value, callback) => {
    console.log("setting new chat room in redis")
    client.HMSET(hashName, [
        key, value
    ], (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null)
        } else {

            console.log("chat room has been set in the hash map");
            console.log(result)
            callback(null, result)
        }
    });


}

// fucntion to get all chat room in redis hash
let getAllChatRoomInAHash = (hashName, callback) => {
    

    client.HGETALL(hashName, (err, result) => {
        

        if (err) {

            console.log(err);
            callback(err, null)

        } else if (check.isEmpty(result)) {

            console.log("active chat room list is empty");
            console.log(result)

            callback(null, {})

        } else {

            console.log(result);
            callback(null, result)

        }
    });

}
// function to delete a chat room from redis
let deleteChatRoomInHash = (hashName, key, callback) => {
       
    client.HDEL(hashName, key, (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null)
        } else {

            console.log("chat room has been deleted in the hash map");
            console.log(result)
            callback(null, result)
        }
    });


}

let setAUserToChatRoomInHash = (hashName, key, value, callback) => {
    console.log("setting new chat room in redis")
    client.HMSET(hashName, [
        key, value
    ], (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null)
        } else {

            console.log("chat room has been set in the hash map");
            console.log(result)
            callback(null, result)
        }
    });


}

let getAllUserFromChatRoomInHash = (hashName, callback) => {
    

    client.HGETALL(hashName, (err, result) => {
        

        if (err) {

            console.log(err);
            callback(err, null)

        } else if (check.isEmpty(result)) {

            console.log("active chat room list is empty");
            console.log(result)

            callback(null, {})

        } else {

            console.log(result);
            callback(null, result)

        }
    });

}

let deleteUserFromChatRoomHash = (hashName,key)=>{

    client.HDEL(hashName,key);
    return true;

}
module.exports = {
    getAllUsersInAHash:getAllUsersInAHash,
    setANewOnlineUserInHash:setANewOnlineUserInHash,
    deleteUserFromHash:deleteUserFromHash,
    setChatRoomInHash : setANewChatRoomInHash,
    getChatRoomFromHash : getAllChatRoomInAHash,
    deleteChatRoomFromHash : deleteChatRoomInHash,
    setAUserToChatRoomInHash :setAUserToChatRoomInHash,
    getAllUserFromChatRoomInHash :getAllUserFromChatRoomInHash,
    deleteUserFromChatRoomHash :deleteUserFromChatRoomHash
}

