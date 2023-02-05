const { SlashCommandBuilder, SlashCommandUserOption } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
  .setName('add').setDescription("adds star"),
  async execute(interaction){
      interaction.guild.members.cache.every(member=>{
        if(!member.roles.cache.has("1051078951885357108")){
          member.roles.add("1051078951885357108");
        }
      })
  }
}
