const db = require('quick.db'),
  Discord = require('discord.js');

exports.run = (bot, message, args, tools) => {

  let member = message.mentions.members.first()

  if (!message.member.hasPermission('ADMINISTRATOR')) {

    const embed = new Discord.MessageEmbed()
      .setFooter('You do not have the proper permissions to do this.');

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Invalid Permissions',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
    })

  }

  if (!member) {

    const embed = new Discord.MessageEmbed()
      .setFooter('Please mention a user after the command.');

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Invalid Arguments',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
    })

  }

  db.set(`channelOwner_${message.channel.id}`, member.id);

  const embed = new Discord.MessageEmbed()
    .setColor(0x1db954)
    .setFooter(`Successfully set ${member.user.username} as the owner of this channel.`)

  tools.send(message.channel, embed, {
    name: 'Owner Assigned',
    icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-512.png',
    color: true
  });

}