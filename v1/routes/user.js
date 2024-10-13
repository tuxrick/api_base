const controller = require('../controllers/user/index');
//const verifyToken = require('../utils/authorization').verifyToken;

module.exports = (router) => {

    router.route('/register_user')
        .post(controller.registerUser);

    return router;
}