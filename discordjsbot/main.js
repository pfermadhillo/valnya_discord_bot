const Keyv = require('keyv');
const { Client, Events, GatewayIntentBits, PermissionsBitField  } = require('discord.js');
const { globalPrefix, token } = require('./config.json');

const client = new Client({ intents: [
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildMessages, 
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions] });
// const prefixes = new Keyv('sqlite://path/to.sqlite');

const rc = require('./roll_call.js');
const rd = require('./roll_dice.js');
const bfq = require('./bot_funny_quips.js');
const tkts = require('./tickets.js');


const pingList = ["pong","pong","pong","pong","pong","pong","pong","pong","pong","pong","pong","pong",
      "pong","pong","pong","pong","pong","pong","pong","pong","pong","pong","pong","pong",
      "stahp","i got u","wat","wat do", "cash me ousside","no plz no","ooo-wee","oof","big mood",
      "im here", "relax bruh", "chill dawg", "naw, that aint me", "raspberry sherbert","get rekt skrub",
      "roundtrip 24.7ms\n...lol not really", "🇾", "💖💞💝", "㊙️","🍆🍑💦"];

function getRandomInt(min, max) { // inclusive
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}
function isAdmin(msg) {
  // Administrator
  // member.permissions.has(PermissionsBitField.Flags.KickMembers)
  return msg.member.permissions.has(PermissionsBitField.Flags.Administrator)
  // return msg.member.permissionsIn(msg.channel).has("ADMINISTRATOR")
}

client.once(Events.ClientReady, () => {
  var tz_offset = -5 // -5 is central in the summertime
  var dt_central = new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60000) + (3600000 * tz_offset))
  console.log('Ready as '+client.user.tag+", time:"+dt_central);

  // var day = dt_central.getDay()
  // var hour = dt_central.getHours()
  // var minute = dt_central.getMinutes()

  // 0 5 10 * * 2  =  Tuesday 10:05:00 am 

  rc.setup_rollcall(client)
  

            
        // When you want to start
});

client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;

  bfq.check_word(message)

  // if(message.content.includes('ping')){
  //  message.channel.send(pingList[getRandomInt(0,pingList.length-1)]);
  // }

  let args;
  if (message.guild) {
    console.log("msg:",message.content)
    let prefix;

    if (message.content.startsWith(globalPrefix)) {
      prefix = globalPrefix;
    } else {
      // const guildPrefix = await prefixes.get(message.guild.id);
      // if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
    }

    if (!prefix) return;
    args = message.content.slice(prefix.length).trim().split(/\s+/);
  } else {
    const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
    args = message.content.slice(slice).split(/\s+/);
  }

  const command = args.shift().toLowerCase();
  console.log("cmd: ", command, "args:",args)

  if (command === 'prefix') {
    if (args.length) {
      // await prefixes.set(message.guild.id, args[0]);
      return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
    }

    return message.channel.send(`Prefix is `);
  }

  if(command === 'r'){
    var dice = parseInt(args[0]);
      var retval = "Invalid input: \n" + message.content;
      var prefix = "@" + message.author.username.toString() + " sent: \n";
      if(Number.isInteger(dice)){
      console.log("prefix: ", prefix, "dice:",dice,"retval:",retval)

        if(dice > 0 && dice < 100){
          message.channel.send(prefix+rd.rollDice(dice));
        }else{
          message.channel.send(prefix+"You really don't need to be rolling "+dice+" dice..");
        }
        message.delete();
      }else{
        // message.channel.send(prefix+retval);
      }
  }

  if(command === 's'){
    var dice = parseInt(args[0]);
      var retval = "Invalid input: \n" + message.content;
      var prefix = "@" + message.author.username.toString() + "'s streak test: \n";
      if(Number.isInteger(dice)){
        if(dice > 0 && dice < 21){
          message.channel.send(prefix+rd.rollDice(dice) + "\n"+rd.rollDice(dice) + "\n"+rd.rollDice(dice));
          message.channel.send(rd.rollDice(dice) + "\n"+rd.rollDice(dice) + "\n"+rd.rollDice(dice));
          message.channel.send(rd.rollDice(dice) + "\n"+rd.rollDice(dice) + "\n"+rd.rollDice(dice));
          message.channel.send(rd.rollDice(dice) + "\n"+rd.rollDice(dice) + "\n"+rd.rollDice(dice));
        }else{
          message.channel.send(prefix+"You really don't need to be rolling "+dice+" dice..");
        }
        message.delete();
      }else{
        // message.channel.send(prefix+retval);
      }
  }


  if(command === 'gm'){
    var dice = parseInt(args[0]);
    var streak   = parseInt(args[1]);
    var prefix = "@" + message.author.username.toString() + " *feels the Universe like:* \n";
    // console.log("rollChance", dice);
    if(Number.isInteger(dice)){
      if(dice > 0 && dice < 100){
        message.channel.send(prefix+rd.rollChance(dice));
      }else{
        message.channel.send(prefix+"Mmmm.. "+dice+" is too big..");
      }
      message.delete();
    }else if(Number.isInteger(streak)){
      message.channel.send("Running streak: " + streak);
      while (streak > 0 && streak < 100) {
      streak -= 3;
      message.channel.send(rd.rollChance()+"\t"+rd.rollChance()+"\t"+rd.rollChance());
    }
    message.channel.send("...  *phew* ...  done streak: " + streak);
      message.delete();
    }
    else if(message.content.includes("bone")){
      var bonePrefix = "@" + message.author.username.toString() + " wills  ***__T H E   B O N E S__***  to speak! \n";
      message.channel.send(bonePrefix+rd.rollTheBones());
      message.delete();
    }
    else{
      // message.channel.send(prefix+retval);
    }
  }

  if(command === 'monster'){
    var power = parseInt(args[0]);
    var prefix = "@" + message.author.username.toString() + " summons a monster like whoa: \n";
    // console.log("rollChance", dice);
    if(message.content.includes("streak!")){
      message.channel.send("You asked for it....");
      var fakePwr = 4;
      message.channel.send(fakePwr+"\n"+rd.generateMonster(fakePwr)+rd.generateMonster(fakePwr)+rd.generateMonster(fakePwr));
      fakePwr = 8;
      message.channel.send(fakePwr+"\n"+rd.generateMonster(fakePwr)+rd.generateMonster(fakePwr)+rd.generateMonster(fakePwr));
      fakePwr = 14;
      message.channel.send(fakePwr+"\n"+rd.generateMonster(fakePwr)+rd.generateMonster(fakePwr)+rd.generateMonster(fakePwr));
      fakePwr = 20;
      message.channel.send(fakePwr+"\n"+rd.generateMonster(fakePwr)+rd.generateMonster(fakePwr)+rd.generateMonster(fakePwr));
      message.delete();
    }
    if(Number.isInteger(power)){
      if(power > 4 && power < 21){
        message.channel.send(prefix+rd.generateMonster(power));
      }else{
        message.channel.send(prefix+"Power: "+power+", should represent approx highest monster dice pool, between 5 and 20.");
      }
      message.delete();
    }
    else{
      // message.channel.send(prefix+retval);
    }
  }

  if(command === 'ticket'){
    tkts.process_args(message, args);
  }


  if(command === 'ticketreact'){
    if(isAdmin(message)){
      tkts.ticketReactPost(client, message);
    }
  }

  // client.on('messageReactionAdd', (reaction, user) => {
  //   console.log("reaction:",reaction)
  //   if(reaction.emoji.name === "✅") {
  //       console.log("reaction.users:",reaction.users);
  //   }
  // });


});


