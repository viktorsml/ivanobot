import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';

import { ArkPortsResponse } from '../../../../shared/interfaces';
import { logger } from '../../../../shared/ivanobot.api';
import { apiEndpoint, delayAsyncBlock } from '../../../utils/daemon-client';
import { token } from '../../../utils/transactions';
import { handleDaemonFetchError } from './daemon-fetch';

export const watchArkServerStartup = (message: Message): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    logger.action('WATCH_ARK_SERVER_STARTUP', ['STARTED']);
    try {
      let totalPorts = 0;
      while (totalPorts < 3) {
        await delayAsyncBlock(30000);
        const arkPorts: AxiosResponse<ArkPortsResponse> = await axios.post(apiEndpoint('/ark/activePorts'), token);
        logger.action('WATCH_ARK_SERVER_STARTUP_FOUND', [`Ports found: "${arkPorts.data.activePorts}"`]);
        totalPorts = arkPorts.data.activePorts;
      }
      resolve();
    } catch (error) {
      handleDaemonFetchError(error, 'WATCH_ARK_SERVER_STARTUP_FAILED', message);
      reject(error);
    }
  });
};
