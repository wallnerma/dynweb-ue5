/*
 * HOMEWORK
 */

const express = require('express');
const templates = require('./views/templates');
const router = require('./router');

const app = express();
templates.initSync();
router(app);

app.listen(3000, () => console.log('Photopick listening on port 3000!'));