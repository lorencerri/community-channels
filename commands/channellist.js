const db = require('quick.db');
const Discord = require('discord.js');
const send = require('quick.hook');

exports.run = async (client, message, args, tools) => {
    
    async function createPosted() {
        
        let name;
        if (!args[0]) name = 'Community Channels';
        else name = args.join(' ');
        
        const embed = new Discord.MessageEmbed()
            .setFooter(`Loading Message...`)
            .setColor(0xD7A489)
        
        let callback = await message.channel.send(embed)
        
        await db.set(`postedChannel_${message.guild.id}`, { enabled: true, channel: message.channel.id, message: callback.id })
        tools.updateChannels(message.guild);
        
    }
    
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('You do not have the proper permissions to do this.');
            
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Invalid Permissions',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
        })
        
    }
    
    let enabled = await db.fetch(`postedChannel_${message.guild.id}`);
    
    if (enabled !== null && enabled.enabled) {
        
        let channel,
            msg,
            found = true;
            
        channel = client.channels.get(enabled.channel);
        
        if (!channel) createPosted(), found = false;
        
        try {
            msg = await channel.messages.fetch(enabled.message);
        } catch (e) {
            found = false;
            return createPosted();
        }
    console.log(msg)
        if (found) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`**Channel:** ${channel} | **MessageID:** ${msg.id} `)
                .setFooter('This server already has a channel list.');
                
            return tools.send(message.channel, embed, {
                color: true,
                name: 'List Found',
                icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
            })
        }
        
    }
    
    createPosted();

}