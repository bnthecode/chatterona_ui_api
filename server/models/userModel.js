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
    type: String
  },
  status: {
    type: String
  }
});

export default mongoose.model("User", User);
