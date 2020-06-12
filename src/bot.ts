require('dotenv').config();

import { Client } from 'discord.js';
import { messageListener } from './listeners/message.listener';

const discordBot = new Client();

discordBot.login(process.env.TOKEN).then().catch(console.error);

discordBot.on('ready', () => console.info(`Logged in as ${discordBot.user.tag}!\n`));
discordBot.on('message', messageListener);
