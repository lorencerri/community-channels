const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (client, message, args, tools) => {

    if (message.guild.id === '435093693402316800') {
        let commandFile = require(`./join_435093693402316800.js`);
        return commandFile.run(client, message, args, tools);
    }
    
    let list = await db.fetch(`joinList_${message.guild.id}`);

    if (list === null || list.length === 0) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('Sorry, there are no channels available.');
                
        tools.send(message.channel, embed, {
            color: true,
            delete: 5000,
            name: 'No Listings',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
        })  
        
    }
    
    if (isNaN(args[0])) {
        
       let fetched = await db.fetch(`customChannels_${message.guild.id}`),
            joining = [],
            final = [];
        
        for (var i in fetched) {
            if (i === 'pool');
            else if (fetched[i].code === args.join(' ').toLowerCase()) {
                joining.push(i);
                try {
                    final.push(client.channels.get(i).name);
                } catch(e) {
                    console.log(e.stack);
                }
            }
        }
        
        if (joining.length === 0) {
            
            const embed = new Discord.MessageEmbed()
                .setFooter('Please specify a number after the command.');
            
            return tools.send(message.channel, embed, {
                delete: 5000,
                color: true,
                name: 'Unknown Number',
                icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
            })  
            
        } else {
            
            for (var i in joining) {
                tools.addUserToChannel(message.author, client.channels.get(joining[i]), false);   
            }
        
            const embed = new Discord.MessageEmbed()
                .setFooter(`Joining ${final.join(' & ')}...`);
                
            return tools.send(message.channel, embed, {
                color: true,
                delete: 5000,
                name: 'Joining Channel',
                icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
            })  
            
        }
        
    } else args[0] = parseInt(args[0]);
    
    if (!list[args[0]-1]) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('Please specify a valid channel number.');
            
        return tools.send(message.channel, embed, {
            color: true,
            delete: 5000,
            name: 'Unknown Channel',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
        })  
        
    }
    
    let channel = client.channels.get(list[args[0]-1]);
    
    if (!channel) {
        
        const embed = new Discord.MessageEmbed()
            .setFooter('Invalid channel, this channel may have been deleted.');
            
        return tools.send(message.channel, embed, {
            color: true,
            delete: 5000,
            name: 'Unknown Channel',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
        })  
        
    } else {
    
        tools.addUserToChannel(message.author, channel, false);
        
        const embed = new Discord.MessageEmbed()
            .setFooter(`Joining ${channel.name}...`);
            
        let callback = await tools.send(message.channel, embed, {
            color: true,
            delete: 5000,
            name: 'Joining Channel',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
        })  
        
        // callback.delete({timeout: 10000})
        
    }

}