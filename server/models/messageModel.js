import mongoose from "mongoose";
const Schema = mongoose.Schema;

const opts = {
  createdAt: "created_at",
  updatedAt: "updated_at",
};

const messageSchema = new Schema({
  author: {
    username: {
      type: String,
    },
    photoURL: {
      type: String,
    },
    id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  content: [ 
    {
      date: {
        type: Date,
      },
      title1: {
        type: String,
      },
      title2: {
        type: String,
      },
      description: {
        type: String,
      },
      icon: {
        type: String,
      },
      site: {
        type: String,
      },
      img: {
        type: String,
      },
      videoUrl: {
        type: String,
      },

      message: {
        type: String,
      },
      type: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
  },
  timestamp: {
    type: Date,
  },
});

export default mongoose.model("Message", messageSchema);
