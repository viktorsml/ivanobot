import { Message } from 'discord.js';

import { StatusCode } from '../../../../shared/interfaces';
import { friendlyErrorMessage, logger } from '../../../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';

type ServerStatus = 'OFFLINE' | 'STARTING' | 'ONLINE';

export interface ArkStatus {
  isServerOnline: boolean;
  currentStatus: ServerStatus;
  arkServersLink: string;
  errorCode?: string;
}

export const getArkStatus = async (): Promise<ArkStatus> => {
  const arkStatusCode: StatusCode = {
    initial: 'ARK_STATUS_RETRIEVAL',
    success: 'ARK_STATUS_RETRIEVAL_SUCCESSFUL',
    failure: 'ARK_STATUS_RETRIEVAL_FAILED',
  };
  logger.action(arkStatusCode.initial);
  try {
    const commandResponse = await executeCommand('docker exec -i CaguamoArk arkmanager status');
    const serverRunning = commandResponse.find((line) => /(Server running)/.test(line));
    const serverListening = commandResponse.find((line) => /(Server listening)/.test(line));
    const serverOnline = commandResponse.find((line) => /(Server online)/.test(line));
    const arkServersLink = commandResponse.find((line) => /(ARKServers link)/.test(line));
    const isYes = (serverStatusLine: string): boolean => /((Yes)|(No))/.test(serverStatusLine);
    const isServerOnline = isYes(serverRunning) && isYes(serverListening) && isYes(serverOnline);
    const currentStatus: ServerStatus = isServerOnline ? 'ONLINE' : 'STARTING';
    logger.action(arkStatusCode.success, [commandResponse]);
    return { isServerOnline, currentStatus, arkServersLink };
  } catch (error) {
    const defaultOffline: ArkStatus = { isServerOnline: false, currentStatus: 'OFFLINE', arkServersLink: null };
    if (/(Connection timed out)/.test(error.message)) {
      logger.error('SSH_CONNECTION_FAILURE', error);
      return { ...defaultOffline, errorCode: 'SSH_CONNECTION_FAILURE' };
    }
    if (/(is not running)/.test(error.message)) {
      logger.action('ARK_STATUS_STOPED', [error.message]);
      return defaultOffline;
    }
    logger.error(arkStatusCode.failure, error);
    return { ...defaultOffline, errorCode: arkStatusCode.failure };
  }
};

export const arkStatusCommand = async (message: Message) => {
  const initialMessage = await message.channel.send('Revisando estado del servidor...');
  const { currentStatus, errorCode } = await getArkStatus();
  if (errorCode) {
    message.channel.send(friendlyErrorMessage('Whops! No puedo determinar el estado del servidor ARK. :disappointed_relieved:', errorCode));
    initialMessage.delete();
    return;
  }
  if (currentStatus === 'OFFLINE') {
    message.channel.send(':octagonal_sign: El servidor de ARK no está activo.');
  }
  if (currentStatus === 'ONLINE') {
    message.channel.send(':white_check_mark: El servidor de ARK está activo.');
  }
  if (currentStatus === 'STARTING') {
    message.channel.send(':construction_worker: El servidor de ARK se está encendiendo. Usualmente tarde ~3min.');
  }
  initialMessage.delete();
};
