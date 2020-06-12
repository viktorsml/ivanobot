require('dotenv').config();

import { Client } from 'discord.js';
import { messageListener } from './listeners/message.listener';

const TOKEN = process.env.TOKEN;
const discordBot = new Client();

discordBot
  .login(TOKEN)
  .then()
  .catch((reason) => {
    console.error(reason);
  });

discordBot.on('ready', () => console.info(`Logged in as ${discordBot.user.tag}!\n`));
discordBot.on('message', messageListener);
