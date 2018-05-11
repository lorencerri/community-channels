const db = require('quick.db');
const Discord = require('discord.js');

exports.run = async (client, message, args, tools) => {
    
    const embed = new Discord.MessageEmbed()
        .setTitle('Community Channels')
        .setDescription(`**Developed by [TrueXPixels](https://youtube.com/c/TrueXPixels) from [Plexi Development](https://discord.gg/8nrEqvP)**\n\n**Discord: [https://discord.gg/8nrEqvP](https://discord.gg/8nrEqvP)**\n\n**YouTube: [https://youtube.com/c/TrueXPixels](https://youtube.com/c/TrueXPixels)**\n**Twitter: [https://twitter.com/TrueXPixels](https://twitter.com/Plexidev)**\n_ _`)
        .addField('Packages Used', '**[Discord.js](https://www.npmjs.com/package/discord.js) *by Hydrabolt***\n*Discord API Library*\n\n**[Quick.db](https://www.npmjs.com/package/quick.db) *by Plexi Development***\n*Database Solution*\n\n**[Quick.hook](https://www.npmjs.com/package/quick.hook) *by Plexi Development***\n*Custom Webhooks/Messages*\n\n**[String-Similarity](https://www.npmjs.com/package/string-similarity) *by Aceakash***\n*Username Autocomplete*\n_ _')
        .addField('More Information (Invite, Support, Website)', '**[https://bit.ly/getCommunity](https://bit.ly/getCommunity)**\n_ _')
        .addField('Interested in a Custom Bot?', '**Contact __TrueXPixels__ here: [https://discord.gg/8nrEqvP](https://discord.gg/8nrEqvP)**')
    
    
    tools.send(message.channel, embed, {
        name: 'Information',
        icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/pin-128.png',
        color: true
    })
    
}