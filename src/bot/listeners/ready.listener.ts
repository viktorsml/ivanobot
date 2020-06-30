import { logger, botVersion, enviroment } from '../../shared/ivanobot.api';

export const readyListener = (userTag: string) => {
  console.log(`\n>>> Ivanobot v(${botVersion})(env: ${enviroment}) <<<\n`);
  logger.action('LOGIN_SUCCESSFUL', [`Logged in as ${userTag}!`]);
};
