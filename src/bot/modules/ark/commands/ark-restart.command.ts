import { Message } from 'discord.js';

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
    const commandResponse = await executeCommand('docker exec -i CaguamoArk arkmanager restart');
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
      friendlyErrorMessage('Whops! No puedo determinar el estado del servidor ARK. :disappointed_relieved:', arkStatusErrorCode)
    );
    initialMessage.delete();
    return;
  }

  if (currentStatus === 'OFFLINE') {
    message.channel.send(
      'Whops! No puedo reiniciar el servidor de ARK porque se encuentra apagado. :no_mouth:' +
        '\n\n> *Usa el comand "!ark start" si quieres iniciar el servidor de ARK.*'
    );
    initialMessage.delete();
    return;
  }

  if (currentStatus === 'STARTING') {
    message.channel.send(
      'Whops! No puedo reiniciar el servidor de ARK porque se encuentra iniciándose, espera a que se inicie por completo. :no_mouth:'
    );
    initialMessage.delete();
    return;
  }

  const { successfullyRestarted, errorCode } = await restartArkServer();
  const pendingMessage = await message.channel.send(
    ':construction_worker: Listo, el servidor de ARK se está reiniciando. Te avisaré cuando ya puedas entrar a jugar. (Usualmente tarda 3min.)'
  );

  if (!successfullyRestarted) {
    message.channel.send(
      friendlyErrorMessage(
        'Hmm, que extraño. Ocurrió un problema desconocido al momento de reiniciar el servidor de ARK. :thinking:',
        errorCode
      )
    );
    pendingMessage.delete();
    return;
  }

  // check server status every 20 seconds to see if people can start to play
  try {
    await watchArkServerStartup();
    message.channel.send(`¡Listo! Ya puedes entrar a jugar, <@${message.author.id}>. :partying_face:`);
  } catch (error) {
    message.channel.send(
      friendlyErrorMessage(
        `Lo siento mucho, ya no te podré avisar cuando ya puedas entrar, <@${message.author.id}>. ` +
          'Ocurrió un problema al reiniciar el server. :sob:',
        'INTERRUPTED_START_PROCESS'
      )
    );
  } finally {
    pendingMessage.delete();
  }
};
