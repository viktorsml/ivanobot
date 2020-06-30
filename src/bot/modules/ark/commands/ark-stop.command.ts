import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';

import { daemonApiUrl, friendlyErrorMessage, logger } from '../../../../shared/ivanobot.api';
import { token } from '../utils/transaction-token';

export const arkStopCommand = async (message: Message) => {
  logger.action('ARK_STOP_SERVER', [`Invoked by '@${message.author.username}'`]);
  const initialMessage = await message.channel.send('No me duele, me quema, me lastima pero ni pedo, estoy apagando el server...');
  try {
    const arkStopServer: AxiosResponse<string> = await axios.post(daemonApiUrl + '/ark/stopServer', token);
    logger.action('ARK_STOP_SUCCESSFUL', [arkStopServer]);
    message.channel.send('Listo, el servidor se detuvo correctamente. Espero hayas tenido buenas razones. :rage:');
  } catch (error) {
    const errorCode = error.response ? error.response.status : error.code;
    const errorTag = error.response ? error.response.data : 'NO_DAEMON_CONNECTION';
    logger.error('ARK_STOP_FAILED', [errorCode, errorTag]);
    message.channel.send(friendlyErrorMessage(errorTag, errorCode));
  } finally {
    initialMessage.delete();
  }
};
