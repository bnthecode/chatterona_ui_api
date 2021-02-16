import mongoose from "mongoose";
const Schema = mongoose.Schema;


const contentSchema = new Schema({
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
});

const authorSchema = new Schema({
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
})

const messageSchema = new Schema({
  author: authorSchema,
  content: [contentSchema],
  date: {
    type: Date,
  },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
