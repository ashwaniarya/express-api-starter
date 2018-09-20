//depedencies
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

const Schema = mongoose.Schema

const resetSchema = new Schema({
  userid:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  nonce:{
    type:String
  },
  timestamp:{
    type : Number,
		default: Date.now
  }
})

resetSchema.methods.generateReset = function(){
  const reset = this
  let cipher = crypto.createCipher(algorithm,password)
  let crypted = cipher.update(reset.userid.toString(),'utf8','hex')
  crypted += cipher.final('hex')
  reset.nonce = crypted.toString()
	reset.timestamp = Date.now().valueOf()
	return reset.save()
}

resetSchema.statics.validateReset = function(nonce,callback){
  Reset.findOne({nonce})
  .then(reset=>{
    if(!reset) return callback('Reset link Error',401,null)
    let decipher = crypto.createDecipher(algorithm,password)
    let id = decipher.update(nonce,'hex','utf8')
    id += decipher.final('utf8');
    let userid = reset.userid
    console.log('RESET:',reset)
    console.log('ID:',id)
    reset.remove()
    if(id === userid.toString()){
      return callback(null,200,userid)
    }
    else{
      return callback('Reset link Error',401,null)
    }
  })
  .catch(e=>{
    console.log(e)
    return callback('Internal Server Error',500,null)
  })
   
}


const Reset = mongoose.model('Reset',resetSchema)

module.exports = Reset
