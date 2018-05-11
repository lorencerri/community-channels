const db = require('quick.db'),
      Discord = require('discord.js'),
      sm = require('string-similarity');

exports.run = async (client, message, args, tools) => { // This needs to be upgraded with Recursion

    let channelOwner = await db.fetch(`channelOwner_${message.channel.id}`),
        moderators = await db.fetch(`moderators_${message.channel.id}`),
        temporaryUser = client.users.get(args.join(' '));

    if (moderators === null) moderators = [];

    if (channelOwner !== message.author.id && !moderators.includes(message.author.id) && !message.member.hasPermission('ADMINISTRATOR'))
        return tools.embed(message, 'You do not have proper permissions to do this.');
        
    if (!args.join(' '))
        return tools.embed(message, 'Please specify a name of the user you would like to invite.');
    
    if (message.mentions.members.first()) args[0] = message.mentions.members.first().user.username;
    
    if (temporaryUser !== undefined) return tools.addUserToChannel(temporaryUser, message.channel, true);
    let guildMember = await tools.findBestMatch(args.join(' '), message.guild);
    
    const embed = new Discord.MessageEmbed()
        .setColor(0x1db954)
        .setTitle(`Are you sure you would like to invite ${guildMember.user.username}?`)
        .setThumbnail(guildMember.user.avatarURL());
        
    let msg = await message.channel.send(embed),
        completed = false;
    
    await msg.react('✅');
    await msg.react('⛔');
    
    const acceptFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id,
          accept = msg.createReactionCollector(acceptFilter, { time: 15000 }),
          rejectFilter = (reaction, user) => reaction.emoji.name === '⛔' && user.id === message.author.id,
          reject = msg.createReactionCollector(rejectFilter, { time: 15000 });
    
    accept.on('collect', r => {
        if (completed) return;
        completed = true;
        embed.setDescription('**User Invited!**');
        msg.delete();
        
        tools.addUserToChannel(guildMember.user, message.channel, true);
        
    })
    
    reject.on('collect', r => {
        if (completed) return;
        completed = true;
        embed.setDescription('**Invitation Revoked!**');
        msg.delete();
        
        const resp = new Discord.MessageEmbed()
            .setFooter(`The invitation for ${guildMember.user.username} has been revoked.`);
        
        tools.send(message.channel, resp, {
            color: true,
            name: 'Invitation Revoked',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/contacts-128.png'
        })
        
    })
    
    accept.on('end', r => {
        if (!completed)
            embed.setDescription('**Timed out...**'), msg.edit(embed);
        msg.delete({timeout: 15000})
    })

}