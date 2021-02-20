import mongoose from "mongoose";
const Schema = mongoose.Schema;

const User = new Schema({
  username: {
    type: String,
  },
  photoURL: {
    type: String,
  },
  type: {
    type: String,
  },
  status: {
    type: String,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  directMessages: [
    {
      to: {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        photoURL: { type: String },
        username: { type: String }
      },
      from: {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        photoURL: { type: String },
        username: { type: String }
      },
      channelId: {
        type: Schema.Types.ObjectId,
        ref: "Channel",
      },
    },
  ],
});

export default mongoose.model("User", User);
