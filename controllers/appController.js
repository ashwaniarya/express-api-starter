// Dependencies
const { App ,User} = require('./../models');
const _ = require('lodash')
const createNewApp = (data, callback) => {
  App.findOne({name: /data.name/i}, (err, app) => {
    if(err)
      return callback(err, 500, null);
    else if(app)
      return callback('App Already exists', 400, null);
    else{
      let app = new App(data);
      app.save((err, success) => {
        if(err)
          return callback(err, 500, null);
        else
          return callback(null, 200, success);
      })
    }
  });
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
      return callback('Internal error please contact CheckPost',200,response)
    })
            
}
module.exports = {
  createNewApp,
  findApp,
  setTelegramGroupId,
  setTelegramUserId,
  findAppByGroupId,
  evaluate
}