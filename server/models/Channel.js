import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Channel = new Schema({
  name: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
  type: {
    type: String,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

export default mongoose.model("Channel", Channel);
