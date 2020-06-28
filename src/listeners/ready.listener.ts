import { logger } from '../api/ivanobot.api';

export const readyListener = (userTag: string) => {
  logger.action('LOGIN_SUCCESSFUL', [`Logged in as ${userTag}!`]);
};