// client.on(Events.InteractionCreate, async interaction => {
//   console.log("interaction:",interaction)
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === 'ticketreact') {

//     // tkts.ticketReactPost(message, args);

//     const message = await interaction.reply({ content: 'Awaiting emojis...', fetchReply: true });
//     message.react('👍').then(() => message.react('👎'));

//     const filter = (reaction, user) => {
//       return ['👍', '👎'].includes(reaction.emoji.name) && user.id === interaction.user.id;
//     };

//     message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
//       .then(collected => {
//         const reaction = collected.first();

//         if (reaction.emoji.name === '👍') {
//           interaction.followUp('You reacted with a thumbs up.');
//         } else {
//           interaction.followUp('You reacted with a thumbs down.');
//         }
//       })
//       .catch(collected => {
//         console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
//         interaction.followUp('You didn\'t react with neither a thumbs up, nor a thumbs down.');
//       });
//   }
// });

// client.on(Events.InteractionCreate, async interaction => {
//   if (!interaction.isChatInputCommand()) return;

//   const { commandName } = interaction;

//   if (commandName === 'react') {
//     const message = await interaction.reply({ content: 'You can react with Unicode emojis!', fetchReply: true });
//     message.react('😄');
//   }
// });


// client.on(Events.InteractionCreate, async interaction => {
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === 'react-await') {
//     const message = await interaction.reply({ content: 'Awaiting emojis...', fetchReply: true });
//     message.react('👍').then(() => message.react('👎'));

//     const filter = (reaction, user) => {
//       return ['👍', '👎'].includes(reaction.emoji.name) && user.id === interaction.user.id;
//     };

//     message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
//       .then(collected => {
//         const reaction = collected.first();

//         if (reaction.emoji.name === '👍') {
//           interaction.followUp('You reacted with a thumbs up.');
//         } else {
//           interaction.followUp('You reacted with a thumbs down.');
//         }
//       })
//       .catch(collected => {
//         console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
//         interaction.followUp('You didn\'t react with neither a thumbs up, nor a thumbs down.');
//       });
//   }
// });




client.login(token);