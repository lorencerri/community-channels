const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (bot, message, args, tools) => {

  let moderators = await db.fetch(`moderators_${message.channel.id}`);

  if (moderators === null || moderators.length === 0) {

    const embed = new Discord.MessageEmbed()
      .setFooter(`This channel does not have any moderators.`);

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Channel Moderators',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png'
    })

  }
  console.log(moderators)
  let resp = '';

  switch (moderators.length) {
    case 1:
      resp = `${message.guild.members.get(moderators[0]).user.username} is the only channel moderator.`;
      break;
    default:

      resp = `This channel has ${moderators.length} moderators: `
      let users = []

      moderators.forEach(function(id) {
        try {
          let member = message.guild.members.get(id).user.username;
          if (member) users.push(member);
        } catch (e) {
          console.log('Invalid...')
        }
      })

      let last = users.pop();
      resp += `${users.join(', ')} & ${last}.`;

  }

  const embed = new Discord.MessageEmbed()
    .setFooter(resp);

  tools.send(message.channel, embed, {
    color: true,
    name: 'Channel Moderators',
    icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png'
  })

}