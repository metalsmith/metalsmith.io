---
title: Metalsmith 2.5 released
description: New metalsmith.env & metalsmith.debug methods. All methods now return promises, and a lot of outdated dependencies have been dropped.
pubdate: 2022-06-10
layout: default.njk
sitemap:
  lastmod: 2022-06-10
---

Metalsmith 2.5 is out!

[Github release](https://github.com/metalsmith/metalsmith/releases/tag/v2.5.0) |
[Github Roadmap 2.5 issue](https://github.com/metalsmith/metalsmith/issues/365) |
[NPM package](https://www.npmjs.com/package/metalsmith/v/2.5.0) | Node >= 12

## Highlights

* **New [`Metalsmith#debug`](/api/#Metalsmith+debug) method** available. The method returns a [debugger based on debug](https://github.com/debug-js/debug) with some differences/extra's:
  * debug can now be enabled/disabled directly through Metalsmith (`metalsmith.env('DEBUG', '*')`)
  * The debugger has 4 preinstantiated channels with preset colors that were tested for readability in light & dark color schemes: log (gray), info (cyan), warn (orange), error (red)
  * The debug output of `metalsmith.debug` debuggers can be centralized and output to a single build log file. Specify `metalsmith.env('DEBUG_LOG', 'path/to/your/build.log)` to do so. Note that when `DEBUG_LOG` is set, the logs will only be written to a file and will not appear in the CLI.
  ```js
    function myPlugin(files, metalsmith) {
      const debug = metalsmith.debug('metalsmith-myplugin')
      debug('A message')         // metalsmith-myplugin A message
      debug.warn('A warning')    // metalsmith-myplugin:warn A warning
      debug.error('An error')    // metalsmith-myplugin:error An error
    }
  ```
  

* **New [`Metalsmith#env`](/api/#Metalsmith+env) method** available:
  ```js
  // pass all Node env variables
  metalsmith.env(process.env)
  // get all env variables
  metalsmith.env()
  // get DEBUG env variable
  metalsmith.env('DEBUG')
  // set DEBUG env variable (chainable)
  metalsmith.env('DEBUG', '*')
  // set multiple env variables at once (chainable)
  // this does not clear previously set variables
  metalsmith.env({
    DEBUG: false,
    NODE_ENV: 'development'
  })
  ```
  The method mimicks native env (only accepts primitive values: string, boolean, number) and it is case-insensitive, so you can choose whether you prefer upper- or lowercase. However when running `metalsmith.env()` the env returned will contain uppercase keys.

  It is also available as a property in `metalsmith.json`.

  ```json
  {
    "env": {
      "DEBUG": true,
      "DEBUG_LOG": "metalsmith.log",
      "NAME": "$NODE_ENV"
    }
  }
  ```
  When running Metalsmith in CLI mode, strings starting with `$` dollar sign will be substituted for `process.env.<var_name>` so you can easily pass env vars.
  Furthermore `metalsmith.env('CLI')` will be automatically set to `true`. As you can see from the examples above, it is now possible to enable/disable debug logs through `metalsmith.env('DEBUG', true)`. Setting `DEBUG_LOG` will pipe the logs to a file instead of logging them in the console. Plugin authors are encouraged to use the single env var getter/ setter signatures.

  *Why a `.env` method when there already is a [metalsmith-env](https://github.com/kalamuna/metalsmith-env) plugin?*

  * It allows plugins to rely on a method that is always present to target default configs and logs according to popular env var conventions, e.g. `if (metalsmith.env('NODE_ENV') === 'development') debug('password: %s', pwd)`.
  * It makes unit testing environments easy, running `plugin(files, { env() { /* mocked env method */ }})`
  * [metalsmith-env](https://github.com/kalamuna/metalsmith-env) reads all env vars. The core `.env` method takes an approach similar to [Deno's](https://deno.land/manual/getting_started/permissions#environment-variables): explicit is better than implicit when it comes to env vars, to avoid leaking secrets and sensitive data.

* `Metalsmith#read`,`Metalsmith#readFile`,`Metalsmith#write`,`Metalsmith#writeFile`,`Metalsmith#process` and `Metalsmith#run` can now be `await`'ed:
    ```js
    try {
      const files = await metalsmith.read()
    } catch (err) {
      console.error(err)
    }
    ```
    
    If a callback is passed, `<method>` does not return a promise. Metalsmith users have to opt for one of the 2 build flows (callback or promise-based)

* **7.5% to 10% build speed increase** thanks to moving to promises and eliminating old dependencies.
  This is an approximative perf test (run on the metalsmith.io source, and only benchmarks speed of the core read - process - run - write - build methods): 
  ```js
  const prom = (timings) => new Promise((resolve, reject) => {
    const start = Date.now()
    metalsmith
      .build((err) => { 
        if (err) reject(err)
        resolve([ ...timings, Date.now() - start])
      })
  })

  let runs = 100
  let current = Promise.resolve([])
  do {
    current = current.then(prom)
  } while(runs--)
  current.then(timings => console.log(timings, timings.reduce((acc, curr, index) => {
    acc += curr
    if (index === runs - 1) acc = acc / runs
    return acc
  }, 0)))
  ```

## Full Release notes

### Added

- [#354] Added `Metalsmith#env` method. Supports passing `DEBUG` and `DEBUG_LOG` amongst others. Sets `CLI: true` when run from the metalsmith CLI. [`b42df8c`](https://github.com/metalsmith/metalsmith/commit/b42df8c), [`446c676`](https://github.com/metalsmith/metalsmith/commit/446c676), [`33d936b`](https://github.com/metalsmith/metalsmith/commit/33d936b), [`4c483a3`](https://github.com/metalsmith/metalsmith/commit/4c483a3)
- [#356] Added `Metalsmith#debug` method for creating plugin debuggers
- [#362] Upgraded all generator-based methods (`Metalsmith#read`,`Metalsmith#readFile`,`Metalsmith#write`,`Metalsmith#writeFile`, `Metalsmith#run` and `Metalsmith#process`) to dual callback-/ promise-based methods [`16a91c5`](https://github.com/metalsmith/metalsmith/commit/16a91c5), [`faf6ab6`](https://github.com/metalsmith/metalsmith/commit/faf6ab6), [`6cb6229`](https://github.com/metalsmith/metalsmith/commit/6cb6229)
- Added org migration notification to postinstall script to encourage users to upgrade [`3a11a24`](https://github.com/metalsmith/metalsmith/commit/3a11a24)

### Removed

- [#231] Dropped support for Node < 12 [`0a53007`](https://github.com/metalsmith/metalsmith/commit/0a53007)
- **Dependencies:**
  - `thunkify`: replaced with promise-based implementation [`faf6ab6`](https://github.com/metalsmith/metalsmith/commit/faf6ab6)
  - `unyield` replaced with promise-based implementation [`faf6ab6`](https://github.com/metalsmith/metalsmith/commit/faf6ab6)
  - `co-fs-extra`: replaced with native Node.js methods [`faf6ab6`](https://github.com/metalsmith/metalsmith/commit/faf6ab6)
  - `chalk`: not necessary for the few colors used by Metalsmith CLI [`1dae1cb`](https://github.com/metalsmith/metalsmith/commit/a1dae1cb)
  - `clone`: see [#247] [`a871af6`](https://github.com/metalsmith/metalsmith/commit/a871af6)

### Updated

- Restructured and updated `README.md` [`0da0c4d`](https://github.com/metalsmith/metalsmith/commit/0da0c4d)
- [#247] Calling `Metalsmith#metadata` no longer clones the object passed to it, overwriting the previous metadata, but merges it into existing metadata.

[#362]: https://github.com/metalsmith/metalsmith/issues/362
[#354]: https://github.com/metalsmith/metalsmith/issues/354
[#355]: https://github.com/metalsmith/metalsmith/issues/355
[#356]: https://github.com/metalsmith/metalsmith/issues/356
[#247]: https://github.com/metalsmith/metalsmith/issues/247

### Fixed

- [#355] Proper path resolution for edge-cases using CLI, running metalsmith from outside or subfolder of `metalsmith.directory()`[`5d75539`](https://github.com/metalsmith/metalsmith/commit/5d75539)
