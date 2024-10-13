module.exports = function(app, router, route){
    
    let user = require('./routes/user.js');
    app.use(route+'/user', user(router));

    return app;
}