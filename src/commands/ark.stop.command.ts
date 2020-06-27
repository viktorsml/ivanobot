import { Message } from "discord.js";
import { logger } from "../utils/logger";
import { ArkServerApi } from "../utils/arkServer.api";

export const arkStopCommand = (message: Message) => {
  logger('Stopping ARK Server.', [`invoked by '@${message.author.username}'`]);
  message.reply('Deteniendo servidor de ark...').then((initialMessage) => {
    ArkServerApi.stopServer().then((commandResponse) => {
      logger('Successfully stopped ARK Server.', [commandResponse]);
      initialMessage.delete();
      message.reply('Listo, el servidor se detuvo correctamente. Espero hayas tenido buenas razones. 😡');
    }).catch((error) => {
      logger('Error while trying to stop ARK Server.', [error]);
      initialMessage.delete();
      message.reply('Lo sentimos pero hubo un error al detener el servidor de ARK. Revisa los logs del servidor.');
    });
  });

}