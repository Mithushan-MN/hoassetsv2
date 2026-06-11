const express = require('express');
const router = express.Router();

const {
  createNestedCollection,
  updateNestedCollection,
} = require('../controllers/wrapperController');

const {
  getCollections,
  deleteCollection,
} = require('../controllers/collectionController');

const { protect, admin } = require('../middlewares/authMiddleware');

const auth = [protect, admin];

router.get('/wrapper/:wrapperId', getCollections);

// Collections use JSON body (no file uploads) — express.json() in server.js parses it
router.post('/', auth, createNestedCollection);

router.put('/:id', auth, updateNestedCollection);

router.delete('/:id', auth, deleteCollection);

module.exports = router;