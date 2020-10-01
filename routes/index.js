var express = require('express');
const witsModel = require('../models/witsModel');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let userId = typeof req.session.token === 'undefined' ? '' :  "user connected";
  witsModel.find({isValid: true})
  .then(wits => { 
    res.render('index', {wits, userId})
    }
  )
  .catch(error => res.status(400).json({ error }));
});

module.exports = router;
