require('dotenv').config();

import { Client } from 'discord.js';
import { messageListener } from './listeners/message.listener';
import { readyListener } from './listeners/ready.listener';
import { logger } from './api/ivanobot.api';

const discordBot = new Client();

discordBot
  .login(process.env.TOKEN)
  .then(() => {
    discordBot.on('ready', () => readyListener(discordBot.user.tag));
    discordBot.on('message', messageListener);
  })
  .catch((error) => {
    logger('CLIENT_LOGIN_ERROR', [error]);
  });
