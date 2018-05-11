const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (client, message, args, tools) => {

  if (!message.member.roles.find('name', 'Editor')) {

    const embed = new Discord.MessageEmbed()
      .setFooter('Sorry, you need the Editor role to create a webpage!');

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Website Creation',
      icon: 'https://i.imgur.com/m7ehNQA.png',
      delete: 10000
    })

  }

  function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
      if (array[i] === what) {
        count++;
      }
    }
    return count;
  }

  // Fetch Category
  let category = await db.fetch(`category_${message.guild.id}`),
    authors = await db.fetch(`activeAuthors_${message.guild.id}`);
  if (category === null || category.toLowerCase() === 'none') category = null;
  if (authors === null) authors = [];

  // Verify Parent
  let parent = message.guild.channels.get(category)
  if (!parent || parent === null) category = null;

  if (countInArray(authors, message.member.id) > 1) {

    const embed = new Discord.MessageEmbed()
      .setFooter('Sorry, you already have 2 pages, please ask an administrator to `~assign` one to you.');

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Website Creation',
      icon: 'https://i.imgur.com/m7ehNQA.png',
      delete: 15000
    })

  }

  let channel = await message.guild.channels.create(`webpage`, {
    type: 'text',
    overwrites: [{
        id: message.guild.id,
        denied: ['VIEW_CHANNEL', 'SEND_MESSAGES']
      },
      {
        id: message.author.id,
        allowed: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'ADD_REACTIONS']
      }
    ],
    parent: category
  }).catch(e => {

    let guildID = message.guild.id;
    client.guilds.get(guildID).channels.create('Hypnospace-Community', {
        type: 'category'
      })
      .then(i => db.set(`category_${guildID}`, i.id))

    const embed = new Discord.MessageEmbed()
      .setFooter('Created a new channel category, please re-run this command.');

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Nested Channel Limit Reached',
      icon: 'https://i.imgur.com/m7ehNQA.png'
    })

  })

  if (channel.name) {
    const first = new Discord.MessageEmbed()
      .setFooter(`Welcome to Hypnospace!`)

    tools.send(message.channel, first, {
      icon: 'https://i.imgur.com/m7ehNQA.png',
      color: true,
      name: 'Website Created'
    })

    db.push(`activeAuthors_${message.guild.id}`, message.member.id);

    const embed = new Discord.MessageEmbed()
      .setDescription(`**Hello ${message.member}!**\n\nWelcome to your new website, here, you have full control with a variety of custom & unique features/commands.\n\n**To get started & view the commands, you can do \`~channel\` or \`~help\`\nTo invite members or bots, you can do \`~invite <username>\`** *(Names autocomplete, so you don't need to type the full name)*\n\n**Some other noteable commands are:\n\`~channelName <name>\`\n\`~channelDesc <description>\`**\n\nEnjoy your new website!\n - *${message.guild.name}*`)

    tools.send(channel, embed, {
      icon: 'https://i.imgur.com/m7ehNQA.png',
      color: true,
      name: 'Website'
    })

    let member = message.member;
    if (member) {
      tools.addUserToChannel(member.user, channel, false);
      await db.set(`channelOwner_${channel.id}`, member.id);
    }

  }

}