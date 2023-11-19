const { Schema, model, models, default: mongoose } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: "String",
      required: true,
      unique: true,
    },
    email: {
      type: "String",
      required: true,
      unique: true,
    },
    password: {
      type: "String",
      required: true,
    },
    isVerified: {
      type: "Boolean",
      default: false,
    },
    isPrivate: {
      type: "Boolean",
      default: false,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    hasBlocked: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    hasRequested: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    requestedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    icon: {
      type: "string",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
