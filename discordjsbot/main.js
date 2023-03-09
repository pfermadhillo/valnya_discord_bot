const Keyv = require('keyv');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { globalPrefix, token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
// const prefixes = new Keyv('sqlite://path/to.sqlite');

const rc = require('./roll_call.js');
const rd = require('./roll_dice.js');


client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.MessageCreate, async message => {
	if (message.author.bot) return;

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
  	var streak	 = parseInt(args[1]);
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





});

client.login(token);