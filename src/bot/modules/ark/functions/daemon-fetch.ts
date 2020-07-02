import axios, { AxiosError } from 'axios';
import { Message } from 'discord.js';

import { TransactionToken } from '../../../../shared/interfaces';
import { friendlyErrorMessage, logger, restApiToken } from '../../../../shared/ivanobot.api';
import { apiEndpoint, delayAsyncBlock } from '../../../utils/daemon-client';

interface CommandMetaIds {
  wait: string;
  success: string;
  failure: string;
}

export interface RunCommandParams {
  endpoint: string;
  commandMeta: CommandMetaIds;
  initialMessageText?: string;
}

export const handleDaemonFetchError = (error: any, failureId: string, message: Message) => {
  const e = { code: 500, tag: 'NO_DAEMON_CONNECTION' };
  if (error.response) {
    e.code = error.response.status;
    e.tag = 'BAD_REQUEST';
  }
  logger.error(failureId, [e.code, e.tag]);
  message.channel.send(friendlyErrorMessage(e.tag, e.code));
};

export const fetchDaemonData = async (message: Message, { commandMeta, endpoint, initialMessageText }: RunCommandParams) => {
  logger.action(commandMeta.wait, [`Invoked by '@${message.author.username}'`]);
  const token: TransactionToken = { data: restApiToken };
  const initialMessage = initialMessageText ? await message.channel.send(initialMessageText) : null;
  if (initialMessage) await delayAsyncBlock(2000);
  try {
    const apiResponse = await axios.post(apiEndpoint(endpoint), token);
    logger.action(commandMeta.success, ['Response data was', apiResponse.data]);
    return apiResponse;
  } catch (error) {
    handleDaemonFetchError(error, commandMeta.failure, message);
    return;
  } finally {
    if (initialMessage) initialMessage.delete();
  }
};
