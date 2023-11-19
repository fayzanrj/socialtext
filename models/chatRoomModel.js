const { Schema, default: mongoose, model, models } = require("mongoose");

const chatRoomModel = new Schema(
  {},
  { timestamps: true }
);

const ChatRoom = models.ChatRoom || model("ChatRoom", chatRoomModel);

export default ChatRoom;
