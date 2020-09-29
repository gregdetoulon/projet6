var express = require('express');
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
  let userId = typeof req.session.token === 'undefined' ? '' :  "user connected";
  res.render('newWit', {userId});
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


router.get('/details/:id', function (req, res,next) {
  let userId = typeof req.session.token === 'undefined' ? '' :  "user connected";
  var id = req.params.id;
  witsModel.findOne({_id:id})
    .then(wits => {
      res.render('details', {wits, userId})
    })
    .catch(error => res.status(400).json({ error }));
  
})

router.post('/search', (req, res)=>{
  witsModel.findOne({title: req.body.search})
   .then(found => res.redirect(`/wits/details/${found._id}`))
   .catch(error=> console.log(error));
})

module.exports = router;