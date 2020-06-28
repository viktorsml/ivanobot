require('dotenv').config();

import { Client } from 'discord.js';
import { messageListener } from './listeners/message.listener';
import { readyListener } from './listeners/ready.listener';
import { logger } from './api/ivanobot.api';

(async () => {
  try {
    const discordBot = new Client();
    const token = await discordBot.login(process.env.TOKEN);
    discordBot.on('ready', () => readyListener(discordBot.user.tag));
    discordBot.on('message', messageListener);
  } catch (error) {
    logger.action('INITIALIZATION_ERROR', [error]);
  }
})();
