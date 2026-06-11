const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  wrapper: { type: mongoose.Schema.Types.ObjectId, ref: "Wrapper", required: true },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true },
  tile: { type: mongoose.Schema.Types.ObjectId, ref: "Tile", required: true },

  title: { type: String, required: true },
  url: { type: String, required: true },

  icon: { type: String, default: "" },
  iconKey: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Asset", assetSchema);