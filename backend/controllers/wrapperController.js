const mongoose = require('mongoose');
const Wrapper = require('../models/Wrapper');
const Collection = require('../models/Collection');
const Tile = require('../models/Tile');
const Asset = require('../models/Asset');
const { deleteFile } = require('../middlewares/upload');

/* Helpers */
// const fileUrl = (req, filename) =>
//   filename
//     ? `${req.protocol}://${req.get('host')}/uploads/${filename}`
//     : '';

const uploadedUrl = (_req, file) => {
  if (!file) return '';
  return file.path || file.secure_url || '';
};

const uploadedKey = (file) => {
  if (!file) return '';
  return file.filename || file.public_id || '';
};

// Robust ID validation helper
const isValidId = (id) => {
  if (!id) return false;
  const s = String(id).trim();
  return s !== 'undefined' && s !== 'null' && s !== '' && mongoose.Types.ObjectId.isValid(s);
};

// Aggregation helper to build the fully nested tree structure expected by AdminDashboard.jsx
const getFullyNestedWrapper = async (wrapperId) => {
  if (!isValidId(wrapperId)) return null;
  const wrapper = await Wrapper.findById(wrapperId).lean();
  if (!wrapper) return null;

  // Find all collections for this wrapper
  // const collections = await Collection.find({ wrapper: wrapperId }).sort({ createdAt: 1 }).lean();
      const collections = await Collection.find({
        wrapper: wrapperId
      })
      .sort({ order: 1, createdAt: 1 })
      .lean();

  // For each collection, find all tiles
  const collectionsWithTiles = await Promise.all(collections.map(async (col) => {
    const tiles = await Tile.find({ collection: col._id }).sort({ createdAt: 1 }).lean();

    // For each tile, find all assets
    const tilesWithAssets = await Promise.all(tiles.map(async (tile) => {
      const assets = await Asset.find({ tile: tile._id }).sort({ createdAt: 1 }).lean();
      return {
        ...tile,
        assets
      };
    }));

    return {
      ...col,
      tiles: tilesWithAssets
    };
  }));

  return {
    ...wrapper,
    tiles: collectionsWithTiles
  };
};

exports.getFullyNestedWrapper = getFullyNestedWrapper;

