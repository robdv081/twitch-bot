const tmi = require('tmi.js');

const cooldowns = new Map();
const COOLDOWN_MS = 5000;

function isOnCooldown(userId, commandKey) {
  const key = `${userId}-${commandKey}`;
  const now = Date.now();
  if (cooldowns.has(key)) {
    const expiresAt = cooldowns.get(key);
    if (now < expiresAt) return true;
  }
  cooldowns.set(key, now + COOLDOWN_MS);
  return false;
}

function isValidTwitchUsername(username) {
  return /^[a-z0-9_]{4,25}$/.test(username.toLowerCase());
}

function sendMessage(channel, message) {
  client.say(channel, message).catch(err => {
    console.error('Failed to send message:', err);
  });
}

const client = new tmi.Client({
  options: { debug: true },
  connection: { reconnect: true, secure: true },
  identity: { 
    username: process.env.BOT_USERNAME,
    password: process.env.BOT_OAUTH
  },
  channels: [process.env.CHANNEL_NAME]
});

const welcomedUsers = new Set();
const welcomeLines = [
  user => `🔥 @${user} pulled up! Lock in — this stream doesn't do casual.`,
  user => `😤 @${user} just entered the arena. Hope you're ready to keep up.`,
  user => `🎙️ AND HERE COMES @${user}! Another challenger steps into the fire!`,
  user => `💥 @${user} arrived. Time to raise the pace — no slow players allowed.`,
  user => `➡️ @${user} joined the fight. Full send only in here.`
];

const vipWelcome = user => `👑 VIP @${user} has arrived — clear the lane, elite player coming through.`;
const subWelcome = user => `💎 Subscriber @${user} in the building — respect the loyalty, now let's dominate.`;
const returningWelcome = user => `🔥 @${user} is back for more smoke. You already know how we run it in here.`;

const commands = {
  '!hype': '🔥 LOCK THE HELL IN. We\'re not here to play—we\'re here to break whoever queues up.',
  '!clutch': '💥 THAT\'S ICE IN THE VEINS. No panic. No fear. Just execution.',
  '!push': '➡️ SEND IT. Overwhelm them. Outpace them. Outgun them. No breathing room.',
  '!focus': '🎯 DIAL IN. No excuses. No slip-ups. Win the fight, win the game.',
  '!gg': 'GG. Respect the grind—but next round, we\'re taking everything.',
  '!tilt': '🧊 SHAKE IT OFF. Champions don\'t tilt—they adapt and destroy.',
  '!coach': '📣 LISTEN UP. You know the strat. You know the angles. Now execute and crush them.',
  '!cast': '🎙️ AND THEY GET ABSOLUTELY DEMOLISHED! Zero room. Zero mercy. Pure domination!',
  '!trash': '😤 They\'re getting outplayed in every category. Footwork? Weak. Aim? Weak. Mental? Broken.'
};

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
  if (self) return;
  const msg = message.trim().toLowerCase();
  const user = tags.username;
  const userId = tags['user-id'];

  if (!welcomedUsers.has(user)) {
    welcomedUsers.add(user);
    if (tags.badges && tags.badges.vip === '1') {
      sendMessage(channel, vipWelcome(user));
    } else if (tags.subscriber) {
      sendMessage(channel, subWelcome(user));
    } else if (tags['first-msg'] === false) {
      sendMessage(channel, returningWelcome(user));
    } else {
      const line = welcomeLines[Math.floor(Math.random() * welcomeLines.length)];
      sendMessage(channel, line(user));
    }
  }

  if (commands[msg]) {
    if (!isOnCooldown(userId, msg)) {
      sendMessage(channel, commands[msg]);
    }
    return;
  }

  if (msg.startsWith('!so ')) {
    const isBroadcaster = tags.badges && tags.badges.broadcaster === '1';
    const isMod = tags.mod;
    if (!isBroadcaster && !isMod) return;
    const target = message.split(' ')[1]?.replace('@', '').toLowerCase();
    if (!target || !isValidTwitchUsername(target)) {
      sendMessage(channel, 'Invalid username format. Twitch usernames must be 4-25 characters.');
      return;
    }
    if (!isOnCooldown(userId, '!so')) {
      sendMessage(channel, `Shoutout to ${target}! Go check them out at https://twitch.tv/${target}`);
    }
    return;
  }

  if ((msg === '!win' || msg.startsWith('!win ')) && !isOnCooldown(userId, '!win-keyword')) {
    sendMessage(channel, 'WINNING IS THE STANDARD. Anything less is unacceptable.');
  }

  if ((msg === 'clutch!' || msg === '!clutch-response') && !isOnCooldown(userId, '!clutch-keyword')) {
    sendMessage(channel, 'CLUTCH MOMENT. Don\'t blink or you\'ll miss the takeover.');
  }

  if (msg.includes('lag') && msg.length < 50 && !isOnCooldown(userId, '!lag-keyword')) {
    sendMessage(channel, 'LAG EXCUSES ARE FOR LOSERS. Push through and dominate anyway.');
  }
});

client.on('disconnected', (reason) => {
  console.error('Disconnected from chat:', reason);
});
