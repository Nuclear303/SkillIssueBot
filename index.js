require('dotenv').config();
const {REST} = require("@discordjs/rest");
const {Routes, PermissionFlagsBits} = require("discord-api-types/v9");
const {  Client, IntentsBitField, Collection, EmbedBuilder, ButtonStyle, GuildMember, ChannelType, OverwriteType } = require("discord.js");
const {KickDMEmbed, acceptEmbed, inviteLinksEmbed, nitroLinksEmbed, chanLinksEmbed, pornLinksEmbed, selfharmEmbed, gifsEmbed} = require("./embeds/embeds");

const path = require("path");
const fs = require("fs");
const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildBans, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.DirectMessages, IntentsBitField.Flags.GuildPresences]
});

/**
 * squadronRole - role IDs for roles such as Twix Squadron Verified Member etc.
 */
const squadronRole = {
  "Twix": "998675476270825492",
  "Marz": "998675824129605632",
  "Mlky": "998675941712724159",
  "BNTY": "1048551330890924073"
}

/**
 * pendingRole - role IDs for roles such as Twix Pending Verification etc.
 */

const pendingRole = {
  "Twix": "998674829513347082",
  "Marz": "998674942650490940",
  "Mlky": "998675147168948234",
  "BNTY": "1048555345573847080"
}

function acceptApplication(interaction, embedId){
  interaction.reply({ content: `Accepted user ${interaction.guild.members.cache.get(embedId).nickname ?? interaction.guild.members.cache.get(embedId).user.username}`});
  interaction.guild.members.cache.get(embedId).user.send({embeds: [acceptEmbed]}).catch(err=>{
    console.log(err)
    outputChannel.send("Couldn't send accept embed to user")
  });
  interaction.message.delete().catch(err=>{
    console.log(err)
    console.log("Couldn't delete application embed")
  });
}

const commands = [];
client.commands = new Collection();
let outputChannel;
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
    outputChannel = guild.channels.cache.get("1062081528567431218");
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
  //don't check the messages if sent by a staff member or a bot
  if(message.author.bot == true || message.member == null) return;
   if (!message.member.roles.cache.has('1048606041597812798')){
    const mess = message.content.toLowerCase();
    // delete free nitro links
    if(mess.includes("discord.gift")){
      message.member.timeout(1000*3600*24*3, "Sending/offering free nitro links").catch(_=>{});
      message.member.user.send({embeds: [nitroLinksEmbed]}).then(_=>{
        message.delete();
      }).catch(_=>{});
    }

    // delete discord invite links if they're not the official Remy HUB link
    else if((mess.includes("discord.com/invite") || mess.includes("discord.gg")) && !mess.includes("discord.gg/Qsybqr6sjZ")){
      message.member.timeout(1000*3600*24*3, "Sending discord invite links").catch(err=>{
        console.log(err);
        outputChannel.send("Could not timeout " + message.member.user.username + " for sending an invite link.");
      });
      message.member.user.send({embeds: [inviteLinksEmbed]}).then(_=>{
        message.delete();
      }).catch(err=>{
        console.log(err);
        outputChannel.send("Could not send an inviteLinks embed to " + message.member.user.username);
      });
      
    }

    // disallow 4chan links
    else if(mess.includes("4chan.org")){
      message.member.timeout(1000*3600*24*7, "4chan links are not allowed on this server").catch(err=>{
        console.log(err);
        outputChannel.send("Could not timeout " + message.member.user.username + " for sending a 4chan link.");
      });
      message.member.user.send({embeds: [chanLinksEmbed]}).then(_=>{
        message.delete();
      }).catch(err=>{
        console.log(err);
        outputChannel.send("Could not send a 4chan_delete embed to " + message.member.user.username);
      });
    }
    // disallow encouraging selfharm (even jokingly)
    else if(mess.includes("kys ") || mess.includes(" kys") || mess == "kys" || mess.includes("kуs") || mess.includes("куs")|| mess.includes("кys") ||(mess.includes("kill") && (mess.includes("yourself") || mess.includes("your self") || mess.includes("yourselves") || mess.includes("your selves")))){
      message.member.timeout(1000*600, "Encouraging selfharm").catch(_=>{});
      message.member.user.send({embeds: [selfharmEmbed]}).then(_=>{
        message.delete();
      }).catch(_=>{});
    }
    // list of pornsites that are not allowed (those not listed are still not allowed)
    //TODO: add more sites
    const pornSites = [
      "pornhub.com",
      "xvideos.com",
      "redtube.com",
      "xnxx.com",
      "xhamster.com",
      "rule34.xxx",
      "rule34videos.com",
      "rule34world.com",
      "hentaidude.com",
      "hentaihaven.com"
    ]

    //disallow porn links
    pornSites.forEach(site => {
      if(mess.includes(site)){
        message.member.timeout(1000*3600*24*7, "Porn sites aren't allowed on this server").catch(_=>{});
        message.member.user.send({embeds: [pornLinksEmbed]}).then(_=>{
          message.delete();
        }).catch(_=>{});
      }
    });
    const bannedGifs = [
      "https://media.discordapp.net/attachments/1192235193629679717/1200147172713308302/togif.gif?ex=65ce59a7&is=65bbe4a7&hm=c5d43670f481dab23433f9cdf5d793a7cd5816089257a40f6406e37d4fe9d1c9&"
     ]
     for(let gif of bannedGifs){
      if(mess.includes(gif)){
        message.member.timeout(1000*600, "This gif breaks our rules").catch(_=>{});
        message.member.user.send({embeds: [gifsEmbed]}).then(_=>{
          message.delete();
        }).catch(_=>{});
      }
     }
   }

   
})

