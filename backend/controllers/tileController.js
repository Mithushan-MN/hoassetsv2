// const Tile = require('../models/Tile');

// // CREATE
// exports.createTile = async (req, res) => {
//   try {
//     const { wrapperId, collectionId, name, image } = req.body;

//     if (!wrapperId || !collectionId || !name) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     const tile = await Tile.create({
//       wrapper: wrapperId,
//       collection: collectionId,
//       name,
//       image: image || "",
//     });

//     res.status(201).json(tile);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // GET
// exports.getTiles = async (req, res) => {
//   try {
//     const tiles = await Tile.find({
//       collection: req.params.collectionId,
//     });

//     res.json(tiles);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // UPDATE
// exports.updateTile = async (req, res) => {
//   try {
//     const tile = await Tile.findById(req.params.id);

//     if (!tile) return res.status(404).json({ message: "Not found" });

//     tile.name = req.body.name || tile.name;
//     tile.image = req.body.image || tile.image;

//     const updated = await tile.save();
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // DELETE
// exports.deleteTile = async (req, res) => {
//   try {
//     await Tile.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



const Tile = require("../models/Tile");

/* =========================================================
   CREATE TILE
========================================================= */
exports.createTile = async (req, res) => {

  try {

    const {
      wrapperId,
      collectionId,
      name,
      type,
      link
    } = req.body;

    /* VALIDATION */
    if (!wrapperId || !collectionId || !name) {

      return res.status(400).json({
        message: "Missing required fields"
      });

    }

    /* LINK TILE VALIDATION */
    if (type === "link" && !link) {

      return res.status(400).json({
        message: "Link URL is required"
      });

    }

    /* CREATE */
    const tile = await Tile.create({

      wrapper: wrapperId,

      collection: collectionId,

      name: name.trim(),

      type: type || "folder",

      link: type === "link"
        ? link.trim()
        : "",

      image: req.file?.location || "",

      imageKey: req.file?.key || ""

    });

    res.status(201).json(tile);

  } catch (err) {

    console.error("CREATE TILE ERROR:", err);

    res.status(500).json({
      message: err.message
    });

  }

};


/* =========================================================
   GET TILES
========================================================= */
exports.getTiles = async (req, res) => {

  try {

    const tiles = await Tile.find({
      collection: req.params.collectionId
    }).sort({ createdAt: -1 });

    res.json(tiles);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};


/* =========================================================
   UPDATE TILE
========================================================= */
exports.updateTile = async (req, res) => {

  try {

    const tile = await Tile.findById(req.params.id);

    if (!tile) {

      return res.status(404).json({
        message: "Tile not found"
      });

    }

    const {
      name,
      type,
      link
    } = req.body;

    /* UPDATE NAME */
    if (name) {
      tile.name = name.trim();
    }

    /* UPDATE TYPE */
    if (type) {
      tile.type = type;
    }

    /* LINK HANDLING */
    if (type === "link") {

      tile.link = link || "";

    } else {

      tile.link = "";

    }

    /* IMAGE */
    if (req.file) {

      tile.image = req.file.location;
      tile.imageKey = req.file.key;

    }

    const updated = await tile.save();

    res.json(updated);

  } catch (err) {

    console.error("UPDATE TILE ERROR:", err);

    res.status(500).json({
      message: err.message
    });

  }

};


/* =========================================================
   DELETE TILE
========================================================= */
exports.deleteTile = async (req, res) => {

  try {

    const tile = await Tile.findById(req.params.id);

    if (!tile) {

      return res.status(404).json({
        message: "Tile not found"
      });

    }

    await tile.deleteOne();

    res.json({
      message: "Tile deleted successfully"
    });

  } catch (err) {

    console.error("DELETE TILE ERROR:", err);

    res.status(500).json({
      message: err.message
    });

  }

};