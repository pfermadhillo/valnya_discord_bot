
const { writeFile, readFile } = require("fs");

const path = "userTickets.json";

const GM_id = "573683013813272606"
const zhu_li_id = "1082882746340356136"
const valnya_active_id = "576081452211372062"
const sacrifice_active_id = "563403299470966816"

const millisDay = 86400000
const millisHour = 3600000
const millisMinute = 60000



const weaponRanges = ["touch","short","medium","long","line of sight","everywhere"]

const reactGameArray = [
{emoji:'🐓', value:2, timer: millisMinute, msg:"React w a chicken in one minute and win two tickets!"},
{emoji:'🐄', value:1, timer: millisMinute*20, msg:"React w a cow in twenty minutes and win a ticket!"},
{emoji:'🦇', value:1, timer: millisMinute*30, msg:"React w a 🦇 in 30 minutes and win a ticket!"},
{emoji:'🐉', value:1, timer: millisMinute*40, msg:"React w a 🐉 in 40 minutes and win a ticket!"},
{emoji:'🐬', value:1, timer: millisMinute*50, msg:"React w a 🐬 in 50 minutes and win a ticket!"},
{emoji:'🍆', value:1, timer: millisHour, msg:"React w a eggplant in an hour and win a ticket!"},
{emoji:'🌈', value:1, timer: millisHour*5, msg:"React w a rainbow in the next 5 hours and win a ticket!"},
{emoji:'🤠', value:1, timer: millisHour*7, msg:"React w a 🤠 in the next 7 hours and win a ticket!"},
{emoji:'🦷', value:1, timer: millisHour*8, msg:"React w a 🦷 in the next 8 hours and win a ticket!"},
{emoji:'🐶', value:1, timer: millisHour*9, msg:"React w a 🐶 in the next 9 hours and win a ticket!"},
{emoji:'🐇', value:1, timer: millisHour*11, msg:"React w a 🐇 in the next 11 hours and win a ticket!"},
{emoji:'💤', value:1, timer: millisHour*12, msg:"React w a 💤 in the next 12 hours and win a ticket!"},
{emoji:'🐖', value:1, timer: millisMinute*5, msg:"React w a piggy in five minutes and win a ticket!"}]

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

