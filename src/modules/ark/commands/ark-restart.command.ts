import { Message } from 'discord.js';
import { logger } from '../../../api/ivanobot.api';
import { restartArkServer } from '../../../api/ark-server.api';

export const arkRestartCommand = (message: Message) => {
  const { author } = message;

  logger('ARK_SERVER_RESTART', [`Invoked by '@${author.username}'`]);
  message.channel.send('Reiniciando servidor de ark. Espera un momento...').then((initialMessage) => {
    restartArkServer()
      .then((commandResponse) => {
        logger('ARK_RESTART_SUCCESSFUL', [commandResponse]);
        message.channel.send(
          ':white_check_mark: Listo, el servidor se reinició correctamente.' +
            'Espera unos minutos para que te aparezca en la lista de servidores de ARK.'
        );
        initialMessage.delete();
      })
      .catch((error) => {
        logger('ARK_RESTART_FAILED', [error]);
        message.channel.send('Lo siento pero ocurrió un error. :sob: (Code: ARK_RESTART_FAILED)');
        initialMessage.delete();
      });
  });
};
