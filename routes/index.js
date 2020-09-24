var express = require('express');
const witsModel = require('../models/witsModel');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  witsModel.find()
    .then(wits => {
      res.render('index', {wits})
    })
    .catch(error => res.status(400).json({ error }));
});

module.exports = router;
