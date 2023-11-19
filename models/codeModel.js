const { Schema, default: mongoose, model, models } = require("mongoose");

const codeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: "Number",
      required: true,
    },
  },
  { timestamps: true }
);

const Code = models.Code || model("Code" , codeSchema)

module.exports = Code