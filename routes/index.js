module.exports = function initRoutes(app) {
    app.use('/client', require('./client'));
}
