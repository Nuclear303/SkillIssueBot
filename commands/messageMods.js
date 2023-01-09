const { SlashCommandBuilder, SlashCommandUserOption } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName('message').setDescription("Messages bot-output channel"),
  async execute(interaction){
    const messageEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle("Test embed")
      .addFields({name: "Hello message", value:"Hello guys! I'm a bot!"})
      .setTimestamp()
      .setFooter({text:"example embed"})
    await interaction.guild.channels.cache.get("1062081528567431218").send({embeds:[messageEmbed]});
  }
}
