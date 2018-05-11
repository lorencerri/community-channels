const db = require('quick.db'),
  Discord = require('discord.js');

exports.run = async (client, message, args, tools) => {

  // Fetch Invite
  let invites = await db.fetch(`invites_${message.guild.id}`),
    found,
    fetched;

  if (invites === null) invites = {};

  if (!invites[message.channel.id]) found = false;
  else found = true;

  if (found) {
    let fetchedInvites = await message.channel.fetchInvites().catch(err => {
      const embed = new Discord.MessageEmbed()
        .setFooter('This bot does not have the proper permissions.');

      return tools.send(message.channel, embed, {
        color: true,
        name: 'Invalid Permissions',
        icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/mail-128.png'
      })
    })
    fetched = fetchedInvites.find('code', invites[message.channel.id].code)
    if (!fetched) found = false;
  }


  if (found === false) {

    let invite = await message.channel.createInvite({
      maxAge: 0,
      reason: `Custom Private Channel Invite: ${message.channel.name}`
    }).catch(err => {

      const embed = new Discord.MessageEmbed()
        .setFooter('This bot does not have the proper permissions (Create Instant Invite).');

      return tools.send(message.channel, embed, {
        color: true,
        name: 'Invalid Permissions',
        icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/mail-128.png'
      })

    })

    invites[message.channel.id] = {
      uses: 0,
      code: invite.code,
      url: invite.url
    };

    await db.set(`invites_${message.guild.id}`, invites)

    const embed = new Discord.MessageEmbed()
      .setFooter(`Invite successfully created: ${invites[message.channel.id].url}`);

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Invite Created',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/mail-128.png'
    })

  } else {

    const embed = new Discord.MessageEmbed()
      .setFooter(`Channel Invite URL found: ${invites[message.channel.id].url} | ${fetched.uses} uses.`);

    return tools.send(message.channel, embed, {
      color: true,
      name: 'Invite Found',
      icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/mail-128.png'
    })

  }

}