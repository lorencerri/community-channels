// Require Packages
const Discord = require('discord.js'),
  db = require('quick.db'),
  fs = require('fs'),
  client = new Discord.Client(),
  tools = require('./functions.js'),
  prefix = '~',
  DBL = require("dblapi.js"),
  dbl = new DBL('<HIDDEN>'),
  moment = require('moment');

client.on('createTimer', data => { // data = { timer: <seconds>, function: <function> }
  data.function = data.function.toString();
  data.timer = Math.floor(new Date().getTime() / 1000 + data.timer);
  if (isNaN(data.timer)) return console.log('Timer input isn\'t seconds.');
  db.push('timers', data.function, {
    target: data.timer
  });
})

client.on('ready', () => {
  setInterval(async function() {
    let timer = Math.floor(new Date().getTime() / 1000);
    let fetched = await db.fetch('timers', {
      target: timer
    });
    if (!fetched || !fetched instanceof Array) return;
    db.delete('timers', {
      target: timer
    });
    for (var i in fetched) eval(fetched[i]);
  }, 1000)
})

// Listener Events
client.on('message', async message => {
  return;
  // Variable
  let args = message.content.slice(prefix.length).trim().split(" ");

  // Fetch Guild Settings
  let fetched = await db.fetch(`autoCreate_${message.guild.id}`);

  // Return If Settings Null
  if (fetched === null || !fetched.channelID || !client.channels.get(fetched.channelID)) return;

  // Return Statement
  if (fetched.channelID !== message.channel.id) return;

  // Return Statement
  if (message.content.toLowerCase().trim() !== fetched.msg && fetched.msg !== null) return message.delete({
    timeout: 1000
  });

  let guildChannels = message.guild.channels.array();
  console.log(guildChannels.length)
  for (var i in guildChannels) {
    db.fetch(`channelOwner_${guildChannels[i].id}`).then(channelInfo => {
      if (channelInfo === null) return;
      else if (channelInfo === message.author.id) {
        callback(true);
      } else if (i === guildChannels.length - 1) callback(false);
    })
  }

  function callback(found) {

    if (found) {

      const embed = new Discord.MessageEmbed()
        .setFooter(`Sorry, you already have a channel. Please ask an administrator if you would like a second channel.`);

      return tools.send(message.channel, embed, {
        color: true,
        name: 'Channel Found',
        icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bookshelf-128.png'
      });

    } else {

      let commandFile = require(`./commands/create.js`);
      commandFile.run(client, message, args, tools, true);

    }

  }

})

client.on('message', async message => {

  if (!message.guild || message.author.bot) return;

  // Variables
  let msg = message.content.toUpperCase(),
    raw = msg.toLowerCase(),
    args = message.content.slice(prefix.length).trim().split(" "),
    cmd = args.shift().toLowerCase(),
    completed = true;

  let delList = await db.fetch(`autoDelete_${message.guild.id}`);

  if (delList !== null && delList.includes(message.channel.id) && !message.author.bot) message.delete({
    timeout: 1000
  })

  let keywords = ['penis', 'enlarge', 'traffic', 'data', 'money', 'purchase', 'satisfied', 'apply', 'celebrity', 'claim', 'credit', '$', 'offshore', 'valium', 'viagra', 'warranty', 'xanax', 'drugs'],
    found = false;

  for (var i in keywords) {
    if (message.guild.id !== '435093693402316800');
    else if (raw.includes(keywords[i]) && !found) {
      found = true;
      tools.sendAd(message.channel, true);
    }
  }

  if (message.guild.id === '435093693402316800' && message.channel.id !== '436474444567937034' && msg.includes('HELP') && cmd !== 'help') {
    console.log('Ran Help')
    let commandFile = require(`./commands/professor-helper.js`);
    commandFile.run(client, message, args, tools);

  }

  // Return Statement
  if (!msg.startsWith(prefix) || message.author.bot) return;

  // Aliases
  let aliases = { // cmd: target
    'channeldescription': 'channeldesc',
    'mods': 'moderators',
    'mod': 'addmod',
    'delmod': 'removemod',
    'help': 'channel',
    'commands': 'channel',
    'cmdlist': 'channel',
    'setname': 'channelname',
    'setdesc': 'channeldesc',
    'statistics': 'stats',
    'newchannel': 'create',
    'delete': 'purge',
    'clear': 'purge',
    'inviteurl': 'invitelink'
  }

  // Set Alias
  if (aliases[cmd] !== undefined) cmd = aliases[cmd];

  // Command Handler
  try { // Initialize

    if (message.channel.id === '436474444567937034' && !['join', 'leave'].includes(cmd));
    else {
      if (cmd === 'canvas-test') delete require.cache[require.resolve(`./commands/${cmd}.js`)];
      let commandFile = require(`./commands/${cmd}.js`);
      commandFile.run(client, message, args, tools);
    }
  } catch (e) { // Catch Errors

    console.log(e.stack)
    completed = false;

  } finally { // Run Last

    // Log Commands
    if (completed) {
      //console.log(`[${message.guild.name}] ${message.author.tag} ran the command: ${message.content}`);
      db.add(`commands`, 1, {
        target: 'total'
      });
      db.add(`commands`, 1, {
        target: `${cmd}`
      })
    } else console.log(`[${message.guild.name}] ${message.author.tag} attempted to run the command: ${message.content}`);

  }

});

