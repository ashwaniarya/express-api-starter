const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const morgan = require('morgan')
const hbs = require('hbs')
const {initTelegramBot} = require('./utility/telegram')

dotenv.load()
//Mongoose take promise
mongoose.Promise = global.Promise
//Mongoose connect to mongodb
mongoose.connect(process.env.MONGODB_URI ,{useNewUrlParser: true})


//middleware
const {passport} = require('./middleware/auth')

//Routers
const { UserRouter, AppRouter } = require('./routers');


//express app initialization
const app = express()

// initTelegramBot()

app.set('view engine','hbs')

//Let app to use
app.use(morgan('dev'))
app.use(passport.initialize())

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log(req.path)
  next();
})

app.use(express.static(__dirname+'/views'))

app.use('/user',UserRouter);
app.use('/app', AppRouter);

app.get("/",(req,res)=>{
  res.json({message:"Hi From server"})
})

// app.get('/secret',passport.authenticate('jwt',{session:false}),(req,res)=>{
//   res.json("Success! you have accessed a secret route")
// })
app.listen(5000,()=>{
  console.log("Server is running at port 5000")
})