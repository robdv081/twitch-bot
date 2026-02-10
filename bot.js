const tmi = require('tmi.js');

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.BOT_OAUTH
  },
  channels: [process.env.CHANNEL_NAME]
});

// Cooldown system to prevent spam
const cooldowns = new Map();
const COOLDOWN_MS = 5000; // 5 second cooldown

/**
 * Check if a command is on cooldown
 * @param {string} userId - User ID
 * @param {string} commandKey - Unique command identifier
 * @returns {boolean} - True if on cooldown
 */
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

/**
 * Validate Twitch username format
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid
 */
function isValidTwitchUsername(username) {
  return /^[a-z0-9_]{4,25}$/.test(username.toLowerCase());
}

/**
 * Send a message to chat with error handling
 * @param {string} channel - Channel name
 * @param {string} message - Message to send
 */
function sendMessage(channel, message) {
  client.say(channel, message).catch(err => {
    console.error('Failed to send message to', channel, ':', err);
  });
}

// Command responses map
const commands = {
  '!hype': '🔥 LOCK THE HELL IN. We\'re not here to play—we\'re here to break whoever queues up.',
  '!clutch': '💥 THAT\'S ICE IN THE VEINS. No panic. No fear. Just execution.',
  '!push': '➡️ SEND IT. Overwhelm them. Outpace them. Outgun them. No breathing room.',
  '!focus': '🎯 DIAL IN. No excuses. No slip-ups. Win the fight, win the game.',
  '!gg': 'GG. Respect the grind—but next round, we\'re taking everything.',
  '!tilt': '🧊 SHAKE IT OFF. Champions don\'t tilt—they adapt and destroy.',
  '!coach': '📣 LISTEN UP. You know the strat. You know the angles. Now execute and crush them.',
  '!cast': '🎙️ "AND THEY GET ABSOLUTELY DEMOLISHED! Zero room. Zero mercy. Pure domination!",',
  '!trash': '😤 They\'re getting outplayed in every category. Footwork? Weak. Aim? Weak. Mental? Broken.'
};

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  const msg = message.trim().toLowerCase();
  const userId = tags['user-id'];

  // Check for standard commands
  if (commands[msg]) {
    if (!isOnCooldown(userId, msg)) {
      sendMessage(channel, commands[msg]);
    }
    return;
  }

  // Handle !so command (shoutout - broadcaster/mod only)
  if (msg.startsWith('!so ')) {
    const isBroadcaster = tags.badges && tags.badges.broadcaster === '1';
    const isMod = tags.mod;
    
    if (!isBroadcaster && !isMod) return;

    const target = message.split(' ')[1]?.replace('@', '').toLowerCase();
    
    // Validate username format
    if (!target || !isValidTwitchUsername(target)) {
      sendMessage(channel, '⚠️ Invalid username format. Twitch usernames must be 4-25 characters.');
      return;
    }

    if (!isOnCooldown(userId, '!so')) {
      sendMessage(
        channel,
        `📣 Shoutout to ${target}! Strong creator—go test your skills at https://twitch.tv/${target}`
      );
    }
    return;
  }

  // Auto-response keywords (now more specific to avoid spam)
  // Only trigger on exact keyword matches or command-style usage
  if (msg === '!win' || msg.startsWith('!win ')) {
    if (!isOnCooldown(userId, '!win-keyword')) {
      sendMessage(channel, '🔥 WINNING IS THE STANDARD. Anything less is unacceptable.');
    }
  }

  if (msg === '!clutch-keyword' || (msg.startsWith('clutch') && msg.length < 20 && !msg.includes(' '))) {
    if (!isOnCooldown(userId, '!clutch-keyword')) {
      sendMessage(channel, '💥 CLUTCH MOMENT. Don\'t blink or you\'ll miss the takeover.');
    }
  }

  if (msg.includes('lag') && msg.length < 50) {
    // More specific: only trigger if "lag" is mentioned in a short message
    if (!isOnCooldown(userId, '!lag-keyword')) {
      sendMessage(channel, '⚠️ LAG EXCUSES ARE FOR LOSERS. Push through and dominate anyway.');
    }
  }
});

client.on('disconnected', (reason) => {
  console.error('Disconnected from chat:', reason);
});