function getNick(msg){
  var retVal = "User"
  if(msg.member && msg.member.nickname){
    retVal = msg.member.nickname
  }else if(msg.author && msg.author.username){
    retVal = msg.author.username
  }
  return retVal
}
function makeRoleFromID(id){
  return "<@&" + id + ">"
}
function makeAuthorFromID(id){
  return "<@" + id + ">"
}
function getReactGame(){
  return reactGameArray[getRandomInt(0,reactGameArray.length-1)]
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


function rollRandomMonster(){

  var monster = {};

  monster.atk = getRandomInt(1,12);
  monster.def = getRandomInt(1,5);
  monster.highlowdp = [getRandomInt(3,12), getRandomInt(2,11), getRandomInt(1,10)];
  monster.highlowdp = monster.highlowdp.sort((a, b) => b - a);
  monster.size = getRandomInt(1,9);
  if(getRandomInt(0,1)){
    monster.size = 5;
  }
  monster.health = getRandomInt(1,3) + monster.size;
  monster.hasThuam = getRandomInt(0,1);
  monster.number = getRandomInt(1,5);



  //four is normal
  var temp = monster.atk * 0.30
            + monster.def * 0.38
            + monster.highlowdp[0] * 0.13
            + monster.highlowdp[1] * 0.08
            + monster.highlowdp[2] * 0.04
            + monster.size * 0.31
            + monster.health * 0.23
            + monster.hasThuam * 0.30

  // temp = temp * (1 + ((monster.number - 1) * 0.9 ));
  temp = 0.6 * temp * (1 + ((monster.number - 1) * 0.9 ));

  // console.log("temp:",temp)

  monster.dp = temp.toFixed(2)

  return monster;
}

function getMonster(amt){
  var outMsg = "";
  var counter = 0;
  var atkdpDiff = 3;
  var atkhealthDiff = 3;
  var statDiff = 3;

  while(amt > 0){
    var offset = 0.3;
    var monster = rollRandomMonster();
    if(monster.dp < amt - offset || monster.dp > amt +offset ){
      // bad run
      counter = counter + 1;
    }else{
      if(Math.abs(monster.atk-monster.highlowdp[0]) > atkdpDiff ){
        //bad run
      }else if(Math.abs(monster.atk-monster.health) > atkhealthDiff ){
        //bad run
      }else{
        amt = -1;
      }
    }

    if(counter > 9999){
      // console.log("counter999:",monster.dp,monster)
      amt = -1;
    }
  }

  outMsg = "You found "+monster.number+" Monster(s)!  This took  "+counter+" runs to generate: \n"
      + "a:"+monster.atk
      + " , d:"+monster.def
      + " , h/m/l:"+ monster.highlowdp[0] +"/"+ monster.highlowdp[1] +"/"+ monster.highlowdp[2]
      + " , sz:"+monster.size
      + " , hp:"+monster.health
      + " , caster:"+monster.hasThuam
      + " , dp:"+monster.dp
      
  return outMsg;      
}


function rollRandomItem(){

  var item = {armor:0,atk:0,ap:0,penalty:0,range:0};
  // console.log("item:",item)

  var type = getRandomInt(1,100);
  if(type < 2){ // horse
    item.armor = getRandomInt(0,5);
  }else if(type < 60){ // weapon
    item.atk = getRandomInt(1,5);
    item.ap = getRandomInt(0,3);
    item.range = getRandomInt(0,4);
  }else if(type < 100){ // armor
    item.armor = getRandomInt(1,4);
    item.penalty = Math.floor(item.armor,getRandomInt(0,3));
  }else{ // something else

  }

  //four is normal
  var temp = 0;
  temp = item.atk * 1.1
        + item.ap * 1.0
        + item.armor * 1.1
        + item.penalty * -0.29
        + Math.pow(item.range, 1.2)

  // console.log("temp:",temp)

  item.dp = temp.toFixed(2)

  return item;

}


function getItem(amt){
  var outMsg = "";
  var counter = 0;
  var atkdpDiff = 1;
  var atkhealthDiff = 3;
  var statDiff = 3;

  while(amt > 0){
    var offset = 0.7;
    var item = rollRandomItem();

    if(item.dp < amt - offset || item.dp > amt +offset ){
      // bad run
      counter = counter + 1;
    }else{
      if( (item.range-item.atk) > atkdpDiff ){
        //bad run
      }else if(Math.abs(item.atk-item.ap) > atkhealthDiff ){
        //bad run
      }else{
        amt = -1;
      }
    }

    if(counter > 9999){
      // console.log("counter999:",item.dp,item)
      amt = -1;
    }
  }

  outMsg = "You found an Item!  This took "+counter+" runs to generate: \n";
    if(item.atk > 0){outMsg += "atk:"+item.atk+" , "}
    if(item.ap > 0){outMsg += "ap:"+item.ap+" , "}
    if(item.armor > 0){outMsg += "armor:"+item.armor+" , "}
    if(item.penalty > 0){outMsg += "penalty:"+item.penalty+" , "}
    if(item.range > 0){outMsg += "range:"+weaponRanges[item.range]+"("+item.range+") , "}

    outMsg += "dp:"+item.dp;

      
  return outMsg;      
}






function rollRandomtrap(){

  var trap = {armor:0,atk:0,ap:0,penalty:0,range:0};
  // console.log("trap:",trap)

  trap.negToSpot = getRandomInt(0,5);
  trap.atk = getRandomInt(1,5);

  //four is normal
  var temp = 0;
  temp = trap.atk * 1.6
        + trap.negToSpot * 1.5


  // console.log("temp:",temp)

  trap.dp = temp.toFixed(2)

  return trap;

}


function gettrap(amt){
  var outMsg = "";
  var counter = 0;
  var atkdpDiff = 1;
  var atkhealthDiff = 3;
  var statDiff = 3;

  while(amt > 0){
    var offset = 0.7;
    var trap = rollRandomtrap();

    if(trap.dp < amt - offset || trap.dp > amt +offset ){
      // bad run
      counter = counter + 1;
    }else{
      // if( (trap.range-trap.atk) > atkdpDiff ){
      //   //bad run
      // }else if(Math.abs(trap.atk-trap.ap) > atkhealthDiff ){
      //   //bad run
      // }else{
      //   amt = -1;
      // }
      amt = -1;
    }

    if(counter > 9999){
      // console.log("counter999:",trap.dp,trap)
      amt = -1;
    }
  }

  outMsg = "You found a Trap!  This took "+counter+" runs to generate: \n";
    if(trap.atk > 0){outMsg += "atk:"+trap.atk+" , "}
    if(trap.negToSpot > 0){outMsg += "negToSpot:"+trap.negToSpot+" , "}

    outMsg += "dp:"+trap.dp;

      
  return outMsg;      
}







function processRndEnc(msg, amt=0){
  var outMsg;
  if(amt && amt > 0){
    
  }else{
    amt = getRandomInt(3,6);
  }

  var type = getRandomInt(1,100)
  // if(type < 5){
  if(type < 20){
    // monster
    outMsg = getMonster(amt);

  }else if(type < 30){
    // item
    outMsg = getItem(amt);
  }else if(type < 35){
    // trap
    // outMsg = "You found trap";
    outMsg = gettrap(amt);


  }else{
    // none
    outMsg = "You found nothing";
  }

    // console.log("processRndEnc:",amt,type);

  return outMsg;
}


var process_args = function(msg, args){

  var outMsg = "";

  var arg0 = null;
  var arg1 = null;
  if(args.length >= 1){arg0 = args[0]}
  if(args.length >= 2){arg1 = args[1]}

  if(arg0 && arg0.includes('get')){
    // msg.channel.send("You got a ticket!");
    // console.log("arg0:",arg0,arg1);
    outMsg = processRndEnc(msg, parseInt(arg1))
    
  // }else if(arg0 && arg0.includes('cashout')){
  //   processTicket(msg, true, parseInt(arg1))
  // }else if(arg0 && arg0.includes('count')){
  //   showTicket(msg)
  }else{
    var outMsg = "The commands are as follows:"
    outMsg += "\n `.rndenc get` - gets you a random encounter of dicepool 4"
    outMsg += "\n `.rndenc get $number$` - gets you a random encounter of dicepool $number$"
    outMsg += "\n\t example: `.rndenc get 9` - gets you a very difficult random encounter of dicepool 9 "

    // msg.channel.send(outMsg)
  }

  if(outMsg){
    msg.channel.send(outMsg).catch(() => {/*Ignore error*/});
  }
  
}







module.exports = {
   process_args : process_args,

}
