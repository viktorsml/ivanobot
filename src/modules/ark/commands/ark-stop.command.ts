import { Message } from 'discord.js';
import { logger } from '../../../api/ivanobot.api';
import { stopArkServer } from '../../../api/ark-server.api';

export const arkStopCommand = (message: Message) => {
  const { author } = message;

  logger('ARK_STOP_SERVER', [`Invoked by '@${author.username}'`]);
  message.channel
    .send('No me duele, me quema, me lastima pero ni pedo, estoy apagando el server. Espera un momento...')
    .then((initialMessage) => {
      stopArkServer()
        .then((commandResponse) => {
          logger('ARK_STOP_SUCCESSFUL', [commandResponse]);
          message.channel.send('Listo, el servidor se detuvo correctamente. Espero hayas tenido buenas razones. :rage:');
          initialMessage.delete();
        })
        .catch((error) => {
          logger('ARK_STOP_FAILED', [error]);
          message.channel.send('Lo siento pero ocurrió un error. :sob: (Code: ARK_STOP_FAILED)');
          initialMessage.delete();
        });
    });
};
