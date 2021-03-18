require('dotenv').config();
let debug = require('debug')('main');
const express = require('express');
const {DBclient} = require('./db');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');

(async () => {
    await DBclient.execute(
        `CREATE TABLE IF NOT EXISTS ${process.env.DB_KEYSPACE}.${process.env.DB_CLIENT_TABLE} (id uuid PRIMARY KEY, name text, package int, balance float);`
    ).then(() => {
        debug('Table exists');
    }).catch((err) => console.log(err));



    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    require('./routes/index')(app);

    app.use(function(req, res, next) {
        next(createError(404));
    });

    app.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        res.status(err.status || 500);
        res.send(err);
    });

    const port = process.env.PORT || 80;
    app.listen(port, () => {
        debug(`Server has been started: ${port}`);
    });
})();
