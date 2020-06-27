import { Message } from 'discord.js';
import { ArkServerApi } from './../utils/arkServer.api';

const errorMessage = (action: string) => {
  return `El comando "${action}" no existe. Comandos disponibles:
ℹ !ark status\n▶ !ark start\n🔁 !ark restart\n⏹ !ark stop\nAy no, que feo caso. Todo meco el vato.`;
};

export const arkModule = (message: Message) => {
  const [ark, action] = message.content.split(' ');
  switch (action) {
    case 'status':
      console.log(ArkServerApi.getServerStatus());
      break;
    case 'restart':
      break;
    case 'start':
      break;
    case 'stop':
      break;
    default:
      message.reply(errorMessage(action));
      break;
  }
};
