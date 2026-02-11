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

const commands = {
  '!hype': 'LOCK THE HELL IN. We\'re not here to play—we\'re here to break whoever queues up.',
  '!clutch': 'THAT\'S ICE IN THE VEINS. No panic. No fear. Just execution.',
  '!push': 'SEND IT. Overwhelm them. Outpace them. Outgun them. No breathing room.',
  '!focus': 'DIAL IN. No excuses. No slip-ups. Win the fight, win the game.',
  '!gg': 'GG. Respect the grind—but next round, we\'re taking everything.',
  '!tilt': 'SHAKE IT OFF. Champions don\'t tilt—they adapt and destroy.',
  '!coach': 'LISTEN UP. You know the strat. You know the angles. Now execute and crush them.',
  '!cast': 'AND THEY GET ABSOLUTELY DEMOLISHED! Zero room. Zero mercy. Pure domination!',
  '!trash': 'They\'re getting outplayed in every category. Footwork? Weak. Aim? Weak. Mental? Broken.'
};

client.connect().catch(err => {
  console.error('Failed to connect:', err);
  process.exit(1);
});

client.on('message', (channel, tags, message, self) => {
  if (self) return;
  const msg = message.toLowerCase().trim();
  if (commands[msg]) {
    client.say(channel, commands[msg]).catch(err => {
      console.error('Failed to send message:', err);
    });
  }
});

client.on('connected', (address, port) => {
  console.log(`Connected to ${address}:${port}`);
});

client.on('disconnected', (reason) => {
  console.error(`Disconnected: ${reason}`);
});

client.on('error', (err) => {
  console.error('Client error:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
