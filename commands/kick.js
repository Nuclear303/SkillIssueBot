const { SlashCommandBuilder, SlashCommandUserOption } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
  .setName('kick')
  .setDescription("kicks people")
  .addUserOption((option) =>
    option
    .setName('target')
    .setDescription("Person with a pfp")
  ),
  async execute(interaction){
    let message ="";
    const defaults = ["https://cdn.discordapp.com/embed/avatars/1.png","https://cdn.discordapp.com/embed/avatars/2.png", "https://cdn.discordapp.com/embed/avatars/3.png","https://cdn.discordapp.com/embed/avatars/4.png" ,"https://cdn.discordapp.com/embed/avatars/5.png"];
    const target = interaction.options.getUser('target');
    if(defaults.includes(String(target.displayAvatarURL()))){
      await interaction.guild.members.get()
      await interaction.reply(`Kicking ${target.username} for having a default pfp`);
    }
    else{
      await interaction.reply("This user doesn't have a default pfp");
    }
  }
}
