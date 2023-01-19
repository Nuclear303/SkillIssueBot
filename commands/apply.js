const { SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
  .setName('apply')
  .setDescription("Sends an application to one of our squadrons")
  .addStringOption((option)=>{
    option
    .setName("ign")
    .setDescription('Your in-game nickname')
    .setRequired(true)
  })
  .addStringOption((option)=>{
    option
    .setName('squadron')
    .setDescription('Tag of the squadron you are applying to (Twix/Marz/Mlky/BNTY)')
    .setRequired(true)
  }),
  async execute(interaction){
    await interaction.reply('Test');
  }
}
