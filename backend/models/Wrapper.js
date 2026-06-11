const mongoose = require("mongoose");

const wrapperSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: "" },
  logo: { type: String, default: "" },
  logoKey: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Wrapper", wrapperSchema);