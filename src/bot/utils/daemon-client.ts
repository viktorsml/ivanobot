import { TransactionToken } from '../../shared/interfaces';
import { daemonApiUrl } from '../../shared/ivanobot.api';

export interface DaemonRunParams {
  endpoint: string;
  dataPayload: TransactionToken;
}

export const apiEndpoint = (endpoint: string) => {
  return daemonApiUrl + endpoint;
};

export const delayAsyncBlock = async (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
