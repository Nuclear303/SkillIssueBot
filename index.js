require('dotenv').config();
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const {  Client, IntentsBitField, Collection, EmbedBuilder, ButtonStyle } = require("discord.js");
const {KickDMEmbed} = require("./embeds/embeds");
const path = require("path");
const fs = require("fs");
const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { channel } = require('diagnostics_channel');
const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildBans, IntentsBitField.Flags.MessageContent]
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
  client.guilds.fetch("735871800730189916", false).then(guild=>{
    guild.members.fetch();
  })
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

    member.guild.channels.cache.get("1062081528567431218").send({embeds:[messageEmbed]});
    client.users.fetch(`${member.id}`,false)
      .then(_=>{
        member.user.send({embeds:[KickDMEmbed]}).then(_=>{
          member.guild.channels.cache.get("1062081528567431218").send(`Successfully sent a message to ${member.user.tag}`);
          console.log(`Successfully messaged ${member.user.username}`)})
          .catch(_=>{
            member.guild.channels.cache.get("1062081528567431218").send(`Could not send a message to ${member.user.tag}.`);
            console.log(`Could not send a message to ${member.user.tag}.`)
        });
        })
        .catch(_=>{
          member.guild.channels.cache.get("1062081528567431218").send(`Could not send a message to ${member.user.tag}.`);
          console.log(`Could not send a message to ${member.user.tag}.`)
      });
    setTimeout(_=>{member.kick()}, 500);
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

client.on("channelCreate", channel =>{
  client.channels.fetch("1046424601615405056", false).then(log =>{
    log.send({embeds:[
      new EmbedBuilder()
        .setTitle("Channel Created")
        .addFields({name:"Name", value:`#${channel.name}`},
        {name:"Channel ID", value:`${channel.id}`})
        .setColor(0x0796fc)
        .setFooter({text:"Skill Issue Bot - Channel Created"})
        .setTimestamp()
    ]})
  })
});

client.on("channelDelete", channel =>{
  client.channels.fetch("1046424601615405056", false).then(log =>{
    log.send({embeds:[
      new EmbedBuilder()
        .setTitle("Channel Deleted")
        .addFields({name:"Name", value:`#${channel.name}`},
        {name:"Channel ID", value:`${channel.id}`})
        .setColor(0xfc3807)
        .setFooter({text:"Skill Issue Bot - Channel Deleted"})
        .setTimestamp()
    ]})
  })
});
client.on("guildMemberUpdate", (oldM, newM) =>{
  if(oldM.nickname != newM.nickname){
    client.channels.fetch("999028490164772985", false).then(log =>{
      log.send({embeds:[
        new EmbedBuilder()
          .setTitle("Nickname Changed")
          .addFields({name:"Username", value:`${oldM.user.tag}`},
          {name:"Old nickname", value:`${oldM.nickname ?? "No nickname"}`},
          {name:"New nickname", value:`${newM.nickname ?? "No nickname"}`},
          {name:"User ID", value:`${newM.id}`})
          .setColor(0x0796fc)
          .setFooter({text:"Skill Issue Bot - NicknameChanged"})
          .setThumbnail(`${newM.displayAvatarURL()}`)
          .setTimestamp()
      ]})
    })
  }
})

client.on("roleCreate", role =>{
  client.channels.fetch("1046424601615405056", false).then(log =>{
    log.send({embeds:[
      new EmbedBuilder()
        .setTitle("Role Created")
        .addFields({name:"Name", value:`#${role.name}`},
        {name:"Role ID", value:`${role.id}`})
        .setColor(0x0796fc)
        .setFooter({text:"Skill Issue Bot - Role Created"})
        .setTimestamp()
    ]})
  })
})

client.on("roleDelete", role =>{
  client.channels.fetch("1046424601615405056", false).then(log =>{
    log.send({embeds:[
      new EmbedBuilder()
        .setTitle("Role Deleted")
        .addFields({name:"Name", value:`#${role.name}`},
        {name:"Role ID", value:`${role.id}`})
        .setColor(0xfc3807)
        .setFooter({text:"Skill Issue Bot - Role Deleted"})
        .setTimestamp()
    ]})
  })
});

client.on("messageDelete", message =>{
  console.log("here")
  if(message.attachments.size == 0){
    client.channels.fetch("881209789131161651", false).then(log =>{
      log.send({embeds:[
        new EmbedBuilder()
          .setTitle(`Message Deleted in #${message.channel.name}`)
          .addFields({name: "Message Author", value: `@&${message.member.id}`, inline:true},
            {name: "Author ID:", value:`@&${message.member.id}`, inline:true},
            {name: "Content:", value:`${message.content}`}
          )
      ]})
    })
  }
  else{
    message.attachments.forEach(attachment =>{
      client.channels.fetch("1046420086929494107", false).then(log =>{
        log.send({embeds:[
          new EmbedBuilder()
            .setTitle(`Message Deleted in #${message.channel.name}`)
            .addFields({name: "Message Author", value: `@&${message.member}`, inline:true},
              {name: "Author ID:", value:`${message.member.id}`, inline:true},
              {name: "Attachment: ", value:`${attachment}`}
            )
        ]})
      })
    })
  }
})
client.login(process.env.TOKEN)