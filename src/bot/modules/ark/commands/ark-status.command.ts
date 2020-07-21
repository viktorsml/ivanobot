import { Message, MessageEmbed } from 'discord.js';

import { StatusCode } from '../../../../shared/interfaces';
import { logger } from '../../../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';

type ServerStatus = 'OFFLINE' | 'STARTING' | 'ONLINE';

export interface ArkStatus {
  isServerOnline: boolean;
  currentStatus: ServerStatus;
  arkServersLink: string;
  arkOnlinePlayers: string;
  errorCode?: string;
}

export const getArkStatus = async (): Promise<ArkStatus> => {
  const arkStatusCode: StatusCode = {
    initial: 'ARK_STATUS_RETRIEVAL',
    success: 'ARK_STATUS_RETRIEVAL_SUCCESSFUL',
    failure: 'ARK_STATUS_RETRIEVAL_FAILED',
  };
  const isYes = (serverStatusLine: string): boolean => {
    if (typeof serverStatusLine !== 'string') {
      return false;
    }
    const [answer] = /((Yes)|(No))/.exec(serverStatusLine);
    return answer === 'Yes';
  };
  logger.action(arkStatusCode.initial);
  try {
    const commandResponse = await executeCommand('arkmanager status', { runOnDocker: true });
    const isServerRunning = isYes(commandResponse.find((line) => /(Server running)/.test(line)));
    const isServerListening = isYes(commandResponse.find((line) => /(Server listening)/.test(line)));
    const isServerOnline = isYes(commandResponse.find((line) => /(Server online)/.test(line)));
    const arkServersLink = commandResponse.find((line) => /(ARKServers link)/.test(line));
    const arkOnlinePlayers = commandResponse.find((line) => /(Players:)/.test(line));
    const isOffline = !isServerRunning && !isServerListening;
    const currentStatus: ServerStatus = isServerOnline ? 'ONLINE' : isOffline ? 'OFFLINE' : 'STARTING';
    console.log(commandResponse.find((line) => /(Server running)/.test(line)));
    logger.action(arkStatusCode.success, [commandResponse]);
    return { isServerOnline, currentStatus, arkServersLink, arkOnlinePlayers };
  } catch (error) {
    const defaultOffline: ArkStatus = { isServerOnline: false, currentStatus: 'OFFLINE', arkServersLink: null, arkOnlinePlayers: null };
    if (/(Connection timed out)/.test(error.message)) {
      logger.error('SSH_CONNECTION_FAILURE', error);
      return { ...defaultOffline, errorCode: 'SSH_CONNECTION_FAILURE' };
    }
    if (/(is not running)/.test(error.message)) {
      logger.action('ARK_CONTAINER_STOPED', [error.message]);
      return { ...defaultOffline, errorCode: 'ARK_CONTAINER_STOPED' };
    }
    logger.error(arkStatusCode.failure, error);
    return { ...defaultOffline, errorCode: arkStatusCode.failure };
  }
};

export const arkStatusCommand = async (message: Message) => {
  const initialMessage = await message.channel.send('Revisando estado del servidor de ARK...');
  const { currentStatus, errorCode, arkOnlinePlayers, arkServersLink } = await getArkStatus();
  if (errorCode && errorCode !== 'ARK_CONTAINER_STOPED') {
    message.channel.send(
      new MessageEmbed()
        .setColor('RED')
        .setTitle('Whops! No puedo determinar el estado del servidor de ARK. :disappointed_relieved:')
        .setFooter(errorCode)
    );
    initialMessage.delete();
    return;
  }
  if (currentStatus === 'OFFLINE') {
    message.channel.send(new MessageEmbed().setColor('GREY').setTitle('El servidor de ARK no está activo.'));
  }
  if (currentStatus === 'ONLINE') {
    message.channel.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`El servidor de ARK está activo.`)
        .addFields({ name: 'Jugadores', value: arkOnlinePlayers.replace('Players: ', '') })
    );
    message.channel.send(
      new MessageEmbed().setTitle(':alien: Ver jugadores activos.').setURL(arkServersLink.replace('ARKServers link: ', ''))
    );
  }
  if (currentStatus === 'STARTING') {
    message.channel.send(
      new MessageEmbed().setColor('YELLOW').setTitle(':construction_worker: El servidor de ARK se está iniciando. Usualmente tarda ~3min.')
    );
  }
  initialMessage.delete();
};
