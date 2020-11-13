const express = require('express');

const app = express();
const { Router } = express;
const jsonBodyParser = express.json();

module.exports = { app, Router, jsonBodyParser };
