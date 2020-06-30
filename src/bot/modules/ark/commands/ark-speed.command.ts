import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';

import { daemonApiUrl, friendlyErrorMessage, logger } from '../../../../shared/ivanobot.api';
import { token } from '../utils/transaction-token';

export const arkSpeedCommand = async (message: Message) => {
  logger.action('ARK_SPEEDTEST', [`Invoked by '@${message.author.username}'`]);
  const initialMessage = await message.channel.send('Aguantame poquito, ando midiendo la velocidad :zap: ...');
  try {
    const results: AxiosResponse<string> = await axios.post(daemonApiUrl + '/speedtest', token);
    const speedtestResults = results.data.split('\n').map((line) => `\n${line.trim()}`);
    logger.action('ARK_SPEEDTEST_SUCCESSFUL', [results.data]);
    message.channel.send(`>>> **Resultados de la prueba:** ${speedtestResults}`);
  } catch (error) {
    const errorCode = error.response ? error.response.status : error.code;
    const errorTag = error.response ? error.response.data : 'NO_DAEMON_CONNECTION';
    logger.error('ARK_SPEEDTEST_FAILED', [errorCode, errorTag]);
    message.channel.send(friendlyErrorMessage(errorTag, errorCode));
  } finally {
    initialMessage.delete();
  }
};
