var express = require('express');
const { replaceOne } = require('../models/witsModel');
var router = express.Router();
var witsModel = require('../models/witsModel');
const multer = require('multer');
// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
 
const upload = multer({ storage: storage })


/* GET home page. */
router.get('/newWit', function(req, res, next) {
  res.render('newWit');
});

router.post('/newWit', upload.single("picture"), (req, res, next) => {
  const file = req.file
  console.log(file);
  const dest = file.destination.split("/");
  const path = dest[1] + "/" + dest[2] + "/" + file.filename;
  const newWits = new witsModel({
    title:req.body.nameWit,
    description:req.body.describe,
    imageUrl: path,
    isValid: false,
  });
  newWits.save()
    .then(() => res.redirect('/'))
    .catch(error => res.status(400).json({ error }));
});



module.exports = router;