var express = require('express');
var router = express.Router();
var usersModel = require('../models/usersModel');
const bcrypt = require('bcrypt');
const { check, validationResult} = require("express-validator/check");
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
      console.log(user);
      return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
    console.log(user);
    bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        req.session.token = jwt.sign(
          { userId: user._id },
          '1234' 
        )
        res.redirect('/');
        
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
  res.render('profil', { userId});
 
})

module.exports = router;
