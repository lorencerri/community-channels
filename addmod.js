const db = require('quick.db'),
      Discord = require('discord.js');

exports.run = async (bot, message, args, tools) => {
    
    let owner = await db.fetch(`channelOwner_${message.channel.id}`);
    
    if (owner !== message.author.id && !message.member.hasPermission('ADMINISTRATOR')) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('You do not have the proper permissions to do this.');
            
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Invalid Permissions',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/stop-128.png'
        })
        
    }
    
    if (!message.mentions.members.first()) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('Please specify a member to add.');
            
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Invalid Member',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png'
        })
        
    }
    
    let member = message.mentions.members.first(),
        moderators = await db.fetch(`moderators_${message.channel.id}`)
  
    if (moderators !== null && moderators.includes(member.id)) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('This member is already a moderator.');
          
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Invalid Member',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png'
        })
        
    }
    
    db.push(`moderators_${message.channel.id}`, member.id);
    
    if (message.guild.id === '435093693402316800') {
        message.channel.updateOverwrite(member.user, {
            SEND_MESSAGES: true
        }).catch(e => console.log(e))
    }
    
    
    const embed = new Discord.MessageEmbed()
        .setFooter(`Successfully added ${member.user.username} as a moderator.`)
    
    tools.send(message.channel, embed, {
        color: true,
        name: 'Moderator Added',
        icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png'
    })

}