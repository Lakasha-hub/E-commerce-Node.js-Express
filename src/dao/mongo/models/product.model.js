import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "Products";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "The title is required",
    },
    description: {
      type: String,
      required: "The description is required",
    },
    price: {
      type: Number,
      required: "The price is required",
    },
    code: {
      type: String,
      unique: true,
      required: "The code is required",
    },
    stock: {
      type: String,
      required: "The stock is required",
    },
    category: {
      type: String,
      default: "Without Category",
    },
    thumbnails: [
      {
        type: String,
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, productSchema);

export default productModel;
