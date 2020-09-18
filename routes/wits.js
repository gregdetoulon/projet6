var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/newWit', function(req, res, next) {
  res.render('newWit');
});

module.exports = router;