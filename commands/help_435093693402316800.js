const db = require('quick.db');
const Discord = require('discord.js');

exports.run = (client, message, args, tools) => {

  const embed = new Discord.MessageEmbed()
    .setTitle('I see you\'re looking for some help! Here are the commands available to you:')
    .setDescription('`~channelName <name>` renames your custom webpage.\n`~channelDesc <description>` sets a new description for your custom webpage.\n`~invite <name>` invites the specified user to your webpage.\n`~remove <@user>` kick the specified user from your webpage.\n`~setPublic [ true | false ]` lists your webpage in the ' +  client.channels.get('436474444567937034').toString() + '.\n`~addmod <@user>` assigns the user as a moderator for your webpage.\n`~removemod <@user>` removes the user as a moderator for your webpage.')
    .setFooter('[] = optional & <> = required, do not include them in the command. | Please note that the prefix is a tilda, not a dash.')
    .setColor(0xffffff)    

  tools.send(message.channel, embed, {
    name: 'Professor Helper',
    icon: 'https://i.imgur.com/SwFnjDm.png'
  })

}