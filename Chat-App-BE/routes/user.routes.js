const express = require("express");
const router = express.Router();
const { getUsers, findUser } = require("../controllers/userController");

// Định nghĩa tuyến đường API danh sách người dùng
router.get("/listAccount", getUsers);

router.get("/find", findUser);

module.exports = router;
