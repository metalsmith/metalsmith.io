---
title: API reference
description: Metalsmith.js API reference
slug: api
layout: default.njk
sitemap:
  priority: 1.0
  lastmod: 2023-05-22
config:
  anchors: true
---
## Typedefs

<dl>
<dt><a href="#Metalsmith">Metalsmith</a> ⇒ <code><a href="#Metalsmith">Metalsmith</a></code></dt>
<dd><p>Initialize a new <code>Metalsmith</code> builder with a working <code>directory</code>.</p>
</dd>
<dt><a href="#Files">Files</a> : <code>Object.&lt;string, File&gt;</code></dt>
<dd><p>Metalsmith representation of the files in <code>metalsmith.source()</code>.
The keys represent the file paths and the values are <a href="#File">File</a> objects</p>
</dd>
<dt><a href="#File">File</a> : <code>Object</code></dt>
<dd><p>Metalsmith file. Defines <code>mode</code>, <code>stats</code> and <code>contents</code> properties by default, but may be altered by plugins</p>
</dd>
<dt><a href="#BuildCallback">BuildCallback</a> : <code>function</code></dt>
<dd><p>A callback to run when the Metalsmith build is done</p>
</dd>
<dt><a href="#DoneCallback">DoneCallback</a> : <code>function</code></dt>
<dd><p>A callback to indicate that a plugin&#39;s work is done</p>
</dd>
<dt><a href="#Plugin">Plugin</a> : <code>function</code></dt>
<dd><p>A Metalsmith plugin is a function that is passed the file list, the metalsmith instance, and a <code>done</code> callback.
Calling the callback is required for asynchronous plugins, and optional for synchronous plugins.</p>
</dd>
<dt><a href="#Debugger">Debugger</a> : <code>function</code></dt>
<dd><p>A <a href="https://github.com/debug-js/debug#readme">debug</a>-based plugin debugger</p>
</dd>
<dt><a href="#MatterOptions">MatterOptions</a> : <code>Object</code></dt>
<dd><p>Options for parsing/stringifying front-and other matter</p>
</dd>
</dl>

<a name="Metalsmith"></a>

## Metalsmith ⇒ [`Metalsmith`](#Metalsmith)
Initialize a new `Metalsmith` builder with a working `directory`.

**Kind**: global typedef  

| Param     | Type     |
|-----------|----------|
| directory | `string` |

**Properties**

