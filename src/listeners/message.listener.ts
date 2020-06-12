import { Message } from 'discord.js';
import { executeAddictedLevel } from '../actions/addictedLevel';
import { ivanoInvoke } from '../actions/ivanoInvoke';

export const messageListener = (message: Message) => {
  if (message.content.startsWith('!nivel')) executeAddictedLevel(message);
  if (message.content.startsWith('!ivano')) ivanoInvoke(message);
};
