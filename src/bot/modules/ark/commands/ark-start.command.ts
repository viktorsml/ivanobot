import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';

import { ArkStatusResponse } from '../../../../shared/interfaces';
import { daemonApiUrl, friendlyErrorMessage, logger } from '../../../../shared/ivanobot.api';
import { token } from '../utils/transaction-token';

export const arkStartCommand = async (message: Message) => {
  logger.action('ARK_SERVER_START', [`Invoked by '@${message.author.username}'`]);
  const initialMessage = await message.channel.send('Iniciando servidor de ark. Espera un momento...');
  try {
    const arkStatus: AxiosResponse<ArkStatusResponse> = await axios.post(daemonApiUrl + '/ark/serverStatus', token);
    const { isActive, since } = arkStatus.data;
    // check server status
    if (isActive) {
      logger.action('ARK_SERVER_ALREADY_ACTIVE', [isActive]);
      message.channel.send(
        `El servidor de ARK ya se encuentra activado desde el ${since} por lo que no se tomó ninguna acción.` +
          '\n\n> *Si quires reiniciar el servidor usa el comando "!ark restart".*'
      );
      return;
    }
    // start server if necesary
    const arkStartServer: AxiosResponse<string> = await axios.post(daemonApiUrl + '/ark/startServer', token);
    logger.action('ARK_SUCCESSFULLY_STARTED', [arkStartServer.data]);
    message.channel.send(':construction_worker: Listo, el servidor se está iniciando. Te avisaré cuando ya puedas entrar a jugar.');
    // const pendingMessage = await message.channel.send(
    //   ':construction_worker: Listo, el servidor se está iniciando. Te avisaré cuando ya puedas entrar a jugar.'
    // );
    // check server status every 20 seconds to see if people can start to play
    // pendingMessage.delete();
  } catch (error) {
    const errorCode = error.response ? error.response.status : error.code;
    const errorTag = error.response ? error.response.data : 'NO_DAEMON_CONNECTION';
    logger.error('ARK_START_FAILED', [errorCode, errorTag]);
    message.channel.send(friendlyErrorMessage(errorTag, errorCode));
  } finally {
    initialMessage.delete();
  }
};
