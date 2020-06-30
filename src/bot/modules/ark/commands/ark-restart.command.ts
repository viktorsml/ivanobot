import { Message } from 'discord.js';

import { fetchDaemonData, RunCommandParams } from '../functions/daemon-fetch';
import { watchArkServerStartup } from '../functions/wath-startup';

const clientSettingsForStartServer: RunCommandParams = {
  endpoint: '/ark/restartServer',
  initialMessageText: 'Reiniciando ARK Server...',
  commandMeta: {
    wait: 'ARK_SERVER_RESTART',
    success: 'ARK_SERVER_RESTART_SUCCESSFUL',
    failure: 'ARK_SERVER_RESTART_FAILED',
  },
};

export const arkRestartCommand = async (message: Message) => {
  const arkServerRestartResponse = await fetchDaemonData(message, clientSettingsForStartServer);
  if (!arkServerRestartResponse) return;
  const pendingMessage = await message.channel.send(
    ':construction_worker: Listo, el servidor se está reiniciando. Te avisaré cuando ya puedas entrar a jugar. (Usualmente tarda 3min.)'
  );

  // check server status every 20 seconds to see if people can start to play
  try {
    await watchArkServerStartup(message);
    message.channel.send(`¡Listo! Ya puedes entrar a jugar, <@${message.author.id}>. :partying_face:`);
  } catch (error) {
    message.channel.send(`> \nYa no te podré avisar cuando ya puedas entrar.`);
  } finally {
    pendingMessage.delete();
  }
};
