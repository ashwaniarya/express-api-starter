// Dependencies
const { App } = require('./../models');
const { ObjectId } = require('mongodb');

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

module.exports = {
  createNewApp,
  getUserApps
}