const db = require('quick.db'),
  Discord = require('discord.js');

exports.run = async (bot, message, args, tools) => {

  let owner = await db.fetch(`channelOwner_${message.channel.id}`);

  if (owner !== message.author.id && !message.member.hasPermission('ADMINISTRATOR')) {

    const embed = new Discord.MessageEmbed()
      .setFooter('You do not have the proper permissions to do this.');

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Invalid Permissions',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/stop-128.png'
    })

  }

  if (!message.mentions.members.first()) {

    const embed = new Discord.MessageEmbed()
      .setFooter('Please specify a member to add.');

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Invalid Member',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png'
    })

  }

  let member = message.mentions.members.first(),
    moderators = await db.fetch(`moderators_${message.channel.id}`)

  if (moderators !== null && !moderators.includes(member.id)) {

    const embed = new Discord.MessageEmbed()
      .setFooter('This member is not a moderator.');

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Invalid Moderator',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png'
    })

  }

  moderators.splice(moderators.indexOf(member.id), 1);
  db.set(`moderators_${message.channel.id}`, moderators);

  if (message.guild.id === '435093693402316800') {
    message.channel.updateOverwrite(member.user, {
      SEND_MESSAGES: false
    }).catch(e => console.log(e))
  }

  const embed = new Discord.MessageEmbed()
    .setFooter(`Successfully removed ${member.user.username} as a moderator.`)

  tools.send(message.channel, embed, {
    color: true,
    name: 'Moderator Removed',
    icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png'
  })

}