// Dependencies
const express = require('express');
const router = express.Router();
const { auth } = require('./../middleware/auth');
const { appController } = require('./../controllers');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key, Authorization");
  next();
});

// POST '/app' to create new app
router.post('/', auth, (req, res, next) => {
  appController.createNewApp(req.body, (err, status, data) => {
    res.status(status).send({err, data});
  });
});

module.exports = router;