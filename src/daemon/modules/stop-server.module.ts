import { logger } from '../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';

export const stopArkServer = async (request, response) => {
  logger.action('ARK_STOP_SERVER', [request.headers]);
  try {
    const consoleOutput = await executeCommand('sudo /bin/systemctl stop ark.service');
    logger.action('ARK_STOP_SUCCESSFUL', [consoleOutput]);
    response.send('ARK_STOP_SUCCESSFUL');
  } catch (error) {
    logger.error('ARK_STOP_FAILED', [error]);
    response.status(500).send('ARK_STOP_FAILED');
  }
};
