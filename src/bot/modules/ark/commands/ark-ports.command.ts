import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';

import { ArkPortsResponse } from '../../../../shared/interfaces';
import { daemonApiUrl, friendlyErrorMessage, logger } from '../../../../shared/ivanobot.api';
import { token } from '../utils/transaction-token';

export const arkPortCommand = async (message: Message) => {
  logger.action('PORT_RETRIEVAL', [`Invoked by '@${message.author.username}'`]);
  const initialMessage = await message.channel.send('Espera un momento en lo que obtengo los puertos usados por ARK Server...');
  try {
    const arkPortsResponse: AxiosResponse<ArkPortsResponse> = await axios.post(daemonApiUrl + '/ark/activePorts', token);
    const { activePorts, portsPayload } = arkPortsResponse.data;
    const portList = portsPayload.split('\n').map((line) => `\n${line.substring(60).trim()}`);
    logger.action('PORTS_SUCCESSFULLY_RETRIEVED', [`${activePorts} ports found.\n`, portsPayload]);
    message.channel.send(`Hay **${activePorts}** puertos activos usados por ARK Server:\n\n>>> **Puertos activos:** ${portList}`);
  } catch (error) {
    const errorCode = error.response ? error.response.status : error.code;
    const errorTag = error.response ? error.response.data : 'NO_DAEMON_CONNECTION';
    if (errorTag !== 'NO_DAEMON_CONNECTION') {
      logger.error('ARK_STATUS_RETRIEVAL_FAILED', [errorCode, errorTag]);
      message.channel.send(friendlyErrorMessage(errorTag, errorCode));
    } else {
      logger.error('ZERO_PORTS_RETRIEVED', [errorCode, errorTag, !error.response ? error : null]);
      message.channel.send(
        'No hay puertos activos para ARK Server. ¿Estás seguro de que está activo el servidor?' +
          '\n\n> *Usa el comando "!ark status" para averiguarlo.*'
      );
    }
  } finally {
    initialMessage.delete();
  }
};
