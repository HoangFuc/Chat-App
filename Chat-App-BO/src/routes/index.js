
const userRouter = require('./user.route');
const detailRouter = require('./detail.route');
function route(app) {
    //Dinh tuyen trang list User la /api/userList
    app.use('/api/userList/detail', detailRouter);
    app.use('/api/userList', userRouter);
}

module.exports = route;