client.on("interactionCreate", async interaction => {
    // ignore interactions that are not used in the server
    if(!interaction.isCommand() && !interaction.isButton()) return;
    

    if(interaction.isButton()){
      // customId for applications and bans
      const customId = interaction.customId.split(" ");
      //unbanning banned members
      if(customId[0] === "unban"){
        const id = customId[1]
        interaction.guild.members.unban(`${id}`);
        interaction.reply(`Successfully unbanned ${id}`)
      }
      //accepting squadron applications
      else if(customId[0] === "accept"){
        if(interaction.guild.members.cache.get(customId[1]) != null){
          const id = customId[1];
          if(interaction.guild.members.cache.get(id).roles.cache.has("998674829513347082")){
            interaction.guild.members.cache.get(id).roles.add(squadronRole["Twix"]); 
            acceptApplication(interaction, id);
          }
          else if(interaction.guild.members.cache.get(id).roles.cache.has("998674942650490940")){
            interaction.guild.members.cache.get(id).roles.add(squadronRole["Marz"]); 
            acceptApplication(interaction, id);
          }
          else if(interaction.guild.members.cache.get(id).roles.cache.has("998675147168948234")){
            interaction.guild.members.cache.get(id).roles.add(squadronRole["Mlky"]); 
            acceptApplication(interaction, id);
          }
          else if(interaction.guild.members.cache.get(id).roles.cache.has("1048555345573847080")){
            interaction.guild.members.cache.get(id).roles.add(squadronRole["BNTY"]); 
            acceptApplication(interaction, id);
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
        const id = customId[1];
        if(interaction.guild.members.cache.get(id)){
          const rejectionEmbed = new EmbedBuilder()
          .setColor(0xFF7B00)
          .setTitle("Your application has been rejected")
          .setDescription("We rejected your application to the squadron of your choice.\n\nThe most common reason is, that we didn't find your application in the game.\nAnother reason may be that you reapplied to a new squadron in which case your old application has been rejected .\n\nFor more information, message the recruiter mentioned below")
          .addFields({name:"Recruiter that rejected the application", value: interaction.member.nickname})
          .setTimestamp()
          .setFooter({text:"Skill Issue Bot"});
          interaction.guild.members.cache.get(id).send({embeds: [rejectionEmbed]}).catch(err=>{
            console.log(err)
            outputChannel.send("Couldn't send rejection embed to user");
          });
  
          interaction.message.delete().catch(err=>{
            console.log(err)
            outputChannel.send("Couldn't delete application embed")
          });
        }
        else{
          interaction.message.delete().catch(err=>{
            console.log(err);
            outputChannel.send("Couldn't delete application embed")
          });
        }
        
      }
      else if(customId[0] == "createTicket"){
        const ticketWelcome = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle("Remy HUB Support")
        .setDescription(`Please describe your issue, our staff will respond to you shortly.\nThank you for your patience!`)
        .setTimestamp()
        .setFooter({text:"Skill Issue Bot"});
        interaction.guild.channels.create({
          name:`ticket-${interaction.member.id}`,
          type:ChannelType.GuildText,
          permissionOverwrites:[{
            id: "894458473247567882",
            deny:[PermissionFlagsBits.ViewChannel]
          },
          {
            id: interaction.member.id,
            allow:[PermissionFlagsBits.ViewChannel]
          },
          {
            id:"1048606041597812798",
            allow:[PermissionFlagsBits.ViewChannel]
          },
          {
            id:"998682580268367884",
            allow:[PermissionFlagsBits.ViewChannel]
          },
          {
            id:"893305484537397278",
            allow:[PermissionFlagsBits.ViewChannel]
          },
          ],
          parent:"1200730962401706104"
        })
        .then(channel=>{
          interaction.reply({content:`Ticket created. Go to <#${channel.id}>`, ephemeral:true});
          channel.send({content: `Hi! <@${interaction.member.id}>`, embeds:[ticketWelcome]});
        })
        .catch(err=>{
          console.log(err)
          outputChannel.send("Could not create a ticket channel");
          interaction.reply({content:"Something went wrong. Try again or contact <@484397309476470788> to report a bot bug", ephemeral:true})
        })
      }
    }
    
    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {

      if(['kick', 'timout', 'initializeticket', 'closeticket', 'warn'].includes(command.data.name)){
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
        else if(((interaction.options.getString('ign') != interaction.guild.members.cache.get(interaction.user.id).nickname))&&((interaction.options.getString('ign') != interaction.user.displayName))){
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
        await interaction.reply({content: "There was an error executing this command"})
        .catch(err=>{
          console.log(err);
          outputChannel.send("A command has failed");
        });
    }
});

client.on('guildMemberAdd', member => {
  member.guild.channels.fetch("999028490164772985", false).then(memberLogs=>{
    memberLogs.send({embeds:[
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
  })
  .catch(err=>{
    console.log(err)
    outputChannel.send("Could not fetch #member-logs channel")
  })

  // default profile picture links
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

    outputChannel.send({embeds:[messageEmbed]});


    client.users.fetch(`${member.id}`,false)
      .then(_=>{
        member.user.send({embeds:[KickDMEmbed]}).then(_=>{
          outputChannel.send(`Successfully sent a message to ${member.user.tag}`);
          console.log(`Successfully messaged ${member.user.username}`)})
          .catch(_=>{
            outputChannel.send(`Could not send a message to ${member.user.tag}.`);
            console.log(`Could not send a message to ${member.user.tag}.`)
        });
        })
        .catch(err=>{
          console.log(err)
          outputChannel.send(`Could not send a message to ${member.user.tag}.`);
      });
      // kicks if a user has a default pfp
    setTimeout(_=>{member.kick()}, 500);
  }
  else{
    // adds the * role
    member.roles.add("1051078951885357108");
    member.guild.channels.fetch("879055215695904788", false).then(welcomeChannel=>{
      welcomeChannel.send({embeds:
        [
          new EmbedBuilder()
          .setTitle("Welcome to the server!")
          .setThumbnail(member.displayAvatarURL())
          .setFooter({text: `Skill Issue Bot - Member #${member.guild.memberCount}`})
          .setTimestamp()
        ], content: `Welcome to the server, ${member.user.toString()}!`
      })
    })
    .catch(err=>{
      console.log(err)
      outputChannel.send("Could not fetch #welcome channel")
    })
  }
})

// invoked when a user leaves the server
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
  // lists the users roles before his departure
  member.roles.cache.each(role =>{
    if(role.name != "@everyone"){
      memberLeft.addFields({name:`Role #${roleCount}:`, value:`@${role.name}`, inline:true})
      roleCount++;
    }
  })
  member.guild.channels.cache.get("999028490164772985").send({embeds:[memberLeft]});
});

// invoked when a user is banned
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
      // creates a button allowing for a quick unban
      const unbanButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`unban ${member.user.id}`)
          .setLabel("Unban")
          .setStyle(ButtonStyle.Danger)
      );
      //sends the embed to #warn-logs
      client.channels.fetch("999028671895584848").then(channel =>{
        channel.send({embeds:[banMember],components:[unbanButton]});
      })
      .catch(err=>{
        console.log(err)
        outputChannel.send("Could not fetch #warn-logs channel")
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
    .catch(err=>{
      console.log(err)
      outputChannel.send("Could not fetch #warn-logs channel")
    })
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
  .catch(err=>{
    console.log(err)
    outputChannel.send("Could not fetch #staff-changes channel")
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
    .catch(err=>{
      console.log(err)
      outputChannel.send("Could not fetch #staff-changes channel")
    })
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
      .catch(err=>{
        console.log(err)
        outputChannel.send("Could not fetch #member-logs channel")
      })
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
  .catch(err=>{
    console.log(err)
    outputChannel.send("Could not fetch #member-logs channel")
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
  .catch(err=>{
    console.log(err)
    outputChannel.send("Could not fetch #member-logs channel")
  })
});

client.on("messageDelete", message =>{
    client.channels.fetch("881209789131161651", false).then(log =>{
      try{
        log.send({embeds: [
          new EmbedBuilder()
          .setTitle(`Message Deleted in #${message.channel.name}`)
          .setColor(0xa03d13)
          .setFooter({text: "Skill Issue Bot - Message Deleted"})
          .addFields([{name: "Message Author", value: `${message.member.user.username ?? "N/A"}`, inline:true},
          {name: "Author ID:", value:`${message.member.id ?? "N/A"}`, inline:true},
          {name: "Message content", value:`${message.cleanContent || "empty"}`}])
          .setTimestamp()
        ]})
      }
      catch(err){
        console.log(err)
        client.channels.cache.get("1062081528567431218").send("messageDelete has failed");
      }
    })
    .catch(err=>{
      console.log(err)
      outputChannel.send("Could not fetch #message-log channel")
    })
  message.attachments.forEach(attachment =>{
    client.channels.fetch("1046420086929494107", false).then(log =>{
      log.send({embeds:[
        new EmbedBuilder()
          .setTitle(`Message Deleted in #${message.channel.name}`)
          .setColor(0xa03d13)
          .addFields({name: "Message Author", value: `${message.member}`, inline:true},
            {name: "Author ID:", value:`${message.member.id}`, inline:true}
          )
          .setFooter({text:"Skill Issue Bot - Attachment Deleted"})
          .setTimestamp()
      ]});
      log.send("**Attached media:**");
      log.send(attachment.attachment);
    })
  })
})

client.login(process.env.TOKEN); //login to the client
