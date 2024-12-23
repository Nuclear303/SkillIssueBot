const { SlashCommandBuilder} = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
  .setName('closeticket')
  .setDescription("Closes the active ticket")
  .addBooleanOption(option =>
    option.setName('addtoarchive')
    .setDescription('WARNING: This will delete the channel if set to false')
    .setRequired(true)
  ),
  async execute(interaction){
    if(interaction.channel.name.split("-")[0] != "ticket"){
      await interaction.reply({content:"Can't close ticket. Not a ticket channel", ephemeral:true});
      return;
    }
    if(interaction.guild.members.cache.get(interaction.channel.name.split("-")[1])){
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
      }]);
      await interaction.reply("Ticket closed.")
    }
    else{
      await interaction.reply("Ticket closed. Member no longer on the server")
    }
    if(interaction.options.getBoolean("Add to archive")){
      await interaction.channel.setParent("1202957108987830282");
    }
    else{
      await interaction.channel.delete();
    }
  }
    
}
