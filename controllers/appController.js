// Dependencies
const { App } = require('./../models');

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

module.exports = {
  createNewApp
}