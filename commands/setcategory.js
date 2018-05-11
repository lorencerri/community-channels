const db = require('quick.db'),
      Discord = require('discord.js'),
      sm = require('string-similarity');

exports.run = async (client, message, args, tools) => { // This needs to be upgraded with Recursion

      if (!message.member.hasPermission('ADMINISTRATOR')) {
            
            const embed = new Discord.MessageEmbed()
                .setFooter('You do not have the proper permissions to do this.');
                
            return tools.send(message.channel, embed, {
                color: true,
                name: 'Invalid Permissions',
                icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
            })
            
      } else if (!args[0]) {
            
            const embed = new Discord.MessageEmbed()
                .setFooter('Please input a channel category name (this autocompletes).');
                
            return tools.send(message.channel, embed, {
                color: true,
                name: 'Invalid Input',
                icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
            })
            
      }

      let categories = [];
      let indexes = [];

      message.guild.channels.array().forEach(function(channel) {
            if (channel.type !== 'category') return;
            categories.push(channel.name);
            indexes.push(channel.id);
      })
      
      let category = message.guild.channels.get(indexes[categories.indexOf(sm.findBestMatch(args.join(' '), categories).bestMatch.target)]);


      await db.set(`category_${message.guild.id}`, category.id);
      const embed = new Discord.MessageEmbed()
      .setFooter(`Successfully set the default ~create category to ${category.name}`);
      
      return tools.send(message.channel, embed, {
            color: true,
            name: 'Default Category Set',
            icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
      })

}