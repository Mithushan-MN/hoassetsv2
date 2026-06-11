// const mongoose = require("mongoose");

// const tileSchema = new mongoose.Schema({
//   wrapper: { type: mongoose.Schema.Types.ObjectId, ref: "Wrapper", required: true },
//   collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true },
//   name: { type: String, required: true },
//   image: { type: String, default: "" },
//   imageKey: { type: String, default: "" },
//   link: { type: String, default: "" }
// }, { timestamps: true });

// module.exports = mongoose.model("Tile", tileSchema);



const mongoose = require("mongoose");

const tileSchema = new mongoose.Schema({

  wrapper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wrapper",
    required: true
  },

  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  image: {
    type: String,
    default: ""
  },

  imageKey: {
    type: String,
    default: ""
  },

  // NEW
  type: {
    type: String,
    enum: ["folder", "link"],
    default: "folder"
  },

  // only for link tiles
  link: {
    type: String,
    default: "",
    trim: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Tile", tileSchema);