import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    // https://mongoosejs.com/docs/schematypes.html#objectids
    userId: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export const List = mongoose.model("List", listSchema);