| Name      | Type                      |
|-----------|---------------------------|
| [plugins] |[`Array<Plugin>`](#Plugin) |
| [ignores] |`Array<string>`            |


* [Metalsmith](#Metalsmith) ⇒ [`Metalsmith`](#Metalsmith)
    * [.use(plugin)](#Metalsmith+use) ⇒ [`Metalsmith`](#Metalsmith)
    * [.directory([directory])](#Metalsmith+directory) ⇒ `string` | [`Metalsmith`](#Metalsmith)
    * [.metadata([metadata])](#Metalsmith+metadata) ⇒ `Object` | [`Metalsmith`](#Metalsmith)
    * [.source([path])](#Metalsmith+source) ⇒ `string` | [`Metalsmith`](#Metalsmith)
    * [.destination([path])](#Metalsmith+destination) ⇒ `string` | [`Metalsmith`](#Metalsmith)
    * [.concurrency([max])](#Metalsmith+concurrency) ⇒ `number` | [`Metalsmith`](#Metalsmith)
    * [.clean([clean])](#Metalsmith+clean) ⇒ `boolean` | [`Metalsmith`](#Metalsmith)
    * [.frontmatter([frontmatter])](#Metalsmith+frontmatter) ⇒ `boolean` | [`Metalsmith`](#Metalsmith)
    * [.watch([options])](#Metalsmith+watch) ⇒ `boolean` | [`Chokidar.WatchOptions`](https://github.com/paulmillr/chokidar/blob/3.5.3/types/index.d.ts#L68) | [`Metalsmith`](#Metalsmith)
    * [.ignore([files])](#Metalsmith+ignore) ⇒ [`Metalsmith`](#Metalsmith) \| `Array.<string>`
    * [.statik([paths])](#Metalsmith+statik) ⇒ [`Files`](#Files) | `void`
    * [.path(...paths)](#Metalsmith+path) ⇒ `string`
    * [.match(patterns \[, input \[, options\]\])](#Metalsmith+match) ⇒ `Array.<string>`
    * [.imports(specifier \[, namedExport\])](#Metalsmith+imports) ⇒ `Promise<*>`
    * [.debug(namespace)](#Metalsmith+debug) ⇒ [`Debugger`](#Debugger)
    * [.env(\[ vars \[, value\]\])](#Metalsmith+env) ⇒ `string` | `number` | `boolean` | `Object` | [`Metalsmith`](#Metalsmith)
    * [.build([callback])](#Metalsmith+build) ⇒ [`Promise.<Files>`](#Files) | `void`
    * [.process([callback])](#Metalsmith+process) ⇒ [`Promise.<Files>`](#Files) | `void`
    * [.run(files, plugins)](#Metalsmith+run) ⇒ [`Promise.<Files>`](#Files) | `void`
    * [.matter](#Metalsmith+matter)
        * [.parse(contents)](#Metalsmith+matter+parse) ⇒ [`File`](#File) | `void`
        * [.stringify(file)](#Metalsmith+matter+stringify) ⇒ `string`
        * [.wrap(stringifiedData)](#Metalsmith+matter+wrap) ⇒ `string`

<a name="Metalsmith+use"></a>

### metalsmith.use(plugin) ⇒ [`Metalsmith`](#Metalsmith)
Add a `plugin` function to the stack.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  

| Param    | Type               |
|----------|--------------------|
| [plugin] |[`plugin`](#Plugin) |

**Example**  
```js
metalsmith
 .use(drafts())   // use the drafts plugin
 .use(markdown()) // use the markdown plugin
```
<a name="Metalsmith+directory"></a>

### metalsmith.directory([directory]) ⇒ `string` | [`Metalsmith`](#Metalsmith)
Get or set the working `directory`.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  

| Param       | Type    |
|-------------|---------|
| [directory] |`string` |

**Example**  
```js
new Metalsmith('.')                   // set the path of the working directory through the constructor
metalsmith.directory()                // returns '.'
metalsmith.directory('./other/path')  // set the path of the working directory
```
<a name="Metalsmith+metadata"></a>

### metalsmith.metadata([metadata]) ⇒ `Object` | [`Metalsmith`](#Metalsmith)
Get or set the global `metadata`.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  

| Param      | Type     |
|------------|----------|
| [metadata] |`Object`  |

**Example**  
```js
metalsmith.metadata({ sitename: 'My blog' });  // set metadata
metalsmith.metadata()                          // returns { sitename: 'My blog' }
```
<a name="Metalsmith+source"></a>

### metalsmith.source([path]) ⇒ `string` | [`Metalsmith`](#Metalsmith)
Get or set the source directory.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  

| Param  | Type    |
|--------|---------|
| [path] |`string` |

**Example**  
```js
metalsmith.source('./src');    // set source directory
metalsmith.source()            // returns './src'
```
<a name="Metalsmith+destination"></a>

### metalsmith.destination([path]) ⇒ `string` | [`Metalsmith`](#Metalsmith)
Get or set the destination directory.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  

| Param  | Type    |
|--------|---------|
| [path] |`string` |

**Example**  
```js
metalsmith.destination('build'); // set destination
metalsmith.destination()         // returns 'build'
```
<a name="Metalsmith+concurrency"></a>

### metalsmith.concurrency([max]) ⇒ `number` | [`Metalsmith`](#Metalsmith)
Get or set the maximum number of files to open at once.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  

| Param | Type     |
|-------|----------|
| [max] |`number`  |

**Example**  
```js
metalsmith.concurrency(20)   // set concurrency to max 20
metalsmith.concurrency()     // returns 20
```
<a name="Metalsmith+clean"></a>

### metalsmith.clean([clean]) ⇒ `boolean` | [`Metalsmith`](#Metalsmith)
Get or set whether the destination directory will be removed before writing.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  

| Param   | Type     |
|---------|----------|
| [clean] |`boolean` |

**Example**  
```js
metalsmith.clean(true)  // clean the destination directory
metalsmith.clean()      // returns true
```
<a name="Metalsmith+frontmatter"></a>

### metalsmith.frontmatter([frontmatter]) ⇒ `boolean` | [`Metalsmith`](#Metalsmith)
Optionally turn off frontmatter parsing or pass a [gray-matter options object](https://github.com/jonschlinkert/gray-matter/tree/4.0.2#option)

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  

| Param         | Type                                                                                              |
|---------------|---------------------------------------------------------------------------------------------------|
| [frontmatter] |`boolean` \| [`GrayMatterOptions`](https://github.com/jonschlinkert/gray-matter/tree/4.0.2#option) |

**Example**  
```js
metalsmith.frontmatter(false)  // turn off front-matter parsing
metalsmith.frontmatter()       // returns false
metalsmith.frontmatter({ excerpt: true })
```
<a name="Metalsmith+watch"></a>

### metalsmith.watch([options]) ⇒ `boolean` | [`Chokidar.WatchOptions`](https://github.com/paulmillr/chokidar/blob/3.5.3/types/index.d.ts#L68) | [`Metalsmith`](#Metalsmith)

<p class="Note Note--warn">
  Partial rebuilding (=using <code>metalsmith.watch</code> with <code>metalsmith.clean(false)</code>) is still experimental and combined with <code>@metalsmith/metadata</code> &lt;= 0.2.0 a bug may trigger an infinite loop. metalsmith.watch is incompatible with existing watch plugin. In watch mode, metalsmith.process/build are <strong>not awaitable</strong>. Callbacks passed to these methods will run on every rebuild instead of running once at the build's end.
</p>

Set the list of paths to watch and trigger rebuilds on. The watch method will skip files ignored with `metalsmith.ignore()` and will do partial (true) or full (false) rebuilds depending on the `metalsmith.clean()` setting. It can be used both for rebuilding in-memory with `metalsmith.process` or writing to file system with `metalsmith.build`.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[options]</td><td><code>boolean</code> | <code>string</code> | <code>Array.&lt;string&gt;</code> | <code><a href="https://github.com/paulmillr/chokidar/blob/3.5.3/types/index.d.ts#L68">Chokidar.WatchOptions</a></code></td><td>If string or array of strings, the directory path(s) to watch. If <code>true</code> or <code>false</code>, will (not) watch <a href="#Metalsmith+source">Metalsmith.source()</a>. Alternatively an object of Chokidar watchOptions, except <code>cwd</code>, <code>ignored</code>, <code>alwaysStat</code>, <code>ignoreInitial</code>, and <code>awaitWriteFinish</code>. These options are controlled by Metalsmith.</td>
    </tr>  </tbody>
</table>

**Example**  
```js
metalsmith
  .ignore(['wont-be-watched'])  // ignored
  .clean(false)                 // do partial rebuilds
  .watch(true)                  // watch all files in metalsmith.source()
  .watch(['lib','src'])         // or watch files in directories 'lib' and 'src'

if (process.argv[2] === '--dry-run') {
  metalsmith.process(onRebuild) // reprocess in memory without writing to disk
} else {
  metalsmith.build(onRebuild)   // rewrite to disk
}

function onRebuild(err, files) {
  if (err) {
    metalsmith.watch(false)            // stop watching
     .finally(() => console.log(err))  // and log build error
  }
  console.log('reprocessed files', Object.keys(files).join(', '))
}
```
<a name="Metalsmith+ignore"></a>

### metalsmith.ignore([files]) ⇒ [`Metalsmith`](#Metalsmith) \| `Array.<string>`
Get or set the list of filepaths or glob patterns to ignore

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  

| Param        | Type                         | Description                                                   |
|--------------|------------------------------|---------------------------------------------------------------|
| [files]      |`string` \| `Array.<string>`  | The names or glob patterns of files or directories to ignore. |

**Example**  
```js
metalsmith.ignore()                      // return a list of ignored file paths
metalsmith.ignore('layouts')             // ignore the layouts directory
metalsmith.ignore(['.*', 'data.json'])   // ignore dot files & a data file
```

<a name="Metalsmith+statik"></a>

### metalsmith.statik([paths]) ⇒ [`Files`](#Files) | `void`
Get or set files to consider static, i.e. that should be copied to `metalsmith.destination()` without being processed by plugins.


**Kind**: instance method of [`Metalsmith`](#Metalsmith)  
**Returns**: a regular Metalsmith [Files](#Files) object, with the difference that the files' `stats`,`mode` and `contents` are read-only and `contents.toString()` contains the original file path of the file relative to [Metalsmith.source](#Metalsmith+source)


| Param        | Type                         | Description                                                            |
|--------------|------------------------------|------------------------------------------------------------------------|
| [paths]      |`string` \| `Array.<string>`  | The names or glob patterns of files or directories to consider static. |

**Example**  
```js
metalsmith.statik(["assets","CNAME","api/static"]);
const statik = metalsmith.statik()
statik['library.css'].contents.toString() // 'library.css'
```

<a name="Metalsmith+path"></a>

### metalsmith.path(...paths) ⇒ `string`
Resolve `paths` relative to the metalsmith `directory`.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  

| Param        | Type    |
|--------------|---------|
| ...paths     |`string` |

**Example**  
```js
metalsmith.path('./path','to/file.ext')
```
<a name="Metalsmith+match"></a>

### metalsmith.match(patterns \[, input \[,options]]) ⇒ `Array.<string>`
Match filepaths in the source directory by [glob](https://en.wikipedia.org/wiki/Glob_(programming)) pattern.
If `input` is not specified, patterns are matched against `Object.keys(files)`

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  
**Returns**: `Array.<string>` - An array of matching file paths  

| Param     | Type                                                                     | Description                                                                  |
|-----------|--------------------------------------------------------------------------|------------------------------------------------------------------------------|
| patterns  | `string` \| `Array.<string>`                                             | One or more [glob](https://en.wikipedia.org/wiki/Glob_(programming) patterns |
| [input]   | `Array.<string>`                                                         | Array of paths to match patterns to                                          |
| [options] | [`micromatch.Options`](https://github.com/micromatch/micromatch#options) | [Micromatch options](https://github.com/micromatch/micromatch#options)       |                                             |

<a name="Metalsmith+imports"></a>

### metalsmith.imports(specifier\[, namedExport]) ⇒ `Promise<*>`
Like Javascript's dynamic `import()`, with CJS/ESM support for loading default exports, all or a single named export, and JSON files.  
Relative paths are resolved against `metalsmith.directory()`.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  
**Returns**: `Promise.<*>` - a JS/JSON module 

| Param         | Type     | Description                                     |
|---------------|----------|-------------------------------------------------|
| specifier     | `string` | Any specifier you would pass to import/require* |
| [namedExport] | `string` | Return only a single named export               |

**Example**  

```js
 * await metalsmith.imports('metalsmith') // Metalsmith
 * await metalsmith.imports('./data.json')  // object
 * await metalsmith.imports('./helpers/index.js', 'formatDate')  // function
```

<a name="Metalsmith+env"></a>

### metalsmith.env(\[vars \[, value]]) ⇒ `string` | `number` | `boolean` | `Object` | [`Metalsmith`](#Metalsmith)
Get or set one or multiple metalsmith environment variables. Metalsmith env vars are case-insensitive.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  

| Param   | Type     | Description                                                                                            |
|---------|----------|--------------------------------------------------------------------------------------------------------|
| [vars]  | `string` \| `Object`              | Name of the environment variable, or an object with `{ name: <value> }` pairs |
| [value] | `string` \| `number` \| `boolean` | Value of the environment variable                                             |

**Example**  
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
<a name="Metalsmith+debug"></a>

### metalsmith.debug(namespace) ⇒ [`Debugger`](#Debugger)
Create a new [debug](https://github.com/debug-js/debug#readme) debugger

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  

| Param     | Type     | Description        |
|-----------|----------|--------------------|
| namespace | `string` | Debugger namespace |

**Example**  
```js
function plugin(files, metalsmith) {
  const debug = metalsmith.debug('metalsmith-myplugin')
  debug('a debug log')    // logs 'metalsmith-myplugin a debug log'
  debug.warn('A warning') // logs 'metalsmith-myplugin:warn A warning'
}
```

<a name="Metalsmith+build"></a>

### metalsmith.build([callback]) ⇒ [`Promise.<Files>`](#Files) | `void`
Build with the current settings to the destination directory.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  
**Fulfills**: [`Files`](#Files)  
**Rejects**: `Error`  

| Param      | Type                              |
|------------|-----------------------------------|
| [callback] |[`BuildCallback`](#BuildCallback)  |

**Example**  
```js
// callback variant
metalsmith.build(function(error, files) {
  if (error) throw error
  console.log('Build success!')
})

// promise variant
try {
  const files = await metalsmith.build()
  console.log('Build success')
} catch (error) {
  throw error
}
```
<a name="Metalsmith+process"></a>

### metalsmith.process([callback]) ⇒ [`Promise.<Files>`](#Files) | `void`
Process files through plugins without writing out files.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  
**Fulfills**: [`Files`](#Files)  
**Rejects**: `Error`  

| Param      | Type                              |
|------------|-----------------------------------|
| [callback] |[`BuildCallback`](#BuildCallback)  |

**Example**  
```js
// callback variant
metalsmith.process(err => {
  if (err) throw err
  console.log('Success')
})

// promise variant
try {
  await metalsmith.process()
  console.log('Success')
} catch (err) {
  throw err
}
```
<a name="Metalsmith+run"></a>

### metalsmith.run(files, plugins) ⇒ `Object`
Run a set of `files` through the plugins stack.

**Kind**: instance method of [`Metalsmith`](#Metalsmith)  
**Access**: package  

| Param        | Type                       |
|--------------|----------------------------|
| files        |[`files`](#Files)           |
| plugins      |[`Array<Plugin>`](#Plugin)  |

<a name="Metalsmith+matter"></a>

## metalsmith.matter

**Kind**: instance member of [`Metalsmith`](#Metalsmith)  

<a name="Metalsmith+matter+parse"></a>

### metalsmith.matter.options([options]) ⇒ `void` | [`MatterOptions`](#MatterOptions) 
Get or set options for parsing & stringifying matter

**Kind**: instance method of [`Metalsmith.matter`](#Metalsmith+matter)  

| Param      | Type                              |
|------------|-----------------------------------|
| [options]  |[`MatterOptions`](#MatterOptions)  |

**Example**  
```js
metalsmith.matter.parse(Buffer.from('---\ntitle: Hello World\n---\nIntro\n---')) === {
  contents: Buffer<'Hello world'>,
  title: 'Hello World',
  excerpt: 'Intro'
}
```

### metalsmith.matter.parse(file) ⇒  [`File`](#File)
Parse a string for front matter and return it as a [`File`](#File) object.

**Kind**: instance method of [`Metalsmith.matter`](#Metalsmith+matter)  

| Param | Type                              |
|-------|-----------------------------------|
| file  |[`Buffer`](https://nodejs.org/api/buffer.html) \| `string`|

**Example**  
```js
metalsmith.matter.parse(Buffer.from('---\ntitle: Hello World\n---\nIntro\n---')) === {
  contents: Buffer<'Hello world'>,
  title: 'Hello World',
  excerpt: 'Intro'
}
```

<a name="Metalsmith+matter+stringify"></a>

### metalsmith.matter.stringify(file) ⇒ `string`
Stringify a [`File`](#File) object to a string with frontmatter and contents

**Kind**: instance method of [`Metalsmith.matter`](#Metalsmith+matter)  

| Param    | Type            |
|----------|-----------------|
| contents | [`File`](#File) |

**Example**  
```js
metalsmith.matter.stringify({
  contents: Buffer.from('body'),
  title: 'Hello World',
  excerpt: 'Intro'
}) === [
  'title: Hello World',
  'excerpt: Intro',
  '---',
  'body'
].join('\n')
```

<a name="Metalsmith+matter+wrap"></a>

### metalsmith.matter.wrap(stringifiedData) ⇒ `string`
Wrap stringified front-matter-compatible data with the matter delimiters

**Kind**: instance method of [`Metalsmith.matter`](#Metalsmith+matter)  

| Param            | Type                              |
|------------------|-----------------------------------|
| stringifiedData  | [`Buffer`](https://nodejs.org/api/buffer.html) \|`string`|

**Example**  
```js
metalsmith.matter.wrap(Buffer.from('{"hello": "world"}')) === '---\n{"hello": "world"}\n---'
```

<a name="Files"></a>

## Files : `Object.<string, File>`
Metalsmith representation of the files in `metalsmith.source()`.
The keys represent the file paths and the values are [File](#File) objects

**Kind**: global typedef  
<a name="File"></a>

## File
Metalsmith file. Defines `mode`, `stats` and `contents` properties by default, but may be altered by plugins

**Kind**: global typedef  
**Properties**

| Name     | Type                                                           | Description                                                                                                                |
|----------|----------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| contents | [`Buffer`](https://nodejs.org/api/buffer.html)                 | A NodeJS [Buffer](https://nodejs.org/api/buffer.html) that can be `.toString`&#39;ed to obtain its human-readable contents |
| stats    | [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) | A NodeJS [fs.Stats object](https://nodejs.org/api/fs.html#fs_class_fs_stats) with extra filesystem metadata and methods    |
| mode     | `string`                                                       | [Octal permission mode](https://en.wikipedia.org/wiki/File-system_permissions#Numeric_notation)                            |

<a name="BuildCallback"></a>

## BuildCallback : `function`
A callback to run when the Metalsmith build is done

**Kind**: global typedef  
**this**: [`Metalsmith`](#Metalsmith)

| Param   | Type                                                      |
|---------|-----------------------------------------------------------|
| [error] | [`Error`](https://nodejs.org/api/errors.html#class-error) |
| files   | [`Files`](#Files)                                         |

**Example**  
```js
function onBuildEnd(error, files) {
  if (error) throw error
  console.log('Build success')
}
```
<a name="DoneCallback"></a>

## DoneCallback : `function`
A callback to indicate that a plugin's work is done

**Kind**: global typedef  

| Param   | Type                                                      |
|---------|-----------------------------------------------------------|
| [error] | [`Error`](https://nodejs.org/api/errors.html#class-error) |

**Example**  
```js
function plugin(files, metalsmith, done) {
  // ..do stuff
  done()
}
```
<a name="Plugin"></a>

## Plugin : `function`
A Metalsmith plugin is a function that is passed the file list, the metalsmith instance, and a `done` callback.
Calling the callback is required for asynchronous plugins, and optional for synchronous plugins.

**Kind**: global typedef

| Param      | Type                             |
|------------|----------------------------------|
| files      | [`Files`](#Files)                |
| metalsmith | [`Metalsmith`](#Metalsmith)      |
| done       | [`DoneCallback`](#DoneCallback)  |

**Example**  
```js
function drafts(files, metalsmith) {
  Object.keys(files).forEach(path => {
    if (files[path].draft) {
      delete files[path]
    }
  })
}

metalsmith.use(drafts)
```

<a name="Debugger"></a>

## Debugger : `function`
A [debug](https://github.com/debug-js/debug#readme)-based plugin debugger with `warn`, `info` and `error` channels.

**Kind**: global typedef  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>message</td><td><code>string</code></td><td><p>Debug message, including <a href="https://github.com/debug-js/debug#formatters">formatter placeholders</a> and an additional <code>%b</code> (buffer) formatter </p></td></tr>
    <tr><td>...args</td><td><code>any</code></td><td><p>Arguments to fill the formatter placeholders with</p></td></tr>
  </tbody>
</table>

**Example**  
```js
const createDebugger = require('metalsmith/lib/debug')
const debugger = createDebugger('metalsmith-myplugin')
debugger('A message')
```

**Methods**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr><td>warn</td><td><code>function</code></td><td><p>Log a warning. Same signature as main debug function</p></td></tr>
<tr><td>error</td><td><code>function</code></td><td><p>Log an error. Same signature as main debug function</p></td></tr>
<tr><td>info</td><td><code>function</code></td><td><p>Log an informational message. Same signature as main debug function</p></td></tr>
</tbody>
</table>

**Example**  
```js
const createDebugger = require('metalsmith/lib/debug')
const debugger = createDebugger('metalsmith-myplugin')
debugger.error('An error')
debugger.warn('A warning')
debugger.info('File contents: %b', Buffer.from('custom'))
```

## MatterOptions: `Object`
[Gray matter options](https://github.com/jonschlinkert/gray-matter#options)

**Kind**: global typedef

| Param               | Type                                                         |
|---------------------|--------------------------------------------------------------|
| language            | `string`                                                     |
| excerpt             | `boolean` \| `function`                                      |
| excerpt_separator   | `string`                                                     |
| delimiters          | `string` \| `string[]`                                       |
| engines             | `Object<string, { parse: Function[, stringify: Function] }>` |