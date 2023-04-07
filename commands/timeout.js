const { SlashCommandBuilder, SlashCommandUserOption } = require("@discordjs/builders");
const { Guild, GuildMember } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
  .setName('timeout')
  .setDescription("timeouts people")
  .addUserOption((option) =>
    option
    .setName('target')
    .setDescription("User to timeout")
  )
  .addNumberOption((option)=>
  option
  .setName('time')
  .setDescription('Number of minutes')
  ),
  async execute(interaction){
    const target = interaction.options.getUser('target');
    const time = interaction.options.getNumber('time');
    const member = interaction.guild.members.cache.get(target.id);
    member.timeout(1000*60*time)
  }
}
