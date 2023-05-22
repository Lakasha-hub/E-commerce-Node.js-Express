import mongoose from "mongoose";

const collection = "Carts";

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        _id: {
          type: String,
          required: "The Product id is required",
        },
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;
