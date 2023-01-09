const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
  .setName('ping').setDescription("Sends pong"),
  async execute(interaction){
    await interaction.reply('Pong!');
  }
}
