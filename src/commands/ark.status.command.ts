import { Message } from "discord.js";
import { logger } from "../utils/logger";
import { ArkServerApi } from "../utils/arkServer.api";

export const arkStatusCommand = (message: Message) => {
  logger('Getting server ARK Server status.', [`invoked by '@${message.author.username}'`]);
  message.reply('Obteniendo estatus del server. Espera un momento...').then((initialMessage) => {
    ArkServerApi.getStatus().then((serverStatus) => {
      logger('Successfully server status from ARK Server.', [serverStatus]);
      initialMessage.delete();
      message.reply(serverStatus.trim());
    }).catch((error) => {
      logger('Error while trying to get info from ARK Server.', [error]);
      initialMessage.delete();
      message.reply('Lo sentimos pero hubo un error al obtener información  del servidor de ARK. Revisa los logs en el servidor.');
    });
  });
}