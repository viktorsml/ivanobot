import { Message } from 'discord.js';
import { logger } from '../../../api/ivanobot.api';
import { getArkServerActivePorts } from '../../../api/ark-server.api';

export const arkPortCommand = (message: Message) => {
  const { author } = message;

  logger('PORT_RETRIEVAL', [`Invoked by '@${author.username}'`]);
  message.channel.send('Espera un momento en lo que obtengo los puertos usados por ARK Server...').then((initialMessage) => {
    getArkServerActivePorts()
      .then((activePorts) => {
        const activePortsArray = activePorts.split('\n');
        const totalPorts = activePortsArray.length;
        const ports = activePortsArray.map((line) => `\n${line.substring(60).trim()}`);
        logger('PORTS_SUCCESSFULLY_RETRIEVED', [`${totalPorts} ports found.\n`, activePorts]);
        message.channel.send(`Hay **${totalPorts}** puertos activos usados por ARK Server:\n\n>>> **Puertos activos:** ${ports}`);
        initialMessage.delete();
      })
      .catch((error) => {
        logger('ZERO_PORTS_RETRIEVED', [error]);
        message.channel.send(
          'No hay puertos activos para ARK Server. ¿Estás seguro de que está activo el servidor?' +
            '\n\n> *Usa el comando "!ark status" para averiguarlo.*'
        );
        initialMessage.delete();
      });
  });
};
