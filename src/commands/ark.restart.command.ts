import { Message } from "discord.js";
import { logger } from "../utils/logger";
import { ArkServerApi } from "../utils/arkServer.api";

export const arkRestartCommand = (message: Message) => {
  logger('Restarting ARK Server.', [`invoked by '@${message.author.username}'`]);
  message.reply('Reiniciando servidor de ark. Espera un momento...').then((initialMessage) => {
    ArkServerApi.restartServer().then((commandResponse) => {
      logger('Successfully restarted ARK Server.', [commandResponse]);
      initialMessage.delete();
      message.reply('Listo, el servidor se reinició correctamente. Espera unos minutos para que te aparezca en la lista de servidores de ARK.');
    }).catch((error) => {
      logger('Error while trying to restart ARK Server.', [error]);
      initialMessage.delete();
      message.reply('Lo sentimos pero hubo un error al reiniciar el servidor de ARK. Revisa los logs en el servidor.');
    });
  });
}