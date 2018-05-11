const db = require('quick.db');
const Discord = require('discord.js');
const send = require('quick.hook');

exports.run = async (client, message, args, tools) => {
    
    let owner = await db.fetch(`channelOwner_${message.channel.id}`),
        moderators = await db.fetch(`moderators_${message.channel.id}`);

    if (moderators === null) moderators = [];
    
    if (!message.member.hasPermission('ADMINISTRATOR') && owner !== message.author.id && !moderators.includes(message.author.id)) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('You do not have the proper permissions to do this.');
            
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Invalid Permissions',
            icon: 'https://i.imgur.com/m7ehNQA.png'
        })
        
    }

    if (!args[0] || !['true', 'false', 'true official'].includes(args.join(' ').toLowerCase())) {
        const embed = new Discord.MessageEmbed()
            .setFooter('Please input "true", "true official", or "false" following the command.');
            
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Invalid Input',
            icon: 'https://i.imgur.com/m7ehNQA.png'
        })
    }
    
    let officialChannels = await db.fetch(`officialChannels_${message.guild.id}`),
        communityChannels = await db.fetch(`communityChannels_${message.guild.id}`);
        
    if (officialChannels === null) officialChannels = [];
    if (communityChannels === null) communityChannels = [];
    
    switch(args.join(' ').toLowerCase()) {
        case 'false':
                
            let resp = [],
                msg = '';
            
            if (officialChannels.includes(message.channel.id)) officialChannels.splice(officialChannels.indexOf(message.channel.id), 1), resp.push('Official Channels');
            if (communityChannels.includes(message.channel.id)) communityChannels.splice(communityChannels.indexOf(message.channel.id), 1), resp.push('Community Channels');
            
            if (resp.length === 0) msg = 'This page is not public.';
            else {
                msg = `Successfully removed from ${resp.join(' & ')}.`;
            }

            if (resp.includes('Official Channels')) await db.set(`officialChannels_${message.guild.id}`, officialChannels);
            if (resp.includes('Community Channels')) await db.set(`communityChannels_${message.guild.id}`, communityChannels);
            
            const embed = new Discord.MessageEmbed()
                .setFooter(msg);
            
            tools.send(message.channel, embed, {
                color: true,
                name: 'Listing Removal',
                icon: 'https://i.imgur.com/m7ehNQA.png'
            }) 
            
            break;
        case 'true':
            
            if (communityChannels.includes(message.channel.id)) {
                
                const embed = new Discord.MessageEmbed()
                    .setFooter('This page is already listed as public.');
                    
                return tools.send(message.channel, embed, {
                    color: true,
                    name: 'Listing Found',
                    icon: 'https://i.imgur.com/m7ehNQA.png'
                })   
                
            }
            
            await db.push(`communityChannels_${message.guild.id}`, message.channel.id);
            
            const community = new Discord.MessageEmbed()
                .setFooter('Successfully listed as a community page.');
                
            tools.send(message.channel, community, {
                color: true,
                name: 'Listing Created',
                icon: 'https://i.imgur.com/m7ehNQA.png'
            })  
            
            break;
        case 'true official':
            
            if (!message.member.hasPermission('ADMINISTRATOR')) {
                
                const embed = new Discord.MessageEmbed()
                    .setFooter('You do not have the proper permissions to do this.');
                    
                return tools.send(message.channel, embed, {
                    color: true,
                    name: 'Invalid Permissions',
                    icon: 'https://i.imgur.com/m7ehNQA.png'
                }) 
                
            }
            
            if (officialChannels.includes(message.channel.id)) {
                
                const embed = new Discord.MessageEmbed()
                    .setFooter('This page is already listed as public under official.');
                    
                return tools.send(message.channel, embed, {
                    color: true,
                    name: 'Listing Found',
                    icon: 'https://i.imgur.com/m7ehNQA.png'
                })  
                
            }

            await db.push(`officialChannels_${message.guild.id}`, message.channel.id);
            
            const official = new Discord.MessageEmbed()
                .setFooter('Successfully listed as an official page.');
                
            tools.send(message.channel, official, {
                color: true,
                name: 'Listing Created',
                icon: 'https://i.imgur.com/m7ehNQA.png'
            })  
            
            break;
    }
    
    tools.updateChannels(message.guild);
    
}