client.on('guildCreate', guild => {

  let memberCount = 0;
  client.guilds.map(g => memberCount += g.memberCount)

  const embed = new Discord.MessageEmbed()
    .setTitle(guild.name)
    .setFooter(`+${guild.memberCount} members (${memberCount} total) | +1 guild (${client.guilds.size} total) | +${guild.channels.size} channels (${client.channels.size} total)`)

  tools.send(client.channels.get('410150933549547540'), embed, {
    color: true,
    icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/arrow-up-128.png',
    name: 'Guild Joined'
  })

})

client.on('guildDelete', guild => {

  let memberCount = 0;
  client.guilds.map(g => memberCount += g.memberCount)


  const embed = new Discord.MessageEmbed()
    .setTitle(guild.name)
    .setFooter(`-${guild.memberCount} members (${memberCount} total) | -1 guild (${client.guilds.size} total) | ${client.channels.size} channels remaining`)

  tools.send(client.channels.get('410150933549547540'), embed, {
    color: true,
    icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bomb-128.png',
    name: 'Guild Left'
  })

})

client.on('guildMemberAdd', async member => {

  // Fetch Cached Invites
  let cached = await db.fetch(`invites_${member.guild.id}`);
  if (cached === null) return;

  // Fetch Active invites
  let active = await member.guild.fetchInvites();
  active.array();

  // Compare
  let updated = {};
  active.forEach(async function(invite) {
    if (invite.inviter.id !== '386059740805070848' || !cached[invite.channel.id]) return;
    if (cached[invite.channel.id].uses < invite.uses) {
      tools.addUserToChannel(member.user, invite.channel)
      const embed = new Discord.MessageEmbed()
        .setFooter(`${member.user.tag} has joined through the invite URL ${invite.url}`)

      if (invite.channel.id !== '428705929068806144') tools.send(invite.channel, embed, {
        color: true,
        name: 'User Joined',
        icon: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/mail-128.png'
      })
    }
    db.set(`invites_${member.guild.id}`, invite.uses, {
      target: `.${invite.channel.id}.uses`
    })
  })

})

// Login
client.login("<HIDDEN>");

client.on('ready', () => {
  client.user.setActivity(`bit.ly/getSourceCode`);

  function updateClock() {
    let channel = client.channels.get('436474444567937034');
    let local = `Local Time: ${moment().subtract(19, 'years').format('LLLL')}`
    channel.setTopic(local);

  }

  function repeatEvery(func, interval) {
    // Check current time and calculate the delay until next interval
    var now = new Date(),
      delay = interval - now % interval;

    function start() {
      // Execute function now...
      func();
      // ... and every interval
      setInterval(func, interval);
    }

    // Delay execution until it's an even interval
    setTimeout(start, delay);
  }

  repeatEvery(updateClock, 60000);

  /*    setInterval(async function(){
       let channels = await client.guilds.get('435093693402316800').channels;
       channels = channels.array();
       
       let channel = channels[Math.floor(Math.random()*channels.length)];
           //tools.sendAd(channel, true);
       console.log('Sending Ad');
    }, 45000)
*/
})

client.on('ready', () => {
  setInterval(() => {
    dbl.postStats(client.guilds.size);
  }, 1800000);
  console.log('Running...')
});