import { logger } from '../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';

export const speedtestArkServer = async (request, response) => {
  logger.action('ARK_SPEEDTEST', [request.headers]);
  try {
    const consoleOutput = await executeCommand('speedtest');
    logger.action('ARK_SPEEDTEST_SUCCESSFUL', [consoleOutput]);
    response.send(consoleOutput);
  } catch (error) {
    logger.error('ARK_SPEEDTEST_FAILED', [error]);
    response.status(500).send('ARK_SPEEDTEST_FAILED');
  }
};
