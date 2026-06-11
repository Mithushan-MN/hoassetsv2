const express = require('express');
const router = express.Router();

const {
  getWrappers,
  getWrapper,
  createWrapper,
  updateWrapper,
  deleteWrapper,
  // Collection Actions
  createNestedCollection,
  updateNestedCollection,
  deleteNestedCollection,
  // Tile Actions
  createNestedTile,
  updateNestedTile,
  deleteNestedTile,
  // Asset Actions
  createNestedAsset,
  updateNestedAsset,
  deleteNestedAsset,
  // Public Tile Fetch
  getTileByName,
} = require('../controllers/wrapperController');

const { protect, admin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/upload');

const auth = [protect, admin];

/* ── Public Tile Fetch ───────────────────────────────────────────── */
router.get('/tile-by-name/:brandName/:tileName', getTileByName);

/* ── Standard Wrapper CRUD ───────────────────────────────────────── */
router.get('/', getWrappers);
router.get('/:id', getWrapper);
router.post('/', auth, upload.single('logo'), createWrapper);
router.put('/:id', auth, upload.single('logo'), updateWrapper);
router.delete('/:id', auth, deleteWrapper);

/* ── Collection Nested CRUD ──────────────────────────────────────── */
router.put('/:wrapperId/collections/:id', auth, updateNestedCollection);
router.delete('/:wrapperId/collections/:id', auth, deleteNestedCollection);

/* ── Tile Nested CRUD ────────────────────────────────────────────── */
router.post('/:wrapperId/collections/:collectionId/tiles', auth, upload.single('image'), createNestedTile);
router.put('/:wrapperId/collections/:collectionId/tiles/:id', auth, upload.single('image'), updateNestedTile);
router.delete('/:wrapperId/collections/:collectionId/tiles/:id', auth, deleteNestedTile);

/* ── Asset Nested CRUD ───────────────────────────────────────────── */
router.post('/:wrapperId/collections/:collectionId/tiles/:tileId/assets', auth, upload.single('icon'), createNestedAsset);
router.put('/:wrapperId/collections/:collectionId/tiles/:tileId/assets/:id', auth, upload.single('icon'), updateNestedAsset);
router.delete('/:wrapperId/collections/:collectionId/tiles/:tileId/assets/:id', auth, deleteNestedAsset);

module.exports = router;