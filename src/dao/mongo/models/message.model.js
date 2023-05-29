import mongoose from "mongoose";

const collection = "Messages";

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: "The user is required",
    },
     message: {
      type: String,
      required: "The message is required",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const messageModel = mongoose.model(collection, messageSchema);

export default messageModel;