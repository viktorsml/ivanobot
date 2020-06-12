import { Message } from 'discord.js';
import { logger } from '../utils/logger';

const ivanoId = '531705363804848129';

export const ivanoInvoke = (message: Message) => {
  logger('IVANO_INVOKE', [`invoked by '@${message.author.username}'`]);
  message.reply(
    `<@${ivanoId}>: Pinche Ivano vicio, te pasas de verga, ya deja de jugar un rato, siempre te la pasas de pinche vicio, alv.`
  );
};
