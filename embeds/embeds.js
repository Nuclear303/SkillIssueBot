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

const inviteLinksEmbed = new EmbedBuilder()
.setColor(0xFF0000)
.setTitle("Timeout: 3 days")
.setDescription("Discord invite links aren't allowed on this server")
.setTimestamp()
.setFooter({text:"Skill Issue Bot"});

const nitroLinksEmbed = new EmbedBuilder()
.setColor(0xFF0000)
.setTitle("Timeout: 3 days")
.setDescription("Discord Nitro links aren't allowed on this server (Scam protection measure)")
.setTimestamp()
.setFooter({text:"Skill Issue Bot"});

const chanLinksEmbed = new EmbedBuilder()
.setColor(0xFF0000)
.setTitle("Timeout: 7 days")
.setDescription("4chan links aren't allowed on this server")
.setTimestamp()
.setFooter({text:"Skill Issue Bot"});

const pornLinksEmbed = new EmbedBuilder()
.setColor(0xFF0000)
.setTitle("Timeout: 7 days")
.setDescription("Porn is not allowed on this server")
.setTimestamp()
.setFooter({text:"Skill Issue Bot"});

const selfharmEmbed = new EmbedBuilder()
.setColor(0xFF0000)
.setTitle("Timeout: 10 minutes")
.setDescription("We do not condone encouraging selfharm on the server")
.setTimestamp()
.setFooter({text:"Skill Issue Bot"});



const gifsEmbed = new EmbedBuilder()
.setColor(0xFF0000)
.setTitle("Timeout: 10 minutes")
.setDescription("The gif sent by you breaks our rules")
.setTimestamp()
.setFooter({text:"Skill Issue Bot"});

module.exports ={
  KickDMEmbed,
  acceptEmbed,
  inviteLinksEmbed,
  nitroLinksEmbed,
  chanLinksEmbed,
  pornLinksEmbed,
  selfharmEmbed,
  gifsEmbed
}