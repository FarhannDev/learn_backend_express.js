const express = require("express");
const router = express.Router();
const {
  refreshTokenController,
} = require("../../../controllers/auth/refreshTokenController");

router.get("/", refreshTokenController);

module.exports = router;
