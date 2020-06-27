import * as exec from 'ssh-exec';

export class ArkServerApi {
  private static sshHost = process.env.SSH_HOST;

  private static executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // exec(`systemctl status ark.service | sed -n '3 p'`, this.sshHost, (error, stdout, stderr) => {
      exec(command, this.sshHost, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  public static isActiveServer(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getStatus().then((serverStatus) => {
        resolve(/(active \(running\))/.test(serverStatus));
      }).catch(reject);
    })
  }

  public static getStatus(): Promise<string> {
    return this.executeCommand(`systemctl status ark.service | sed -n '3 p'`);
  }

  public static restartServer(): Promise<string> {
    return this.executeCommand(`sudo /bin/systemctl restart ark.service`);
  }

  public static startServer(): Promise<string> {
    return this.executeCommand(`sudo /bin/systemctl start ark.service`);
  }

  public static stopServer(): Promise<string> {
    return this.executeCommand(`sudo /bin/systemctl stop ark.service`);
  }

  public static getPortsInformation(): Promise<string> {
    return this.executeCommand(`sudo /usr/bin/lsof -i -P -n | /bin/grep -w 'ShooterGa'`);
  }
}