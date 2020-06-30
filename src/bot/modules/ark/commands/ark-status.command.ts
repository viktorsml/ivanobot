import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';

import { ArkStatusResponse, TransactionToken } from '../../../../shared/interfaces';
import { daemonApiUrl, friendlyErrorMessage, logger, restApiToken } from '../../../../shared/ivanobot.api';

export const arkStatusCommand = async (message: Message) => {
  logger.action('ARK_SERVER_STATUS', [`Invoked by '@${message.author.username}'`]);
  const initialMessage = await message.channel.send('Obteniendo estatus del server. Espera un momento...');
  const token: TransactionToken = { data: restApiToken };
  try {
    const arkStatusResponse: AxiosResponse<ArkStatusResponse> = await axios.post(daemonApiUrl + '/ark/serverStatus', token);
    const { isActive, since } = arkStatusResponse.data;
    const activeText = isActive
      ? ':white_check_mark: El servidor de ARK está activo'
      : ':octagonal_sign: El servidor de ARK no está activo';
    logger.action('ARK_STATUS_RETRIEVAL_SUCCESSFUL', ['Response was', arkStatusResponse.data]);
    message.channel.send(`${activeText} desde el ${since}.`);
  } catch (error) {
    const errorCode = error.response ? error.response.status : error.code;
    const errorTag = error.response ? error.response.data : 'NO_DAEMON_CONNECTION';
    logger.error('ARK_STATUS_RETRIEVAL_FAILED', [errorCode, errorTag]);
    message.channel.send(friendlyErrorMessage(errorTag, errorCode));
  } finally {
    initialMessage.delete();
  }
};
