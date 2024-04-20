const User = require('../models/User');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const bodyParser = require('body-parser');
const urlencodeParser = bodyParser.urlencoded({ extended: false });
const bcrypt = require('bcrypt');

class UserController {
  //[GET] /users
  async index(req, res, next) {
    try {
      const users = await User.find({});
      res.render('user', {
        users: multipleMongooseToObject(users)
      });
    } catch (error) {
      next(error);
    }
  }

  //[[GET]]/api/userList/create
  async create(req, res, next) {
    try {
      res.render('users/create');
    } catch (error) {
      next(error)
    }
  }
  //[[POST]]/api/userList/store
  async store(req, res, next) {
    try {
      const { email, password, isAdmin, username, code } = req.body;

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo đối tượng người dùng với thông tin từ req.body
      const user = new User({
        email,
        password: hashedPassword,
        isAdmin,
        username,
        code
      });

      // Lưu đối tượng người dùng vào cơ sở dữ liệu
      await user.save();

      res.redirect('/api/userList');
    } catch (error) {
      next(error);
    }
  }
  //[[GET]]/api/userList/:id/edit
  async edit(req, res, next) {
    try {
      const users = await User.findById(req.params.id);
      res.render('users/edit', {
        users: mongooseToObject(users)
      });
    } catch (error) {
      next(error)
    }
  }
  //[[PUT]]/api/userList/:id
  async update(req, res, next) {
    try {
      const users = await User.updateOne({ _id: req.params.id }, req.body);
      // res.locals.successMessage = 'Update thành công.';
      res.redirect('/api/userList');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const users = await User.deleteOne({ _id: req.params.id });
      res.redirect('back');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
