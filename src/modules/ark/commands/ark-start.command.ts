import { Message } from 'discord.js';
import { logger } from '../../../api/ivanobot.api';
import { getArkServerStatus, startArkServer } from '../../../api/ark-server.api';

export const arkStartCommand = (message: Message) => {
  const { author } = message;

  logger('ARK_SERVER_START', [`Invoked by '@${author.username}'`]);
  message.channel.send('Iniciando servidor de ark. Espera un momento...').then((initialMessage) => {
    getArkServerStatus()
      .then((serverStatus) => {
        const { isActive, since } = serverStatus;
        if (isActive) {
          logger('ARK_SERVER_ALREADY_ACTIVE', [isActive]);
          initialMessage.delete();
          message.channel.send(
            `El servidor de ARK ya se encuentra activado desde el ${since} por lo que no se tomó ninguna acción.` +
              '\n\n> *Si quires reiniciar el servidor usa el comando "!ark restart".*'
          );
          return;
        }
        startArkServer().then((commandResponse) => {
          logger('ARK_SUCCESSFULLY_STARTED', [commandResponse]);
          message.channel.send(
            ':white_check_mark: Listo, el servidor se inicio correctamente.' +
              'Espera unos minutos para que te aparezca en la lista de servidores de ARK.'
          );
          initialMessage.delete();
        });
      })
      .catch((error) => {
        logger('ARK_START_FAILED', [error]);
        message.channel.send('Lo siento pero ocurrió un error. :sob: (Code: ARK_START_FAILED)');
        initialMessage.delete();
      });
  });
};
