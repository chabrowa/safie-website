var router = require('express').Router();

router.get('/', function(req, res, next){
  res.render('home');
});

exports.router = router;

