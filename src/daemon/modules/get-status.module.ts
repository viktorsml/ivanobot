import * as moment from 'moment';
import { logger } from '../../shared/ivanobot.api';
import { executeCommand } from '../functions/execute-command';
import { ArkStatusResponse } from '../../shared/interfaces';

moment.locale('es');

export const getArkServerStatus = async (request, response) => {
  logger.action('ARK_SERVER_STATUS', [request.headers]);
  try {
    const consoleOutput = await executeCommand("systemctl status ark.service | sed -n '3 p'");
    const [textStatusDate] = consoleOutput.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
    const serverStatus: ArkStatusResponse = {
      isActive: /(active \(running\))/.test(consoleOutput),
      date: moment(textStatusDate),
      since: moment(textStatusDate).format('dddd, DD [de] MMMM [del] YYYY [a las] h:mm:ss a'),
    };
    logger.action('ARK_STATUS_RETRIEVAL_SUCCESSFUL', [serverStatus]);
    response.send(serverStatus);
  } catch (error) {
    logger.error('ARK_STATUS_RETRIEVAL_FAILED', [error]);
    response.status(500).send('UNABLE_TO_DETERMINE_STATUS');
  }
};
