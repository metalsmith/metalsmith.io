/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

const browserSync = require('browser-sync');
const chokidar = require('chokidar');
const msBuild = require('../metalsmith');

(async function firstRun() {
  await msBuild();
  chokidar
    .watch(['src', 'lib'], {
      ignoreInitial: true,
      awaitWriteFinish: { pollInterval: 1000 }
    })
    .on('ready', () => {
      browserSync.init({
        host: 'localhost',
        server: './build',
        port: 3000,
        injectChanges: false,
        reloadThrottle: 0
      });
      console.log('Initializing browser-sync...');
    })
    .on('all', async () => {
      await msBuild();
      browserSync.reload();
    });
})();
