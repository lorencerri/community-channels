const db = require('quick.db');
const Discord = require('discord.js');
//const table = require('table');

exports.run = async (client, message, args, tools) => {
    
    if (message.guild.id === '435093693402316800') {
        let commandFile = require(`./help_435093693402316800.js`);
        return commandFile.run(client, message, args, tools);
    }
    
    let owner = await db.fetch(`channelOwner_${message.channel.id}`);
    
    if (owner === null) owner = 'This channel is not assigned to anyone.';
    else {
        
        try {
            owner = `This channel is owned by ${message.guild.members.get(owner).user.username}.`
        } catch (e) {
            owner = 'This channel is not assigned to anyone.'
        }
        
    }
    
    //let channel = [['assign <@user>', 'Sets the mentioned user as the owner of the channel'], ['channel', 'Displays the owner, and commands for the channel'], ['inviteURL', 'Creates or fetches a custom invite URL, if a user joins using it, they will automatically be added to your channel'], ['setName <name>', 'Renames the current channel'], ['setDesc', 'Sets a new description for the channel'], ['invite <name>', 'Invites the specified user'], ['remove <@user>', 'Kicks the specified user from the channel'], ['setPublic [ false | true | true official ]', 'Lists the channel under the channel list for users to join']]
    
    const embed = new Discord.MessageEmbed()
        .setTitle(owner)
        .setDescription('**You can view the full commands list & instructions [here](https://truexpixels.gitbooks.io/community-channels).**\n\\**Bold** *= New Feature*')
        //.addField('Channel Commands', `\`\`\`${table.table(channel, { border: { topBody: `─`, topJoin: `┬`, topLeft: `┌`, topRight: `┐`, bottomBody: `─`, bottomJoin: `┴`, bottomLeft: `└`, bottomRight: `┘`, bodyLeft: `│`, bodyRight: `│`, bodyJoin: `│`, joinBody: `─`, joinLeft: `├`, joinRight: `┤`, joinJoin: `┼` } })}\`\`\`\``)
        .addField('Channel Commands', '\`~assign <@user>\` sets the mentioned user as the owner of the channel.\n`~channel` displays the owner, and commands for the channel.\n**`~inviteURL` creates or fetches a custom URL, if a user joins using it, they will automatically be added to your channel.** *__(NEW FEATURE!)__*\n`~channelName <name>` renames the current channel.\n`~channelDesc <description>` sets a new description for the channel.\n`~invite <name>` invites the specified user.\n`~remove <@user>` kicks the specified user.\n`~setPublic [ true | false ] [\'official\']` lists the channel under the channel list for users to join.\n`~purge <amount>` deletes the specified amount of messages from the channel.\n`~nsfw [ true | false ]` sets the channel\'s NSFW status to the following.\n`~addmod <@user>` assigns the user as a channel moderator.\n`~removemod <@user>` removes the user as a moderator.\n`~moderators` displays the current moderators.\n`~pin <messageID>` pins a message in the current chat.\n`~unpin <messageID>` unpins a message in the current chat.')
        .addField('General Commands', '\`~create [@user]\` creates a new channel & posts some info.\n\`~setCategory <category>\` sets the default category to ~create channels under (name autocompletes)\n\`~autodelete <#channel>\` toggles auto-delete messages for the specified channel.\n\`~channellist [title]` sets the channel list to where the command was run.\n`~info` displays information about the packages used, and developer.\n\`~stats\` displays statistics about the bot.\n\`~cmdCount\` displays the commands usage count.', true)
        .setFooter('[] = optional & <> = required, do not include them in the command. | Please note that the prefix is a tilda, not a dash.');

    tools.send(message.channel, embed, {
        color: true,
        name: 'Information',
        icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
    })

}