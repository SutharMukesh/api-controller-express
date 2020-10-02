/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const controller = require('../dist');

const app = express();

// for parsing application/json
app.use(bodyParser.json());

// Creates collection wise POST routes.
controller({ collectionPath: path.join(__dirname, './collections'), baseUrl: '/sample-base-url', app });

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).send({ status: 'unsucess', error: err.message });
});

app.listen(3000, () => console.log('server running'));
