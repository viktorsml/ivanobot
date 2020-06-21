require('dotenv').config();

import { Client } from 'discord.js';
import { messageListener } from './listeners/message.listener';
import { readyListener } from './listeners/ready.listener';

const discordBot = new Client();

discordBot.login(process.env.TOKEN).then().catch(console.error);

discordBot.on('ready', () => readyListener(discordBot));
discordBot.on('message', messageListener);
