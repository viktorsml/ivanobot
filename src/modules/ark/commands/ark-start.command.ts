import { Message } from 'discord.js';
import { logger } from '../../../api/ivanobot.api';
import { getArkServerStatus, startArkServer } from '../../../api/ark-server.api';

export const arkStartCommand = async (message: Message) => {
  logger.action('ARK_SERVER_START', [`Invoked by '@${message.author.username}'`]);
  const initialMessage = await message.channel.send('Iniciando servidor de ark. Espera un momento...');
  try {
    const { isActive, since } = await getArkServerStatus();

    if (isActive) {
      logger.action('ARK_SERVER_ALREADY_ACTIVE', [isActive]);
      message.channel.send(
        `El servidor de ARK ya se encuentra activado desde el ${since} por lo que no se tomó ninguna acción.` +
          '\n\n> *Si quires reiniciar el servidor usa el comando "!ark restart".*'
      );
      return;
    }

    const startResponse = await startArkServer();
    logger.action('ARK_SUCCESSFULLY_STARTED', [startResponse]);
    message.channel.send(
      ':white_check_mark: Listo, el servidor se inicio correctamente.' +
        'Espera unos minutos para que te aparezca en la lista de servidores de ARK.'
    );
  } catch (error) {
    logger.error('ARK_START_FAILED', [error]);
    message.channel.send('Lo siento pero ocurrió un error. :sob: (Code: ARK_START_FAILED)');
  } finally {
    initialMessage.delete();
  }
};
