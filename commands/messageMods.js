const { SlashCommandBuilder, SlashCommandUserOption } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
  .setName('message').setDescription("Messages bot-output channel"),
  async execute(interaction){
    await interaction.guild.channels.cache.get("1062081528567431218").send("Hello!");
  }
}
