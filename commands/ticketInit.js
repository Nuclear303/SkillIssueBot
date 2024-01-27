const { SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
  .setName('ticketInit')
  .setDescription("Initializes the ticket system")
  .setDefaultMemberPermissions(0),
  async execute(interaction){
    const channel = interaction.guild.channels.cache.get('1200762577941188688');
    await channel.send({
      embeds:[
      new EmbedBuilder()
      .setTitle("Open a ticket :ticket:")
      .setDescription("Need help with something? You're worried about your application? Something broke? Create a ticket and let us know!")
    ],
    components:[
      new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setLabel("Create a ticket")
        .setCustomId("createTicket")
        .setStyle(ButtonStyle.Success)
      )
    ]})
  }
}
