const express = require("express");
const router = express.Router();

const { listAccount, editName } = require("../controllers/accountController");

router.get("/listAccount", listAccount); //danh sach account
router.post("/:id/editName", editName);

module.exports = router;
