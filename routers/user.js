const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const controllers = require('../controllers')

const {auth} = require('../middleware/auth')
const {URL} = require('../globals')
let router = express.Router()

router.post('/signup',(req,res)=>{
  if(req.body.username && req.body.password && req.body.email){
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email
    controllers.user.addUser(username,email,password,(err,status,data)=>{
      if(status === 200){
        res.send({err,status,data})
      }
      else{
        res.status(status).send({err,status,data})
      }
    })
  }
  else{
    res.status(400).send({err:'Bad request',status:400,data:null})
  }
})

router.post('/login',(req,res)=>{
  if(req.body.username && req.body.password){
    let username = req.body.username
    let password = req.body.password
    controllers.user.getAccessToken(username,password,(err,status,data)=>{
      if(status === 200){
        if(data.user.activated){
          res.send({err,status,data})
        } else {
          controllers.email.sendActivationLink(`${URL}/user/activate/${data.user._id}`,data.user.email)
          res.send({err,status,data:{user:{activated:false}}})            
        }
        
        
      }
      else{
        res.status(status).send({err,status,data})
      }
    })
  }
  else{
    res.status(400).send({err:'Bad request',status:400,data:null})
  }
  
})

router.get('/activate/:id',(req,res)=>{
  if(req.params.id){
    
    let userid = req.params.id
    console.log(userid)
    if(mongoose.Types.ObjectId.isValid(userid)){
      controllers.user.actvateUser(userid,(err,status,data)=>{
        //res.status(status).send({err,status,data})
        res.render('activate.hbs')
      })
    }
    else{
      res.status(400).send({err:'Invalid Id',data:null})
    }
  }
  else{
    res.status(400).send({err:'Bad request',data:null})
    
  }
})

router.post('/genreset',(req,res)=>{
  if(req.body.email){
    let email = req.body.email
    controllers.user.generatePasswordReset(email,(err,status,data)=>{
      if(status === 200){ 
        controllers.email.sendResetLink(`${URL}/user/valreset/${data.nonce}`,email)
        res.send({err,status,data:'ok'})
      }
      else{
        res.send({err,status,data})
      }
    })
  }
  else{
    res.status(400).send({err:'Bad Request',status:400,data:null})
  }
})


router.get('/valreset/:nonce',(req,res)=>{
  console.log(req.params.nonce)
  if(req.params.nonce){
    controllers.user.validatePasswordReset(req.params.nonce,(err,status,data)=>{
      if(status === 200){
        let token = jwt.sign({id:data},process.env.SECRET_KEY)
        res.render('reset.hbs',{
          token
        })
      }
      else {
        res.status(status).send({err,status,data})
      }
    })
  }else{
    res.status(400).send({err:'Bad Request',status:400,data:null})
  }
})

router.post('/reset',(req,res)=>{
  if(req.body.password && req.body.token){
    let password = req.body.password
    let token = req.body.token
    try{
      let decoded = jwt.verify(token,process.env.SECRET_KEY)
      controllers.user.changePassword(decoded.id,password,(err,status,data)=>{
        if(status === 200){
          res.render('successreset.hbs',{
            message:'Password reset successfull'
          })
          res.send({err,status,data:"ok"})
        }
        else{
          res.status(status).send({err,status,data})
        }
      })
    }
    catch(e){
      res.status(401).send({err:'Signature failed',status:401,data:null})
    }
  } else{
    res.status(404).send({err:'Bad request',status:404,data:null})
  }
})
router.get("/secret",auth, function(req, res){
  res.json("Success! You can not see this without a token");
});



module.exports = router