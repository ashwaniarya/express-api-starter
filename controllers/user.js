//dependencies
const jwt = require('jsonwebtoken')
const {User,Reset} = require('../models')

const getAccessToken = (username,password,callback)=>{
  User.findByCredentials(username,password,(err,status,user)=>{
    if(status === 401) return callback(err,401,null)
    else {
      try{  
        
        let token = jwt.sign({id:user._id},process.env.SECRET_KEY)
        return callback(null,200,{user,token})
      }
      catch(e){
        console.log(e)
        return callback('Signature error',401,null)
      }
    }
    
  })
}


const actvateUser = (userid,callback)=>{

  User.findById(userid)
  .then(user=>{
    if(!user) return callback('User not found',404,null)
    return user.activate()
  })
  .then(user=>{
    return callback(null,200,user)
  })
  .catch(e=>{
    return callback('Internal error',500,null)
  })
}
const addUser = (username,email,password,callback)=>{
  let newUser = new User({
    username,
    password,
    email
  })

  newUser.save()
    .then(user=>{
      return callback(null,200,{activated:user.activated,username:user.username,email:user.email})
    })
    .catch(e=>{
      
      if(e.code === 11000)
        return callback('username or email already exists',401,null)
      else{
        return callback('Internal server error',500,null)
      }
      
    })
}

const generatePasswordReset = (email,callback)=>{
  User.findOne({email})
    .then(user=>{
      if(!user) callback("No user",404, null);
      else{
        Reset.remove({userid:user._id})
        .then(()=>{
          const newReset = new Reset({
            userid:user._id
          })
          newReset.generateReset()
          .then(reset=>{
            return callback(null, 200, reset);
          })
          .catch(err=>{
            return callback('Internal Server Error', 500, null);
          })
        })
        .catch(err=>{
          return callback('Internal Server Error', 500, null);
        })
      }
    })
    .catch(err=>{
      return callback('Internal Server Error', 500, null);
    })
}

const validatePasswordReset = (nonce,callback)=>{
  Reset.validateReset(nonce,(err,status,data)=>{
    callback(err,status,data)
  })
}

const changePassword = (userId,password,callback)=>{
  User.findById(userId)
  .then(user=>{
    if(!user) return callback('Not found',401,null)
    else {
      user.password = password
      user.save()
        .then(user=>{
          return callback(null,200,user)
        })
        .catch(e=>{
          return callback('Internal server error',500,null)
        })
    }
  })
  .catch(e=>{
    return callback('Internal server error',500,null)
  })
}
module.exports = {
  getAccessToken,
  addUser,
  actvateUser,
  generatePasswordReset,
  validatePasswordReset,
  changePassword
}