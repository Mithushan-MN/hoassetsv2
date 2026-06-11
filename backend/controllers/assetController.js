const Asset = require('../models/Asset');
const { deleteFile } = require('../middlewares/upload');

/* Helpers */
const fileUrl = (req, filename) =>
  filename
    ? `${req.protocol}://${req.get('host')}/uploads/${filename}`
    : '';

const uploadedUrl = (req, file) => {
  if (!file) return '';

  return file.path && file.path.startsWith('http')
    ? file.path
    : fileUrl(req, file.filename);
};

const uploadedKey = (file) => {
  if (!file) return '';
  return file.filename || file.public_id || '';
};


// CREATE
exports.createAsset = async (req, res) => {
  try {
    const { wrapperId, collectionId, tileId, title, url, icon } = req.body;

    const asset = await Asset.create({
      wrapper: wrapperId,
      collection: collectionId,
      tile: tileId,
      title,
      url,
      icon: icon || "",
    });

    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET
exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({
      tile: req.params.tileId,
    });

    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        message: 'Asset not found',
      });
    }

    if (req.body.title) {
      asset.title = req.body.title;
    }

    if (req.body.url) {
      asset.url = req.body.url;
    }

    if (req.file) {
      await deleteFile(asset.iconKey);

      asset.icon = uploadedUrl(req, req.file);
      asset.iconKey = uploadedKey(req.file);
    }

    const updated = await asset.save();

    res.json(updated);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

/* DELETE */
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        message: 'Asset not found',
      });
    }

    await deleteFile(asset.iconKey);

    await asset.deleteOne();

    res.json({
      message: 'Asset deleted',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};