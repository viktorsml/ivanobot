import { AxiosResponse } from 'axios';
import { Message } from 'discord.js';

import { ArkStatusResponse } from '../../../../shared/interfaces';
import { logger } from '../../../../shared/ivanobot.api';
import { fetchDaemonData, RunCommandParams } from '../functions/daemon-fetch';
import { watchArkServerStartup } from '../functions/wath-startup';

const clientSettingsForStatusServer: RunCommandParams = {
  endpoint: '/ark/serverStatus',
  commandMeta: {
    wait: 'ARK_SERVER_RETRIEVE_STATUS',
    success: 'ARK_SERVER_RETRIEVE_STATUS_SUCCESSFUL',
    failure: 'ARK_SERVER_RETRIEVE_STATUS_FAILED',
  },
};

const clientSettingsForStartServer: RunCommandParams = {
  endpoint: '/ark/startServer',
  initialMessageText: 'Iniciando ARK Server...',
  commandMeta: {
    wait: 'ARK_SERVER_START',
    success: 'ARK_SERVER_START_SUCCESSFUL',
    failure: 'ARK_SERVER_START_FAILED',
  },
};

export const arkStartCommand = async (message: Message) => {
  const arkStatusResponse: AxiosResponse<ArkStatusResponse> = await fetchDaemonData(message, clientSettingsForStatusServer);
  if (!arkStatusResponse) return;
  const { isActive, since } = arkStatusResponse.data;
  if (isActive) {
    logger.action('ARK_SERVER_ALREADY_ACTIVE', [arkStatusResponse.data]);
    message.channel.send(
      `>>> El servidor de ARK ya se encuentra activado desde el ${since} por lo que no se tomó ninguna acción.` +
        '\n\n*Si quires reiniciar el servidor usa el comando "!ark restart".*'
    );
    return;
  }

  // start server
  const arkServerStartResponse = await fetchDaemonData(message, clientSettingsForStartServer);
  const pendingMessage = await message.channel.send(
    ':construction_worker: Listo, el servidor se está iniciando. Te avisaré cuando ya puedas entrar a jugar. (Usualmente tarda 3min.)'
  );
  console.log(arkServerStartResponse.data);

  // check server status every 20 seconds to see if people can start to play
  try {
    await watchArkServerStartup(message);
    message.channel.send(`¡Listo! Ya puedes entrar a jugar, <@${message.author.id}>. :partying_face:`);
  } catch (error) {
    message.channel.send(`\nYa no te podré avisar cuando ya puedas entrar.`);
  } finally {
    pendingMessage.delete();
  }
};
