import * as exec from 'ssh-exec';

export class ArkServerApi {
  private static sshHost = process.env.SSH_HOST;

  public static getServerStatus(): string {
    return exec('systemctl status ark.service', this.sshHost);
  }
}

// mi pc > mcpanel > ark server
