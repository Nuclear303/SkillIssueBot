require('dotenv').config();
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const {  Client, IntentsBitField, Collection, EmbedBuilder, ButtonStyle, GuildMember } = require("discord.js");
const {KickDMEmbed, acceptEmbed, inviteLinksEmbed, nitroLinksEmbed, chanLinksEmbed, pornLinksEmbed} = require("./embeds/embeds");

const path = require("path");
const fs = require("fs");
const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildBans, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.DirectMessages, IntentsBitField.Flags.GuildPresences]
});

const squadronRole = {
  "Twix": "998675476270825492",
  "Marz": "998675824129605632",
  "Mlky": "998675941712724159",
  "BNTY": "1048551330890924073"
}
const pendingRole = {
  "Twix": "998674829513347082",
  "Marz": "998674942650490940",
  "Mlky": "998675147168948234",
  "BNTY": "1048555345573847080"
}

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

client.on("messageCreate", message =>{
  if(message.content.toLowerCase().includes("woźny")){
    message.delete();
  }
  if(message.author.bot == true || message.member == null) return;
   if (!message.member.roles.cache.has('1048606041597812798')){
    if(message.content.includes("discord.gift") || message.content.includes("free nitro")){
      message.member.timeout(1000*3600*24*3, "Sending/offering free nitro links").catch(_=>{});
      message.member.user.send({embeds: [nitroLinksEmbed]}).then(_=>{
        message.delete();
      }).catch(_=>{});
    }
    else if((message.content.includes("discord.com/invite") || message.content.includes("discord.gg")) && !message.content.includes("discord.gg/Qsybqr6sjZ")){
      message.member.timeout(1000*3600*24*3, "Sending discord invite links").catch(_=>{});
      message.member.user.send({embeds: [inviteLinksEmbed]}).then(_=>{
        message.delete();
      }).catch(_=>{});
      
    }
    else if(message.content.includes("4chan.org")){
      message.member.timeout(1000*3600*24*7, "4chan is not allowed on this server").catch(_=>{});
      message.member.user.send({embeds: [chanLinksEmbed]}).then(_=>{
        message.delete();
      }).catch(_=>{});
    }
    const pornSites = [
      "pornhub.com",
      "xvideos.com",
      "redtube.com",
      "xnxx.com",
      "xhamster.com",
      "rule34.xxx",
      "rule34videos.com",
      "rule34world.com"
    ]
    pornSites.forEach(site => {
      if(message.content.includes(site)){
        message.member.timeout(1000*3600*24*7, "Porn sites aren't allowed on this server").catch(_=>{});
        message.member.user.send({embeds: [pornLinksEmbed]}).then(_=>{
          message.delete();
        }).catch(_=>{});
      }
    });
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
      else if(customId[0] === "accept"){
        if(interaction.guild.members.cache.get(id) != null){
          const id = customId[1];
        if(interaction.guild.members.cache.get(id).roles.cache.has("998674829513347082")){
          interaction.guild.members.cache.get(id).roles.add(squadronRole["Twix"]); 
          interaction.reply(`Accepted user ${interaction.guild.members.cache.get(id).nickname ?? interaction.guild.members.cache.get(id).user.username}`);
          interaction.guild.members.cache.get(id).user.send({embeds: [acceptEmbed]}).catch(_=>{
            console.log("Couldn't send accept embed to user")
          });
          interaction.message.delete().catch(_=>{
            console.log("Couldn't delete application embed")
          });
        }
        else if(interaction.guild.members.cache.get(id).roles.cache.has("998674942650490940")){
          interaction.guild.members.cache.get(id).roles.add(squadronRole["Marz"]); 
          interaction.reply(`Accepted user ${interaction.guild.members.cache.get(id).nickname ?? interaction.guild.members.cache.get(id).user.username}`);
          interaction.guild.members.cache.get(id).send({embeds: [acceptEmbed]}).catch(_=>{
            console.log("Couldn't send accept embed to user")
          });
          interaction.message.delete().catch(_=>{
            console.log("Couldn't delete application embed")
          });
        }
        else if(interaction.guild.members.cache.get(id).roles.cache.has("998675147168948234")){
          interaction.guild.members.cache.get(id).roles.add(squadronRole["Mlky"]); 
          interaction.reply(`Accepted user ${interaction.guild.members.cache.get(id).nickname ?? interaction.guild.members.cache.get(id).user.username}`);
          interaction.guild.members.cache.get(id).send({embeds: [acceptEmbed]}).catch(_=>{
            console.log("Couldn't send accept embed to user")
          });
          interaction.message.delete().catch(_=>{
            console.log("Couldn't delete application embed")
          });
        }
        else if(interaction.guild.members.cache.get(id).roles.cache.has("1048555345573847080")){
          interaction.guild.members.cache.get(id).roles.add(squadronRole["BNTY"]); 
          interaction.reply(`Accepted user ${interaction.guild.members.cache.get(id).nickname ?? interaction.guild.members.cache.get(id).user.username}`);
          interaction.guild.members.cache.get(id).send({embeds: [acceptEmbed]}).catch(_=>{
            console.log("Couldn't send accept embed to user")
          });
          interaction.message.delete().catch(_=>{
            console.log("Couldn't delete application embed")
          });
        }
        else{
          interaction.reply("Error: User left or already verified")
          interaction.message.delete().catch(_=>{
            console.log("Couldn't delete application embed")
          });
        }
        
        }
      }
      else if(customId[0] === "reject"){
        interaction.message.delete().catch(_=>{
          console.log("Couldn't delete application embed")
        });
      }
    }
    
    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {

      if(command.data.name === 'kick'){
        if (!interaction.member.roles.cache.has('1048606041597812798')) return interaction.reply({content: 'You require administator privileges to use that command!', ephemeral:true});
        else{
          await command.execute(interaction);
        }
      }
      else if(command.data.name === 'ping'){
        client.user.setActivity("and judging issues with your skill", {type: "WATCHING"});
        await command.execute(interaction);
      }
      else if(command.data.name === 'apply'){

        if(interaction.channel.id != "1073278274735702108"){
          return interaction.reply({content: `You can only use this command in <#1073278274735702108> !`, ephemeral:true})
        }
        else if((interaction.member.roles.cache.has("998675476270825492") || interaction.member.roles.cache.has("998675824129605632") || interaction.member.roles.cache.has("998675941712724159") || interaction.member.roles.cache.has("1048551330890924073"))){
          return interaction.reply({content: `You're already a member of a squadron!`, ephemeral:true})
        }
        else if(!(interaction.member.roles.cache.has("998674829513347082") || interaction.member.roles.cache.has("998674942650490940") || interaction.member.roles.cache.has("998675147168948234") || interaction.member.roles.cache.has("1048555345573847080"))){
          return interaction.reply({content: `You can't apply without a pending verification role! Get one from <#894445518573404230>`, ephemeral:true})
        }
        else if(((interaction.options.getString('ign') != interaction.guild.members.cache.get(interaction.user.id).nickname))&&(!(interaction.options.getString('ign') == interaction.user.username))){
          return interaction.reply({content: `Your nickname doesn't match the provided IGN! Please change it!`, ephemeral:true})
        }
        else if(!interaction.member.roles.cache.has(pendingRole[interaction.options.getString('squadron')])){
          return interaction.reply({content: `Squadron you mentioned in your application doesn't match your Pending Verification role!`, ephemeral:true})
        }
        else{
          await command.execute(interaction)
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
  else{
    member.roles.add("1051078951885357108");
    member.guild.channels.cache.get("879055215695904788").send({embeds:
      [
        new EmbedBuilder()
        .setTitle(`Welcome to the server, ${member.user.username}!`)
        .setThumbnail(member.displayAvatarURL())
        .setFooter({text: `Skill Issue Bot - Member #${member.guild.memberCount}`})
        .setTimestamp()
      ]})
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
  const guild = client.guilds.cache.get("735871800730189916");
  const member = guild.members.cache.get(`${newM.user.id}`);
  if(oldM.roles.cache.has("1055518589488214026") && (newM.roles.cache.has("998674829513347082") || newM.roles.cache.has("998674942650490940") || newM.roles.cache.has("998675147168948234") || newM.roles.cache.has("1048555345573847080") || member.roles.cache.has("998675476270825492") || member.roles.cache.has("998675824129605632") || member.roles.cache.has("998675941712724159") || member.roles.cache.has("1048551330890924073")) ){
    member.roles.remove("1055518589488214026");
  }

  if(member.roles.cache.has("998674829513347082") && (member.roles.cache.has("998675476270825492") || member.roles.cache.has("998675824129605632") || member.roles.cache.has("998675941712724159") || member.roles.cache.has("1048551330890924073"))){
    member.roles.remove("998674829513347082");
  }
  else if(member.roles.cache.has("998674942650490940") && (member.roles.cache.has("998675476270825492") || member.roles.cache.has("998675824129605632") || member.roles.cache.has("998675941712724159") || member.roles.cache.has("1048551330890924073"))){
    member.roles.remove("998674942650490940");
  }
  else if(member.roles.cache.has("998675147168948234") && (member.roles.cache.has("998675476270825492") || member.roles.cache.has("998675824129605632") || member.roles.cache.has("998675941712724159") || member.roles.cache.has("1048551330890924073"))){
    member.roles.remove("998675147168948234");
  }
  else if(member.roles.cache.has("1048555345573847080") && (member.roles.cache.has("998675476270825492") || member.roles.cache.has("998675824129605632") || member.roles.cache.has("998675941712724159") || member.roles.cache.has("1048551330890924073"))){
    member.roles.remove("1048555345573847080");
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
  if(message.attachments.size == 0){
    client.channels.fetch("881209789131161651", false).then(log =>{
      try{
        log.send({embeds: [
          new EmbedBuilder()
          .setTitle(`Message Deleted in #${message.channel.name}`)
          .setColor(0xa03d13)
          .setFooter({text: "Skill Issue Bot - Message Deleted"})
          .addFields({name: "Message Author", value: `${message.member}`, inline:true},
          {name: "Author ID:", value:`${message.member.id}`, inline:true},
          {name: "Message content", value:`${message.content}`})
          .setTimestamp()
        ]})
      }
      catch(err){

      }
    })
  }
  else{
    message.attachments.forEach(attachment =>{
      client.channels.fetch("1046420086929494107", false).then(log =>{
        log.send({embeds:[
          new EmbedBuilder()
            .setTitle(`Message Deleted in #${message.channel.name}`)
            .setColor(0xa03d13)
            .addFields({name: "Message Author", value: `${message.member}`, inline:true},
              {name: "Author ID:", value:`${message.member.id}`, inline:true}
            )
            .setImage(`${attachment.attachment}`)
            .setFooter({text:"Skill Issue Bot - Attachment Deleted"})
            .setTimestamp()
        ]})
        const extension = attachment.attachment.split('.')[3];
        if(extension == "mp4" || extension == "webm" || extension == "avi" || extension == "mkv"){
          log.send("**Attached media:**");
          log.send(attachment.attachment);
        }
      })
    })
  }
})
client.login(process.env.TOKEN)
