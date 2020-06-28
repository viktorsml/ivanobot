import { Message } from 'discord.js';
import { logger } from '../../api/ivanobot.api';
import { arkStartCommand } from './commands/ark-start.command';
import { arkRestartCommand } from './commands/ark-restart.command';
import { arkStatusCommand } from './commands/ark-status.command';
import { arkStopCommand } from './commands/ark-stop.command';
import { arkPortCommand } from './commands/ark-ports.command';
import { arkSpeedCommand } from './commands/ark-speed.command';

export const arkModule = (message: Message) => {
  const { content, member, author } = message;
  const [_, action] = content.split(' ');
  const foundValidRoles = member.roles.cache.find((role) => role.name === 'CaguamoTecnico' || role.name === 'Tecnico');

  if (!foundValidRoles) {
    logger.action('NOT_ENOUGH_PERMISSIONS', [`'@${author.username}' tried to run a protected command`, content]);
    message.reply('Te falta más barrio. No tienes permiso para ejecutar este comando. Contacta a un CaguamoTecnico.');
    return;
  }

  switch (action) {
    case 'status':
      arkStatusCommand(message);
      break;
    case 'restart':
      arkRestartCommand(message);
      break;
    case 'start':
      arkStartCommand(message);
      break;
    case 'stop':
      arkStopCommand(message);
      break;
    case 'ports':
      arkPortCommand(message);
      break;
    case 'speedtest':
      arkSpeedCommand(message);
      break;
    default:
      message.reply(
        `El comando "${action}" no existe. Comandos disponibles:` +
          '\n\n:information_source: **!ark status**' +
          '\n:arrow_forward: **!ark start**' +
          '\n:repeat: **!ark restart**' +
          '\n:stop_button: **!ark stop**' +
          '\n:1234: **!ark ports**' +
          '\n:zap: **!ark speedtest**' +
          '\n\n> *Ay no, que feo caso. Todo meco el vato.*'
      );
      break;
  }
};
