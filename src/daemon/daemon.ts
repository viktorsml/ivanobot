import * as express from 'express';
import * as moment from 'moment';

import { TransactionToken } from '../shared/interfaces';
import { daemonPort, logger, restApiToken } from '../shared/ivanobot.api';
import { readyListener } from './listeners/ready.listener';
import { getArkServerActivePorts } from './modules/get-ports.module';
import { getArkServerStatus } from './modules/get-status.module';
import { restartArkServer } from './modules/restart-server.module';
import { speedtestArkServer } from './modules/speedtest.module';
import { startArkServer } from './modules/start-server.module';
import { stopArkServer } from './modules/stop-server.module';

const daemon = express();
moment.locale('es');

console.log(restApiToken);

// Middleware
daemon.use(express.urlencoded({ extended: true }));
daemon.use(express.json());
daemon.use((request, response, next) => {
  const token: TransactionToken = request.body;
  if (token.data !== restApiToken) {
    logger.error('NOT_AUTHORIZED', [request.body]);
    response.status(403).send('NOT_AUTHORIZED');
    return;
  } else {
    next();
  }
});

// REST API Endpoints
daemon.get('/', (req, res) => res.send('Hello'));
daemon.post('/ark/serverStatus', async (req, res) => getArkServerStatus(req, res));
daemon.post('/ark/activePorts', async (req, res) => getArkServerActivePorts(req, res));
daemon.post('/ark/startServer', async (req, res) => startArkServer(req, res));
daemon.post('/ark/stopServer', async (req, res) => stopArkServer(req, res));
daemon.post('/ark/restartServer', async (req, res) => restartArkServer(req, res));
daemon.post('/speedtest', async (req, res) => speedtestArkServer(req, res));

// Call this always at the end
daemon.listen(daemonPort, () => readyListener());
