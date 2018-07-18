const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordLib = require('./../libs/generatePasswordLib');
const token = require('../libs/tokenLib')
/* Models */
const ChatRoomModel = mongoose.model('ChatRoom')


let createChatRoom =(req,res)=>{
    

    let createNewChatRoom = () => {
        return new Promise((resolve, reject) => {
            ChatRoomModel.findOne({ name: req.body.name })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'chatRoomController: createNewChatRoom', 10)
                        let apiResponse = response.generate(true, 'Failed To Create chat Room', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newChatRoom = new ChatRoomModel({
                            id: shortid.generate(),
                            name: req.body.name,
                            createdBy: req.body.createdBy
                           
                        })
                        newChatRoom.save((err, newChatRoom) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'chatRoomController: createNewChatRoom', 10)
                                let apiResponse = response.generate(true, 'Failed to create new chat room', 500, null)
                                reject(apiResponse)
                            } else {
                                let newChatRoomObj = newChatRoom.toObject();
                                resolve(newChatRoomObj)
                            }
                        })
                    } else {
                        logger.error('Chat room with same name is already Present', 'chatRoomController: createNewChatRoom', 4)
                        let apiResponse = response.generate(true, 'Chat room Already Present ', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


    createNewChatRoom(req, res)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Chat room created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
}


// function to get all chat rooms
let getAllChatRoom = (req, res) => {
    ChatRoomModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'chatRoomController: getAllChatRoom', 10)
                let apiResponse = response.generate(true, 'Failed To Find chat room Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No product Found', 'chatRoomController: getAllChatRoom')
                let apiResponse = response.generate(true, 'No chat room Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All chat room Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}


module.exports = {

    createChatRoom :createChatRoom,
    getAllChatRoom : getAllChatRoom

}