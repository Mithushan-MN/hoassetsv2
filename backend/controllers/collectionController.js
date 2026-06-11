const Collection = require('../models/Collection');

// CREATE
exports.createCollection = async (req, res) => {
  try {
     const wrapperId = req.body.wrapperId || req.body.wrapper;
    const { name } = req.body;

    if (!wrapperId || !name) {
      return res.status(400).json({ message: "wrapperId and name required" });
    }

    // Move existing collections from 2nd position onward down by 1
    await Collection.updateMany(
      {
        wrapper: wrapperId,
        order: { $gte: 1 }
      },
      {
        $inc: { order: 1 }
      }
    );

    // New collection always goes to 2nd position
    const col = await Collection.create({
      wrapper: wrapperId,
      name,
      order: 1
    });

    res.status(201).json(col);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET
exports.getCollections = async (req, res) => {
  try {
    const cols = await Collection.find({
      wrapper: req.params.wrapperId,
    }).sort({ order: 1, createdAt: 1 });

    res.json(cols);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateCollection = async (req, res) => {
  try {
    const col = await Collection.findById(req.params.id);

    if (!col) return res.status(404).json({ message: "Not found" });

    col.name = req.body.name || col.name;

    const updated = await col.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};