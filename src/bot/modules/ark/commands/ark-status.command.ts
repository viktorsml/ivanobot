import { AxiosResponse } from 'axios';
import { Message } from 'discord.js';

import { ArkStatusResponse } from '../../../../shared/interfaces';
import { fetchDaemonData, RunCommandParams } from '../functions/daemon-fetch';

const clientSettings: RunCommandParams = {
  endpoint: '/ark/serverStatus',
  commandMeta: {
    wait: 'ARK_SERVER_RETRIEVE_STATUS',
    success: 'ARK_SERVER_RETRIEVE_STATUS_SUCCESSFUL',
    failure: 'ARK_SERVER_RETRIEVE_STATUS_FAILED',
  },
};

export const arkStatusCommand = async (message: Message) => {
  const arkStatusResponse: AxiosResponse<ArkStatusResponse> = await fetchDaemonData(message, clientSettings);
  if (!arkStatusResponse) return;
  const { isActive, since } = arkStatusResponse.data;
  const activeText = isActive ? ':white_check_mark: El servidor de ARK está activo' : ':octagonal_sign: El servidor de ARK no está activo';
  message.channel.send(`${activeText} desde el ${since}.`);
};
