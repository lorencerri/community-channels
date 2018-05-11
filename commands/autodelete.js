const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (client, message, args, tools) => {

  if (!message.member.hasPermission('ADMINISTRATOR')) {

    const embed = new Discord.MessageEmbed()
      .setFooter('You do not have the proper permissions to do this.');

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Invalid Permissions',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
    })

  }

  if (!message.mentions.channels.first()) {

    const embed = new Discord.MessageEmbed()
      .setFooter('Please mention a text channel following the command.');

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Invalid Channel',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
    })

  }

  let list = await db.fetch(`autoDelete_${message.guild.id}`),
    channel = message.mentions.channels.first();

  if (list === null) list = [];

  if (list.includes(channel.id)) {

    list = list.splice(list.indexOf(channel.id), 1);
    await db.set(`autoDelete_${message.guild.id}`, list);

    const embed = new Discord.MessageEmbed()
      .setFooter(`Auto-Delete turned off for #${channel.name}.`);

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Auto-Delete Disabled',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
    })

  } else {

    await db.push(`autoDelete_${message.guild.id}`, channel.id)

    const embed = new Discord.MessageEmbed()
      .setFooter(`Auto-Delete turned on for #${channel.name}.`);

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Auto-Delete Enabled',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
    })

  }

}