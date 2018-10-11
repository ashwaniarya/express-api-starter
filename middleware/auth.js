const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const {User} = require('../models')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const dotenv = require('dotenv')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

dotenv.load()
//Passport JWT Strategy
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.SECRET_KEY


const strategy = new JwtStrategy(jwtOptions,(jwt_payload,next)=>{
  
  if(!mongoose.Types.ObjectId.isValid(jwt_payload.id)) next('Invalid token',false)
  User.findById(jwt_payload.id)
  .then(user=>{ 
    if(user) 
      next(null,user)
    else 
      next('Not found',false)
  })
  .catch(e=>{
    console.log(e)
    next(e,false)
  })
})


const auth = (req, res, next)=>{
  passport.authenticate('jwt', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) { return res.status(401).send({err:'unauthorized',data:null}) }
    req.user = user;
    next(null,user);
  })(req, res, next)}
  
//Apply stratefy to passport
passport.use(strategy)

module.exports = {
  passport,
  auth
}