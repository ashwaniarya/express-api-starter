// Dependencies
const { App } = require('./../models');
const { ObjectId } = require('mongodb');
const _ = require('lodash')
const axios = require('axios')

// Create New App
const createNewApp = (data, callback) => {
  App.findOne({name: {$regex: /data.name/i}}, (err, app) => {
    if(err)
      return callback(err, 500, null);
    else if(app)
      return callback('App Already exists', 400, null);
    else{
      let app = new App(data);
      app.user = data.userid;
      app.save((err, success) => {
        if(err)
          return callback(err, 500, null);
        else
          return callback(null, 200, success);
      })
    }
  });
}

// Get User Apps
const getUserApps = (userId, callback) => {
  if(!ObjectId.isValid(userId))
    return callback('Invalid User Id', 500, null);

  App.find({user: userId}, (err, apps) => {
    if(err)
      return callback(err, 500, null);
    else
      return callback(null, 200, apps);
  })
}

const findApp = (data,callback)=>{

  App.findOne({_id:data.appKey},(err,app)=>{
    if(err)
      return callback(err, 500, null);
    else if(_.isEmpty(app)){
      return callback('App not found', 404, null);
    }
    else{
      return callback(null, 200, app);
    }
       
  })

}

const findAppByGroupId = (data,callback)=>{
  App.findOne({telegramGroupId:data.id},(err,app)=>{
    if(err)
      return callback(err, 500, null);
    else if(_.isEmpty(app)){
      return callback('App not found', 404, null);
    }
    else{
      return callback(null, 200, app);
    }
       
  })
}

const setTelegramUserId = (data,callback) =>{
  App.findOne({_id:data.key},(err,app)=>{
    console.log(app)
    if(err)
      return callback('Some internal error, contact checkPost support',500,null)
    else if(app){
      app.telegramUserId = data.id
      app.save((err,success)=>{
        if(err) return callback('Some internal error, contact checkPost support',500,null)
        return callback(null,200,success)
      }) 
    }
    else{
      return callback('App not found',404,null)
    }
  })
}

const setTelegramGroupId = (data,callback)=>{
  App.findOne({_id:data.key},(err,app)=>{
    console.log(app)
    if(err)
      return callback('Some internal error, contact checkPost support',500,null)
    else if(app){
      app.telegramGroupId = data.id
      app.save((err,success)=>{
        if(err) return callback('Some internal error, contact checkPost support',500,null)
        return callback(null,200,success)
      })
    }else{
      callback('App not found',404,null)
    }

  })
}

const evaluate = (data,callback)=>{
  let url = 'http://127.0.0.1:9797/'+data.text
  axios.get(url)
    .then(res=>{
      
      let response = res.data
      return callback(null,200,response)
      
    })
    .catch(e=>{
      console.log('Error')
      return callback('Internal error please contact CheckPost',500,e)
    })
            
}
module.exports = {
  createNewApp,
  getUserApps,
  findApp,
  setTelegramGroupId,
  setTelegramUserId,
  findAppByGroupId,
  evaluate
}