import { logger } from '../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';

export const startArkServer = async (request, response) => {
  logger.action('ARK_SERVER_START', [request.headers]);
  try {
    const consoleOutput = await executeCommand('sudo /bin/systemctl start ark.service');
    logger.action('ARK_SUCCESSFULLY_STARTED', [consoleOutput]);
    response.send('ARK_SUCCESSFULLY_STARTED');
  } catch (error) {
    logger.error('ARK_START_FAILED', [error]);
    response.status(500).send('ARK_START_FAILED');
  }
};
