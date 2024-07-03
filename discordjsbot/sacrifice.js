
const { writeFile, readFile } = require("fs");

const path = "sacrificeTickets.json";

const GM_id = "573683013813272606"
const zhu_li_id = "1082882746340356136"
const valnya_active_id = "576081452211372062"
const sacrifice_active_id = "563403299470966816"

const wordArray = [
{
  word: "ping",
  freq: 100,
  replies:["pong","pong","pong","pong","pong","pong","pong","pong","pong","pong","pong","pong",
      "pong","pong","pong","pong","pong","pong","pong","pong","pong","pong","pong","pong",
      "stahp","i got u","wat","wat do", "cash me ousside","no plz no","ooo-wee","oof","big mood",
      "im here", "relax bruh", "chill dawg", "naw, that aint me", "raspberry sherbert","get rekt skrub",
      "roundtrip 24.7ms\n...lol not really", "🇾", "💖💞💝", "㊙️","🍆🍑💦"]
},
{
  word: "fuck",
  freq: 3,
  replies:["language!","language","language..","hey :/", "im telling on you to "+makeRoleFromID(GM_id)]
},
{
  word: "welcome",
  freq: 66,
  replies:["Welcome!!","Welcome to our server!", "Welcome, and be sure to thank "+makeRoleFromID(zhu_li_id)+" for all her hard work!"]
}
]

const ticketRewards = ["😄","🤣😂","🤪","🤠","👻","🖕","🙏","🐄🐮","🌲🔥🌬","🍓","🗺","🛑",
  "🌈","🏆", "*nuffin*","*denada*","*try again later*","**A NEW CAAAR** *loljk*",
  "🐖🐷🐽","🐔🐓",
  "☠ -1 on your next roll 💩","😄 +1 on your next roll 🤡",
  "🐄 +1 on your next roll 🐮","👽 +2 on your next roll *~ as per your customs ~* 👽",
  "take a +1 thx","someone else gets a +1", "It's dangerous to go alone, take this: 😺",
  "🔮 you can ask a deeplore question 🔮", "🎭 you can ask a deeplore question 🎭",
  "⚖ the next npc will *probably* answer the next question truthfully ⚖", 
  "🔒 the next npc will *probably* answer the next question with a lie 🔑",
  "🎅 +1 🧙‍♀️ to a downtime action 👼", "🐍 you 🐍 get 🐍 snaked 🐍",
  "👪 1 free success 👣 to a downtime action 👩‍👩‍👧‍👧 once this gets 10 🦝 (*raccoon*) reacts 🦄",
  "last" 
]

function makeRoleFromID(id){
  return "<@&" + id + ">"
}
function getRandomInt(min, max) { // inclusive
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}
function getReply(word) { // inclusive
    return word.replies[getRandomInt(0,word.replies.length-1)]
}
function checkIfReply(word) { // inclusive
  var isReply = false
  if(word.freq >= 100){
    isReply = true
  }else if(word.freq > getRandomInt(0,99)){
    isReply = true
  }
    return isReply
}

function processCashout(amt){
  var retVal = "\nThe "+amt+" rewards are:  "

  try {
    for(var i = 0;i < amt;i++){
      retVal += "\n|| "+ticketRewards[getRandomInt(0,ticketRewards.length-1)]+" ||"
      // console.log("retVal: ",i,retVal)
    }
  } finally {
    // console.log("retVal: ",retVal)
    return retVal
  }
}


function processTicket(msg, cashout=false, amt=0){
  var dt = new Date()
  var theDate = dt.getDate()
  const author = msg.author;
  readFile(path, (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    // console.log(data)
    
    const parsedData = JSON.parse(data);
    var tickets = 1;
    // updating name in shipping_address
    // parsedData.shipping_address.name = "John Smith";
    if(!parsedData[author]){
      parsedData[author] = {tickets:-1,date:-1}
    }

    var obj = parsedData[author]
    if(cashout || obj.date != theDate){
      obj.date = theDate
    }else{
      msg.channel.send("You cannot get more tickets today.")
      msg.delete()
      return;
    }

    if(cashout){
      tickets = parseInt(obj.tickets)
      if(amt && amt > 0 && amt <= tickets){
        obj.tickets = obj.tickets - amt
        tickets = obj.tickets
      }else{
        obj.tickets = 0
      }
    }else if(obj 
        && obj.tickets
        && obj.tickets >= 1){
      obj.tickets++
      tickets = parseInt(obj.tickets)
    }else{
      obj.tickets = 1
    }

    parsedData[author] = obj
    
    writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
      if (err) {
        console.log("Failed to write updated data to file");
        return;
      }
      console.log("Updated file successfully");

      var outMsg = msg.member.nickname+" now has " +tickets+ " tickets!"
      if(cashout){
        if(amt && amt > 0 && amt <= tickets){
          outMsg = msg.member.nickname+" has cashed out "+amt+" tickets. Current balance is "+tickets+"."
          outMsg += processCashout(amt)
        }else{
          outMsg = msg.member.nickname+" has cashed out "+tickets+" tickets. Current balance is 0."
          outMsg += processCashout(tickets)
        }
      }
      msg.channel.send(outMsg)
      msg.delete()
    });
  });
}




function showTicket(msg, cashout=false, amt=0){
  var dt = new Date()
  var theDate = dt.getDate()
  const author = msg.author;
  readFile(path, (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    // console.log(data)
    
    const parsedData = JSON.parse(data);

    var outMsg = ""
    if(parsedData[author] && parsedData[author].tickets){
      outMsg = msg.member.nickname+" has "+parsedData[author].tickets+" tickets."
    }else{
      outMsg = "Cannot read your id. Try getting a ticket! \nType `.sacrifice ticket` "
    }

    msg.channel.send(outMsg)
    msg.delete()

  })
}

var process_args = function(msg, args){

  var arg0 = null;
  var arg1 = null;
  if(args.length >= 1){arg0 = args[0]}
  if(args.length >= 2){arg1 = args[1]}

  if(arg0 && arg0.includes('ticket')){
    // msg.channel.send("You got a ticket!");
    processTicket(msg)
    
  }else if(arg0 && arg0.includes('cashout')){
    processTicket(msg, true, parseInt(arg1))
  }else if(arg0 && arg0.includes('count')){
    showTicket(msg)
  }else{
    var outMsg = "The commands are as follows:"
    outMsg += "\n `.sacrifice ticket` - gets you a ticket, once a day"
    outMsg += "\n `.sacrifice count` - shows how many tickets you have"
    outMsg += "\n `.sacrifice cashout` - cashes out your tickets into rewards"
    outMsg += "\n `.sacrifice cashout $number$` - cashes out your $number$ of tickets into rewards"
    outMsg += "\n\t example: `.sacrifice cashout 5` - cashes out 5 tickets "

    msg.channel.send(outMsg)
  }


  
}



// const path = "home/json/purchase_history.json";

// readFile(path, (error, data) => {
//     if (error) {
//         console.log(error);
//         return;
//     }
//     console.log(data)
    
//     const parsedData = JSON.parse(data);
    
//     // updating name in shipping_address
//     parsedData.shipping_address.name = "John Smith";
    
//     writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
//         if (err) {
//             console.log("Failed to write updated data to file");
//             return;
//         }
//         console.log("Updated file successfully");
//     });
// });



module.exports = {
   process_args : process_args,

}
