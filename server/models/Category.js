import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Category = new Schema({
  name: {
    type: String,
  },

  channels: [
    {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Channel",
        },
        name: {
          type: String,
        },
        type: { 
            type: String,
        }
      },
  ],
});

export default mongoose.model("Category", Category);
