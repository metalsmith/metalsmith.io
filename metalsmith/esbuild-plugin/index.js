const esbuildLib = require('esbuild');
const debug = require('debug')('@metalsmith/local:esbuild');

const isProduction = process.env.NODE_ENV !== 'development';

/**
 * @type {import('esbuild').BuildOptions}
 */
const defaults = {
  bundle: true,
  write: true,
  minify: isProduction,
  sourcemap: !isProduction,
  target: 'es2017'
};

function normalizeOptions({ entries, ...options }, metalsmith) {
  return {
    ...defaults,
    ...options,
    entryPoints: entries,
    outdir: metalsmith.destination()
  };
}

module.exports = function configureEsbuild(options) {
  return function esbuild(files, metalsmith, done) {
    options = normalizeOptions(options, metalsmith);
    debug('Running @metalsmith/local:esbuild with options %o', options);

    try {
      // const { errors, warnings, metafile, outputFiles } = esbuildLib.buildSync(options);
      esbuildLib.buildSync(options);
      done();
    } catch (err) {
      done(err);
    }
  };
};
