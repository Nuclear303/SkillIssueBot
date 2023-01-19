const { SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName('apply')
  .setDescription("Sends an application to one of our squadrons")
  .addStringOption(option =>
    option.setName('ign')
    .setDescription('Your in-game nickname')
    .setRequired(true)
  )
  .addStringOption(option =>
    option
    .setName('squadron')
    .setDescription('Tag of the squadron you are applying to (Twix/Marz/Mlky/BNTY)')
    .setRequired(true)
    .addChoices(
      {name:"Twix", value:"Twix"},
      {name:"Marz", value:"Marz"},
      {name:"Mlky", value:"Mlky"},
      {name:"BNTY", value:"BNTY"},
    )
  )
  ,
  async execute(interaction){
    await interaction.reply({content: "Your application has been sent to recruiters", ephemeral:true, embeds:[
      new EmbedBuilder()
        .setTitle("Your application")
        .setColor(0x00fc15)
        .addFields({name:"IGN", value:`${interaction.options.getString('ign')}`},
        {name:"Squadron", value:`${interaction.options.getString("squadron")}`})
        .setFooter({text:"Skill Issue Bot - Application Sent"})
        .setTimestamp()
      ]});
  }
}
