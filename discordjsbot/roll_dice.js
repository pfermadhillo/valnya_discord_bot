
const emojiList = [
	"🤪","🤩","🤬","🧡","👍","👎","🌻","☀️","🧊","⛈",
	"🍽","👇","👆🏽","🆙","🧊","❎","☝","⚰","⚰","⚰",
	"💋","💋","💋","⌛","⌛","⌛","🗡","🗡","📉","❔",
	"❔","💎","☯","🌠","🌠","🎭","🧡","🍄","🙄","💊",
	"😃","😃","😃","😃","😃","😃","😃","😃","😃","😃",
	"😦","😦","😦","😦","😦","😦","😦","😦","😦","😦",
	"🌲","🐌","🍉","🚀","🖕🏼","⚡","⚡","⚡","💔","🆘"
	];
//  get more here:   https://www.randomlists.com/emojis?qty=60


let theBones = require('./theBones.json');
let monsterEmojis = require('./monsterEmojis.json');


function oneRoll(min=1, max=12){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function rollD(sides=12){
	return oneRoll(1,sides);
}

function oneInX(x=100){
	return x == rollD(x);
}

function xIn100(x){
	return x >= rollD(100);
}

function rollProgression(iterations=1, start=50, divisor=1, decay=2){
	var i=0;
	var final = 1;
	for(i=0;i<iterations;i++){
		if(xIn100(Math.min(1,Math.round(start/divisor)))){
			final += 1;
		}
		divisor = divisor * decay;
	}
	return final;
}

function rollOne(diceMsg=""){
	var delim = ",";
	if(diceMsg.length == 0){
		delim = "";
	}
	var min = 1;
	var max = 12;
	var oneR = oneRoll();
	var addMsg = '';
	if(oneR == 1){
		addMsg = delim+" **-1**" ;
	}else if(oneR > 8 && oneR < 12){
		addMsg = delim+" "+oneR+" ";
	}else if(oneR == 12){
		addMsg = rollOne(delim+" **12**" )
	}else{
		addMsg = delim+" ~~*"+oneR+"*~~ ";
	}
	return diceMsg + addMsg;
}

function rollDice(dice){
	// return "roll "+ dice +" dice";
	var diceMsg = "";
	var i = 0;
	for(i=0;i<dice;i++){
		diceMsg = rollOne(diceMsg);
	}

	var final = (diceMsg.match(/\*\*12\*\*/g) || []).length
		+ (diceMsg.match(/9/g) || []).length
		+ (diceMsg.match(/10/g) || []).length
		+ (diceMsg.match(/11/g) || []).length
		- (diceMsg.match(/\*\*-1\*\*/g) || []).length;

	if(final < -1){
		return rollDice(dice);
	}

	return "You rolled: ||"+ diceMsg + "||  Successes: **"+final+"**";
}


function rollChance(dice=12){
	var l = oneRoll(0, emojiList.length-1);
	var leftEmoji = emojiList[l];

	var rightEmoji = leftEmoji;
	while (rightEmoji == leftEmoji) {
	  rightEmoji = emojiList[rollD(emojiList.length)-1];
	}

	var big = " **(" + oneRoll() + ")** ";
	var lil = " *]" + oneRoll() + "[* ";

	var tmp = oneRoll(-dice, dice);
	var newThing = tmp;
	while (Math.abs(tmp) >= (dice * 0.916)) {
	  tmp = oneRoll(-dice, dice);
	  newThing += tmp;
	}

	var outMsg = leftEmoji + "  ||" + big + "||  `"+ newThing +"`  ||" + lil + "||  " + rightEmoji;
	return outMsg;
}

function numberOfBones(min=7,max=13,iterations=3){
	var num = 0, i=0;
	for(i=0;i<iterations;i++){
		num += oneRoll(min, max);
	}
	return Math.round(num / iterations);
}

function buildBonesArray(){
	var bones = [] , i=0;
	var len = numberOfBones();
	for(i=0;i<len;i++){
		bones.push([]);
	}

	// console.log("buildBonesArray:", bones);
	return bones;
}

function sortBonesIntoArrays(bones){
	const adjustment = 10; // 10 random faces wont be avilable at all
	var bonesCopy = JSON.parse(JSON.stringify(theBones));
	var i=0;
	var available = bonesCopy.length - adjustment;
	while(available>0){
		i = rollD(bones.length)-1;
		var toAdd = bonesCopy[rollD(bonesCopy.length)-1];
		var dupe = false;
		bones.forEach(tmp => {
			if(tmp.emoji == toAdd.emoji){
				dupe = true;
			}
		});
		if(!dupe){
			bones[i].push(toAdd);
			available -= 1;
		}

		
		// bonesCopy = bonesCopy.splice(i,1);
		// len = bonesCopy.length;
		// console.log("sortBonesIntoArrays while loop:\n", i, bones, bonesCopy);
	}
	// console.log("sortBonesIntoArrays:", bones);
	return bones;
}

function pickBones(bones){
	var picked = [];
	bones.forEach(bone => {
		// var len = bone.length;
		// var i = rollD(len)-1;
		// picked.push(bone[i]);
		picked.push(pickFace(bone));
	});
	return picked;
}

function randTees(r=5){
	var i=0; 
	var tees = "";
	var len = rollD(r);
	for(i=0;i<len;i++){
		tees += " \t ";
	}
	return tees;
}

function rollTheBones(){
	var bones = buildBonesArray();
	bones = sortBonesIntoArrays(bones);
	var picked = pickBones(bones);


	var boneMsg	= "";
	// console.log("rollTheBones:", picked, bones);
	var bump = 1;
	picked.forEach(bone => {
		boneMsg	+= randTees(3) + bone.emoji;
		if(oneInX(bump)){
			boneMsg	+= "\n";
			bump += 1;
		}else{
			bump -= 1;
			if(bump < 1){bump=1;}
		}
		
    });
    return boneMsg;
}


function pickFace(faces){
	var total = 0;
	faces.forEach(face => {
		total += face.wt;
	});

	var num = rollD(total);
	// console.log("pickFace:", total, num);
	var i=0;
	var picked = faces[i];
	while(num > 1){
		num -= faces[i].wt;
		i += 1;
		if(i < faces.length){
			picked = faces[i];
		}else{
			// picked = faces[i];
		}
		
		// console.log("pickFace while loop:", i, num, picked);
	}
	return picked;
}

function generateMonster(power){
	var obj = {
		size: 0,
		damage: 0,
		ap: 0,
		armor: 0,
		vitality: 0,
		speed: 0,
		primary: 0,
		secondary: 0,
		tertiary: 0,
		qty: 0,
		emojis: ""
	};

	var i=0;
	obj.emojis += "||";
	var maxEmojis = oneRoll(1,3);
	for(i=0;i<maxEmojis;i++){
		obj.emojis += pickFace(monsterEmojis.temperment).emoji;
	}
	obj.emojis += "||  | \t\t";
	maxEmojis = oneRoll(4, 7);
	for(i=0;i<maxEmojis;i++){
		var pick = pickFace(monsterEmojis.desc).emoji ;
		if(obj.emojis.includes(pick)){
			pick = pickFace(monsterEmojis.desc).emoji ;
		}
		obj.emojis += pick + "\t";
	}
	

	
	obj.size = (power / 5) + rollProgression(5,70); 
	obj.size = Math.round(obj.size);
	obj.damage = Math.round( power * 0.9 + oneRoll(-2,3) );
	obj.primary =  Math.round( (power * 0.9) + oneRoll(-2,4) );

	var addl = 3;
	for (prop in obj) {
	   // console.log(`key= ${property} value = ${experienceObject[property]}`);
	  if(prop.includes("damage") 
	  		|| prop.includes("size") 
	  		|| prop.includes("primary") 
	  	){
	  	if(xIn100(65)){
	  		obj[prop] += addl;
	  		addl -= 1;
	  	} 
	  }
	}

	obj.ap = Math.round( Math.max(0, (power)/8 + oneRoll(-2,1) ));
	obj.armor = Math.round( Math.max(1, (power)/4 + oneRoll(-1,2) ));
	obj.speed = Math.round( Math.max(obj.size + 3, obj.size + (power)/3 + oneRoll(-1,4) - (obj.damage/10) ));
	obj.vitality = Math.round( Math.max(obj.size + 1, obj.size + (power)/8 + oneRoll(-1,2) ));
	obj.secondary =  Math.round( (obj.primary * 0.7) + oneRoll(0,2) );
	obj.tertiary =  Math.round( (obj.primary * 0.4) + oneRoll(0,2) );
	obj.qty = Math.max(1, Math.round( 5 - obj.size + (power*0.9)/obj.size ));

	var outString = ""+obj.emojis+"\n";
	outString += "Damage: **"+obj.damage+"**  | AP: **"+obj.ap+"**  | Vitality: **"+obj.vitality+"**  "
	outString += "| Size: "+obj.size+"  | Speed: "+obj.speed+"\n";
	outString += "Misc Dicepools: [ "+obj.primary+" | "+obj.secondary+" | "+obj.tertiary+" ]  -"
	outString += "  Suggested #: { "+obj.qty+" }\n";
	return outString;
}

module.exports = {
   rollDice : rollDice,
   rollOne : rollOne,
   rollChance : rollChance,
   rollTheBones : rollTheBones,
   generateMonster : generateMonster,

}
