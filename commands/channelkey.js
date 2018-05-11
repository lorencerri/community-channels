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
  let fetched = await db.fetch(`customChannels_${message.guild.id}`);
  if (!fetched) fetched = {};
  let pool = fetched.pool;
  if (!pool) pool = [];

  switch (pool.includes(message.channel.id)) {
    case true:
      pool.splice(pool.indexOf(message.channel.id), 1);

      embed.setFooter(`Successfully removed #${message.channel.name}'s custom key.`);
      tools.send(message.channel, embed, {
        color: true,
        name: 'Key Removed',
        icon: 'https://i.imgur.com/m7ehNQA.png'
      })

      try {
        delete fetched[message.channel.id];
      } catch (e) {
        console.log(e);
      }
      await db.set(`customChannels_${message.guild.id}`, fetched);
      await db.set(`customChannels_${message.guild.id}`, pool, {
        target: '.pool'
      });
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

      embed.setFooter(`Successfully set this channel's custom key to "${args.join(' ').toLowerCase()}"`);
      tools.send(message.channel, embed, {
        color: true,
        name: 'Key Added',
        icon: 'https://i.imgur.com/m7ehNQA.png'
      })

      db.push(`customChannels_${message.guild.id}`, message.channel.id, {
        target: '.pool'
      });
      db.set(`customChannels_${message.guild.id}`, {
        code: args.join(' ').toLowerCase()
      }, {
        target: `.${message.channel.id}`
      });
      break;
  }

}