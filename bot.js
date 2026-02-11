const tmi = require('tmi.js');

// Configuration  
const config = {
    identity: {
        username: 'BotUsername',  // Replace with your bot's username
        password: 'oauth:your_oauth_token'  // Replace with your OAuth token
    },
    channels: ['your_channel_name']  // Replace with the channel to join
};

// Create a client  
const client = new tmi.Client(config);

// List of commands
const commands = {
    '!help': 'Available commands: !help, !join, !leave, !command1, !command2, !command3, !command4, !command5, !command6, !command7, !command8, !command9',
    '!join': 'Joining the channel!',
    '!leave': 'Leaving the channel!',
    '!command1': 'Command 1 executed!',
    '!command2': 'Command 2 executed!',
    '!command3': 'Command 3 executed!',
    '!command4': 'Command 4 executed!',
    '!command5': 'Command 5 executed!',
    '!command6': 'Command 6 executed!',
    '!command7': 'Command 7 executed!',
    '!command8': 'Command 8 executed!',
    '!command9': 'Command 9 executed!'
};

// Connect to Twitch  
client.connect();

// Event listener for messages  
client.on('message', (channel, tags, message, self) => {
    if(self) return;  // Ignore messages from the bot
    const command = message.split(' ')[0];  // Get the command from the message

    // Check if command is available and respond
    if(commands[command]) {
        client.say(channel, commands[command]);
    } else {
        client.say(channel, `Command not found. Type !help for a list of commands.`);
    }
});

// Error handling  
client.on('error', (err) => {
    console.error('Error:', err);
});

client.on('connected', (addr, port) => {
    console.log(`* Connected to ${addr}:${port}`);
});