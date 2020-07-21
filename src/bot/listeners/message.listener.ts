import { Message } from 'discord.js';

import { botVersion, handleBotDevelopment } from '../../shared/ivanobot.api';
import { arkModule } from '../modules/ark/akr.module';
import { ivanoModule } from '../modules/ivano/ivano.module';
import { levelModule } from '../modules/level/level.module';

export const messageListener = (message: Message) => {
  const [command] = message.content.split(' ');
  if (handleBotDevelopment(message)) return;
  switch (command) {
    case '!ark':
      arkModule(message);
      break;
    case '!nivel':
      levelModule(message);
      break;
    case '!ivano':
      ivanoModule(message);
      break;
    case '!ibversion':
      message.reply(`soy el bot versión ${botVersion}`);
      break;
    case '!ibenv':
      message.reply(`soy el bot de '${process.env.NODE_ENV}'`);
      break;
  }
};
