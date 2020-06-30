import { logger, botVersion, enviroment, daemonPort } from '../../shared/ivanobot.api';

export const readyListener = () => {
  console.log(`\n>>> Ivanobot Daemon v(${botVersion})(env: ${enviroment}) <<<\n`);
  logger.error('CLIENT_READY', [`Daemon running on port: ${daemonPort}`]);
};
