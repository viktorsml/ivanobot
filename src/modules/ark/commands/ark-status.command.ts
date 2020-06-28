import { Message } from 'discord.js';
import { logger } from '../../../api/ivanobot.api';
import { getArkServerStatus } from '../../../api/ark-server.api';

export const arkStatusCommand = async (message: Message) => {
  logger.action('ARK_SERVER_STATUS', [`Invoked by '@${message.author.username}'`]);
  const initialMessage = await message.channel.send('Obteniendo estatus del server. Espera un momento...');
  try {
    const serverStatus = await getArkServerStatus();
    const { isActive, since } = serverStatus;
    const activeText = isActive
      ? ':white_check_mark: El servidor de ARK está activo'
      : ':octagonal_sign: El servidor de ARK no está activo';
    logger.action('ARK_STATUS_RETRIEVAL_SUCCESSFUL', [serverStatus]);
    message.channel.send(`${activeText} desde el ${since}.`);
  } catch (error) {
    logger.error('ARK_STATUS_RETRIEVAL_FAILED', [error]);
    message.channel.send('Lo siento pero ocurrió un error. :sob: (Code: ARK_STATUS_RETRIEVAL_FAILED)');
  } finally {
    initialMessage.delete();
  }
};
