const telegramBot = require('node-telegram-bot-api')
const token = "670739733:AAH2yW6jHlCS3vWP7kUuC3Z0kg3hKp3GWBM"
const {appController} = require('../controllers')
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
           
            api.sendMessage(fromId, "User got registered successfully");
          }
        })
        
      }
      else{
        api.sendMessage(fromId, "No user commands");
      }

    }
    else if(msg.chat.type === "group"){
      console.log('Group Message')
      fromId = msg.chat.id

      if(exMessage.search(rexRegisterGroup) === 0){
        key = exMessage.split(' ')[1]
        console.log('Got some key')
        // appController.setTelegramUserId({key,id:fromId},(err,status,data)=>{
        //   console.log(`ERR: ${err} STATUS: ${status} DATA: ${data}`)
        //   if(err){
        //     api.sendMessage(fromId, err);
        //   }
        //   else{
           
        //     api.sendMessage(fromId, "User got registered successfully");
        //   }
        // })
        api.sendMessage(fromId, "Group got registered successfully");
      }
      else{
        api.sendMessage(fromId, "No user commands");
      }
    }
    else if(msg.chat.type === "supergroup"){
      
      fromId = msg.chat.id
      message = "Message Got deleted"
      
      //console.log('CHATID :',fromId,'  MESSAGE : ',messageId)

      // api.deleteMessage(fromId, message_id).then(status=>{
      //   console.log(statu)
      //   api.sendMessage(fromId,'Message got deleted');
      // })
      // api.deleteMessage(fromid,Str(messageId),(status)=>{
      //   console.log(status)
      // })
      
      api.deleteMessage(fromId,msg["message_id"]).then(status=>{
        console.log(status)
      })
      //api.sendMessage(fromId,'In Super user');
    }
    else{
      
    }
    
    
  });

  console.log("MadansFirstTelegramBot has started. Start conversations in your Telegram.");
}

module.exports = {
  initTelegramBot
}
