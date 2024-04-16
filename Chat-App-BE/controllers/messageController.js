const messageModel = require("../models/message");

//create Message

exports.createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  const message = new messageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const response = await message.save();
    res.status(200).json(response);
  } catch (err) {
    console.log("=======err", err);
    res.status(500).json(err);
  }
};

//get Message

exports.getMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    const message = await messageModel.find({ chatId });
    res.status(200).json(message);
  } catch (err) {
    console.log("==================err", err);
    res.status(500).json(err);
  }
};