const { SlashCommandBuilder} = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
  .setName('closeticket')
  .setDescription("Closes the active ticket"),
  async execute(interaction){
    interaction.channel.permissionOverwrites.set([{
      id: interaction.channel.name.split("-")[1],
      allow:[PermissionFlagsBits.ViewChannel],
      deny: [PermissionFlagsBits.SendMessages]
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
    {
      id: "894458473247567882",
      deny:[PermissionFlagsBits.ViewChannel]
    }
    ])
    interaction.channel.setParent("1202957108987830282");
    await interaction.reply("Ticket closed.");
  }
}
