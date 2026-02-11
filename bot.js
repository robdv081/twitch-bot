const tmi = require('tmi.js');

// Define configuration options
const config = {
    identity: {
        username: 'your_bot_username', // Replace with your bot's username
        password: 'oauth:your_oauth_token' // Replace with your OAuth token
    },
    channels: [ 'your_channel_name' ] // Replace with the channel to join
};

// Create a client with our configuration options
const client = new tmi.Client(config);

// Register event handlers
client.on('message', (channel, userstate, message, self) => {
    if(self) return; // Ignore messages from the bot
    console.log(`${userstate.username}: ${message}`); // Print the message to the console
});

client.on('join', (channel, username, self) => {
    if(self) {
        console.log(`* ${username} has joined ${channel}`);
    }
});

// Connect to Twitch:
client.connect();