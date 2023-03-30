const cron = require('cron');

// var userlist = "";
// var poll = {poll:"",user:""};
// var option = [];
// var userlist = [];

const GM_id = "573683013813272606"
const valnya_active_id = "576081452211372062"
const sacrifice_active_id = "563403299470966816"


var announce = "\n Lemme know below if you can make it!";
	announce += "\n";
	announce += "\n🇾 - If you are coming (late is okay)";
	announce += "\n❔ - If you might try but aren't sure";
	announce += "\n🇳 - If you cannot make it";
	announce += "\n";
	announce += "\n We will see you at ";

var meet = "(*Online*) at 6:00pm!"
// role_id:"<@&576081452211372062>"

const rollsToCallArray= [
// {
// 	cron: '0 * * * * *',
// 	guildID:'317773499156660224',
// 	channelID:'563397845432926238',
// 	tagID:GM_id,
// 	message:'   New Test Message at: '+ new Date()
// },
{
	cron: '0 5 15 * * 2', // =  Tuesday 10:05:00 am // -5 GMT
	guildID:'317773499156660224',
	channelID:'563397845432926238',
	tagID:valnya_active_id,
	message:'   **Its is Tuesday my dudes!!**'+announce+meet
},
{
	cron: '0 5 15 * * 4', // =  thursday 10:05:00 am // -5 gmt
	guildID:'317773499156660224',
	channelID:'563397845432926238',
	tagID:sacrifice_active_id,
	message:'   **Its is Thursday my dudes!!**'+announce+meet
}]

function makeRoleFromID(id){
	return "<@&" + id + ">"
}

var check_rollcall = function(){
}

var setup_rollcall = function(client){
	rollsToCallArray.forEach(rtc => {
		let scheduledMessage = new cron.CronJob(rtc.cron, () => {
	      // This runs every day at 10:30:00, you can do anything you want
	      // Specifing your guild (server) and your channel
	        var dayword = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            var msg = " **It is "+dayword+" my dudes!!**";

	        const guild = client.guilds.cache.get(rtc.guildID);
	        const channel = guild.channels.cache.get(rtc.channelID);

	        //         NOTIFY_CHANNEL.send(item.role_id + msg + announce + item.meet)

	        channel.send(makeRoleFromID(rtc.tagID)+rtc.message)
	          .then(message => {
	          	console.log(`Sent message: ${message.content}`)
	          	message.react('🇾').catch(console.error)
		        message.react('❔').catch(console.error)
		        message.react('🇳').catch(console.error)
	          })
	          


	        	// .then(() => message.react('🇾'))
	        	// .then(() => message.react('❔'))
	        	// .then(() => message.react('🇳'))
	        	.catch(console.error);

	        // console.log("Sent message: "+rtc.message)
	    });

	    scheduledMessage.start()
	});
}



module.exports = {
   check_rollcall : check_rollcall,
   setup_rollcall : setup_rollcall,

}
