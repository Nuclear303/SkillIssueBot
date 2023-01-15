require('dotenv').config();
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const {  Client, IntentsBitField, Collection, EmbedBuilder, ButtonStyle } = require("discord.js");
const {KickDMEmbed} = require("./embeds/embeds");
const path = require("path");
const fs = require("fs");
const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildBans]
});

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}
client.on("ready", _=>{
  const guild_ids = client.guilds.cache.map(guild => guild.id);

  const rest = new REST({version: '9'}).setToken(process.env.TOKEN)

  for (const guildId of guild_ids) {
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
      {body: commands}
    )
    .then(console.log(`Ready to work with ${guildId}`))
    .catch(console.error);
  }
})

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand() && !interaction.isButton()) return;

    if(interaction.isButton()){
      const customId = interaction.customId.split(" ");
      if(customId[0] === "unban"){
        const id = customId[1]
        interaction.guild.members.unban(`${id}`);
        interaction.reply(`Successfully unbanned ${id}`)
      }
    }

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {

      if(command.data.name === 'kick'){
        if (!interaction.member.roles.cache.has('1048606041597812798')) return interaction.reply('You require administator privileges to use that command!');
        else{
          await command.execute(interaction);
        }
      }
      else{
        await command.execute(interaction);
      }
    }
    catch(error)
    {
        console.error(error);
        await interaction.reply({content: "There was an error executing this command"});
    }
});

client.on('guildMemberAdd', member => {
  member.guild.channels.cache.get("999028490164772985").send({embeds:[
    new EmbedBuilder()
    .setTitle("Member joined")
    .setThumbnail(`${member.displayAvatarURL()}`)
    .setColor(0x166AFC)
    .addFields(
      {name: "Nickname", value:`${member.user.tag}`},
      {name: "ID", value:`${member.id}`},
      {name:"Created on", value:`${member.user.createdAt.toDateString()}`}
    )
    .setFooter({text:"Skill Issue Bot - Member Joined"})
    .setTimestamp()
  ]});

  const defaults = ["https://cdn.discordapp.com/embed/avatars/0.png","https://cdn.discordapp.com/embed/avatars/1.png","https://cdn.discordapp.com/embed/avatars/2.png", "https://cdn.discordapp.com/embed/avatars/3.png","https://cdn.discordapp.com/embed/avatars/4.png" ,"https://cdn.discordapp.com/embed/avatars/5.png"];
  if(defaults.includes(String(member.displayAvatarURL()))){
    const messageEmbed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setTitle("Member kicked")
    .addFields({name: "Nickname", value:`${member.user.tag}`},
    {name: "Reason", value:"Default profile picture"},
    {name: "ID", value:`${member.id}`})
    .setImage(`${member.displayAvatarURL()}`)
    .setTimestamp()
    .setFooter({text:"Skill Issue Bot"});

    const sendDM = _=>{
      client.users.fetch(`${member.id}`,false)
      .then((user)=>{
        user.send({embeds:[KickDMEmbed]});
        member.guild.channels.cache.get("1062081528567431218").send(`Successfully sent a message to ${member.user.tag}`);
        console.log(`Successfully messaged ${member.user.username}`)})
        .catch(_=>{
          member.guild.channels.cache.get("1062081528567431218").send(`Could not send a message to ${member.user.tag}.`);
          console.log(`Could not send a message to ${member.user.tag}.`)
      });
    }
    
    member.guild.channels.cache.get("1062081528567431218").send({embeds:[messageEmbed]});  
    sendDM();
    member.kick();
  }
})

client.on("guildMemberRemove", member =>{
  const memberLeft = new EmbedBuilder()
  .setTitle("Member left")
  .setThumbnail(`${member.displayAvatarURL()}`)
  .setColor(0xC93035)
  .addFields({name: "Nickname", value:`${member.user.tag}`},
    {name: "ID", value:`${member.id}`},
  )
  .setFooter({text: "Skill Issue Bot - Member Left"})
  .setTimestamp();
  let roleCount = 1;
  member.roles.cache.each(role =>{
    if(role.name != "@everyone"){
      memberLeft.addFields({name:`Role #${roleCount}:`, value:`@${role.name}`, inline:true})
      roleCount++;
    }
  })
  member.guild.channels.cache.get("999028490164772985").send({embeds:[memberLeft]});
});


client.on("guildBanAdd", (member) => {
  
  member.guild.bans.fetch(`${member.user.id}`).then(ban =>{
    const banMember = new EmbedBuilder()
      .setTitle("Member banned")
      .setThumbnail(`${member.user.displayAvatarURL()}`)
      .setColor(0x8b02fc)
      .addFields({name:"Nickname", value:`${member.user.tag}`},
        {name:"ID", value:`${member.user.id}`},
        {name:"Reason", value:`${ban.reason}`})
      .setFooter({text:"Skill Issue Bot - Member Banned"})
      .setTimestamp();

    const unbanButton = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`unban ${member.user.id}`)
        .setLabel("Unban")
        .setStyle(ButtonStyle.Danger)
    );
    client.channels.fetch("999028671895584848").then(channel =>{
      channel.send({embeds:[banMember],components:[unbanButton]});
    }) 
    })
  
});

client.on("guildBanRemove", (member) => {
  client.channels.fetch("999028671895584848", false).then(channel =>{
    channel.send({embeds:[
      new EmbedBuilder()
      .setTitle("Member unbanned")
      .setThumbnail(`${member.user.displayAvatarURL()}`)
      .setColor(0x00b53c)
      .addFields({name:"Nickname", value:`${member.user.tag}`},
      {name:"ID", value:`${member.user.id}`}
      )
      .setFooter({text:"Skill Issue Bot - Member unbanned"})
      .setTimestamp()
    ]})
  }) 
});
client.login(process.env.TOKEN)