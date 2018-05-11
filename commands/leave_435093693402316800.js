const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (client, message, args, tools) => {

  let list = await db.fetch(`joinList_${message.guild.id}`);
  message.delete({
    timeout: 1000
  })

  let mentioned = message.mentions.channels;
  if (mentioned.first() && mentioned.first().parent && mentioned.first().parent.name.toLowerCase() === 'hypnospace-community') {

    mentioned = mentioned.first();

    mentioned.updateOverwrite(message.author, {
      VIEW_CHANNEL: null
    })

    const embed = new Discord.MessageEmbed()
      .setFooter(`Leaving ${mentioned.name}...`);

    return tools.send(message.channel, embed, {
      delete: 10000,
      color: true,
      name: 'Leaving Page',
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
        .setFooter('Please specify a number or mention a channel after the command. Example: ~leave 6 / ~leave #channel');

      return tools.send(message.channel, embed, {
        delete: 10000,
        color: true,
        name: 'Unknown Number',
        icon: 'https://i.imgur.com/m7ehNQA.png'
      })

    } else {

      for (var i in joining) {
        client.channels.get(joining[i]).updateOverwrite(message.author, {
          VIEW_CHANNEL: null
        })
      }

      const embed = new Discord.MessageEmbed()
        .setFooter(`The website starts to fade from the screen of ${message.author.username}...`);

      return tools.send(message.channel, embed, {
        color: true,
        delete: 7500,
        name: 'Leaving Webpage',
        icon: 'https://i.imgur.com/m7ehNQA.png'
      })

    }

  } else args[0] = parseInt(args[0]);

  if (!list[args[0] - 1]) {

    const embed = new Discord.MessageEmbed()
      .setFooter('Please specify a valid page number.');

    return tools.send(message.channel, embed, {
      delete: 5000,
      color: true,
      name: 'Unknown Page',
      icon: 'https://i.imgur.com/m7ehNQA.png'
    })

  }

  let channel = client.channels.get(list[args[0] - 1]);
  tools.updateTracker(channel);

  channel.updateOverwrite(message.author, {
    VIEW_CHANNEL: null
  })

  const embed = new Discord.MessageEmbed()
    .setFooter(`Leaving ${channel.name}...`);

  let callback = await tools.send(message.channel, embed, {
    delete: 10000,
    color: true,
    name: 'Leaving Page',
    icon: 'https://i.imgur.com/m7ehNQA.png'
  })

}