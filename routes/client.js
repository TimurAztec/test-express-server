require('dotenv').config();
let debug = require('debug')('client:api');
const express = require('express');
const router = express.Router();
const {DBclient} = require('../db');
const cassandra = require('cassandra-driver');

router
    .get('/', (req, res) => {
        const select = `SELECT * FROM ${process.env.DB_KEYSPACE}.${process.env.DB_CLIENT_TABLE}`;
        DBclient
            .execute(select, [], { prepare: true })
            .then((result) => {
                res.status(200).json(result.rows);
            })
            .catch((err) => {
                res.status(404).send({ msg: err });
            });
    })
    .post('/', (req, res) => {
        const { name } = req.body;
        const id = cassandra.types.timeuuid();
        const balance = 0;

        const addClient = `INSERT INTO ${process.env.DB_KEYSPACE}.${process.env.DB_CLIENT_TABLE} (id, name, balance) VALUES (?, ?, ?)`;
        const params = [id, name, balance];
        DBclient
            .execute(addClient, params, { prepare: true })
            .then((result) => {
                res.status(201).json({
                    id,
                    name,
                    balance,
                });
                debug('Client added!');
            })
            .catch((err) => {
                console.error(err);
            });
    })

module.exports = router;
