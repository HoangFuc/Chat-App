const express = require("express");
const {
  createMessage,
  getMessage,
} = require("../controllers/messageController");
const router = express.Router();

router.post("/createMessage", createMessage);
router.get("/getMessage/:id", getMessage);

module.exports = router;
