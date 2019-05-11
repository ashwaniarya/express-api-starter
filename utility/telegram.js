const telegramBot = require('node-telegram-bot-api')
const dotenv = require('dotenv')
const {appController} = require('../controllers')
const axios = require('axios')

dotenv.load()
const token = process.env.TELEGRAM_BOT
const initTelegramBot = ()=>{
  const api = new telegramBot(token, {polling: true});

  api.on('message', function(msg, match) {

    let rexRegisterUser = /^\/registeruser */
    let rexRegisterGroup = /^\/registergroup */
    let rexHelp = /^\/help */
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
      if(exMessage.search(rexHelp) === 0){
        //Don't disturbe the formatting
        let helpText = `
          *CheckPost Bot Help Center*
_A fight against cyberbullies_

INTERNET in 21st Century has become basic need for most of us. And along with its many advantages, there are many problems we face with INTERNET. One such problem is CYBERBULLYING and ONLINE HARASSMENT. CHECK POST is intended to solve this problem by making use of Machine Learning and Web Technologies.

You can use this Bot to delete all the offensive messages automatically in a group.

_It only works for communication happening in english language_

For implementation and doc. Please visit https://checkpostapp.ml
        `
        api.sendMessage(fromId,helpText,{parse_mode:"Markdown"})
      }
      else{
        api.sendMessage(fromId, "No user commands found, please try /help");
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
        let firstName = msg.from.first_name
        let lastName = msg.from.last_name
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

                response = response.split('')
                response = response.map(l=>{
                  if(l === "'") return '"'
                  return l
                })

                response = JSON.parse(response.join(''))
                console.log(response)
                let toxic = response[0].toxic
                let threat = response[0].threat
                let obscene = response[0].obscene
                let insult = response[0].insult
                console.log('Toxic Confidence : ',response[0].toxic)
                console.log('Threat Confidence : ',response[0].threat)
                console.log('Obscence Confidence : ',response[0].obscene)
                console.log('Insult Confidence : ',response[0].insult)

                if(toxic > 0.6 || threat > 0.6 || obscene > 0.6 || insult > 0.6){
                  console.log('FROM ID',fromId,' MESSAGE ID: ',msg["message_id"])
                    // api.editMessageText('Deleted due to obscenity',{message_id:msg["message_id"],chat_id:fromId}).then(status=>{
                    //   console.log("Done")
                    // })
                    api.deleteMessage(fromId,msg["message_id"]).then(status=>{
                      let deletedMsg = `*Deleted due to obscenity*
_Text was from_ ~${firstName}`
                      api.sendMessage(fromId,deletedMsg,{parse_mode:"Markdown"}).then(status=>{
                        console.log(status)
                      })
                  })
                  .catch(e=>{
                    console.log(e)
                  })
                }
                
              })
              .catch(e=>{
                console.log('Error ',e)
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
