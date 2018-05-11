const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (bot, message, args, tools) => {
    
    const embed = new Discord.MessageEmbed()
            .setFooter('This feature is currently a work in progress.')
            
    return tools.send(message.channel, embed, {
        color: true,
        name: 'Server Limits',
        icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/document-128.png'
    })

}