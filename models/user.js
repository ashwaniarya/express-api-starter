//depedencies
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const _ = require('lodash')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username:{
    type:Schema.Types.String,
    required:true,
    unique:true
  },
  password:{
    type:Schema.Types.String,
    required:true
  },
  email:{
    type:Schema.Types.String,
    minlength:1,
    unique:true
  },
  activated:{
    type:Schema.Types.Boolean,
    default:true
  }
})

userSchema.statics.findByCredentials = function(username,password,callback){
  let User = this
  User.findOne({username},(err,user)=>{
    
    if(err) return callback('Internal server error',500,null) 
    if(!user)  return callback('User not found',401,null)
    bcrypt.compare(password,user.password,(err,result)=>{
      if(result) return callback(null,200,user)
      else return callback('Failed to match username or password',401,null)
    })
    
  })
}

userSchema.methods.activate = function(){
  let user = this
  user.activated = true
  return user.save().then((user)=>{
    return user
  })
}

userSchema.methods.toJSON = function(){
  let User = this
  return _.omit(User.toObject(),['password'])
}
userSchema.pre('save',function(next){
  let user = this
  if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        user.password = hash
        next();
      })
    })
  } else{
    next()
  }
})

const User = mongoose.model('User',userSchema)

module.exports = User
