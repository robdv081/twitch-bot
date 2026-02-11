const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const cooldowns = new Map();
const welcomeChannelId = 'YOUR_WELCOME_CHANNEL_ID';
const commands = new Map();

// Command definition
commands.set('ping', { description: 'Replies with pong!', cooldown: 5 });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}!`);
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = commands.get(commandName);
    if (!command) return;

    // Username validation
    const usernamePattern = /^[a-zA-Z0-9-_]{3,16}$/;
    if (!usernamePattern.test(message.author.username)) {
        return message.reply('Invalid username format.');
    }

    // Cooldown check
    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Map());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(commandName);
    const cooldownAmount = command.cooldown * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \\`${commandName}\	command.`);
        }
    }

    // Execute command
    try {
        if (commandName === 'ping') {
            message.channel.send('Pong!');
        }
        // Other commands can be executed here
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }

    // Update cooldown
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
});

client.login('YOUR_BOT_TOKEN');