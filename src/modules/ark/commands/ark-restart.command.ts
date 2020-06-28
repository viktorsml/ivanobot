import { Message } from 'discord.js';
import { logger } from '../../../api/ivanobot.api';
import { restartArkServer } from '../../../api/ark-server.api';

export const arkRestartCommand = async (message: Message) => {
  logger.action('ARK_SERVER_RESTART', [`Invoked by '@${message.author.username}'`]);
  const initialMessage = await message.channel.send('Reiniciando servidor de ark. Espera un momento...');
  try {
    const commandResponse = await restartArkServer();
    logger.action('ARK_RESTART_SUCCESSFUL', [commandResponse]);
    message.channel.send(
      ':white_check_mark: Listo, el servidor se reinició correctamente.' +
        'Espera unos minutos para que te aparezca en la lista de servidores de ARK.'
    );
  } catch (error) {
    logger.error('ARK_RESTART_FAILED', [error]);
    message.channel.send('Lo siento pero ocurrió un error. :sob: (Code: ARK_RESTART_FAILED)');
    initialMessage.delete();
  } finally {
    initialMessage.delete();
  }
};
