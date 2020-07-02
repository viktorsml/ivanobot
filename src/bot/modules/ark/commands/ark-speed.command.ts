import { AxiosResponse } from 'axios';
import { Message } from 'discord.js';

import { fetchDaemonData, RunCommandParams } from '../functions/daemon-fetch';

const clientSettings: RunCommandParams = {
  endpoint: '/speedtest',
  initialMessageText: 'Aguantame poquito, ando midiendo la velocidad :zap: ...',
  commandMeta: {
    wait: 'ARK_SERVER_SPEEDTEST',
    success: 'ARK_SERVER_SPEEDTEST_SUCCESSFUL',
    failure: 'ARK_SERVER_SPEEDTEST_FAILED',
  },
};

export const arkSpeedCommand = async (message: Message) => {
  const results: AxiosResponse<string> = await fetchDaemonData(message, clientSettings);
  if (!results) return;
  const speedtestResults = results.data.split('\n').map((line) => `\n${line.trim()}`);
  message.channel.send(`>>> **Resultados de la prueba:** ${speedtestResults}`);
};
