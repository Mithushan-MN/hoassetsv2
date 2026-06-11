const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  wrapper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wrapper",
    required: true,
    index: true
  },
  name: { type: String, required: true, trim: true },
   order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Collection", collectionSchema);