const { SlashCommandBuilder, SlashCommandUserOption } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
  .setName('time').setDescription("Displays the current UTC time"),
  async execute(interaction){
    let date = new Date();
    await interaction.reply(`${date.getUTCHours()}:${date.getUTCMinutes()}.${date.getUTCSeconds()}`);
  }
}
