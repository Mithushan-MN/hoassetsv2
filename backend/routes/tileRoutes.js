const express = require("express");
const router = express.Router();

const {
  getTiles,
  createTile,
  updateTile,
  deleteTile,
} = require("../controllers/tileController");

const {
  protect,
  admin
} = require("../middlewares/authMiddleware");

const {
  upload
} = require("../middlewares/upload");

const auth = [protect, admin];

/* GET */
router.get(
  "/collection/:collectionId",
  getTiles
);

/* CREATE */
router.post(
  "/",
  auth,
  upload.single("image"),
  createTile
);

/* UPDATE */
router.put(
  "/:id",
  auth,
  upload.single("image"),
  updateTile
);

/* DELETE */
router.delete(
  "/:id",
  auth,
  deleteTile
);

module.exports = router;