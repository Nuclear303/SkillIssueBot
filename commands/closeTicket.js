const { SlashCommandBuilder} = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
  .setName('closeticket')
  .setDescription("Closes the active ticket")
  .setDefaultMemberPermissions(0),
  async execute(interaction){
    interaction.channel.permissionOverwrites.set([{
      id: interaction.channel.name.split("-")[1],
      deny: [PermissionFlagsBits.ViewChannel]
    },
    {
      id: "894458473247567882",
      deny:[PermissionFlagsBits.ViewChannel]
    }
    ])
    await interaction.reply("Ticket closed.")
  }
}
