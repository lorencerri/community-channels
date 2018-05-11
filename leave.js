const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (client, message, args, tools) => {

    if (message.guild.id === '435093693402316800') {
        let commandFile = require(`./leave_435093693402316800.js`);
        return commandFile.run(client, message, args, tools);
    }
    
    let list = await db.fetch(`joinList_${message.guild.id}`);
    message.delete({timeout: 1000})
    
    if (isNaN(args[0])) {
        
        message.channel.updateOverwrite(message.author, {
          VIEW_CHANNEL: null
        })
        
        const embed = new Discord.MessageEmbed()
            .setFooter(`Leaving ${message.channel.name}...`);
            
        let callback = await tools.send(message.channel, embed, {
            color: true,
            name: 'Leaving Channel',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
        })  
    
        return callback.delete({timeout: 10000})
        
    } else args[0] = parseInt(args[0]);
    
    if (!list[args[0]-1]) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('Please specify a valid channel number.');
            
        return tools.send(message.channel, embed, {
            color: true,
            name: 'Unknown Channel',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
        })  
        
    }
    
    let channel = client.channels.get(list[args[0]-1]);
    
    channel.updateOverwrite(message.author, {
        VIEW_CHANNEL: null
    })
    
    const embed = new Discord.MessageEmbed()
        .setFooter(`Leaving ${channel.name}...`);
        
    let callback = await tools.send(message.channel, embed, {
        color: true,
        name: 'Leaving Channel',
        icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
    })  
    
    callback.delete({timeout: 10000})

}