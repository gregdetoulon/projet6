var express = require('express');
var router = express.Router();
var usersModel = require('../models/usersModel');
var witsModel = require('../models/witsModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");



/* GET users listing. */
router.get('/login', function(req, res, next) {
  let userId = typeof req.session.token === 'undefined' ? '' :  "user connected";
  res.render('login', {userId:''});
});

router.post('/signUp', (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  var password = hash;    
  const newUser = new usersModel({
    userName:req.body.userName,
    mail:req.body.mail,
    password:password,
    isAdmin: false,
  });
  newUser.save()
    .then(() => res.redirect('/users/login'))
    .catch(error => res.status(400).json({ error }));
});

router.post('/signIn', (req, res)=>{
  console.log(req.body.password)
       usersModel.findOne({ mail: req.body.mail })
  .then(user => {
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
    bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        req.session.token = jwt.sign(
          { userId: user._id },
          '1234' 
        )
        if (user.isAdmin == true) {
          res.redirect('/users/admin');
        }else{
          res.redirect('/');
        }
      })
      .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error })); 
});

router.get('/logout', function (req, res) {
  req.session.token = null;
  req.session.destroy();
  res.redirect('/');
})

router.get('/profil', function (req, res) {
  let userId = typeof req.session.token === 'undefined' ? '' :  "user connected";
  var decoded = jwt.decode(req.session.token);
    usersModel.findOne({_id: decoded.userId})
    .then(user => {
      res.render('profil', {user, userId});
    })
    .catch(error => res.status(400).json({ error }));
})

router.post('/newPassword', (req, res, next) => {
  var decoded = jwt.decode(req.session.token);
  id = decoded.userId;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  var password = hash;    
  usersModel.findOneAndUpdate({_id: id},{password: password}, function(err, result){
    if(err){
        res.send(err)
    }
    else{
        res.redirect('/users/login');
    }
  });
})

router.get('/admin', checkAuth, function (req, res) {
  let userId = typeof req.session.token === 'undefined' ? '' :  "user connected";
  witsModel.find({isValid: false})
    .then(wits => {
      res.render('admin', {wits, userId});
    })
    .catch(error => res.status(400).json({ error })); 
})


router.get('/adminValid/:id', function (req, res,next) {
  var id = req.params.id;
  witsModel.findOneAndUpdate({_id:id},{isValid: "true"}, function(err, result){
    if(err){
        res.send(err)
    }
    else{
        res.redirect('/users/admin');
    }
  }) 
})

router.get('/adminDelete/:id', function (req, res,next) {
  var id = req.params.id;
  witsModel.findOneAndDelete({_id:id}, function(err, result){

    if(err){
        res.send(err)
    }
    else{
        res.redirect('/users/admin');
    }
  })  
})

function checkAuth(req, res, next) {
  
  if (req.session.token) {
    var decoded = jwt.decode(req.session.token);
    console.log(decoded);
    usersModel.findOne({_id: decoded.userId})
    .then(user => {
      if (user.isAdmin == true) {
      next();
      }else {
      res.redirect("/users/login");
      }
    })
    .catch(error => {throw error});
    
  } else {
    res.redirect("/users/login");
  }
}


module.exports = router;
