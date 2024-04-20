const express = require('express');
const router = express.Router();
const userController = require("../app/controllers/userController");

//Create
router.get('/create', userController.create);
router.post('/store', userController.store);
//Edit
router.get('/:id/edit', userController.edit);
router.put('/:id', userController.update);
//Delete
router.delete('/:id', userController.delete);
//Get
router.get('/', userController.index);

module.exports = router;
