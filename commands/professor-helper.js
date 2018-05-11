const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (client, message, args, tools) => {

  let msg = await tools.send(message.channel, `Hello ${message.author.username}! What do you need help with?`, {
    files: ['../Server/optional-channels/images/professor.gif'],
    name: 'Professor Helper',
    icon: 'https://i.imgur.com/SwFnjDm.png'
  })

  const listFilter = (reaction, user) => reaction.emoji.name === '🤐' && user.id !== client.user.id;
  const listCollector = msg.createReactionCollector(listFilter, {
    time: 3.6e+6
  });

  listCollector.on('collect', () => {
    msg.delete();
  });

  await msg.react('🤐');

}