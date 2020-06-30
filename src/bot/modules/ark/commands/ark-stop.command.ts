import { AxiosResponse } from 'axios';
import { Message } from 'discord.js';

import { ArkStatusResponse } from '../../../../shared/interfaces';
import { logger } from '../../../../shared/ivanobot.api';
import { fetchDaemonData, RunCommandParams } from '../functions/daemon-fetch';

const clientSettingsForStatusServer: RunCommandParams = {
  endpoint: '/ark/serverStatus',
  commandMeta: {
    wait: 'ARK_SERVER_RETRIEVE_STATUS',
    success: 'ARK_SERVER_RETRIEVE_STATUS_SUCCESSFUL',
    failure: 'ARK_SERVER_RETRIEVE_STATUS_FAILED',
  },
};

const clientSettingsForStopServer: RunCommandParams = {
  endpoint: '/ark/stopServer',
  initialMessageText: 'No me duele, me quema, me lastima pero ni pedo, estoy apagando el server...',
  commandMeta: {
    wait: 'ARK_SERVER_STOP',
    success: 'ARK_SERVER_STOP_SUCCESSFUL',
    failure: 'ARK_SERVER_STOP_FAILED',
  },
};

export const arkStopCommand = async (message: Message) => {
  const arkStatusResponse: AxiosResponse<ArkStatusResponse> = await fetchDaemonData(message, clientSettingsForStatusServer);
  if (!arkStatusResponse) return;
  const { isActive, since } = arkStatusResponse.data;
  if (!isActive) {
    logger.action('ARK_SERVER_ALREADY_INACTIVE', [arkStatusResponse.data]);
    message.channel.send(`> *El servidor de ARK ya se encuentra apagado desde el ${since} por lo que no se tomó ninguna acción.*`);
    return;
  }

  // stop server
  await fetchDaemonData(message, clientSettingsForStopServer);
  message.channel.send('Listo, el servidor se detuvo correctamente. Espero hayas tenido buenas razones. :rage:');
};
