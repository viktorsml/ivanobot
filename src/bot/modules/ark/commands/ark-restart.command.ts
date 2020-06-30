import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';

import { daemonApiUrl, friendlyErrorMessage, logger } from '../../../../shared/ivanobot.api';
import { token } from '../utils/transaction-token';

export const arkRestartCommand = async (message: Message) => {
  logger.action('ARK_SERVER_RESTART', [`Invoked by '@${message.author.username}'`]);
  const initialMessage = await message.channel.send('Reiniciando servidor de ark. Espera un momento...');
  try {
    const arkRestartServer: AxiosResponse<string> = await axios.post(daemonApiUrl + '/ark/restartServer', token);
    logger.action('ARK_RESTART_SUCCESSFUL', [arkRestartServer]);
    message.channel.send(':construction_worker: Listo, el servidor se está reiniciando. Te avisaré cuando ya puedas entrar a jugar.');
  } catch (error) {
    const errorCode = error.response ? error.response.status : error.code;
    const errorTag = error.response ? error.response.data : 'NO_DAEMON_CONNECTION';
    logger.error('ARK_RESTART_FAILED', [errorCode, errorTag]);
    message.channel.send(friendlyErrorMessage(errorTag, errorCode));
  } finally {
    initialMessage.delete();
  }
};
