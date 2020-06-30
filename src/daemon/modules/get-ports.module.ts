import { logger } from '../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';
import { ArkPortsResponse } from '../../shared/interfaces';

export const getArkServerActivePorts = async (request, response) => {
  logger.action('PORT_RETRIEVAL', [request.headers]);
  try {
    const consoleOutput = await executeCommand("sudo /usr/bin/lsof -i -P -n | /bin/grep -w 'ShooterGa'");
    const arkPortsResponse: ArkPortsResponse = {
      activePorts: consoleOutput.split('\n').length,
      portsPayload: consoleOutput,
    };
    logger.action('PORTS_SUCCESSFULLY_RETRIEVED', [arkPortsResponse]);
    response.send(arkPortsResponse);
  } catch (error) {
    if (error.code) {
      logger.error('UNABLE_TO_RETRIEVE_PORTS', [error]);
      response.status(500).send('UNABLE_TO_RETRIEVE_PORTS');
      return;
    } else {
      logger.error('ZERO_PORTS_RETRIEVED', [error]);
      response.status(200).send('ZERO_PORTS_RETRIEVED');
    }
  }
};
