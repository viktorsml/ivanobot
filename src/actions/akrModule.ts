import { Message } from 'discord.js';
import { arkStartCommand } from '../commands/ark.start.command';
import { arkRestartCommand } from '../commands/ark.restart.command';
import { arkStatusCommand } from '../commands/ark.status.command';
import { arkStopCommand } from '../commands/ark.stop.command';
import { logger } from '../utils/logger';

const errorMessage = (action: string) => {
  return `El comando "${action}" no existe. Comandos disponibles:
ℹ !ark status\n▶ !ark start\n🔁 !ark restart\n⏹ !ark stop\nAy no, que feo caso. Todo meco el vato.`;
};

export const arkModule = (message: Message) => {
  const [ark, action] = message.content.split(' ');
  const foundValidRoles = message.member.roles.cache.find(role => role.name === 'CaguamoTecnico' || role.name === 'Tecnico');
  if (foundValidRoles) {
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
      default:
        message.reply(errorMessage(action));
        break;
    }
  } else {
    logger(`'@${message.author.username}' tried to run a protected command`, [message.content]);
    message.reply('Te falta más barrio. No tienes permiso para ejecutar este comando. Contacta a un CaguamoTecnico.');
  }
};
