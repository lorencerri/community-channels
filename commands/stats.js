const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (client, message, args, tools) => {
    
    let servers = client.guilds.size,
        users = 0,
        channels = client.channels.size,
        commands = await db.fetch(`commands`);
        
    client.guilds.map(g => users += g.memberCount);
    
    const embed = new Discord.MessageEmbed()
        .setTitle('Community Channels')
        .addField('Servers', servers, true)
        .addField('Users', users, true)
        .addField('Channels', channels, true)
        .addField('Commands Ran', commands.total, true)

    tools.send(message.channel, embed, {
        name: 'Statistics',
        icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/trends-256.png',
        color: true
    })
    
}