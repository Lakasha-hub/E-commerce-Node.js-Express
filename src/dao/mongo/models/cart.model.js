import mongoose from "mongoose";

const collection = "Carts";

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          quantity: {
            type: Number,
            default: 1,
          },
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: "The Product id is required",
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

cartSchema.pre("find", function () {
  this.populate("products.product");
});
cartSchema.pre("findOne", function () {
  this.populate("products.product");
});

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;
