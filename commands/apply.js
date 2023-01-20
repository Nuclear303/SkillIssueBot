const { SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder} = require("discord.js");


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

    await interaction.guild.channels.cache.get("1065586057065807952").send({content: "New application",
    embeds:[
      new EmbedBuilder()
      .setTitle(`${interaction.guild.members.cache.get(interaction.user.id).nickname ?? interaction.user.username} sent an application`)
      .setColor(0x00fc15)
        .addFields({name:"IGN", value:`${interaction.options.getString('ign')}`},
        {name:"Squadron", value:`${interaction.options.getString("squadron")}`})
        .setFooter({text:"Skill Issue Bot - Application Sent"})
        .setTimestamp()
    ],
    components:[new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`accept ${interaction.user.id}`)
          .setLabel("Accept")
          .setStyle(ButtonStyle.Success)
      )
      .addComponents(
        new ButtonBuilder()
        .setCustomId(`reject ${interaction.user.id}`)
        .setLabel("reject")
        .setStyle(ButtonStyle.Danger)
      )]
    })
  }
}
