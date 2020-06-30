import { Message } from 'discord.js';

import { NOT_ENOUGH_PERMISIONS } from '../../../shared/actions-text';
import { logger } from '../../../shared/ivanobot.api';
import { canUserExecuteCommand } from '../../utils/validation';
import { arkPortCommand } from './commands/ark-ports.command';
import { arkRestartCommand } from './commands/ark-restart.command';
import { arkSpeedCommand } from './commands/ark-speed.command';
import { arkStartCommand } from './commands/ark-start.command';
import { arkStatusCommand } from './commands/ark-status.command';
import { arkStopCommand } from './commands/ark-stop.command';

const invalidCommandText = (command: string) => {
  return (
    `El comando "${command}" no existe. Comandos disponibles:` +
    '\n\n:information_source: **!ark status**' +
    '\n:arrow_forward: **!ark start**' +
    '\n:repeat: **!ark restart**' +
    '\n:stop_button: **!ark stop**' +
    '\n:1234: **!ark ports**' +
    '\n:zap: **!ark speedtest**' +
    '\n\n> *Ay no, que feo caso. Todo meco el vato.*'
  );
};

export const arkModule = (message: Message) => {
  const { content, member, author } = message;
  const command = content.split(' ')[1].toLocaleLowerCase();

  if (!canUserExecuteCommand({ userRoles: member.roles.cache, validRoles: ['723271885340803082', '726549737729163356'] })) {
    logger.action(NOT_ENOUGH_PERMISIONS.id, [`"@${author.username}" tried to run a protected command`, content]);
    message.reply(NOT_ENOUGH_PERMISIONS.friendlyText);
    return;
  }

  switch (command) {
    case 'status':
      arkStatusCommand(message);
      break;
    case 'ports':
      arkPortCommand(message);
      break;
    case 'speedtest':
      arkSpeedCommand(message);
      break;
    case 'start':
      arkStartCommand(message);
      break;
    case 'stop':
      arkStopCommand(message);
      break;
    case 'restart':
      arkRestartCommand(message);
      break;

    default:
      message.reply(invalidCommandText(command));
      break;
  }
};
