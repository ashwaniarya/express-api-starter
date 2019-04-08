const telegramBot = require('node-telegram-bot-api')
const dotenv = require('dotenv')
const {appController} = require('../controllers')
const axios = require('axios')

dotenv.load()
const token = process.env.TELEGRAM_BOT
const initTelegramBot = ()=>{
  const api = new telegramBot(token, {polling: true});

  api.on('message', function(msg, match) {

    let rexRegisterUser = /^\/registerUser */
    let rexRegisterGroup = /^\/registerGroup */
    let fromId 
    let message = 'no reguest'
    
    console.log(JSON.stringify(msg))

    if(msg.chat.type === "private"){

      console.log('Private Message')
      fromId = msg.from.id
      let exMessage = msg.text
      
      if(exMessage.search(rexRegisterUser) === 0){
        key = exMessage.split(' ')[1]
        console.log('Got some key')
        appController.setTelegramUserId({key,id:fromId},(err,status,data)=>{
          console.log(`ERR: ${err} STATUS: ${status} DATA: ${data}`)
          if(err){
            api.sendMessage(fromId, err);
          }
          else{
           
            api.sendMessage(fromId, "User registered successfully");
          }
        })
        
      }
      else{
        api.sendMessage(fromId, "No user commands");
      }

    }
    else if(msg.chat.type === "group" || msg.chat.type === "supergroup"){
      console.log('Group Message')
      fromId = msg.chat.id
      let exMessage = msg.text
      if(exMessage.search(rexRegisterGroup) === 0){
        key = exMessage.split(' ')[1]
        console.log('Got some key')

        appController.setTelegramGroupId({key,id:fromId},(err,status,data)=>{
          console.log(`ERR: ${err} STATUS: ${status} DATA: ${data}`)
          if(err){
            api.sendMessage(fromId, err);
          }
          else{
            api.deleteMessage(fromId,msg["message_id"]).then(status=>{
              console.log(status)
            })
            api.sendMessage(fromId, "Group registered successfully");
          }
        })
        
      }
      else{
        fromId = msg.chat.id
        let text = msg.text
        appController.findAppByGroupId({id:fromId},(err,status,data)=>{
          console.log(`ERR: ${err} STATUS: ${status} DATA: ${data}`)
          if(err){
            api.sendMessage(fromId, err);
          }
          else{
            console.log(data)
            let url = 'http://127.0.0.1:9797/'+text
            axios.get(url)
              .then(res=>{
                
                let response = res.data
                console.log('Hate Speech Confidence : ',response.classes[0].confidence)
                console.log('Offensive Confidence : ',response.classes[1].confidence)
                if(response.classes[0].confidence > 0.6 || response.classes[1].confidence > 0.6){
                  console.log('FROM ID',fromId,' MESSAGE ID: ',msg["message_id"])
                  api.deleteMessage(fromId,msg["message_id"]).then(status=>{
                    console.log(status)
                  })
                  .catch(e=>{
                    console.log(e)
                  })
                }
                
              })
              .catch(e=>{
                console.log('Error')
              })
            
          }
        })
      }
    }
    else{
      
    }
    
    
  });

  console.log("Telegram Bot has started. Start conversations in your Telegram.");
}

module.exports = {
  initTelegramBot
}
