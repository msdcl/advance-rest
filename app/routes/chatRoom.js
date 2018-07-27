const express = require('express');
const router = express.Router();
const chatRoomController = require("./../../app/controllers/chatRoomController");
const chatController = require("./../../app/controllers/chatController");
const appConfig = require("./../../config/appConfig")

module.exports.setRouter = (app) => {

    let baseUrl = appConfig.apiVersion+'/chatRoom'
     app.post(`${baseUrl}/create`, chatRoomController.createChatRoom);  /**
     * @apiGroup chatRoom
     * @apiVersion  1.0.0
     * @api {post} /api/v1/chatRoom/create api for creating new chat room.
     *
     * @apiParam {string} name Name of the chat room. (body params) (required)
    
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Chat room created",
            "status": 200,
            "data": {
        "__v": 0,
        "_id": "5b52bb5d4ec1b34cd41943fb",
        "isActive": true,
        "name": "",
        "createdBy": "",
        "id": "VpDi1Gxmo"
    }

        }
    */

     app.get(`${baseUrl}/allChatRoom`, chatRoomController.getAllChatRoom);

     /**
	 * @api {get} /api/v1/chatRoom/allChatRoom get all chat rooms
	 * @apiVersion 0.0.1
	 * @apiGroup read
	 *
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
         "message": "All chat room Details Found",
        "status": 200,
        "data": [
            {
            "isActive": true,
            "name": "",
            "createdBy": "",
            "id": "VpDi1Gxmo"
            }
           ]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 500,
	    "data": null
	   }
	 */

     app.get(`${baseUrl}/getChat`, chatController.getGroupChat)

      /**
	 * @api {get} /api/v1/chatRoom/getChat get chat for a room
	 * @apiVersion 0.0.1
	 * @apiGroup read
	 * * @apiParam {String} chatRoom chatRoom name shoul passed as the query parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
         "message": "All Group Chats Listed",
        "status": 200,
        "data": [
            {
            
            }
           ]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.",
	    "status": 500,
	    "data": null
	   }
	 */
}