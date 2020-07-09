import { logger } from '../../../../shared/ivanobot.api';
import { getArkStatus } from '../commands/ark-status.command';

export const delayAsyncBlock = async (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const watchArkServerStartup = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    logger.action('WATCH_ARK_SERVER_STARTUP', [`Started at ${new Date()}`]);
    try {
      let isOnline = false;
      while (!isOnline) {
        await delayAsyncBlock(30000);
        const { isServerOnline, currentStatus } = await getArkStatus();
        if (currentStatus === 'OFFLINE') {
          throw new Error('WATCH_ARK_SERVER_STARTUP_INTERRUPTED');
        }
        isOnline = isServerOnline;
      }
      resolve();
    } catch (error) {
      logger.error('WATCH_ARK_SERVER_STARTUP_FAILED', error);
      reject(error);
    }
  });
};
