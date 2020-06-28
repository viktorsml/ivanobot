import { Message } from 'discord.js';
import { logger } from '../../../api/ivanobot.api';
import { executeCommand } from '../../../api/ark-server.api';

export const arkSpeedCommand = (message: Message) => {
  const { author } = message;
  logger('ARK_SPEEDTEST', [`Invoked by '@${author.username}'`]);
  message.channel
    .send('Ejecutando pureba de velocidad de internet usando Speedtest.net. Espera un momento en lo que se completa...')
    .then((initialMessage) => {
      executeCommand('speedtest')
        .then((results) => {
          const speedtestResults = results.split('\n').map((line) => `\n${line.trim()}`);
          logger('ARK_SPEEDTEST_SUCCESSFUL', [results]);
          message.channel.send(`>>> **Resultados de la prueba:** ${speedtestResults}`);
          initialMessage.delete();
        })
        .catch((error) => {
          logger('ARK_SPEEDTEST_FAILED', [error]);
          message.channel.send('Lo siento pero ocurrió un error. :sob: (Code: ARK_SPEEDTEST_FAILED)');
          initialMessage.delete();
        });
    });
};
