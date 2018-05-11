const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (client, message, args, tools, forced) => {
  
    if (message.guild.id === '435093693402316800') {
        let commandFile = require(`./newpage.js`);
        return commandFile.run(client, message, args, tools);
    }
  
    if (!message.member.hasPermission('ADMINISTRATOR') && !forced) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('You do not have the proper permissions to do this.');
            
        return tools.send(message.channel, embed, {
            delete: 10000,
            color: true,
            name: 'Invalid Permissions',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
        })
        
    }
    
    // Fetch Category
    let category = await db.fetch(`category_${message.guild.id}`);
    if (category === null || category.toLowerCase() === 'none') category = null;

    // Verify Parent
    let parent = message.guild.channels.get(category)
    if (!parent || parent === null) category = null;

    let channel = await message.guild.channels.create(`community-channel`, {
        type: 'text',
        overwrites: [
            {
                id: message.guild.id,
                denied: ['VIEW_CHANNEL'],
            },
        ],
        parent: category
    }).catch(e => {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('This bot does not have the proper permissions (Manage Channels).');
            
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Invalid Permissions',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
        })
        
    })
    
    if (channel.name) {
        const first = new Discord.MessageEmbed()
            .setFooter(`Channel created! Please make sure the bot has the proper permissions to view the channel.`)
        
        tools.send(message.channel, first, {
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/magicwand-128.png',
            color: true,
            name: 'Channel Created'
        })
        
        const embed = new Discord.MessageEmbed()
            .setDescription(`**Hello ${message.mentions.members.first() || ''}!**\n\nWelcome to your new channel, in this channel you have full control with a variety of custom & unique features/commands.\n\n**To get started & view the commands, you can do \`~channel\` or \`~help\`\nTo invite members or bots, you can do \`~invite <username>\`** *(Names autocomplete, so you don't need to type the full name)*\n\n**Some other noteable commands are:\n\`~channelName <name>\`\n\`~channelDesc <description>\`**\n\nEnjoy your new channel!\n - *${message.guild.name}*`)
            .setFooter('Feel free to move this channel anywhere or into any category!')
        
        tools.send(channel, embed, {
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/magicwand-128.png',
            color: true,
            name: 'Channel Created'
        })
        
        let member = message.mentions.members.first();
        if (member) {
            tools.addUserToChannel(member.user, channel, false);
            await db.set(`channelOwner_${channel.id}`, member.id);
        }
        
    }
    
}