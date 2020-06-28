import { Message } from 'discord.js';
import { addictedLevel, parseLevel } from './functions/level.functions';
import { logger } from '../../api/ivanobot.api';

export const levelModule = (message: Message) => {
  const { mentions, author } = message;
  const mentionedUser = mentions.users.first();

  if (mentionedUser) {
    const { level, levelText } = addictedLevel(mentionedUser.username);
    logger('ADDICTED_LEVEL_FOR_USER', [
      `'${author.username}' asked for the addicted level for ${mentionedUser.username} (${mentionedUser.id}).\n`,
      { level, levelText },
    ]);
    message.channel.send(`<@${mentionedUser.id}> es ${parseLevel(level)}% vicio. ${levelText}`);
    return;
  }

  const { level, levelText } = addictedLevel(author.username);
  logger('USER_ADDICTED_LEVEL', [`'${author.username}' asked for his addicted level.\n`, { level, levelText }]);
  message.reply(`Eres ${parseLevel(level)}% vicio. ${levelText}`);
};
