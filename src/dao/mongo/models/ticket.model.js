import mongoose from "mongoose";

const collection = "Tickets";

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: "The code is required",
    },
    amount: {
      type: Number,
      required: "The amount is required",
    },
    purchaser: {
      type: String,
      required: "The purchaser is required",
    },
  },
  { timestamps: { createdAt: "purchase_datetime", updatedAt: "updated_at" } }
);

const ticketModel = mongoose.model(collection, ticketSchema);

export default ticketModel;
