const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (client, message, args, tools) => {

  let list = await db.fetch(`joinList_${message.guild.id}`);

  if (list === null || list.length === 0) {

    const embed = new Discord.MessageEmbed()
      .setFooter('Sorry, there are no channels available.');

    return tools.send(message.channel, embed, {
      color: true,
      delete: 5000,
      name: 'No Listings',
      icon: 'https://i.imgur.com/m7ehNQA.png'
    })

  }

  if (message.channel.id !== '436474444567937034') {
    message.delete({
      timeout: 1000
    })
    const embed = new Discord.MessageEmbed()
      .setTitle(`Sorry ${message.author.username},`)
      .setDescription(`Please use ~join in ${client.channels.get('436474444567937034')}`);

    return tools.send(message.channel, embed, {
      color: true,
      delete: 10000,
      name: 'Invalid Use',
      icon: 'https://i.imgur.com/m7ehNQA.png'
    })
  }

  if (isNaN(args[0])) {

    let fetched = await db.fetch(`customChannels_${message.guild.id}`),
      joining = [],
      final = [];

    for (var i in fetched) {
      if (i === 'pool');
      else if (fetched[i].code === args.join(' ').toLowerCase()) {
        joining.push(i);
        try {
          final.push(client.channels.get(i).name);
        } catch (e) {
          console.log(e.stack);
        }
      }
    }

    if (joining.length === 0) {

      const embed = new Discord.MessageEmbed()
        .setFooter('Please specify a number after the command. Example: ~join 6');

      return tools.send(message.channel, embed, {
        delete: 5000,
        color: true,
        name: 'Unknown Number',
        icon: 'https://i.imgur.com/m7ehNQA.png'
      })

    } else {

      for (var i in joining) {
        tools.addUserToChannel(message.author, client.channels.get(joining[i]), false);
      }

      const embed = new Discord.MessageEmbed()
        .setFooter(`Looks like you found something ${message.author.username}!`);

      return tools.send(message.channel, embed, {
        color: true,
        delete: 7500,
        name: 'Searching...',
        icon: 'https://i.imgur.com/m7ehNQA.png'
      })

    }

  } else args[0] = parseInt(args[0]);

  if (!list[args[0] - 1]) {

    const embed = new Discord.MessageEmbed()
      .setFooter('Please specify a valid website number.');

    return tools.send(message.channel, embed, {
      color: true,
      delete: 5000,
      name: 'Unknown Website',
      icon: 'https://i.imgur.com/m7ehNQA.png'
    })

  }

  let channel = client.channels.get(list[args[0] - 1]);

  if (!channel) {

    const embed = new Discord.MessageEmbed()
      .setFooter('Invalid channel, this website may have been deleted.');

    return tools.send(message.channel, embed, {
      color: true,
      delete: 5000,
      name: 'Unknown Channel',
      icon: 'https://i.imgur.com/m7ehNQA.png'
    })

  } else {

    tools.addUserToChannel(message.author, channel, false);
    tools.updateTracker(channel);

    const embed = new Discord.MessageEmbed()
      .setTitle(`Attention ${message.author.username},`)
      .setDescription(`Loading ${channel}`);

    let callback = await tools.send(message.channel, embed, {
      color: true,
      delete: 7500,
      name: 'Searching...',
      icon: 'https://i.imgur.com/m7ehNQA.png'
    })

  }

}