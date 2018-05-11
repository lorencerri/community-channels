const db = require('quick.db');
const Discord = require('discord.js');
const send = require('quick.hook');

exports.run = async (client, message, args, tools) => {

  const embed = new Discord.MessageEmbed()
    .setColor(0xffffff)


  if (!message.member.hasPermission('ADMINISTRATOR') && owner !== message.author.id && !moderators.includes(message.author.id)) {

    embed.setFooter('Sorry, this requires the administrator permission.');
    return tools.send(message.channel, embed, {
      color: true,
      name: 'Invalid Permissions',
      icon: 'https://i.imgur.com/m7ehNQA.png'
    })

  }

  // Fetch Channels
  let pool = await db.fetch(`customChannels_${message.guild.id}`);
  if (pool === null) pool = [];

  switch (pool.includes(message.channel.id)) {
    case true:
      pool.splice(pool.indexOf(message.channel.id), 1);

      embed.setFooter(`Successfully removed ${message.channel.name} as a custom channel.`);
      tools.send(message.channel, embed, {
        color: true,
        name: 'Channel Removed',
        icon: 'https://i.imgur.com/m7ehNQA.png'
      })

      db.set(`customChannels_${message.guild.id}`, pool);
      db.delete(`customChannel_${message.channel.id}`);
      break;
    case false:

      if (!args[0]) {

        embed.setFooter('Please enter a word/phrase following the command.');
        return tools.send(message.channel, embed, {
          color: true,
          name: 'Invalid Input',
          icon: 'https://i.imgur.com/m7ehNQA.png'
        })
        break;

      }

      embed.setFooter(`Successfully set this channel's custom code to ${args.join(' ').toLowerCase()}`);
      tools.send(message.channel, embed, {
        color: true,
        name: 'Channel Added',
        icon: 'https://i.imgur.com/m7ehNQA.png'
      })

      db.push(`customChannels_${message.guild.id}`, message.channel.id);
      db.set(`customChannel_${message.channel.id}`, {
        code: args.join(' ').toLowerCase()
      });
      break;
  }

}