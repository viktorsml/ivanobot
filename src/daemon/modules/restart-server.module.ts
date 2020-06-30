import { logger } from '../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';

export const restartArkServer = async (request, response) => {
  logger.action('ARK_SERVER_RESTART', [request.headers]);
  try {
    const consoleOutput = await executeCommand('sudo /bin/systemctl restart ark.service');
    logger.action('ARK_RESTART_SUCCESSFUL', [consoleOutput]);
    response.send('ARK_RESTART_SUCCESSFUL');
  } catch (error) {
    logger.error('ARK_RESTART_FAILED', [error]);
    response.status(500).send('ARK_RESTART_FAILED');
  }
};
