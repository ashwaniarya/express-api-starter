// Dependencies
const express = require('express');
const router = express.Router();
const { auth } = require('./../middleware/auth');
const { appController } = require('./../controllers');
const App = require('./../models/app');
const _ = require('lodash')

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key, Authorization");
  next();
});

// POST '/app' to create new app
router.post('/', auth, (req, res, next) => {
  let data = req.body;
  data.userid = req.user._id;
  appController.createNewApp(data, (err, status, data) => {
    res.status(status).send({err, data});
  });
});

// POST '/app/evaluate' to evaluate text for hate speech
router.post('/evaluate', auth, (req, res, next) => {
  App.findOne({_id:req.headers['x-key']},(err,app)=>{
    if(err)
      return res.status(500).send({ err: 'Invalid API KEY' , data: null});
    else if(_.isEmpty(app)){
      return res.status(404).send({ err: 'Invalid API KEY', data: null });
    }
    else{
      appController.evaluate(req.body, (err, status, data) => {
        res.status(status).send({err, data});
      })
    }
       
  })
  
});

module.exports = router;