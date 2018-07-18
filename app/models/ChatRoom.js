'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let chatRoomSchema = new Schema({
  id: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  createdBy: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    unique: true,
    default: ''
  },
  isActive :{
    type:Boolean,
    default:true
  }


})


mongoose.model('ChatRoom', chatRoomSchema);