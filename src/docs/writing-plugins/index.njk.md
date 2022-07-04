---
title: Writing plugins
description: 'Learn how to develop & publish plugins for metalsmith.js: Node, toolbox, and best practices'
toc: true
order: 3
layout: default.njk
sitemap:
  priority: 0.8
  lastmod: 2022-02-17
config:
  anchors: true
---
{% include "./lib/views/partials/doc-mdlinks.njk" %}
{% from "./lib/views/partials/replit.njk" import "replit" %}

This plugin development reference will walk you through starting with a simple local plugin and finishing with a flexible multi-option plugin that follows best practices, ready for publishing on NPM. Feel free to drop out at any time or jump to the sections that you need.

## Writing a quick local plugin

Writing a plugin is super-simple! A metalsmith plugin is just a function that is passed the [Files](/api/#Files) object and the [Metalsmith instance](/api/#Metalsmith). {# As seen in the [Usage guide](/docs/usage-guide/), #} even `console.log` can be a plugin: 

{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith')

Metalsmith(__dirname)
  .use(console.log) // logs files, then metalsmith
  .build((err, files) => {
    if (err) throw err
    console.log('Build success!')
  })
```
{% endcodeblock %}

Let us give our plugin a more fitting name, *snapshot*, because it takes a snapshot of the files' state at a given moment in the plugin chain.

{% codetabs ["Code","Diff"] %}
{% codeblock "metalsmith.js" %}
```js
function snapshot(files, metalsmith) {
 console.log(files, metalsmith)
}
const Metalsmith = require('metalsmith')

Metalsmith(__dirname)
  .use(snapshot)
  .build((err, files) => {
    if (err) throw err
    console.log('Build success!')
  })
```
{% endcodeblock %}
{% codeblock "metalsmith.js" %}
```diff
+ function snapshot(files, metalsmith) {
+  console.log(files, metalsmith)
+ }
  const Metalsmith = require('metalsmith')

  Metalsmith(__dirname)
-   .use(console.log) // logs files, then metalsmith
+   .use(snapshot)
    .build((err, files) => {
      if (err) throw err
      console.log('Build success!')
    })
```
{% endcodeblock %}
{% endcodetabs %}

{{ replit("snapshot-plugin", "1-writing-quick-local-plugin/metalsmith.js") | safe }}

If you run this code with `node metalsmith`, you will see the Metalsmith instance with `plugins: [ [Function: snapshot] ]`.
It is important that the plugin is a *named function*. The function name *is* the plugin's name. It is good practice to use a named function for your plugin:

* it allows other plugins and debug tools (like [metalsmith-debug-ui][plugin_debug-ui] ) to identify which plugins the metalsmith build uses through `metalsmith.plugins`. For example, this is the output of `console.log(metalsmith.plugins)` in a plugin in the [metalsmith.io](/) (this site)'s build:
  ```js
  plugins: [
    [Function: drafts],
    [Function: metalsmithFavicons],
    [Function: collections],
    [Function: invertInPlaceExtensions],
    [Function (anonymous)],
    [Function: tableOfContents],
    [Function (anonymous)],
    [Function (anonymous)],
    [Function: sass],
    [Function: postcss],
    [Function: esbuild],
    [Function: plugin],
    [Function (anonymous)]
  ]
  ```
  Anonymous functions all get the name `Function (anonymous)` which is harder to inspect
* The same argument of clarity applies to error stack traces. Naming the plugin allows users to immediately pin the plugin that causes issues:
  ```txt
  UnhandledPromiseRejectionWarning: EINVALID_ARGUMENT: Requiredoption cannot be empty
    at Ware.snapshot (/home/user/ms/metalsmith.js:9:19)
    at Ware.<anonymous> (/home/user/ms/node_modules/wrap-fn/index.js:45:19)
  ```


Cool, cool. But the `snapshot` plugin is pretty limited. We would like to be able to re-use it to target *only* certain files, and *only* certain metadata properties. And perhaps also write the results to a file. 

## Adding options to a plugin

To pass options to a plugin we simply wrap and return the *plugin body* in a closure function, &mdash; an *initializer* &mdash;, then call it in our plugin chain. Mind that code in the *initializer* runs before the plugin is passed to `metalsmith.use`. In the *initializer* you can pass, map & [validate options](#handling-errors) and run other setup logic that doesn't need metalsmith build info.

{% codetabs ["Code","Diff"] %}
{% codeblock "metalsmith.js" %}
```js
function initSnapshot(options = {}) {
  // code in the initializer runs before metalsmith.build()
  return function snapshot(files, metalsmith) {
    // code in the plugin oody runs as part of metalsmith.build()
    console.log(files, metalsmith)
  }
}
const Metalsmith = require('metalsmith')

Metalsmith(__dirname)
  .use(initSnapshot())
  .build((err, files) => {
    if (err) throw err
    console.log('Build success!')
  })
```
{% endcodeblock %}
{% codeblock "metalsmith.js" %}
```diff
+ function initSnapshot(options = {}) {
  // code in the initializer runs before metalsmith.build()
-   function snapshot(files, metalsmith) {
    // code in the plugin oody runs as part of metalsmith.build()
+   return function snapshot(files, metalsmith) {
      console.log(files, metalsmith)
    }
+ }
  const Metalsmith = require('metalsmith')

  Metalsmith(__dirname)
-   .use(snapshot)
+   .use(initSnapshot())
    .build((err, files) => {
      if (err) throw err
      console.log('Build success!')
    })
```
{% endcodeblock %}
{% endcodetabs %}

{{ replit("snapshot-plugin", "2b-adding-options-to-plugin/metalsmith.js") | safe }}

As the *snapshot* plugin becomes more powerful and reusable, we move it to its own file `snapshot.js` in a `plugins` folder next to `metalsmith.js`, and `const snapshot = require('./plugins/snapshot')` in `metalsmith.js`.

We also add a default options object in case none are passed to the plugin. We define the (glob) `pattern` option, so we can target specific files to log, and default it to `'**'` (= all files). We also define the `keys` option, so we can target specific file metadata to log)

{% codetabs ["Code","Diff"] %}
{% codeblock "./plugins/snapshot.js" %}
```js
const defaultOptions = {
  pattern: '**',
  keys: null
}

function initSnapshot(options = {}) {
  return function snapshot(files, metalsmith) {
    options = { ...defaultOptions, ...options }
    // do stuff with options
    console.log(files, metalsmith)
  }
}

module.exports = initSnapshot
```
{% endcodeblock %}
{% codeblock "./plugins/snapshot.js" %}
```diff
+ const defaultOptions = {
+   pattern: '**',
+   keys: null
+ }
+ 
+ function initSnapshot(options = {}) {
+   return function snapshot(files, metalsmith) {
+     options = { ...defaultOptions, ...options }
+     console.log(files, metalsmith)
+   }
+ }
+ 
+ module.exports = initSnapshot
```
{% endcodeblock %}
{% endcodetabs %}
{{ replit("snapshot-plugin", "2b-adding-options-separate-plugin/metalsmith.js") | safe }}

We passed options to the plugin but we're not doing anything with them yet.  
We need to know how to manipulate files, file paths and metadata first. The following sections [Manipulating filepaths](#manipulating-filepaths), [Manipulating files](#manipulating-files), and [Manipulating metadata](#manipulating-metadata) provide general info about how to use JS Object & array methods, the NodeJS path library, and the metalsmith instance inside a plugin. If you would rather skip right to the rest of the implementation of the *snapshot plugin*, go to [The plugin body](#the-plugin-body)

## Manipulating file paths

Inevitably when working with a filesystem, metalsmith works with file paths. Windows has different directory separators `\` (backslash) than other systems' `/` (forward slash). With the [`metalsmith.match(pattern)`](/api/#Metalsmith+match) method, you can use forward slashes for both. However, be aware that when you modify file paths and write them back to the [Files object](/api/#Files), you need to use the OS-specific path separators. 

NodeJS includes a handy standard [path module]() that you can use for this: `require('path')`.  
Inside a plugin you can use the `path` module to get all variations of a path. The plugin below will attach different types of path data to each file in the metalsmith build:

{% codeblock "./plugins/paths.js" %}
```js
function getPaths(filepath, metalsmith) {

  // get the absolute path of the metalsmith working directory
  const msDir = metalsmith.directory() // => '/home/user/metalsmith'
  // get the absolute path of the metalsmith source directory
  const msSource = metalsmith.source() // => '/home/user/metalsmith/src'

  // get the relative path of a file
  filepath // => 'blog/index.html'

  // get the directory of a file relative to metalsmith.source()
  const dirname = path.dirname(filepath) // => 'blog'

  // get the filename of a file without the directories
  const basename = path.basename(filepath) // => 'index.html'

  // get the extension of a file
  const extname = path.extname(filepath) // => '.html'

  // get the filename of a file without the directories & extension
  const barebasename = path.basename(filepath, extname) // => 'index'

  // get the absolute path of a file (relative to filesystem root)
  const absPath = metalsmith.path(msSource, filepath) // => /home/user/metalsmith/src/blog/index.html

  // get the path of a file relative to metalsmith.directory()
  const msDirRelPath = path.relative(msDir, metalsmith.path(msSource, filepath)) // => src/blog/index.html

  return {
    filepath,
    dirname,
    basename,
    extname,
    barebasename,
    absPath,
    msDirRelPath
  }
}

// usage: metalsmith.use(paths())
module.exports = function initPaths() {
  return function paths(files, metalsmith) {
    Object.keys(files).forEach(key => {
      Object.assign(files[key], getPaths(key, metalsmith))
    })
  }
}
```
{% endcodeblock %}

## Manipulating files

### Looping over files

You can use any of the `Object` static methods to easily loop over metalsmith files inside a plugin and apply manipulations to them with the Javascript [Array methods](). [Metalsmith#match](/api/#Metalsmith+match) is a helper to loop over a subset of normalized (i.e. Windows & Linux-compatible) file path matches.

* [`Object.keys(files)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
* [`Object.values(files)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values)
* [`Object.entries(files)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
* [`metalsmith.match(pattern)`](/api/#Metalsmith+match)

{% codeblock "./plugins/loop-over-files.js" %}
```js
function loopOverFiles(files, metalsmith) {
  // useful if you only need access to the file
  Object.values(files).forEach(file => { /* ...code */ })

  // useful if you need access to both filepath & file
  Object.entries(files).forEach(([filepath, file]) => { /* ...code */ })

  // alternative if you need access to both filepath & file
  Object.keys(files).forEach(filepath => {
    const file = files[filepath]
    /* ...code */ 
  })

  // same as previous but with normalized glob filtering
  const all = '**'
  metalsmith.match(all).forEach(filepath => {
    const file = files[filepath]
    /* ...code */ 
  })
}
```
{% endcodeblock %}

### Matching subsets of files

You can use any of the `Object` methods described above and then array-`filter` or `slice` them before applying manipulations,
or you could use [`metalsmith.match`](/api/#Metalsmith+match) to target them easily with a glob pattern:

{% codeblock "./plugins/loop-over-files.js" %}
```js
function matchFiles(files, metalsmith) {
  // match files using array filter
  Object.entries(files)
    .slice(0, 10)  // only apply to the first 10 files
    .filter(([filepath, file]) => !file.draft) // filter out files with draft:true
    .forEach(([filepath, file]) => { /* ...code */ })

  // 
  metalsmith.match('**/*.js')
    .forEach(filepath => {
      const file = files[filepath]
      /* ...code */
    })
}
```
{% endcodeblock %}

### Adding, updating, renaming, moving and removing files

Add a file dynamically by assigning a [File object](/api/#File) to a key in the Metalsmith [Files object](/api/#Files)  
Update a file's metadata by re-assigning its keys.  
Remove a file simply by deleting its key from the files object.

{% codeblock "./plugins/file-action.js" %}
```js

function fileActions(files, metalsmith) {
  const name = 'index.html'
  const file = {
    contents: Buffer.from('Hello world'),
    mode: '0664'
  }
  // check if a file is included
  Object.prototype.hasOwnProperty.call(files, name)

  // add a file
  files[name] = file

  // change the file's metadata
  files[name].description = 'I\'s about saying hello to the world'

  // change the file's contents
  files[name].contents = Buffer.from(files[name].contents.toString().replace('world', 'plugin author'))

  // rename a file
  const newName = 'newindex.html'
  files[newName] = files[name]
  delete files[name]

  // move a file to a subdirectory
  const newPath = require('path').join('blog', newName)
  files[newPath] = files[newName]
  delete files[newName]

  // remove a file
  delete files[newPath]
}
```
{% endcodeblock %}

## Manipulating metadata

Plugins can read and make changes to the metadata specified with [Metalsmith.metadata](/api/#Metalsmith.metadata) much like they can with files. They can add metadata, update, rename, or remove metadata, and they can also make metadata available to files or make files available in metadata! A plugin like [@metalsmith/collections](https://github.com/metalsmith/collections) does both. Below is an example of how plugins can implement most of these:

```js
function plugin(files, metalsmith) {
  // read metadata
  const metadata = metalsmith.metadata()
  
  // add a metadata key:value
  metadata.buildTimestamp = Date.now()

  // add multiple metadata key:value's
  Object.assign(metadata, {
    // make all html files available on metadata as "pages"
    pages: metalsmith.match('**/*.html').map(key => files[key])
  })

  // pass global metadata to all files in the "globalMetadata" key (not recommended)
  Object.keys(files).forEach(filepath => {
    files[filepath].globalMetadata = metadata
  })
}
```

## The plugin body

Armed with enough info about how to manipulate files, paths, and metadata, we can now continue writing the *snapshot* plugin.
To be able to get metadata at `any.key.path`, we will use [lodash.get]() and [lodash.set]() (install it with `npm i lodash.get lodash.set`). A code snippet is worth a thousand words, so here we go:

{% codetabs ["Code","Diff"] %}
{% codeblock "./plugins/snapshot.js" %}
```js
const get = require('lodash.get')
const set = require('lodash.set')
const defaultOptions = {
  pattern: '**',
  keys: null
}

function initSnapshot(options = {}) {
  return function snapshot(files, metalsmith) {
    options = { ...defaultOptions, ...options }

    const matchedPaths = metalsmith.match(options.pattern)

    const fileData = matchedPaths.reduce((result, filepath) => {
      const file = files[filepath]
      
      result[filepath] = file
      if (options.keys) {
        const filtered = {}
        options.keys.forEach(key => {
          set(filtered, key, get(file, key))
        })
        result[filepath] = filtered
      }

      return result
    }, {})

    console.log(fileData)
  }
}

module.exports = initSnapshot
```
{% endcodeblock %}
{% codeblock "./plugins/snapshot.js" %}
```diff
+ const get = require('lodash.get')
+ const set = require('lodash.set')
const defaultOptions = {
  pattern: '**',
  keys: null
}

function initSnapshot(options = {}) {
  return function snapshot(files, metalsmith) {
    options = { ...defaultOptions, ...options }
-   // do stuff with options
+
+   const matchedPaths = metalsmith.match(options.pattern)
+ 
+   const fileData = matchedPaths.reduce((result, filepath) => {
+     const file = files[filepath]
+     
+     result[filepath] = file
+     if (options.keys) {
+       const filtered = {}
+       options.keys.forEach(key => {
+         set(filtered, key, get(file, key))
+       })
+       result[filepath] = filtered
+     }
+ 
+     return result
+   }, {})

-   console.log(files)
+   console.log(fileData)
  }
}

module.exports = initSnapshot
```
{% endcodeblock %}
{% endcodetabs %}

We can now run this plugin to provide different outputs:

```js
const Metalsmith = require('metalsmith')
const snapshot = require('./plugins/snapshot')

Metalsmith(__dirname)
  // log all file data
  .use(snapshot()) 
  // log each .html file's last modified date
  .use(snapshot({ keys: ['stats.mtime'], pattern: '**/*.html' }))
  .build((err, files) => {
    if (err) throw err
    console.log('Build success!')
  })

```
{{ replit("snapshot-plugin", "3-plugin-body/metalsmith.js") | safe }}

Let's also add an extra option to write the metadata to a log file in the `build` directory, that will be `write: true || false`. We will output the files as `<filename>.snapshot<index>.json` in the build directory, right next to the file itself. We add an index to the snapshot so we can see how the file metadata evolves after each plugin:

{% codetabs ["Code","Diff"] %}
{% codeblock "./plugins/snapshot.js" %}
```js
const path = require('path')
const get = require('lodash.get')
const set = require('lodash.set')
const defaultOptions = {
  pattern: '**',
  keys: null,
  write: false
}

// get the matching snapshot path for a given filepath
function getSnapshotPath(filepath, index) {
  const name = path.basename(filepath, path.extname(filepath))
  const dir = path.dirname(filepath)
  return path.join(dir, `${name}.snapshot${index}.json`)
}

function initSnapshot(options = {}) {
  return function snapshot(files, metalsmith) {
    options = { ...defaultOptions, ...options }

    const matchedPaths = metalsmith.match(options.pattern)

    const fileData = matchedPaths.reduce((result, filepath) => {
      const file = files[filepath]
      
      result[filepath] = file

      if (options.keys) {
        const filtered = {}
        options.keys.forEach(key => {
          set(filtered, key, get(file, key))
        })
        result[filepath] = filtered
      }
      
      // handle new write option
      if (options.write) {
        let count = 1, snapshotPath
        do {
          snapshotPath = getSnapshotPath(filepath, count)
          count++
        } while (files.hasOwnProperty(snapshotPath))
        files[snapshotPath] = {
          contents: Buffer.from(JSON.stringify(result[filepath], null, 2))
        }
      }

      return result
    }, {})

    console.log(fileData)
  }
}

module.exports = initSnapshot
```
{% endcodeblock %}
{% codeblock "./plugins/snapshot.js" %}
```diff
+ const path = require('path')
  const get = require('lodash.get')
  const set = require('lodash.set')
  const defaultOptions = {
    pattern: '**',
    keys: null,
    write: false
  }
  
+  // get the matching snapshot path for a given filepath
+  function getSnapshotPath(filepath, index) {
+    const name = path.basename(filepath, path.extname(filepath))
+    const dir = path.dirname(filepath)
+    return path.join(dir, `${name}.snapshot${index}.json`)
+  }
  
  function initSnapshot(options = {}) {
    return function snapshot(files, metalsmith) {
      options = { ...defaultOptions, ...options }
  
      const matchedPaths = metalsmith.match(options.pattern)
  
      const fileData = matchedPaths.reduce((result, filepath) => {
        const file = files[filepath]
        
        result[filepath] = file
  
        if (options.keys) {
          const filtered = {}
          options.keys.forEach(key => {
            set(filtered, key, get(file, key))
          })
          result[filepath] = filtered
        }
        
+       // handle new write option
+       if (options.write) {
+         let count = 1, snapshotPath
+         do {
+           snapshotPath = getSnapshotPath(filepath, count)
+           count++
+         } while (files.hasOwnProperty(snapshotPath))
+         files[snapshotPath] = {
+           contents: Buffer.from(JSON.stringify(result[filepath], null, 2))
+         }
+       }
  
        return result
      }, {})
  
      console.log(fileData)
    }
  }

  module.exports = initSnapshot
```
{% endcodeblock %}
{% endcodetabs %}

{{ replit("snapshot-plugin", "3-plugin-body/metalsmith.js") | safe }}

Let us now quickly race through a boring but very important part: [handling errors](#handling-errors)

## Handling errors

Until now the snapshot plugin has used 2 parameters: `files` and `metalsmith`; but as you can see from the API docs, there is a third, [done callback](/api#donecallback). To let the user decide what to do with errors, it is a good idea **not to throw** an error that occurs during the plugin's run, but instead **pass it to `done(error)`**. 

For demo purposes, here is an `abort` plugin that will stop the build by throwing a custom error unless you pass `false` to it:

{% codeblock "./plugins/abort-plugin.js" %}
```js
/**
 * A plugin that will conditionally abort the build
 *  @param {boolean} [confirm=true]
 *  @example metalsmith.use(abort())
 **/
function initAbort(confirm = true) {
  return function abort(metalsmith, files, done) {
    if (confirm) {
      const error = new Error('Build aborted')
      error.name = 'EBUILD_ABORTED'
      error.code = 'build_aborted'
      done(error)
    }
    done()
  }
}

module.exports = initAbort
```
{% endcodeblock %}

The plugin also demonstrates how you can create a custom error in a simple way.
Note that you can also return a promise if you prefer:

{% codetabs ["JS","Diff"] %}
{% codeblock "./plugins/abort-plugin.js" %}
```js
/**
 * A plugin that will conditionally abort the build
 *  @param {boolean} [confirm=true]
 *  @example metalsmith.use(abort())
 **/
function initAbort(confirm = true) {
  return function abort(metalsmith, files) {
    if (confirm) {
      const error = new Error('Build aborted')
      error.code = 'build_aborted'
      return Promise.reject(error)
    }
    return Promise.resolve()
  }
}

module.exports = initAbort
```
{% endcodeblock %}
{% codeblock "./plugins/abort-plugin.js" %}
```diff
/**
 * A plugin that will conditionally abort the build
 *  @param {boolean} [confirm=true]
 *  @example metalsmith.use(abort())
 **/
function initAbort(confirm = true) {
  return function abort(metalsmith, files) {
    if (confirm) {
      const error = new Error('Build aborted')
      error.code = 'build_aborted'
-     done(error)
+     return Promise.reject(error)
    }
-   done()
+   return Promise.resolve()
  }
}

module.exports = initAbort
```
{% endcodeblock %}
{% endcodetabs %}

For static options validation (=options which don't require extra metalsmith build info) you may choose to `throw` an error immediately in the `initPlugin` wrapper:

```js
function initMyPlugin(options) {
  if (!options.requiredOption) {
    throw new Error('requiredOption is required')
  }
  return function MyPlugin() { ... }
}
```

## Adding debug logs to the plugin

{# In the [Usage guide](/docs/usage-guide/#debugging) we saw that debug logs can be enabled by defining the `DEBUG` environment variable.  #}
Plugins implement debugging with the [debug NPM package](https://npmjs.com/package/debug). Require it in your plugin, and pass it the name of your plugin. For the *snapshot* plugin this could be:

```js
const debug = require('debug')('metalsmith-snapshot')
```

You can also 'divide' the debug logs for your plugin in multiple channels:

```js
const warn = debug.extend('warn') // warn('Careful!') will output "metalsmith-snapshot:warn Careful!"
const error = debug.extend('error') // error('Oops!') will output "metalsmith-snapshot:error Oops!"
```

`debug` provides some [handy formatters](https://github.com/debug-js/debug#formatters) for objects and JSON logging. Here are some usage examples:

```js
// Pretty-print an Object on multiple lines.
debug('Running with options: %O', { pattern: '**' })
// log JSON.stringified version
debug('Metalsmith.metadata: %j', metalsmith.metadata())
```

Things that are generally interesting to log are:
* the plugin options, after normalization (eg. filled with defaults)
* the files or metadata that were processed
* errors & warnings

## Asynchronous manipulations

If a plugin does some manipulations asynchronously, it needs to notify metalsmith when it's done by calling `done()` or returning a promise.

{% codeblock "plugins/add-external-file.js" %}
```js
const { basename } = require('path')

function initAddExternalFile(filepath) {
  return function addExternalFile(files, metalsmith, done) {
    metalsmith.readFile(metalsmith.path(filepath), (err, file) => {
      if (err) done(err)
      files[basename(filepath)] = file
      done()
    })
  }
}

module.exports = initAddExternalFile
```
{% endcodeblock %}

Manipulations within a plugin can happen *in parallel*, but the plugin should only call `done` when all manipulations of the plugin are done. To such effect we can use `Promise.all`. Below we change the `addExternalFile` plugin from the previous example to handle multiple files:

{% codeblock "plugins/add-external-files.js" %}
```js
const { basename } = require('path')

function initAddExternalFiles(filepaths = []) {
  return function addExternalFiles(files, metalsmith) {
    return Promise.all(filepaths.map(filepath => {
      return new Promise((resolve, reject) => {
        metalsmith.readFile(metalsmith.path(filepath), (err, file) => {
          if (err) reject(err)
          files[basename(filepath)] = file
          resolve()
        })
      })
    }))
  }
}

module.exports = initAddExternalFile
```
{% endcodeblock %}

{# WIP #}
{#
## Unit testing plugins

The core plugins use the standard NodeJS [assert]() library and [mocha]() for testing, and [nyc]() for code coverage.  


## Publishing plugins

Work in progress...
<!-- Plugins can be published to [NPM](https://npmjs.com) and/or [the metalsmith plugin registry](/plugins). -->
#}