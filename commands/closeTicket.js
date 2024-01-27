const { SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
  .setName('closeticket')
  .setDescription("Closes the active ticket")
  .setDefaultMemberPermissions(0),
  async execute(interaction){
    interaction.channel.permissionOverwrites.set([{
      id: interaction.channel.name.split("-")[1],
      deny: [PermissionFlagsBits.ViewChannel]
    }
    ])
    await interaction.reply("Ticket closed.")
  }
}
