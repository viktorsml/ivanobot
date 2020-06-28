import * as exec from 'ssh-exec';
import * as moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

interface ServerStatus {
  isActive: boolean;
  date: moment.Moment;
  since: string;
}

export const executeCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, process.env.SSH_HOST, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

export const getArkServerStatus = (): Promise<ServerStatus> => {
  return new Promise((resolve, reject) => {
    this.executeCommand(`systemctl status ark.service | sed -n '3 p'`)
      .then((rawStatusResponse: string) => {
        const [textStatusDate] = rawStatusResponse.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
        const serverStatus: ServerStatus = {
          isActive: /(active \(running\))/.test(rawStatusResponse),
          date: moment(textStatusDate),
          since: moment(textStatusDate).format('dddd, DD [de] MMMM [del] YYYY [a las] h:mm:ss a'),
        };
        resolve(serverStatus);
      })
      .catch(reject);
  });
};

export const restartArkServer = (): Promise<string> => {
  return executeCommand(`sudo /bin/systemctl restart ark.service`);
};

export const startArkServer = (): Promise<string> => {
  return executeCommand(`sudo /bin/systemctl start ark.service`);
};

export const stopArkServer = (): Promise<string> => {
  return this.executeCommand(`sudo /bin/systemctl stop ark.service`);
};

export const getArkServerActivePorts = (): Promise<string> => {
  return executeCommand(`sudo /usr/bin/lsof -i -P -n | /bin/grep -w 'ShooterGa'`);
};
