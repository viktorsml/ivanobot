import { Message } from 'discord.js';
import { logger } from '../../../api/ivanobot.api';
import { getArkServerActivePorts } from '../../../api/ark-server.api';

export const arkPortCommand = async (message: Message) => {
  logger.action('PORT_RETRIEVAL', [`Invoked by '@${message.author.username}'`]);
  const initialMessage = await message.channel.send('Espera un momento en lo que obtengo los puertos usados por ARK Server...');
  try {
    const activePorts = await getArkServerActivePorts();
    const activePortsArray = activePorts.split('\n');
    const totalPorts = activePortsArray.length;
    const ports = activePortsArray.map((line) => `\n${line.substring(60).trim()}`);
    logger.action('PORTS_SUCCESSFULLY_RETRIEVED', [`${totalPorts} ports found.\n`, activePorts]);
    message.channel.send(`Hay **${totalPorts}** puertos activos usados por ARK Server:\n\n>>> **Puertos activos:** ${ports}`);
  } catch (error) {
    logger.action('ZERO_PORTS_RETRIEVED', [error]);
    message.channel.send(
      'No hay puertos activos para ARK Server. ¿Estás seguro de que está activo el servidor?' +
        '\n\n> *Usa el comando "!ark status" para averiguarlo.*'
    );
  } finally {
    initialMessage.delete();
  }
};
