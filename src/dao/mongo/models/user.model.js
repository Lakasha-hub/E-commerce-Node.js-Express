import mongoose from "mongoose";

const collection = "Users";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: "The first name is required",
    },
    last_name: {
      type: String,
      required: "The last name is required",
    },
    email: {
      type: String,
      required: "The email is required",
    },
    age: {
      type: Number,
      required: "age is required",
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carts",
    },
    password: {
      type: String,
      required: "The password is required",
    },
    role: {
      type: String,
      default: "USER_ROLE",
      enum: ["USER_ROLE", "PREMIUN_ROLE", "ADMIN_ROLE"],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const userModel = mongoose.model(collection, userSchema);

export default userModel;
