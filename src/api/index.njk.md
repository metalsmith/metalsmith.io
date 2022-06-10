---
title: API reference
description: Metalsmith.js API reference
slug: api
layout: default.njk
sitemap:
  priority: 1.0
config:
  anchors: true
---

Checkout the [project scaffolder](https://github.com/metalsmith/metalsmith/tree/master/examples/project-scaffolder) or [build tool](https://github.com/metalsmith/metalsmith/tree/master/examples/build-tool) examples to see a real example of the Javascript API in use.

## Typedefs

<dl>
<dt><a href="#Metalsmith">Metalsmith</a> ⇒ <code><a href="#Metalsmith">Metalsmith</a></code></dt>
<dd><p>Initialize a new <code>Metalsmith</code> builder with a working <code>directory</code>.</p>
</dd>
<dt><a href="#Files">Files</a> : <code>Object.&lt;string, File&gt;</code></dt>
<dd><p>Metalsmith representation of the files in <code>metalsmith.source()</code>.
The keys represent the file paths and the values are <a href="#File">File</a> objects</p>
</dd>
<dt><a href="#File">File</a></dt>
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
</dl>

<a name="Metalsmith"></a>

## Metalsmith ⇒ [<code>Metalsmith</code>](#Metalsmith)
Initialize a new `Metalsmith` builder with a working `directory`.

**Kind**: global typedef  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>directory</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>plugins</td><td><code><a href="#Plugin">Array.&lt;Plugin&gt;</a></code></td>
    </tr><tr>
    <td>ignores</td><td><code>Array.&lt;string&gt;</code></td>
    </tr>  </tbody>
</table>


* [Metalsmith](#Metalsmith) ⇒ [<code>Metalsmith</code>](#Metalsmith)
    * [.use(plugin)](#Metalsmith+use) ⇒ [<code>Metalsmith</code>](#Metalsmith)
    * [.directory([directory])](#Metalsmith+directory) ⇒ <code>string</code> \| [<code>Metalsmith</code>](#Metalsmith)
    * [.metadata([metadata])](#Metalsmith+metadata) ⇒ <code>Object</code> \| [<code>Metalsmith</code>](#Metalsmith)
    * [.source([path])](#Metalsmith+source) ⇒ <code>string</code> \| [<code>Metalsmith</code>](#Metalsmith)
    * [.destination([path])](#Metalsmith+destination) ⇒ <code>string</code> \| [<code>Metalsmith</code>](#Metalsmith)
    * [.concurrency([max])](#Metalsmith+concurrency) ⇒ <code>number</code> \| [<code>Metalsmith</code>](#Metalsmith)
    * [.clean([clean])](#Metalsmith+clean) ⇒ <code>boolean</code> \| [<code>Metalsmith</code>](#Metalsmith)
    * [.frontmatter([frontmatter])](#Metalsmith+frontmatter) ⇒ <code>boolean</code> \| [<code>Metalsmith</code>](#Metalsmith)
    * [.ignore([files])](#Metalsmith+ignore) ⇒ [<code>Metalsmith</code>](#Metalsmith) \| <code>Array.&lt;string&gt;</code>
    * [.path(...paths)](#Metalsmith+path) ⇒ <code>string</code>
    * [.match(patterns \[, input \[, options\]\])](#Metalsmith+match) ⇒ <code>Array.&lt;string&gt;</code>
    * [.debug(namespace)](#Metalsmith+debug) ⇒ [<code>Debugger</code>](#Debugger)
    * [.env(\[ vars \[, value\]\])](#Metalsmith+env) ⇒ <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Object</code> \| [<code>Metalsmith</code>](#Metalsmith)
    * [.build([callback])](#Metalsmith+build) ⇒ [<code>Promise.&lt;Files&gt;</code>](#Files) \| <code>void</code>
    * [.process([callback])](#Metalsmith+process) ⇒ [<code>Promise.&lt;Files&gt;</code>](#Files) \| <code>void</code>
    * [.run(files, plugins)](#Metalsmith+run) ⇒ [<code>Promise.&lt;Files&gt;</code>](#Files) \| <code>void</code>

<a name="Metalsmith+use"></a>

### metalsmith.use(plugin) ⇒ [<code>Metalsmith</code>](#Metalsmith)
Add a `plugin` function to the stack.

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>plugin</td><td><code><a href="#Plugin">Plugin</a></code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
metalsmith
 .use(drafts())   // use the drafts plugin
 .use(markdown()) // use the markdown plugin
```
<a name="Metalsmith+directory"></a>

### metalsmith.directory([directory]) ⇒ <code>string</code> \| [<code>Metalsmith</code>](#Metalsmith)
Get or set the working `directory`.

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[directory]</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
new Metalsmith('.')                   // set the path of the working directory through the constructor
metalsmith.directory()                // returns '.'
metalsmith.directory('./other/path')  // set the path of the working directory
```
<a name="Metalsmith+metadata"></a>

### metalsmith.metadata([metadata]) ⇒ <code>Object</code> \| [<code>Metalsmith</code>](#Metalsmith)
Get or set the global `metadata`.

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[metadata]</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
metalsmith.metadata({ sitename: 'My blog' });  // set metadata
metalsmith.metadata()                          // returns { sitename: 'My blog' }
```
<a name="Metalsmith+source"></a>

### metalsmith.source([path]) ⇒ <code>string</code> \| [<code>Metalsmith</code>](#Metalsmith)
Get or set the source directory.

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[path]</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
metalsmith.source('./src');    // set source directory
metalsmith.source()            // returns './src'
```
<a name="Metalsmith+destination"></a>

### metalsmith.destination([path]) ⇒ <code>string</code> \| [<code>Metalsmith</code>](#Metalsmith)
Get or set the destination directory.

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[path]</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
metalsmith.destination('build'); // set destination
metalsmith.destination()         // returns 'build'
```
<a name="Metalsmith+concurrency"></a>

### metalsmith.concurrency([max]) ⇒ <code>number</code> \| [<code>Metalsmith</code>](#Metalsmith)
Get or set the maximum number of files to open at once.

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[max]</td><td><code>number</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
metalsmith.concurrency(20)   // set concurrency to max 20
metalsmith.concurrency()     // returns 20
```
<a name="Metalsmith+clean"></a>

### metalsmith.clean([clean]) ⇒ <code>boolean</code> \| [<code>Metalsmith</code>](#Metalsmith)
Get or set whether the destination directory will be removed before writing.

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[clean]</td><td><code>boolean</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
metalsmith.clean(true)  // clean the destination directory
metalsmith.clean()      // returns true
```
<a name="Metalsmith+frontmatter"></a>

### metalsmith.frontmatter([frontmatter]) ⇒ <code>boolean</code> \| [<code>Metalsmith</code>](#Metalsmith)
Optionally turn off frontmatter parsing or pass a [gray-matter options object](https://github.com/jonschlinkert/gray-matter/tree/4.0.2#option)

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[frontmatter]</td><td><code>boolean</code> | <code><a href="#GrayMatterOptions">GrayMatterOptions</a></code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
metalsmith.frontmatter(false)  // turn off front-matter parsing
metalsmith.frontmatter()       // returns false
metalsmith.frontmatter({ excerpt: true })
```
<a name="Metalsmith+ignore"></a>

### metalsmith.ignore([files]) ⇒ [<code>Metalsmith</code>](#Metalsmith) \| <code>Array.&lt;string&gt;</code>
Get or set the list of filepaths or glob patterns to ignore

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[files]</td><td><code>string</code> | <code>Array.&lt;string&gt;</code></td><td><p>The names or glob patterns of files or directories to ignore.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
metalsmith.ignore()                      // return a list of ignored file paths
metalsmith.ignore('layouts')             // ignore the layouts directory
metalsmith.ignore(['.*', 'data.json'])   // ignore dot files & a data file
```
<a name="Metalsmith+path"></a>

### metalsmith.path(...paths) ⇒ <code>string</code>
Resolve `paths` relative to the metalsmith `directory`.

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>...paths</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
metalsmith.path('./path','to/file.ext')
```
<a name="Metalsmith+match"></a>

### metalsmith.match(patterns \[, input \[,options]]) ⇒ <code>Array.&lt;string&gt;</code>
Match filepaths in the source directory by [glob](https://en.wikipedia.org/wiki/Glob_(programming)) pattern.
If `input` is not specified, patterns are matched against `Object.keys(files)`

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
**Returns**: <code>Array.&lt;string&gt;</code> - An array of matching file paths  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>patterns</td><td><code>string</code> | <code>Array.&lt;string&gt;</code></td><td><p>one or more glob patterns</p>
</td>
    </tr><tr>
    <td>[input]</td><td><code>Array.&lt;string&gt;</code></td><td><p>array of strings to match against</p>
</td>
    </tr><tr>
    <td>[value]</td><td><code>string</code> | <code>number</code> | <code>boolean</code></td><td><p>value of the environment variable</p>
</td>
    </tr>  </tbody>
</table>


<a name="Metalsmith+env"></a>

### metalsmith.env(\[vars \[, value]]) ⇒ <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Object</code> \| [<code>Metalsmith</code>](#Metalsmith)
Get or set one or multiple metalsmith environment variables. Metalsmith env vars are case-insensitive.

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[vars]</td><td><code>string</code> | <code>Object</code></td><td><p>name of the environment variable, or an object with <code>{ name: &#39;value&#39; }</code> pairs</p>
</td>
    </tr><tr>
    <td>[value]</td><td><code>string</code> | <code>number</code> | <code>boolean</code></td><td><p>value of the environment variable</p>
</td>
    </tr>  </tbody>
</table>

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
  ENV: 'development'
})
```
<a name="Metalsmith+debug"></a>

### metalsmith.debug(namespace) ⇒ [<code>Debugger</code>](#Debugger)
Create a new [debug](https://github.com/debug-js/debug#readme) debugger

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>namespace</td><td><code>string</code></td><td><p>Debugger namespace</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
function plugin(files, metalsmith) {
  const debug = metalsmith.debug('metalsmith-myplugin')
  debug('a debug log')    // logs 'metalsmith-myplugin a debug log'
  debug.warn('A warning') // logs 'metalsmith-myplugin:warn A warning'
}
```

<a name="Metalsmith+build"></a>

### metalsmith.build([callback]) ⇒ [<code>Promise.&lt;Files&gt;</code>](#Files)
Build with the current settings to the destination directory.

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
**Fulfills**: [<code>Files</code>](#Files)  
**Rejects**: <code>Error</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[callback]</td><td><code><a href="#BuildCallback">BuildCallback</a></code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
metalsmith.build(function(error, files) {
  if (error) throw error
  console.log('Build success!')
})
```
<a name="Metalsmith+process"></a>

### metalsmith.process([callback]) ⇒ [<code>Files</code>](#Files)
Process files through plugins without writing out files.

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[callback]</td><td><code><a href="#BuildCallback">BuildCallback</a></code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
metalsmith.process(err => {
  if (err) throw err
  console.log('Success')
  console.log(this.metadata())
})
```
<a name="Metalsmith+run"></a>

### metalsmith.run(files, plugins) ⇒ <code>Object</code>
Run a set of `files` through the plugins stack.

**Kind**: instance method of [<code>Metalsmith</code>](#Metalsmith)  
**Access**: package  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>files</td><td><code><a href="#Files">Files</a></code></td>
    </tr><tr>
    <td>plugins</td><td><code><a href="#Plugin">Array.&lt;Plugin&gt;</a></code></td>
    </tr>  </tbody>
</table>

<a name="Files"></a>

## Files : <code>Object.&lt;string, File&gt;</code>
Metalsmith representation of the files in `metalsmith.source()`.
The keys represent the file paths and the values are [File](#File) objects

**Kind**: global typedef  
<a name="File"></a>

## File
Metalsmith file. Defines `mode`, `stats` and `contents` properties by default, but may be altered by plugins

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>contents</td><td><code>Buffer</code></td><td><p>A NodeJS <a href="https://nodejs.org/api/buffer.html">buffer</a> that can be <code>.toString</code>&#39;ed to obtain its human-readable contents</p>
</td>
    </tr><tr>
    <td>stats</td><td><code>fs.Stats</code></td><td><p>A NodeJS <a href="https://nodejs.org/api/fs.html#fs_class_fs_stats">fs.Stats object</a> object with extra filesystem metadata and methods</p>
</td>
    </tr><tr>
    <td>mode</td><td><code>string</code></td><td><p>Octal permission mode, see <a href="https://en.wikipedia.org/wiki/File-system_permissions#Numeric_notation">https://en.wikipedia.org/wiki/File-system_permissions#Numeric_notation</a></p>
</td>
    </tr>  </tbody>
</table>

<a name="BuildCallback"></a>

## BuildCallback : <code>function</code>
A callback to run when the Metalsmith build is done

**Kind**: global typedef  
**this**: <code>{Metalsmith}</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[error]</td><td><code>Error</code></td>
    </tr><tr>
    <td>files</td><td><code><a href="#Files">Files</a></code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
function onBuildEnd(error, files) {
  if (error) throw error
  console.log('Build success')
}
```
<a name="DoneCallback"></a>

## DoneCallback : <code>function</code>
A callback to indicate that a plugin's work is done

**Kind**: global typedef  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[error]</td><td><code>Error</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
function plugin(files, metalsmith, done) {
  // ..do stuff
  done()
}
```
<a name="Plugin"></a>

## Plugin : <code>function</code>
A Metalsmith plugin is a function that is passed the file list, the metalsmith instance, and a `done` callback.
Calling the callback is required for asynchronous plugins, and optional for synchronous plugins.

**Kind**: global typedef
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>files</td><td><code><a href="#Files">Files</a></code></td>
    </tr><tr>
    <td>metalsmith</td><td><code><a href="#Metalsmith">Metalsmith</a></code></td>
    </tr><tr>
    <td>done</td><td><code><a href="#DoneCallback">DoneCallback</a></code></td>
    </tr>  </tbody>
</table>

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

## Debugger : <code>function</code>
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
