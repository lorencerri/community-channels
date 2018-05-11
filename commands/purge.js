const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (bot, message, args, tools) => {

  let owner = await db.fetch(`channelOwner_${message.channel.id}`),
    moderators = await db.fetch(`moderators_${message.channel.id}`);

  if (moderators === null) moderators = [];

  if (owner !== message.author.id && !moderators.includes(message.author.id) && !message.member.hasPermission('ADMINISTRATOR')) {

    const embed = new Discord.MessageEmbed()
      .setFooter('You do not have the proper permissions to do this.');

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Invalid Permissions',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bomb-128.png'
    })

  }

  if (isNaN(args[0]) || args[0] < 0) {

    const embed = new Discord.MessageEmbed()
      .setFooter('Please input a number following the command.');

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Invalid Amount',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bomb-128.png'
    })

  }

  if (args[0] > 100) args[0] = 100;

  let callback = await message.channel.bulkDelete(args[0]).catch(e => {
    tools.embed(message.channel, `**ERROR:** ${e.message}`)
  })

  const embed = new Discord.MessageEmbed()
    .setFooter(`Successfully deleted ${callback.size}/${args[0]} messages.`);

  return tools.send(message.channel, embed, {
    color: true,
    name: 'Messages Purged',
    icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bomb-128.png'
  }).then(i => i.delete({
    timeout: 10000
  }))

}