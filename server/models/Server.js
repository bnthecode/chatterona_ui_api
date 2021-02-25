import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Server = new Schema({
  name: {
    type: String,
    required: true,
  },

  photoURL: {
    type: String,
  },
  timestamp: {
    type: String,
  },
  updates: [
    {
      channelId: {
        type: String,
      },
      date: {
        type: Date,
      },
      type: {
        type: String,
      },
    },
  ],
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
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
      },
    },
  ],
});

export default mongoose.model("Server", Server);
