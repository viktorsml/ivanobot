import { Message } from 'discord.js';

import { StatusCode } from '../../../../shared/interfaces';
import { friendlyErrorMessage, logger } from '../../../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';
import { getArkStatus } from './ark-status.command';

interface StopArkServerResponse {
  successfullyStopped: boolean;
  errorCode?: string;
}

export const stopArkServer = async (): Promise<StopArkServerResponse> => {
  const arkStatusCode: StatusCode = {
    initial: 'ARK_STOP_INITIALIZED',
    success: 'ARK_STOP_SUCCESSFUL',
    failure: 'ARK_STOP_FAILED',
  };
  logger.action(arkStatusCode.initial);
  try {
    const commandResponse = await executeCommand('docker exec -i CaguamoArk arkmanager stop --saveworld');
    logger.action(arkStatusCode.success, [commandResponse]);
    return { successfullyStopped: true };
  } catch (error) {
    logger.error(arkStatusCode.failure, error);
    return { successfullyStopped: false, errorCode: 'UNKOWN_ERROR' };
  }
};

export const arkStopCommand = async (message: Message) => {
  const initialMessage = await message.channel.send('Revisando estado del servidor de ARK...');
  const { currentStatus, errorCode } = await getArkStatus();

  if (errorCode) {
    message.channel.send(
      friendlyErrorMessage('Whops! No puedo determinar el estado del servidor de ARK. :disappointed_relieved:', errorCode)
    );
    initialMessage.delete();
    return;
  }

  if (currentStatus === 'OFFLINE') {
    logger.action('ARK_SERVER_ALREADY_INACTIVE');
    message.channel.send('El servidor de ARK ya se encuentra apagado desde por lo que no se tomó ninguna acción.');
    initialMessage.delete();
    return;
  }

  // stop server
  initialMessage.delete();
  const pendingMessage = await message.channel.send(
    'No me duele, me quema, me lastima, pero ni pedo, estoy apagando el servidor de ARK...'
  );
  const { successfullyStopped, errorCode: stopArkServerErroCode } = await stopArkServer();

  if (!successfullyStopped) {
    message.channel.send(
      friendlyErrorMessage(
        'Hmm, que extraño. Ocurrió un problema desconocido al momento de detener el servidor de ARK. :thinking:',
        stopArkServerErroCode
      )
    );
    pendingMessage.delete();
    return;
  }

  message.channel.send('Listo, el servidor se detuvo correctamente. Espero hayas tenido buenas razones. :rage:');
  pendingMessage.delete();
};
