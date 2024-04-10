var adminRouter = require('./admin');
var userRouter = require('./user');
var auth = require('../service/auth_service')

module.exports = function (app) {
    app.use('/api/user', userRouter);
    app.use('/api/admin', auth, adminRouter);
};