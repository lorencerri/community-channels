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
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bomb-128.png'
        })
        
    }
    
    if (!message.mentions.members.first() && !message.mentions.roles.first()) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('Please mention a user or role following the command.');
            
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Invalid Amount',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bomb-128.png'
        })
        
    }

    
    
    if (message.mentions.members.first().id === message.author.id || message.mentions.members.first().id === owner) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('You cannot remove this user.');
            
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Invalid User',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bomb-128.png'
        })
        
    }
    
    let target = message.mentions.members.first() || message.mentions.roles.first(),
        name;
        
    if (target.constructor.name === 'Role') name = 'Role';
    else name = 'Member';

    message.channel.updateOverwrite(target, {
        VIEW_CHANNEL: null
    })
    
    const embed = new Discord.MessageEmbed()
        .setFooter(`Successfully removed ${target.name || target.user.username} from the channel.`);
            
    return tools.send(message.channel, embed, {
        color: true,
        name: `${name} Removed`,
        icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bomb-128.png'
    })

}