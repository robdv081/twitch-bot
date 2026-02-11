# Commands Overview

This document contains a comprehensive list of all commands for the Twitch Bot, including their permissions, cooldown system, usage examples, and auto-response keywords.

## Command List

| Command          | Description                        | Permission Level | Cooldown    | Usage Example                    | Auto-response Keywords         |
|------------------|------------------------------------|-------------------|-------------|----------------------------------|---------------------------------|
| `!help`          | Displays a list of available commands | Everyone          | 30 seconds  | `!help`                          | `help`, `commands`             |
| `!ban @user`    | Bans a user from the channel        | Moderator        | None        | `!ban @twitchUser`             | `ban`, `banned`                |
| `!timeout @user [duration]` | Times out a user for specified duration | Moderator        | None        | `!timeout @twitchUser 600`     | `timeout`, `mute`            |
| `!unban @user`  | Lifts the ban on a user            | Moderator        | None        | `!unban @twitchUser`           | `unban`, `liftban`             |
| `!quote`        | Provides a random quote             | Everyone          | 60 seconds  | `!quote`                         | `quote`                        |
| `!giverole @user [role]` | Assigns a role to a user       | Admin             | None        | `!giverole @twitchUser Admin`  | `role`, `assign`               |

## Permissions
- **Everyone**: Accessible to all users.
- **Moderator**: Requires moderator status in the channel.
- **Admin**: Requires admin privileges.

## Cooldown System
- Cooldowns help to prevent spam and ensure that commands are used thoughtfully.
- Each command has its defined cooldown period, which resets after the command is executed.

## Usage Examples
- Users can access commands directly in the chat by typing the command prefixed by `!`.
- Example: To ban a user, a moderator would type `!ban @username` in the chat.

## Auto-response Keywords
- The bot can respond to specific keywords in chat, triggering auto-responses.
- Example: If a user types `help`, the bot will respond with a list of commands or information about using commands.

---

For further customization and support, please refer to the bot's user guide or contact an administrator.