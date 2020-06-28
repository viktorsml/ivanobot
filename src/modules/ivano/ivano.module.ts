import { Message } from 'discord.js';
import { logger } from '../../api/ivanobot.api';

export const ivanoModule = (message: Message) => {
  const IVANO_ID = '531705363804848129';
  logger('IVANO_INVOKE', [`invoked by '@${message.author.username}'`]);
  message.channel.send(
    `<@${IVANO_ID}>: Pinche Ivano vicio, te pasas de verga, ya deja de jugar un rato, siempre te la pasas de pinche vicio, alv.`
  );
};