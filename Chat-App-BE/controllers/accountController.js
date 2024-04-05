const userModel = require("../models/users");

exports.listAccount = async (req, res) => {
  const dataAccount = await userModel.find();

  return dataAccount.length > 0
    ? res.status(200).json(dataAccount)
    : res.status(500).json("Hệ thống gặp gián đoạn");
};

exports.editName = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const user = await userModel.findByIdAndUpdate(
    id,
    { username: name },
    { new: true }
  );

  if (user) {
    console.log("==========================success change");
    res.status(200).json("Đổi tên thành công !");
  } else {
    console.log(`============================can't change`);
    res.status(404).json("Đổi tên thất bại !");
  }
};
