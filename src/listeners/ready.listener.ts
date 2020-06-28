import { Client } from 'discord.js';
import { logger } from '../api/ivanobot.api';

export const readyListener = (userTag: string) => {
  logger('CLIENT_LOGIN', [`Logged in as ${userTag}!`]);
};
