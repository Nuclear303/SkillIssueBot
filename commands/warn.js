const { SlashCommandBuilder, EmbedBuilder} = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
  .setName('warn')
  .setDescription("Creates a warning for a user")
  .addUserOption(option =>
    option
    .setName('target')
    .setDescription("User to warn")
    .setRequired(true)
  )
  .addStringOption(option=>
    option
    .setName('reason')
    .setDescription('Reason for the warn')
    .setRequired(true)
  ),
  async execute(interaction){
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason');
    const member = interaction.guild.members.cache.get(target.id);


    const embedForUser = new EmbedBuilder()
    .setTitle("You have been warned!")
    .setColor(0xFF0000)
    .setDescription("Our moderation has decided to give you a warning.")
    .setFields({name: "Reason: ", value: reason})
    .setTimestamp()

    const embedForMods = new EmbedBuilder()
    .setTitle(member.user.globalName + " has been warned")
    .setColor(0xFF0000)
    .setFields({name: "Reason: ", value: reason})
    .setTimestamp()

    member.send({embeds:[embedForUser]});
    interaction.guild.channels.cache.get("1062081528567431218").send({embeds:[embedForMods]})
    interaction.reply("Successfully warned the user");
  }
}
