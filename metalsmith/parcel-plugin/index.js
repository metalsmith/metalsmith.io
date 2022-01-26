/* eslint-disable import/no-extraneous-dependencies */
const { Parcel } = require('@parcel/core');
const debug = require('debug')('@metalsmith/local:parcel');
const { join } = require('path');

const isProduction = process.env.NODE_ENV !== 'development';

const defaults = {
  mode: isProduction ? 'production' : 'development',
  defaultConfig: join(__dirname, 'parcel-config.json'),
  defaultTargetOptions: {
    distDir: 'build',
    outputFormat: 'global',
    isLibrary: false,
    sourceMap: !isProduction,
    shouldOptimize: isProduction
  },
  targets: {
    web: {
      includeNodeModules: true,
      distDir: 'build',
      sourceMap: !isProduction
    }
  }
};

module.exports = function configureParcel(options) {
  return function parcel(files, metalsmith, done) {
    options = { ...defaults, ...options, distDir: metalsmith.destination() };
    debug('Running @metalsmith/local:parcel with options %o', options);
    new Parcel(options)
      .run()
      .then(({ bundleGraph, buildTime }) => {
        const bundles = bundleGraph.getBundles();
        debug(`Built ${bundles.length} bundles in ${buildTime}ms!`);
        done();
      })
      .catch(err => {
        done(err);
      });
  };
};

// usage: parcelPlugin({ entries: "lib/js/index.js" })
