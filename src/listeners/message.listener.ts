import { Message } from 'discord.js';
import { executeAddictedLevel } from '../actions/addictedLevel';

export const messageListener = (message: Message) => {
  if (message.content.startsWith('ivanobot nivel')) executeAddictedLevel(message);
};
