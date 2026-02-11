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

// ✅ COOLDOWN SYSTEM - 3 second cooldown
const cooldowns = new Map();
const COOLDOWN_MS = 3000;

function isOnCooldown(userId, commandKey) {
  const key = `${userId}-${commandKey}`;
  const now = Date.now();
  
  if (cooldowns.has(key)) {
    const expiresAt = cooldowns.get(key);
    if (now < expiresAt) {
      return true;
    }
  }
  
  cooldowns.set(key, now + COOLDOWN_MS);
  return false;
}

// ✅ WELCOME SYSTEM - Random welcome messages
const welcomedUsers = new Set();

const welcomeMessages = [
  user => `🔥 @${user} pulled up! Lock in — this stream doesn't do casual.`,
  user => `😤 @${user} just entered the arena. Hope you're ready to keep up.`,
  user => `🎙️ AND HERE COMES @${user}! Another challenger steps into the fire!`,
  user => `💥 @${user} arrived. Time to raise the pace — no slow players allowed.`,
  user => `➡️ @${user} joined the fight. Full send only in here.`
];

// ✅ EXPANDED COMMANDS - 19 total commands
const commands = {
  '!hype': 'LOCK THE HELL IN. We\'re not here to play—we\'re here to break whoever queues up.',
  '!clutch': 'THAT\'S ICE IN THE VEINS. No panic. No fear. Just execution.',
  '!push': 'SEND IT. Overwhelm them. Outpace them. Outgun them. No breathing room.',
  '!focus': 'DIAL IN. No excuses. No slip-ups. Win the fight, win the game.',
  '!gg': 'GG. Respect the grind—but next round, we\'re taking everything.',
  '!tilt': 'SHAKE IT OFF. Champions don\'t tilt—they adapt and destroy.',
  '!coach': 'LISTEN UP. You know the strat. You know the angles. Now execute and crush them.',
  '!cast': 'AND THEY GET ABSOLUTELY DEMOLISHED! Zero room. Zero mercy. Pure domination!',
  '!trash': 'They\'re getting outplayed in every category. Footwork? Weak. Aim? Weak. Mental? Broken.',
  '!grind': 'The grind never stops. That\'s how you separate winners from everyone else.',
  '!mental': 'MENTAL GAME is everything. Stay sharp. Stay focused. Stay deadly.',
  '!execute': 'No hesitation. No second-guessing. Just pure execution and dominance.',
  '!dominate': 'Show them what dominance looks like. Full control. Every. Single. Round.',
  '!intense': 'The energy is INTENSE right now. This is where legends are made.',
  '!skills': 'Your skills are sharp. Your aim is deadly. Your mind is locked in.',
  '!destroy': 'Time to destroy the competition. Show no mercy. Take everything.',
  '!pressure': 'Pressure is on. This is the moment. Rise to the occasion and dominate!',
  '!fire': 'YOU\'RE ON FIRE RIGHT NOW! Keep that momentum rolling!',
  '!unstoppable': 'UNSTOPPABLE. That\'s what you are right now. Keep it going!',
  '!help': 'Commands: !hype !clutch !push !focus !gg !tilt !coach !cast !trash !grind !mental !execute !dominate !intense !skills !destroy !pressure !fire !unstoppable !so !help'
};

client.connect().catch(err => {
  console.error('Failed to connect:', err);
  process.exit(1);
});

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  const msg = message.toLowerCase().trim();
  const user = tags.username;
  const userId = tags['user-id'];

  // ✅ WELCOME SYSTEM - Greets new users
  if (!welcomedUsers.has(user)) {
    welcomedUsers.add(user);
    const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    client.say(channel, randomWelcome(user)).catch(err => {
      console.error('Failed to send welcome message:', err);
    });
  }

  // ✅ SHOUTOUT COMMAND - Mods/broadcaster only
  if (msg.startsWith('!so ')) {
    const isBroadcaster = tags.badges && tags.badges.broadcaster === '1';
    const isMod = tags.mod;

    if (!isBroadcaster && !isMod) {
      client.say(channel, `@${user}, only mods and broadcasters can use shoutouts!`).catch(err => {
        console.error('Failed to send message:', err);
      });
      return;
    }

    const target = message.split(' ')[1]?.replace('@', '').toLowerCase();

    if (!target) {
      client.say(channel, 'Usage: !so @username').catch(err => {
        console.error('Failed to send message:', err);
      });
      return;
    }

    if (!isOnCooldown(userId, '!so')) {
      client.say(channel, `📣 Shoutout to @${target}! Go check them out at https://twitch.tv/${target} 🔥`).catch(err => {
        console.error('Failed to send message:', err);
      });
    }
    return;
  }

  // ✅ REGULAR COMMANDS with COOLDOWN
  if (commands[msg]) {
    if (!isOnCooldown(userId, msg)) {
      client.say(channel, commands[msg]).catch(err => {
        console.error('Failed to send message:', err);
      });
    } else {
      client.say(channel, `@${user}, that command is on cooldown! Wait a moment.`).catch(err => {
        console.error('Failed to send message:', err);
      });
    }
  }
});

client.on('connected', (address, port) => {
  console.log(`✅ Connected to ${address}:${port}`);
});

client.on('disconnected', (reason) => {
  console.error(`❌ Disconnected: ${reason}`);
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