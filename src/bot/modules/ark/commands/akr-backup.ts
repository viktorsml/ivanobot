import { Message, MessageEmbed } from 'discord.js';

import { logger } from '../../../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';
import { getArkStatus } from './ark-status.command';

export const arkBackupCommand = async (message: Message) => {
  logger.action('ARK_BACKUP_PROCESS_STARTED', [`Inveoked by "@${message.author.username}".`]);

  const initialMessage = await message.channel.send('Creando copia de seguridad...');

  const { isServerOnline } = await getArkStatus();
  if (!isServerOnline) {
    message.channel.send(
      new MessageEmbed()
        .setColor('YELLOW')
        .setTitle('El servidor no está online.')
        .setDescription(
          'Para poder guardar el progreso de la partida y crear una copia de seguridad se necesita que el servidor esté online.'
        )
    );
    initialMessage.delete();
    return;
  }

  try {
    logger.action('EXECUTE_SAVEWORLD', [`Inveoked by "@${message.author.username}".`]);
    const resultOfWorldSave = await executeCommand('arkmanager saveworld', { runOnDocker: true });
    logger.action('SAVEWORLD_COMMAND_EXECUTED', resultOfWorldSave);
    logger.action('EXECUTE_BACKUP');
    const resultOfBackup = await executeCommand('arkmanager backup', { runOnDocker: true });
    logger.action('BACKUP_COMMAND_EXECUTED', resultOfBackup);
    const backupName = resultOfBackup
      .find((line) => /(Created Backup)/.test(line))
      .trim()
      .replace('Created Backup: ', '');
    message.channel.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setTitle('¡Copia de seguridad realizada correctamente!')
        .setDescription(`Nombre de la copia: *${backupName}*`)
    );
  } catch (error) {
    message.channel.send(
      new MessageEmbed()
        .setColor('RED')
        .setTitle('Whops! Por alguna razón no se pudo hacer la copia de seguridad. :disappointed_relieved:')
        .setFooter('BACKUP_FAILED')
    );
    return;
  } finally {
    initialMessage.delete();
  }
};
