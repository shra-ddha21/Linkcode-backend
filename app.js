// Express app configuration and middleware mounting
const express = require('express');
const app = express();

app.use(express.json());

module.exports = app;
