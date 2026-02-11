const tmi = require('tmi.js');

const client = new tmi.Client({
  options: { debug: true },
  connection: { reconnect: true, secure: true },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.BOT_OAUTH
  },
  channels: [process.env.CHANNEL_NAME]
});

client.connect().catch(err => {
  console.error('Connection error:', err);
});

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  const msg = message.toLowerCase().trim();

  if (msg === '!hype') {
    client.say(channel, 'LOCK IN! This is your moment!');
  }
  if (msg === '!test') {
    client.say(channel, 'Bot is working!');
  }
});

client.on('connected', (address, port) => {
  console.log(`✅ Connected to ${address}:${port}`);
});

client.on('disconnected', (reason) => {
  console.error(`❌ Disconnected: ${reason}`);
});

process.on('uncaughtException', (err) => {
  console.error('Fatal error:', err);
});
