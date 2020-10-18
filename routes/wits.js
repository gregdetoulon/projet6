var express = require('express');
var router = express.Router();
var witsModel = require('../models/witsModel');
const multer = require('multer');
const usersModel = require('../models/usersModel');
// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
}) 
const upload = multer({ storage: storage });
const jwt = require("jsonwebtoken");





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
   .then(found => {
      if (found.isValid == true) {
        res.redirect(`/wits/details/${found._id}`);
      }else {
        res.redirect('/')
      };
   })
    .catch(error => res.status(400).json({ error }))
})

router.post('/comment', (req, res) =>{
  var decoded = jwt.decode(req.session.token);
  usersModel.findOne({_id: decoded.userId})
  .then(user => {
    const com = {userName:user.userName, comment:req.body.comm, date:new Date()};
    witsModel.findByIdAndUpdate(req.body.id, {$push:{"comment":com}},{safe: true, upsert: true})
    .then(updateCom => {
      console.log(com);
      res.status(200).send({com})
      
    }).catch(error => {throw error})

  }).catch(error => {throw error})
  
})

router.post('/Likes', (req, res) =>{
  var decoded = jwt.decode(req.session.token);
  usersModel.findOne({_id: decoded.userId})
  .then(user => {
    const Lk = {Likes:user._id};
    witsModel.findByIdAndUpdate(req.body.id, {$push:{"Likes":Lk}},{returnOriginal: false, safe: true, upsert: true})
    .then(updatelike => {
      witsModel.findOne({_id:req.body.id})
      .then(obj =>{
       res.status(200).send({obj}) 
      })
      
      
    }).catch(error => {throw error})

  }).catch(error => {throw error})
  
})

module.exports = router;