const express = require('express');
const router = express.Router();
const chatRoomController = require("./../../app/controllers/chatRoomController");
const chatController = require("./../../app/controllers/chatController");
const appConfig = require("./../../config/appConfig")

module.exports.setRouter = (app) => {

    let baseUrl = appConfig.apiVersion+'/chatRoom'
     app.post(`${baseUrl}/create`, chatRoomController.createChatRoom);
     app.get(`${baseUrl}/allChatRoom`, chatRoomController.getAllChatRoom);
     app.get(`${baseUrl}/getChat`, chatController.getGroupChat)
}