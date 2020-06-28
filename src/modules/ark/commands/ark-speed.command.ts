import { Message } from 'discord.js';
import { logger } from '../../../api/ivanobot.api';
import { executeCommand } from '../../../api/ark-server.api';

export const arkSpeedCommand = async (message: Message) => {
  logger.action('ARK_SPEEDTEST', [`Invoked by '@${message.author.username}'`]);
  const initialMessage = await message.channel.send(
    'Ejecutando pureba de velocidad de internet usando Speedtest.net. Espera un momento en lo que se completa...'
  );
  try {
    const results = await executeCommand('speedtest');
    const speedtestResults = results.split('\n').map((line) => `\n${line.trim()}`);
    logger.action('ARK_SPEEDTEST_SUCCESSFUL', [results]);
    message.channel.send(`>>> **Resultados de la prueba:** ${speedtestResults}`);
  } catch (error) {
    logger.action('ARK_SPEEDTEST_FAILED', [error]);
    message.channel.send('Lo siento pero ocurrió un error. :sob: (Code: ARK_SPEEDTEST_FAILED)');
    initialMessage.delete();
  } finally {
    initialMessage.delete();
  }
};
