import { AxiosResponse } from 'axios';
import { Message } from 'discord.js';

import { ArkPortsResponse, ArkStatusResponse } from '../../../../shared/interfaces';
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

const clientSettings: RunCommandParams = {
  endpoint: '/ark/activePorts',
  commandMeta: {
    wait: 'ARK_SERVER_RETRIEVE_PORTS',
    success: 'ARK_SERVER_RETRIEVE_PORTS_SUCCESSFUL',
    failure: 'ARK_SERVER_RETRIEVE_PORTS_FAILED',
  },
};

export const arkPortCommand = async (message: Message) => {
  const arkStatusResponse: AxiosResponse<ArkStatusResponse> = await fetchDaemonData(message, clientSettingsForStatusServer);
  if (!arkStatusResponse) return;
  if (!arkStatusResponse.data.isActive) {
    logger.action('ARK_SERVER_ALREADY_STOPED', [arkStatusResponse.data]);
    message.channel.send('Es servidor no está activo por lo que no hay puertos abiertos para ARK Server. :face_with_hand_over_mouth:');
    return;
  }

  const arkPortsResponse: AxiosResponse<ArkPortsResponse> = await fetchDaemonData(message, clientSettings);
  if (arkPortsResponse) {
    const { activePorts, portsPayload } = arkPortsResponse.data;
    const portList = portsPayload.split('\n').map((line) => `\n${line.substring(60).trim()}`);
    message.channel.send(`Hay **${activePorts}** puertos activos usados por ARK Server:\n\n>>> **Puertos activos:** ${portList}`);
  } else {
    message.channel.send('No hay puertos activos para ARK Server. :no_mouth:');
  }
};
