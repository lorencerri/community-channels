const db = require('quick.db'),
      Discord = require('discord.js'),
      sm = require('string-similarity'),
      send = require('quick.hook');

module.exports = { // This basically works like every normal package you use.

    updateTracker: async function(channel) {
      
      // Fetch previous
      let cachedCount = await db.fetch(`channelUsers_${channel.id}`);
      let description = channel.topic;
      let count = channel.members.size;
      
      if (cachedCount === null);
      else description = description.replace(/\n\n\n\n - This webpage has (\d+((.|,)\d+)?) unique users -/g, '');
      
      description += `\n\n\n\n - This webpage has ${count} unique users -`;
      await db.set(`channelUsers_${channel.id}`, count);
      channel.setTopic(description).catch(err => console.log(err.stack));
        
    },

    sendAd: async function(channel, del) {
        const init = new Promise(async resolve => {
            let files = 3;
            let index = Math.floor(Math.random()*(files-1+1)+1);
            const embed = new Discord.MessageEmbed()
            
            console.log(index)
            if (del) del = 30000;
            let callback = await send(channel, '_ _', {
                delete: del,
                files: [`../Server/optional-channels/images/${index}.gif`],
                name: 'Advertisement',
                icon: 'https://images.pond5.com/static-glitch-sound-4k-footage-037277611_iconl.jpeg'
            })
            let react = ['🇨', '🇱', '🇦', '🇮', '🇲', '🇳', '🇴', '🇼', '❌'],
                reactants = [];
                            const listFilter = reaction => react.includes(reaction.emoji.name);
            const listCollector = callback.createReactionCollector(listFilter, { time: 30000 });
            listCollector.on('collect', (r, u) => {
                if (u.id === '386059740805070848') return;
                if (r.emoji.name === '❌') {
                    return callback.delete();
                }
                if (reactants.includes(u.id)) return;
                reactants.push(u.id);
                send(channel, `**THANK YOU ${u.username.toUpperCase()}, YOUR PERSONAL INFORMATION HAS BEEN ENTERED INTO OUR DATABASE.**`, {
                    delete: 15000,
                    name: 'Advertisement',
                    icon: 'https://images.pond5.com/static-glitch-sound-4k-footage-037277611_iconl.jpeg'
                })
            });
            for (var i in react) {
                await callback.react(react[i]);
            }
        })
        return init;
    },
    
    send: send,

    updateChannels: async function(guild) {

        let channel = await db.fetch(`postedChannel_${guild.id}`),
            message;

        // Fetch message to update
        try {
            if (channel === null || !channel.enabled) return;
            message = await guild.channels.get(channel.channel).messages.fetch(channel.message);
        } catch (e) { // Message not found
            return;
        }
        
        const embed = new Discord.MessageEmbed()
        if (guild.id === '435093693402316800') {
            embed.setColor(message.embeds[0].color)
                 .setTitle('Welcome to Hypnospace! Here\'s all you need to surf the Hypnospace Highway:')
                 .setDescription('**Want to join a page? *Type:***\n`~join #`\n\n**To leave, type the following:**\n`~leave #`')
                 .setFooter('Custom Developed by Plexi Development @ discord.gg/8nrEqvP | ~info for more information.')
        } else {
            embed.setColor(message.embeds[0].color)
                 .setTitle(`Community Channels`)
                 .setDescription('**Want to join a channel? *Type:***\n`~join #`\n\n**To leave, type the following in the channel:**\n`~leave` **or** `~leave #`')
                 .setFooter('Community Channels Developed By Plexi Development @ discord.gg/8nrEqvP | ~info for more information.')

        }
    
        let joinList = [],
            officialChannels = await db.fetch(`officialChannels_${guild.id}`),
            communityChannels = await db.fetch(`communityChannels_${guild.id}`),
            officialString = '',
            communityString = '',
            index = 1;

        if (officialChannels === null) officialChannels = [];
        if (communityChannels === null) communityChannels = [];

        officialChannels.forEach(function(channelID){

            let channel = guild.channels.get(channelID);
            
            if (!channel && officialString.length > 0 && channelID == officialChannels[officialChannels.length-1]) return embed.addField('Official Channels', officialString, true);
            if (!channel) return;

            officialString += `**${index}** [❱](https://discord.io/plexidev) ${channel.name.charAt(0).toUpperCase() + channel.name.slice(1).replace('nsfw', 'NSFW')}\n`
            officialString = officialString.replace(/-/g, ' ').replace(/(\b[a-z](?!\s))/g, function(x){return x.toUpperCase()});
            joinList.push(channelID)
            index++

            if (officialString.length > 924) {
                if (guild.id === '435093693402316800') embed.addField('Official Pages', officialString, true)
                else embed.addField('Official Channels', officialString, true)
                officialString = '';
            }

            console.log(`${channelID} === ${officialChannels[officialChannels.length-1]}`, officialString)
            if (officialString.length > 0 && channelID == officialChannels[officialChannels.length-1] && guild.id === '435093693402316800') embed.addField('Official Pages', officialString, true);
            else if (officialString.length > 0 && channelID == officialChannels[officialChannels.length-1]) embed.addField('Official Channels', officialString, true);

        })

        communityChannels.forEach(function(channelID){

            let channel = guild.channels.get(channelID);
            if (!channel && communityString.length > 0 && channelID == communityChannels[communityChannels.length-1]) return embed.addField('Community Channels', communityString, true);
            if (!channel) return;

            communityString += `**${index}** [❱](https://discord.io/plexidev) ${channel.name.charAt(0).toUpperCase() + channel.name.slice(1).replace('nsfw', 'NSFW')}\n`
            communityString = communityString.replace(/-/g, ' ').replace(/(\b[a-z](?!\s))/g, function(x){return x.toUpperCase()});
            joinList.push(channelID)
            index++

            if (communityString.length > 924) {
                if (guild.id === '435093693402316800') embed.addField('Citizen Pages', communityString, true)
                else embed.addField('Community Channels', communityString, true);
                communityString = '';
            }
            if (communityString.length > 0 && channelID == communityChannels[communityChannels.length-1] && guild.id === '435093693402316800') {
                embed.addField('Citizen Pages', communityString, true);
            } else if (communityString.length > 0 && channelID == communityChannels[communityChannels.length-1]) {
                embed.addField('Community Channels', communityString, true);
            }

        })

        if (index === 1) {
            embed.setTitle('No Channels Found')
                 .setDescription('**You can do *`~setpublic true`* \n**OR**\n *`~setpublic true official`* to get started!**')
        }
        
        await db.set(`joinList_${guild.id}`, joinList)
        message.edit(embed)
        console.log(embed)


    },

    embed: function(channel, message, timer) {
      channel = channel.channel || channel;
      channel.send({embed:{
        title: message,
        color: 0x1db954
      }}).then(msg => {
        if (!isNaN(timer)) {msg.delete({timeout: 10000})};
      })
    },

    footer: function(channel, title, footer, timer) {
      channel = channel.channel || channel;
      channel.send({embed:{
        title: title,
        footer: {
            text: footer
        },
        color: 0x1db954
      }}).then(msg => {
        if (!isNaN(timer)) {msg.delete({timeout: 10000})};
      })
    },

    findBestMatch: function(username, guild) {
        const getInfo = new Promise((resolve, error) => {
            let users = [],
                indexes = [];
            guild.members.forEach(function(member){
                users.push(member.user.username)
                indexes.push(member.user.id)
            });
            resolve(guild.members.get(indexes[users.indexOf(sm.findBestMatch(username, users).bestMatch.target)]));
        });
        return getInfo;
    },

    addUserToChannel: async function(user, channel, display) {
        let callback = await channel.updateOverwrite(user, {
          VIEW_CHANNEL: true
        }).catch(e => {

        const embed = new Discord.MessageEmbed()
            .setFooter('This bot does not have the proper permissions (Manage Channels).');

        return send(channel, embed, {
            color: true,
            name: 'Invalid Permissions',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
        })

        })
        if (display && callback.name) {

         const resp = new Discord.MessageEmbed()
            .setFooter(`${user.username} has been successfully invited.`);

        send(channel, resp, {
            color: true,
            name: 'User Invited',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png'
        })

        }
    },

    resp: function(channel, message, timer) {
      channel = channel.channel || channel;
      channel.send({embed:{
        description: message,
        color: 0x1db954
      }}).then(msg => {
        if (!isNaN(timer)) {msg.delete({timeout: 10000})};
      })
    },

    pages: function(message, pages, config) {

      let page = 1;

    const embed = new Discord.MessageEmbed()
      .setColor(0xffffff)
      .setFooter(`Page ${page} of ${pages.length}`)
      .setDescription(pages[page-1])

    message.channel.send(embed).then(msg => {

      msg.react('⏪').then( r => {
        msg.react('⏩')

        // Create Filters
        const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;

        const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
        const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });

        backwards.on('collect', r => {
          if (page === 1) return;
          page--;
          embed.setDescription(pages[page-1])
          embed.setFooter(`Page ${page} of ${pages.length}`)
          msg.edit(embed)
        });

        forwards.on('collect', r => {
          if (page === pages.length) return;
          page++;
          embed.setDescription(pages[page-1])
          embed.setFooter(`Page ${page} of ${pages.length}`)
          msg.edit(embed)
        });

      })

    })

    },

    setChannels: function(message) {
        const embed = new Discord.MessageEmbed()
            .setColor(0x1db954)
            .setTitle('Optional Channels')
            .setDescription('**Want to join a channel? Type:**\n`~join #`\n\n**To leave, type the following in the channel:**\n`~leave`')

    },

    setChannels: function(message) { // Someone needs to update this with Recursion

       const embed = new Discord.MessageEmbed()
        .setColor(0x1db954)
        .setTitle('Optional Channels')
        .setDescription('**Want to join a channel? Type:**\n`~join #`\n\n**To leave, type the following in the channel:**\n`~leave`')

       let joinList = [];
       setTimeout(function() {
       db.fetchArray(`officialChannels_${message.guild.id}`).then(o => {
         let officialChannels = '';
         o.shift()
         let index = o.length;
         for (var i = 0; i < o.length; i++) {
          if (!message.guild.channels.get(o[i])) console.log('Fetched channel not found.')
          else {
          joinList.push(o[i])
          officialChannels += `**${i+1}** [❱](https://discord.io/plexidev) ${message.guild.channels.get(o[i]).name.charAt(0).toUpperCase() + message.guild.channels.get(o[i]).name.slice(1).replace('nsfw', 'NSFW')}`
          //if (message.guild.channels.get(o[i]).topic) officialChannels += ` **-** ${message.guild.channels.get(o[i]).topic}`
          officialChannels += '\n\n'
          }
         }
         if (o.length > 0) embed.addField('Official Channels', officialChannels,true);
         db.fetchArray(`publicChannels_${message.guild.id}`).then(p => {
           let publicChannels = '';
           p.shift()
           let w = 0;
           for (var i = 0; i < p.length; i++) {
             if (!message.guild.channels.get(o[i])) console.log('Fetched channel not found.')
             else {
            joinList.push(p[i])
            publicChannels += `**${i+1+index}** [❱](https://discord.io/plexidev) ${message.guild.channels.get(p[i]).name.charAt(0).toUpperCase() + message.guild.channels.get(p[i]).name.slice(1).replace('nsfw', 'NSFW')}`
            //if (message.guild.channels.get(p[i]).topic) publicChannels += ` **-** ${message.guild.channels.get(p[i]).topic}`
            publicChannels += '\n\n'
             }
           }
           if (p.length > 0) embed.addField('Community Channels', publicChannels,true);
           embed.setFooter('Have an idea for an optional channel? Message a staff member!')
           message.guild.channels.get('409922524948987924').messages.fetch('412707175950057474').then(msg => msg.edit(embed));
           db.setArray(`joinList_${message.guild.id}`, joinList)
         })
       })

       },100)

    }

}
