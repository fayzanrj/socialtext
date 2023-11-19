const { Mongoose } = require("mongoose");
const { Schema, default:mongoose, models, model } = require("mongoose");

const chatSchema = Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    chatUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User", 
    },
    chatRoom: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
    },
    pic: {
      type: "String",
      required: true,
      default: "https://icon-library.com/images/groups-icon/groups-icon-16.jpg",
    },
  },
  { timestamps: true }
);

const Chat = models.Chat || model("Chat", chatSchema);

module.exports = Chat;

