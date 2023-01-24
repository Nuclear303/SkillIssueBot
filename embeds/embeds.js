const {EmbedBuilder} = require("discord.js");
const KickDMEmbed = new EmbedBuilder()
.setColor(0xFF0000)
.setTitle("You got kicked")
.addFields({name: "Reason:", value:"Default profile picture (Safety measure)"},
  {name: "What can I do?", value:"Please change your profile picture and you'll be more than welcome to join!"},
  {name:"Why do you do that?", value:"It's a bot prevention mechanism"})
.setTimestamp()
.setFooter({text:"Skill Issue Bot"});


const acceptEmbed = new EmbedBuilder()
.setColor(0x00fc15)
.setTitle("You got accepted!")
.setDescription("Congratulations you got accepted to the squadron!")
.setTimestamp()
.setFooter({text:"Skill Issue Bot"});

module.exports ={
  KickDMEmbed,
  acceptEmbed
}