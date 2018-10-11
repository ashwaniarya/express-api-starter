const telegramBot = require('node-telegram-bot-api')
const token = "670739733:AAH2yW6jHlCS3vWP7kUuC3Z0kg3hKp3GWBM"

const initTelegramBot = ()=>{
  const api = new telegramBot(token, {polling: true});

  api.onText(/\/help/, function(msg, match) {
    let fromId = msg.from.id;
    api.sendMessage(fromId, "I can help you in getting the sentiments of any text you send to me.");
  });

  api.on('message', function(msg, match) {
    let fromId 
    let message = ''
    console.log('ID',fromId)
    console.log(JSON.stringify(msg))
    if(msg.chat.type === "private"){
      fromId = msg.from.id
      message = "They call me MadansFirstTelegramBot. " +
      "I can help you in getting the sentiments of any text you send to me."+
      "To help you i just have few commands.\n/help\n/start\n/sentiments"
    }
    else if(msg.chat.type === "group"){
      fromId = msg.chat.id
      message = "No Gandmasti"
    }
    else if(msg.chat.type === "supergroup"){
      fromId = meg.chat.id
      message = "No Gandmasti"
    }
    api.sendMessage(fromId, message);
  });

  console.log("MadansFirstTelegramBot has started. Start conversations in your Telegram.");
}

module.exports = {
  initTelegramBot
}
