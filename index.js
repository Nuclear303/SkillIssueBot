require('dotenv').config();
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const {  Client, IntentsBitField, Collection, EmbedBuilder } = require("discord.js");
const path = require("path");
const fs = require("fs");
const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers]
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
    if(!interaction.isCommand()) return;

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
  const defaults = ["https://cdn.discordapp.com/embed/avatars/0.png","https://cdn.discordapp.com/embed/avatars/1.png","https://cdn.discordapp.com/embed/avatars/2.png", "https://cdn.discordapp.com/embed/avatars/3.png","https://cdn.discordapp.com/embed/avatars/4.png" ,"https://cdn.discordapp.com/embed/avatars/5.png"];
  if(defaults.includes(String(member.displayAvatarURL()))){
    const messageEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle("Member kicked")
      .addFields({name: "Nickname", value:`${member.user.username}`},
      {name: "Reason:", value:"Default profile picture"},
      {name: "ID:", value:`${member.id}`})
      .setImage(`${member.displayAvatarURL()}`)
      .setTimestamp()
      .setFooter({text:"Skill Issue Bot"});

      
    const dmEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle("You got kicked")
      .addFields({name: "Reason:", value:"Default profile picture (Safety measure)"},
      {name: "What can I do?", value:"Please change your profile picture and you'll be more than welcome to join!"},
      {name:"Why do you do that?", value:"It's a bot prevention mechanism"})
      .setTimestamp()
      .setFooter({text:"Skill Issue Bot"});
    member.guild.channels.cache.get("1062081528567431218").send({embeds:[messageEmbed]});
    member.send({embeds:[dmEmbed]});
    member.kick();
  }
})
client.login(process.env.TOKEN)