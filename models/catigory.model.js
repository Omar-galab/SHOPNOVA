import mongoose from "mongoose";
const { Schema } = mongoose;

const catigorySchema = new Schema({
  name: String,
});
const catigoryModle = mongoose.model("catigory", catigorySchema);

export default catigoryModle;
