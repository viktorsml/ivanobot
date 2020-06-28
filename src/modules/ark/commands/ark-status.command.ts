import { Message } from 'discord.js';
import { logger } from '../../../api/ivanobot.api';
import { getArkServerStatus } from '../../../api/ark-server.api';

export const arkStatusCommand = (message: Message) => {
  const { author } = message;

  logger('ARK_SERVER_STATUS', [`Invoked by '@${author.username}'`]);
  message.channel.send('Obteniendo estatus del server. Espera un momento...').then((initialMessage) => {
    getArkServerStatus()
      .then((serverStatus) => {
        const { isActive, since } = serverStatus;
        const activeText = isActive
          ? ':white_check_mark: El servidor de ARK está activo'
          : ':octagonal_sign: El servidor de ARK no está activo';
        logger('ARK_STATUS_RETRIEVAL_SUCCESSFUL', [serverStatus]);
        message.channel.send(`${activeText} desde el ${since}.`);
        initialMessage.delete();
      })
      .catch((error) => {
        logger('ARK_STATUS_RETRIEVAL_FAILED', [error]);
        message.channel.send('Lo siento pero ocurrió un error. :sob: (Code: ARK_STATUS_RETRIEVAL_FAILED)');
        initialMessage.delete();
      });
  });
};
