const { Schema, model, models, default: mongoose } = require("mongoose");

const msgSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: "String",
      trim: true,
    },
    msgType: {
      type: "String",
      required: true,
    },
    isReplyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isChatUpdate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = models.Message || model("Message", msgSchema);
module.exports = Message;
