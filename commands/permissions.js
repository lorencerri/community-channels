const Discord = require('discord.js'),
  arraySort = require('array-sort'),
  table = require('table');

exports.run = async (client, message, args, tools) => {

  // Fetch Permission
  let user = message.mentions.users.first() || message.author;
  let permissions = message.channel.permissionsFor(user).serialize();

  // Turn into an array
  permissions = permissions.array();
  // Turn the collection into an array
  let invites = invites.array();

  // Sort the array
  arraySort(invites, 'uses', {
    reverse: true
  });

  // Go through each invite of the server
  let possibleInvites = [
      [' - User - ', ' - Uses - ']
    ],
    inviteCount = 0; // Create an empty string holding the output
  invites.forEach(function(invite) {
    if (invite.channel.id !== '398492449514848256' || invite.inviter.id === '144645791145918464' || invite.uses === 0) return;
    inviteCount++;
    possibleInvites.push([invite.inviter.username, invite.uses])
  })

  const embed = new Discord.MessageEmbed()
    .setColor(0x7289da)
    .setTitle(`Server Invites (${inviteCount})`)
    .setFooter(`Invites w/ 0 uses are not shown`)
    .setDescription(`**Please Note:** *Only invites directing to ${message.guild.channels.get('398492449514848256')} are included in this.*`)
    .addField('Leaderboard', `\`\`\`${table.table(possibleInvites, { border: { topBody: `─`, topJoin: `┬`, topLeft: `┌`, topRight: `┐`, bottomBody: `─`, bottomJoin: `┴`, bottomLeft: `└`, bottomRight: `┘`, bodyLeft: `│`, bodyRight: `│`, bodyJoin: `│`, joinBody: `─`, joinLeft: `├`, joinRight: `┤`, joinJoin: `┼` } })}\`\`\``)
    .addField('How Do I Join?', `**1.** *__Right Click__* on the *#rules-info* channel\n**2.** *Press: __Instant Invite__*\n**3.** ***__Select__: "Set this link to never expire"***\n**4.** *Share your link!*\n\n*Rewards are still being decided upon, although you can start now to earn them!*`)
  message.channel.send(embed)

}