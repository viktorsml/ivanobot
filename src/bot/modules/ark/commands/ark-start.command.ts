import { Message, MessageEmbed } from 'discord.js';

import { StatusCode } from '../../../../shared/interfaces';
import { friendlyErrorMessage, logger } from '../../../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';
import { watchArkServerStartup } from '../functions/wath-startup';
import { getArkStatus } from './ark-status.command';

type StartMethod = 'CONTAINER' | 'ARKMANAGER';

interface StartArkServerResponse {
  successfullyStarted: boolean;
  errorCode?: string;
}

export const startArkServer = async (startMethod: StartMethod): Promise<StartArkServerResponse> => {
  const arkStatusCode: StatusCode = {
    initial: 'ARK_START_INITIALIZED',
    success: 'ARK_START_SUCCESSFUL',
    failure: 'ARK_START_FAILED',
  };
  const startArkServerWithArkManager = 'docker exec -i CaguamoArk arkmanager start';
  const startContainerCommand = `docker start CaguamoArk && ${startArkServerWithArkManager}`;
  const commandToRun = startMethod === 'CONTAINER' ? startContainerCommand : startArkServerWithArkManager;
  logger.action(arkStatusCode.initial, [`With method: ${startMethod}`]);
  try {
    const commandResponse = await executeCommand(commandToRun);
    logger.action(arkStatusCode.success, [commandResponse]);
    return { successfullyStarted: true };
  } catch (error) {
    logger.error(arkStatusCode.failure, error);
    return { successfullyStarted: false, errorCode: arkStatusCode.failure };
  }
};

export const arkStartCommand = async (message: Message) => {
  const initialMessage = await message.channel.send('Revisando estado del servidor...');
  const { currentStatus, errorCode } = await getArkStatus();

  if (errorCode && errorCode !== 'ARK_CONTAINER_STOPED') {
    message.channel.send(friendlyErrorMessage('Whops! No puedo determinar el estado del servidor ARK. :disappointed_relieved:', errorCode));
    initialMessage.delete();
    return;
  }

  if (currentStatus === 'STARTING') {
    logger.action('ARK_SERVER_ALREADY_STARTING', ['No extra accion was made.']);
    message.channel.send(
      new MessageEmbed()
        .setColor('YELLOW')
        .setTitle('El servidor de ARK ya se encuentra activando.')
        .setDescription('*Espera un momento en lo que está disponible (Usualmente tarda unos ~3min).* :wink:')
    );
    initialMessage.delete();
    return;
  }

  if (currentStatus === 'ONLINE') {
    logger.action('ARK_SERVER_ALREADY_ACTIVE', ['No extra accion was made.']);
    message.channel.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setTitle('El servidor de ARK ya se encuentra activado. :star_struck:')
        .setDescription('*Si quires reiniciar el servidor usa el comando "!ark restart".*')
    );
    initialMessage.delete();
    return;
  }

  // start server
  const startMethod: StartMethod = errorCode === 'ARK_CONTAINER_STOPED' ? 'CONTAINER' : 'ARKMANAGER';
  const { successfullyStarted, errorCode: startArkServerErrorCode } = await startArkServer(startMethod);
  initialMessage.delete();

  if (!successfullyStarted) {
    message.channel.send(
      new MessageEmbed()
        .setColor('RED')
        .setTitle('Hmm, que extraño. Ocurrió un problema desconocido al momento de iniciar el servidor de ARK. :thinking:')
        .setFooter(startArkServerErrorCode)
    );
    return;
  }

  const pendingMessage = await message.channel.send(
    new MessageEmbed()
      .setColor('YELLOW')
      .setTitle(':construction_worker: Listo, el servidor de ARK se está iniciando.')
      .setDescription('Te avisaré cuando ya puedas entrar a jugar. (Usualmente tarda ~3min.)')
  );

  // check server status every 20 seconds to see if people can start to play
  try {
    await watchArkServerStartup();
    message.channel.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Servidor de ARK iniciado correctamente.')
        .setDescription(`¡Listo! Ya puedes entrar a jugar, <@${message.author.id}>. :partying_face:`)
    );
  } catch (error) {
    message.channel.send(
      new MessageEmbed()
        .setColor('RED')
        .setTitle('Ocurrió un problema al iniciar el servidor de ARK.')
        .setDescription(`Lo siento mucho, ya no te podré avisar cuando ya puedas entrar, <@${message.author.id}>. :sob:`)
        .setFooter('INTERRUPTED_START_PROCESS')
    );
  } finally {
    pendingMessage.delete();
  }
};
