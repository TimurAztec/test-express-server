require('dotenv').config();
const debug = require('debug')('database');
const path = require('path');
const { Client } = require("cassandra-driver");
let DBclient;

DBclient = new Client({
    cloud: {
        secureConnectBundle: path.join(__dirname, `/secure-connect-test.zip`),
    },
    credentials: {
        username: process.env.DB_CLIENT_ID,
        password: process.env.DB_CLIENT_SECRET,
    },
});

DBclient.connect();

module.exports = {DBclient}
