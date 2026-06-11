const express = require('express');
const router = express.Router();

const {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} = require('../controllers/assetController');

const { protect, admin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/upload');

const auth = [protect, admin];

router.get('/tile/:tileId', getAssets);

router.post(
  '/',
  auth,
  upload.single('icon'),
  createAsset
);

router.put(
  '/:id',
  auth,
  upload.single('icon'),
  updateAsset
);

router.delete('/:id', auth, deleteAsset);

module.exports = router;