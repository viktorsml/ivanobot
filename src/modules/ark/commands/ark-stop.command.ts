import { Message } from 'discord.js';
import { logger } from '../../../api/ivanobot.api';
import { stopArkServer } from '../../../api/ark-server.api';

export const arkStopCommand = async (message: Message) => {
  logger.action('ARK_STOP_SERVER', [`Invoked by '@${message.author.username}'`]);
  const initialMessage = await message.channel.send('No me duele, me quema, me lastima pero ni pedo, estoy apagando el server...');
  try {
    const commandResponse = await stopArkServer();
    logger.action('ARK_STOP_SUCCESSFUL', [commandResponse]);
    message.channel.send('Listo, el servidor se detuvo correctamente. Espero hayas tenido buenas razones. :rage:');
  } catch (error) {
    logger.error('ARK_STOP_FAILED', [error]);
    message.channel.send('Lo siento pero ocurrió un error. :sob: (Code: ARK_STOP_FAILED)');
  } finally {
    initialMessage.delete();
  }
};
