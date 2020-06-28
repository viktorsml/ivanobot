import { Message } from 'discord.js';
import { arkModule } from '../modules/ark/akr.module';
import { levelModule } from '../modules/level/level.module';
import { ivanoModule } from '../modules/ivano/ivano.module';

export const messageListener = (message: Message) => {
  if (message.content.startsWith('!nivel')) levelModule(message);
  if (message.content.startsWith('!ivano')) ivanoModule(message);
  if (message.content.startsWith('!ark')) arkModule(message);
};
