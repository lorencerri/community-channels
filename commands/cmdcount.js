const db = require('quick.db'),
  Discord = require('discord.js'),
  arraySort = require('array-sort'),
  table = require('table'),
  hastebin = require('hastebin-gen');

exports.run = async (client, message, args, tools) => {

  let array = [],
    final = [],
    count = -1,
    list = await db.fetch(`commands`);

  for (var i in list) {
    count++;
    array.push({
      name: i,
      count: list[i]
    })
  }

  arraySort(array, 'count', {
    reverse: true
  });

  for (var i in array) {
    final.push([array[i].name, array[i].count]);
  }

  final = table.table(final, {
    border: {
      topBody: `─`,
      topJoin: `┬`,
      topLeft: `┌`,
      topRight: `┐`,
      bottomBody: `─`,
      bottomJoin: `┴`,
      bottomLeft: `└`,
      bottomRight: `┘`,
      bodyLeft: `│`,
      bodyRight: `│`,
      bodyJoin: `│`,
      joinBody: `─`,
      joinLeft: `├`,
      joinRight: `┤`,
      joinJoin: `┼`
    }
  })
  let url = await hastebin(final, "js").catch(err => console.log(err.stack));

  const embed = new Discord.MessageEmbed()
    .setTitle(`Command Counts (${count} commands)`)
    .setDescription(`**[${url}](${url})**`)

  tools.send(message.channel, embed, {
    name: 'Statistics',
    icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/trends-256.png',
    color: true
  })

}