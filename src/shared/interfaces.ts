export interface ArkStatusResponse {
  isActive: boolean;
  date: moment.Moment;
  since: string;
}

export interface ArkPortsResponse {
  activePorts: number;
  portsPayload: string;
}

export interface TransactionToken {
  data: string;
}
