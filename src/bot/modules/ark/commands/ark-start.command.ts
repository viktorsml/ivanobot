import { Message } from 'discord.js';

import { StatusCode } from '../../../../shared/interfaces';
import { friendlyErrorMessage, logger } from '../../../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';
import { watchArkServerStartup } from '../functions/wath-startup';
import { getArkStatus } from './ark-status.command';

interface StartArkServerResponse {
  successfullyStarted: boolean;
  errorCode?: string;
}

export const startArkServer = async (): Promise<StartArkServerResponse> => {
  const arkStatusCode: StatusCode = {
    initial: 'ARK_START_INITIALIZED',
    success: 'ARK_START_SUCCESSFUL',
    failure: 'ARK_START_FAILED',
  };
  logger.action(arkStatusCode.initial);
  try {
    const commandResponse = await executeCommand('docker start CaguamoArk');
    console.log(commandResponse);
    return { successfullyStarted: true };
  } catch (error) {
    return { successfullyStarted: false, errorCode: 'UNKOWN_ERROR' };
  }
};

export const arkStartCommand = async (message: Message) => {
  const initialMessage = await message.channel.send('Revisando estado del servidor...');
  const { currentStatus, errorCode } = await getArkStatus();

  if (errorCode) {
    message.channel.send(friendlyErrorMessage('Whops! No puedo determinar el estado del servidor ARK. :disappointed_relieved:', errorCode));
    initialMessage.delete();
    return;
  }

  if (currentStatus === 'STARTING') {
    logger.action('ARK_SERVER_ALREADY_STARTING', ['No extra accion was made.']);
    message.channel.send(
      'El servidor de ARK ya se encuentra activadose, espera un momento en lo que está disponible (Ususalmente tarda unos ~3min). :wink:'
    );
    initialMessage.delete();
    return;
  }

  if (currentStatus === 'ONLINE') {
    logger.action('ARK_SERVER_ALREADY_ACTIVE', ['No extra accion was made.']);
    message.channel.send(
      'El servidor de ARK ya se encuentra activado por lo que no se tomó ninguna acción. :star_struck:' +
        '\n\n> *Si quires reiniciar el servidor usa el comando "!ark restart".*'
    );
    initialMessage.delete();
    return;
  }

  // start server
  const { successfullyStarted, errorCode: startArkServerErrorCode } = await startArkServer();
  initialMessage.delete();

  if (!successfullyStarted) {
    message.channel.send(
      friendlyErrorMessage(
        'Hmm, que extraño. Ocurrió un problema desconocido. al momento de inciar el servidor de ARK. :thinking:',
        startArkServerErrorCode
      )
    );
    return;
  }

  const pendingMessage = await message.channel.send(
    ':construction_worker: Listo, el servidor se está iniciando. Te avisaré cuando ya puedas entrar a jugar. (Usualmente tarda ~3min.)'
  );

  // check server status every 20 seconds to see if people can start to play
  try {
    await watchArkServerStartup();
    message.channel.send(`¡Listo! Ya puedes entrar a jugar, <@${message.author.id}>. :partying_face:`);
  } catch (error) {
    message.channel.send(
      friendlyErrorMessage(
        `Lo siento mucho, ya no te podré avisar cuando ya puedas entrar, <@${message.author.id}>. ` +
          'Ocurrió un problema al iniciar el server. :sob:',
        'INTERRUPTED_START_PROCESS'
      )
    );
  } finally {
    pendingMessage.delete();
  }
};
