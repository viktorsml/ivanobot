import { Message, MessageEmbed } from 'discord.js';

import { StatusCode } from '../../../../shared/interfaces';
import { friendlyErrorMessage, logger } from '../../../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';
import { watchArkServerStartup } from '../functions/wath-startup';
import { getArkStatus } from './ark-status.command';

interface RestartArkServerResponse {
  successfullyRestarted: boolean;
  errorCode?: string;
}

export const restartArkServer = async (): Promise<RestartArkServerResponse> => {
  const arkStatusCode: StatusCode = {
    initial: 'ARK_RESTART_INITIALIZED',
    success: 'ARK_RESTART_SUCCESSFUL',
    failure: 'ARK_RESTART_FAILED',
  };
  logger.action(arkStatusCode.initial);
  try {
    const commandResponse = await executeCommand('docker exec -i CaguamoArk arkmanager restart --saveworld');
    logger.action(arkStatusCode.success, [commandResponse]);
    return { successfullyRestarted: true };
  } catch (error) {
    logger.error(arkStatusCode.failure, error);
    return { successfullyRestarted: false, errorCode: 'UNKOWN_ERROR' };
  }
};

export const arkRestartCommand = async (message: Message) => {
  const initialMessage = await message.channel.send('Revisando estado del servidor...');
  const { currentStatus, errorCode: arkStatusErrorCode } = await getArkStatus();

  if (arkStatusErrorCode) {
    message.channel.send(
      new MessageEmbed()
        .setColor('RED')
        .setTitle('Whops! No puedo determinar el estado del servidor de ARK. :disappointed_relieved:')
        .setFooter(arkStatusErrorCode)
    );
    initialMessage.delete();
    return;
  }

  if (currentStatus === 'OFFLINE') {
    message.channel.send(
      new MessageEmbed()
        .setColor('RED')
        .setTitle('Whops! No puedo reiniciar el servidor de ARK porque se encuentra apagado. :no_mouth:')
        .setDescription('*Usa el comand "!ark start" si quieres iniciar el servidor de ARK.*')
    );
    initialMessage.delete();
    return;
  }

  if (currentStatus === 'STARTING') {
    message.channel.send(
      new MessageEmbed()
        .setColor('YELLOW')
        .setTitle('Whops! No puedo reiniciar el servidor de ARK porque se encuentra iniciándose. :no_mouth:')
        .setDescription('*Espera a que se inicie por completo e intenta de nuevo si es que quieres reiniciar el servidor.*')
    );
    initialMessage.delete();
    return;
  }

  const { successfullyRestarted, errorCode } = await restartArkServer();
  const pendingMessage = await message.channel.send(
    new MessageEmbed()
      .setColor('YELLOW')
      .setTitle(':construction_worker: Listo, el servidor de ARK se está reiniciando.')
      .setDescription('*Te avisaré cuando ya puedas entrar a jugar. (Usualmente tarda 3min.)*')
  );

  if (!successfullyRestarted) {
    message.channel.send(
      new MessageEmbed()
        .setColor('RED')
        .setTitle('Hmm, que extraño. Ocurrió un problema desconocido al momento de reiniciar el servidor de ARK. :thinking:')
        .setFooter(errorCode)
    );
    pendingMessage.delete();
    return;
  }

  // check server status every 20 seconds to see if people can start to play
  try {
    await watchArkServerStartup();
    message.channel.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Servidor de ARK reiniciado correctamente.')
        .setDescription(`¡Listo! Ya puedes entrar a jugar, <@${message.author.id}>. :partying_face:`)
    );
  } catch (error) {
    message.channel.send(
      new MessageEmbed()
        .setColor('RED')
        .setTitle('Ocurrió un problema al reiniciar el server. :sob:')
        .setDescription(`Lo siento mucho, ya no te podré avisar cuando ya puedas entrar, <@${message.author.id}>.`)
        .setFooter('INTERRUPTED_START_PROCESS')
    );
  } finally {
    pendingMessage.delete();
  }
};