/* GET ALL */
exports.getWrappers = async (req, res) => {
  try {
    const wrappers = await Wrapper.find().sort({ createdAt: -1 }).lean();
    const fullyNestedWrappers = await Promise.all(
      wrappers.map((w) => getFullyNestedWrapper(w._id))
    );
    res.json(fullyNestedWrappers);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* GET SINGLE */
exports.getWrapper = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Wrapper ID format' });
    }
    const wrapper = await getFullyNestedWrapper(req.params.id);

    if (!wrapper) {
      return res.status(404).json({
        message: 'Wrapper not found',
      });
    }

    res.json(wrapper);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* CREATE WRAPPER */
exports.createWrapper = async (req, res) => {
  try {
    const body = req.body || {};
    const { name, description } = body;

    const wrapper = await Wrapper.create({
      name,
      description,
      logo: uploadedUrl(req, req.file),
      logoKey: uploadedKey(req.file),
    });

    const fullyNested = await getFullyNestedWrapper(wrapper._id);
    res.status(201).json(fullyNested);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

/* UPDATE WRAPPER */
exports.updateWrapper = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Wrapper ID format' });
    }
    const wrapper = await Wrapper.findById(req.params.id);

    if (!wrapper) {
      return res.status(404).json({
        message: 'Wrapper not found',
      });
    }

    const body = req.body || {};

    if (body.name) {
      wrapper.name = body.name;
    }

    if (body.description !== undefined) {
      wrapper.description = body.description;
    }

    if (req.file) {
      await deleteFile(wrapper.logoKey);

      wrapper.logo = uploadedUrl(req, req.file);
      wrapper.logoKey = uploadedKey(req.file);
    }

    await wrapper.save();

    const fullyNested = await getFullyNestedWrapper(wrapper._id);
    res.json(fullyNested);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

/* DELETE WRAPPER */
exports.deleteWrapper = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Wrapper ID format' });
    }
    const wrapper = await Wrapper.findById(req.params.id);

    if (!wrapper) {
      return res.status(404).json({
        message: 'Wrapper not found',
      });
    }

    // Clean up all nested assets
    const assets = await Asset.find({ wrapper: wrapper._id });
    for (const asset of assets) {
      if (asset.iconKey) await deleteFile(asset.iconKey);
    }
    await Asset.deleteMany({ wrapper: wrapper._id });

    // Clean up all nested tiles
    const tiles = await Tile.find({ wrapper: wrapper._id });
    for (const tile of tiles) {
      if (tile.imageKey) await deleteFile(tile.imageKey);
    }
    await Tile.deleteMany({ wrapper: wrapper._id });

    // Clean up all nested collections
    await Collection.deleteMany({ wrapper: wrapper._id });

    // Delete logo file
    await deleteFile(wrapper.logoKey);

    await wrapper.deleteOne();

    res.json({
      message: 'Wrapper deleted',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ── NESTED COLLECTIONS CONTROLLERS ──────────────────────────────── */

exports.createNestedCollection = async (req, res) => {
  try {
    const body = req.body || {};
    const wrapperId = body.wrapper || body.wrapperId || req.params.wrapperId;
    const { name } = body;

    if (!isValidId(wrapperId) || !name) {
      return res.status(400).json({ message: "Valid wrapperId and name required" });
    }

   await Collection.updateMany(
  {
    wrapper: wrapperId,
    order: { $gte: 1 }
  },
  {
    $inc: { order: 1 }
  }
);

await Collection.create({
  wrapper: wrapperId,
  name,
  order: 1
});

    const fullyNested = await getFullyNestedWrapper(wrapperId);
    res.status(201).json(fullyNested);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNestedCollection = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const col = await Collection.findById(req.params.id);
    if (!col) return res.status(404).json({ message: "Collection not found" });

    const body = req.body || {};
    col.name = body.name || col.name;
    await col.save();

    const fullyNested = await getFullyNestedWrapper(col.wrapper);
    res.json(fullyNested);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNestedCollection = async (req, res) => {
  try {
    const colId = req.params.id;
    if (!isValidId(colId)) {
      return res.status(400).json({ message: "Invalid Collection ID format" });
    }

    const col = await Collection.findById(colId);
    if (!col) return res.status(404).json({ message: "Collection not found" });

    const wrapperId = col.wrapper;

    // Clean up all assets in this collection
    const assets = await Asset.find({ collection: colId });
    for (const asset of assets) {
      if (asset.iconKey) await deleteFile(asset.iconKey);
    }
    await Asset.deleteMany({ collection: colId });

    // Clean up all tiles in this collection
    const tiles = await Tile.find({ collection: colId });
    for (const tile of tiles) {
      if (tile.imageKey) await deleteFile(tile.imageKey);
    }
    await Tile.deleteMany({ collection: colId });

    // Delete collection
    await col.deleteOne();

    const fullyNested = await getFullyNestedWrapper(wrapperId);
    res.json(fullyNested);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── NESTED TILES CONTROLLERS ────────────────────────────────────── */

exports.createNestedTile = async (req, res) => {
  try {
    const { wrapperId, collectionId } = req.params;
    const body = req.body || {};
    const { name, type, link } = body;

    if (!isValidId(wrapperId) || !isValidId(collectionId)) {
      return res.status(400).json({ message: "Valid Wrapper ID and Collection ID are required" });
    }
    if (!name) {
      return res.status(400).json({ message: "Tile name is required" });
    }
    if (type === "link" && !link) {
      return res.status(400).json({ message: "Link URL is required for link tiles" });
    }

    await Tile.create({
      wrapper: wrapperId,
      collection: collectionId,
      name,
      type: type || "folder",
      link: type === "link" ? (link || "").trim() : "",
      image: uploadedUrl(req, req.file),
      imageKey: uploadedKey(req.file),
    });

    const fullyNested = await getFullyNestedWrapper(wrapperId);
    res.status(201).json(fullyNested);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNestedTile = async (req, res) => {
  try {
    const { wrapperId, id } = req.params;
    if (!isValidId(wrapperId) || !isValidId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const tile = await Tile.findById(id);

    if (!tile) return res.status(404).json({ message: "Tile not found" });

    const body = req.body || {};
    if (body.name) {
      tile.name = body.name;
    }

    /* ── type + link ── */
    if (body.type) {
      tile.type = body.type;
    }
    if (tile.type === "link") {
      tile.link = (body.link || "").trim();
    } else {
      tile.link = "";
    }

    if (req.file) {
      await deleteFile(tile.imageKey);
      tile.image = uploadedUrl(req, req.file);
      tile.imageKey = uploadedKey(req.file);
    }

    await tile.save();

    const fullyNested = await getFullyNestedWrapper(wrapperId);
    res.json(fullyNested);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNestedTile = async (req, res) => {
  try {
    const { wrapperId, id } = req.params;
    if (!isValidId(wrapperId) || !isValidId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const tile = await Tile.findById(id);

    if (tile) {
      // Delete images
      if (tile.imageKey) await deleteFile(tile.imageKey);

      // Clean up assets under this tile
      const assets = await Asset.find({ tile: id });
      for (const asset of assets) {
        if (asset.iconKey) await deleteFile(asset.iconKey);
      }
      await Asset.deleteMany({ tile: id });

      await tile.deleteOne();
    }

    const fullyNested = await getFullyNestedWrapper(wrapperId);
    res.json(fullyNested);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── NESTED ASSETS CONTROLLERS ───────────────────────────────────── */

exports.createNestedAsset = async (req, res) => {
  try {
    const { wrapperId, collectionId, tileId } = req.params;
    const body = req.body || {};
    const { title, url } = body;

    if (!isValidId(wrapperId) || !isValidId(collectionId) || !isValidId(tileId)) {
      return res.status(400).json({ message: "Valid Wrapper, Collection, and Tile IDs are required" });
    }
    if (!title || !url) {
      return res.status(400).json({ message: "Title and URL are required" });
    }

    await Asset.create({
      wrapper: wrapperId,
      collection: collectionId,
      tile: tileId,
      title,
      url,
      icon: uploadedUrl(req, req.file),
      iconKey: uploadedKey(req.file),
    });

    const fullyNested = await getFullyNestedWrapper(wrapperId);
    res.status(201).json(fullyNested);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNestedAsset = async (req, res) => {
  try {
    const { wrapperId, id } = req.params;
    if (!isValidId(wrapperId) || !isValidId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const asset = await Asset.findById(id);

    if (!asset) return res.status(404).json({ message: "Asset not found" });

    const body = req.body || {};
    if (body.title) {
      asset.title = body.title;
    }
    if (body.url) {
      asset.url = body.url;
    }

    if (req.file) {
      await deleteFile(asset.iconKey);
      asset.icon = uploadedUrl(req, req.file);
      asset.iconKey = uploadedKey(req.file);
    }

    await asset.save();

    const fullyNested = await getFullyNestedWrapper(wrapperId);
    res.json(fullyNested);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNestedAsset = async (req, res) => {
  try {
    const { wrapperId, id } = req.params;
    if (!isValidId(wrapperId) || !isValidId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const asset = await Asset.findById(id);

    if (asset) {
      if (asset.iconKey) await deleteFile(asset.iconKey);
      await asset.deleteOne();
    }

    const fullyNested = await getFullyNestedWrapper(wrapperId);
    res.json(fullyNested);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET TILE BY BRAND NAME AND TILE NAME (Case Insensitive)
exports.getTileByName = async (req, res) => {
  try {
    const { brandName, tileName } = req.params;

    // Find the wrapper (brand) by name
    const wrapper = await Wrapper.findOne({ name: { $regex: new RegExp(`^${brandName.trim()}$`, 'i') } });
    if (!wrapper) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Find the tile under this wrapper by name
    const tile = await Tile.findOne({
      wrapper: wrapper._id,
      name: { $regex: new RegExp(`^${tileName.trim()}$`, 'i') }
    }).lean();

    if (!tile) {
      return res.status(404).json({ message: "Tile not found" });
    }

    // Find all assets for this tile
    const assets = await Asset.find({ tile: tile._id }).sort({ createdAt: 1 }).lean();

    res.json({
      ...tile,
      brandName: wrapper.name,
      assets
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};