const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (bot, message, args, tools) => {
  
    let owner = await db.fetch(`channelOwner_${message.channel.id}`),
        moderators = await db.fetch(`moderators_${message.channel.id}`);
    
    if (moderators === null) moderators = [];
    
    if (owner !== message.author.id && !moderators.includes(message.author.id) && !message.member.hasPermission('ADMINISTRATOR')) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('You do not have the proper permissions to do this.');
            
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Invalid Permissions',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/document-128.png'
        })
        
    }
    
    if (!['true', 'false'].includes(args[0].toLowerCase())) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('Please write true or false following the command.');
            
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Invalid Toggle',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/document-128.png'
        })
        
    }
    
    let callback = await message.channel.setNSFW(args[0]).catch(e => {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('This bot does not have the proper permissions (Manage Channels).');
            
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Invalid Permissions',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
        })
        
    })
    
    const embed = new Discord.MessageEmbed()
        .setFooter(`Channel NSFW status set to ${callback.nsfw}.`);
            
    if (callback.nsfw) tools.send(message.channel, embed, {
        color: true,
        name: 'NSFW Status Set',
        icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/document-128.png'
    })

}