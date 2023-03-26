


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
	replies:["language!","hey :/", "im telling on you to "+makeRoleFromID(GM_id)]
},
{
	word: "welcome",
	freq: 66,
	replies:["Welcome!!","Welcome to our server!", "Welcome, and be sure to thank "+makeRoleFromID(zhu_li_id)+" for all her hard work!"]
}
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

var check_word = function(msg){

	wordArray.forEach(word => {
		if(msg.content.toLowerCase().includes(word.word.toLowerCase())){
			if(checkIfReply(word)){
				msg.channel.send(getReply(word));
			}
		}
	})
	
}


module.exports = {
   check_word : check_word,

}
