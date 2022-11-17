---
title: Usage guide
description: 'Using metalsmith.js: basics, using plugins, rendering content, debugging'
toc: true
order: 2
layout: default.njk
sitemap:
  priority: 0.7
  lastmod: 2022-11-16
config:
  anchors: true
---
{% include "./lib/views/partials/doc-mdlinks.njk" %}
{% from "./lib/views/partials/replit.njk" import "replit" %}

## The Metalsmith directory

The Metalsmith constructor takes a working directory as single argument (in 99% of cases the parent directory of `metalsmith.js`). With ES modules there are 2 extra lines of code.

{% codetabs ["ES module","CommonJS"] %}
{% codeblock "metalsmith.mjs" %}
```js
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import Metalsmith from 'metalsmith'

const __dirname =  dirname(fileURLToPath(import.meta.url))

Metalsmith(__dirname)
```
{% endcodeblock %}
{% codeblock "metalsmith.cjs" %}
```js
const Metalsmith = require('metalsmith')

Metalsmith(__dirname)
```
{% endcodeblock %}
{% endcodetabs %}

If you are using the CLI with a `metalsmith.json` config file, there is no need to specify [`metalsmith.directory`][api_method_directory] explicitly, it will default to `__dirname`.


## Using plugins

A metalsmith plugin is just a function that is passed the [Files][api_files] object and the [Metalsmith][api_metalsmith] instance. In fact, we can even use `console.log` as a plugin!

{% codetabs ["API","CLI"] %}
{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith')

Metalsmith(__dirname)
  .use(console.log)
  .build((err, files) => {
    if (err) throw err
    console.log('Build success!')
  })
```
{% endcodeblock %}
{% codeblock "metalsmith.json" %}
```json
{
  "plugins": [
    {"./plugin-console-log": true}
  ]
}
```
{% endcodeblock %}
{% endcodetabs %}

*Note that for this example to work if you are using the CLI, you need to create a file `plugin-console-log.js` with the contents `module.exports = (...args) => console.log(...args)` and reference it as a local plugin in `metalsmith.json` 

This is super-convenient when you want to quickly have a look at all the files and the metalsmith instance. You could use this little plugin to inspect how the file metadata and the metalsmith instance change in-between plugins:

{% codetabs ["API","CLI"] %}
{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith')
const drafts = require('@metalsmith/drafts')
const markdown = require('@metalsmith/markdown')
const layouts = require('@metalsmith/layouts')

Metalsmith(__dirname)
  .use(console.log)
  .use(drafts())
  .use(console.log)
  .use(markdown())
  .use(console.log)
  .use(layouts())
  .use(console.log)
  .build((err, files) => {
    if (err) throw err
    console.log('Build success!')
  })
```
{% endcodeblock %}
{% codeblock "metalsmith.json" %}
```json
{
  "plugins": [
    {"./plugin-console-log": true},
    {"@metalsmith/drafts": {}},
    {"./plugin-console-log": true},
    {"@metalsmith/markdown": {}},
    {"./plugin-console-log": true},
    {"@metalsmith/layouts": { "pattern": "**/*.html" }},
    {"./plugin-console-log": true},
  ]
}
```
{% endcodeblock %}
{% endcodetabs %}

This example also demonstrates that you can re-use the same plugin multiple times across the plugin chain, each time with different input.

Logging is cool, but what about actually manipulating the files? 
Say, defining additional metadata, rendering markdown files, wrapping them in a layout, adding SASS stylesheets, and optimizing everything for production.
Just as the [Apple iPhone's famous 2009 commercial](https://www.youtube.com/watch?v=szrsfeyLzyg) "There's an app for that", the answer to *how can I do X with Metalsmith?* is - there's a plugin for that. Browse the [official plugin registry](/plugins) for inspiration!

### Plugin types

Plugins can be broadly divided into a few categories:esbuildesbuild

* **Development plugins**: plugins that provide a better developer experience or debug information.  
Examples are: [metalsmith-express][plugin_express], [metalsmith-writemetadata][plugin_writemetadata], [metalsmith-debug-ui][plugin_debug-ui]
* **Metadata plugins**: plugins that add or modify file and global metadata.  
Examples are: [@metalsmith/excerpts][core_plugin_excerpts], [@metalsmith/table-of-contents][core_plugin_table-of-contents], [@metalsmith/default-values][core_plugin_default-values]
* **Rendering plugins**: plugins that render or alter a file's `contents`.  
Examples are: [@metalsmith/layouts][core_plugin_layouts], [@metalsmith/in-place][core_plugin_in-place], [@metalsmith/markdown][core_plugin_markdown]
* **Files-tree manipulating plugins**: plugins that add, move or remove files from the files object.  
Examples are: [@metalsmith/permalinks][core_plugin_permalinks], [@metalsmith/remove][core_plugin_remove], [@metalsmith/drafts][core_plugin_drafts], metalsmith-sitemap
* **Third-party integrations**: plugins that hook third-party tools into the metalsmith build.  
Examples are [@metalsmith/sass][core_plugin_sass], [@metalsmith/postcss][core_plugin_postcss], [@metalsmith/js-bundle][core_plugin_js-bundle], [metalsmith-uglify][plugin_uglify]

A plugin could fit into multiple categories: 

Plugins that start with the `@metalsmith/`  prefix are *core plugins*. They are officially supported by Metalsmith and there's a good chance that you will need most of them when building a static site. Here are some of the most common ones: 

* `@metalsmith/sass`: use sass or scss files for styling
* `@metalsmith/drafts`: mark files as `draft: true` to preview them in development mode, but remove them in production
* `@metalsmith/markdown`: convert markdown files & metadata keys to html
* `@metalsmith/collections`: group files by frontmatter key or pattern into collections
* `@metalsmith/layouts`: wrap files in layouts in the templating language of your choice (a.o. Pug, Nunjucks, Handlebars, Twig, Ejs)

### Plugin order

Plugin order is very important in Metalsmith. As a rule of thumb, `.use(common sense)`: you only want to minify HTML after the markdown file has been processed with `@metalsmith/markdown` and then wrapped in `@metalsmith/layouts`. Generally, you want plugins that inject new files or add metadata to be run at the start of the plugin chain so it is available in layouts and for other plugins to process. `@metalsmith/drafts` is efficient as the first plugin because in a production build it immediately removes the files you don't want to process anyway. 

### Conditionally running plugins

If you're using the Metalsmith CLI, there's only one way to run plugins conditionally: create multiple `metalsmith.json` configs. The common use case is having a development config and a production config. For example, we would like to remove *draft* files and *minify the HTML* only in production:

{% codetabs ["DEV","PROD"] %}
{% codeblock "metalsmith.dev.json" %}
```json
{
  "plugins": [
    { "@metalsmith/markdown": { } },
    { "@metalsmith/layouts": { } }
  ]
}
```
{% endcodeblock %}
{% codeblock "metalsmith.json" %}
```json
{
  "plugins": [
    { "@metalsmith/drafts": { } },
    { "@metalsmith/markdown": { } },
    { "@metalsmith/layouts": { } },
    { "metalsmith-html-minifier": { } }
  ]
}
```
{% endcodeblock %}
{% endcodetabs %}

And run it with:

{% codetabs ["DEV","PROD"] %}
{% codeblock %}
```bash
metalsmith --config metalsmith.dev.json
```
{% endcodeblock %}
{% codeblock %}
```bash
metalsmith --config metalsmith.json
```
{% endcodeblock %}
{% endcodetabs %}

If you have more than 2-3 conditions we recommend using the JS API.
You can run a plugin conditionally by assigning the metalsmith build to a variable, and using native javascript `if` statements. The same example from above  using the JS API:

{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith');
const minifyHTML = require('metalsmith-html-minifier');
const isProduction = process.env.NODE_ENV !== 'development';

const metalsmith = Metalsmith(__dirname);
if (isProduction) {
  metalsmith.use(minifyHTML());
}
metalsmith.build(err => {
  if (err) throw err
  console.log('Build success!')
})
```
{% endcodeblock %}

If you need to check multiple conditions at different places in the build, the [metalsmith-if plugin][plugin_if] might be a better match:

{% codeblock "metalsmith.js" %}
```js
const when = require('metalsmith-if');
const minifyHTML = require('metalsmith-html-minifier');
const production = process.env.NODE_ENV !== 'development';

Metalsmith(__dirname)
  .use(when(production, minifyHTML())
  .build(err => {
    if (err) throw err
    console.log('Build success!')
  })
```
{% endcodeblock %}

## Defining metadata

You can define *global metadata* for a Metalsmith build using the [`metalsmith.metadata`][api_method_metadata] method:

{% codetabs ["API","CLI"] %}
{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith')

Metalsmith(__dirname)
  .metadata({
    sitename: 'My Static Site & Blog',
    description: 'It\'s about saying »Hello« to the World.',
    generator: 'Metalsmith',
    url: 'https://metalsmith.io/'
  })
```
{% endcodeblock %}
{% codeblock "metalsmith.json" %}
```json
{
  "metadata": {
    "sitename": "My Static Site & Blog",
    "description": "It's about saying »Hello« to the World.",
    "generator": "Metalsmith",
    "url": "https://metalsmith.io/"
  }
}
```
{% endcodeblock %}
{% endcodetabs %}

Global metadata can be dynamically added from files in [`metalsmith.directory`][api_method_directory] or [`metalsmith.source`][api_method_source] with a plugin like [`@metalsmith/metadata`][core_plugin_metadata], which can help keep your main build file clean. Here is the same metadata in a separate yaml file:

{% codeblock "src/site.yaml" %}
```yaml
sitename: My Static Site & Blog
description: It's about saying »Hello« to the World.
generator: Metalsmith
url: 'https://metalsmith.io/'
```
{% endcodeblock %}

...that we can then refer to in the build like:

{% codetabs ["API","CLI"] %}
{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith')
const metadata = require('@metalsmith/metadata')

Metalsmith(__dirname)
  .use(metadata({
    site: 'src/site.yaml'
  }))
```
{% endcodeblock %}
{% codeblock "metalsmith.json" %}
```json
{
  "plugins": [
    { "@metalsmith/metadata": { "site": "src/site.yaml" } }
  ]
}
```
{% endcodeblock %}
{% endcodetabs %}

*File metadata* [can be defined as front-matter][docs_frontmatter] in any file (provided that you didn't disable it with [`metalsmith.frontmatter(false)`][api_method_frontmatter]):

```yaml
---
title: My first post went a little like this
description: A turn, an ending, and a twist
---
No more drafts and no more waiting
```

File metadata can be added dynamicaly with plugins like [@metalsmith/default-values][core_plugin_default-values] or [metalsmith-filemetadata][plugin_filemetadata]. Below is an example using `@metalsmith/default-values` to automatically assign the `post.hbs` layout to files by folder and mark all files in the `drafts` folder as draft:

{% codetabs ["API","CLI"] %}
{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith')
const defaultValues = require('@metalsmith/default-values')
const drafts = require('@metalsmith/drafts')
const markdown = require('@metalsmith/markdown')
const layouts = require('@metalsmith/layouts')

Metalsmith(__dirname)
  .use(defaultValues([
    {
      pattern: 'posts/**/*.md',
      defaults: {
        layout: 'post.hbs'
      }
    },
    {
      pattern: 'drafts/**',
      defaults: { draft: true }
    }
  ]))
  .use(process.env.NODE_ENV === 'production' ? drafts() : () => {})
  .use(markdown())
  .use(layouts())
  .build((err, files) => {
    if (err) throw err
    console.log('Build success')
  })
```
{% endcodeblock %}
{% codeblock "metalsmith.dev.json" %}
```json
{
  "plugins": [
    {
      "@metalsmith/default-values": [
        { "pattern": "posts/**/*.md", defaults: { "layout": "post.hbs" }},
        { "pattern": "drafts/**", defaults: { "draft": true }},
      ] 
    },
    { "@metalsmith/drafts": {} },
    { "@metalsmith/markdown": {} },
    { "@metalsmith/layouts": {} }
  ]
}
```
{% endcodeblock %}
{% endcodetabs %}

## Rendering content

There are a multitude of plugins which can be used to render content. For rendering markdown contents and file metadata keys, there is [@metalsmith/markdown][core_plugin_markdown]. [@metalsmith/layouts][core_plugin_layouts] combined with a [jstransformer](https://github.com/jstransformers/) wraps content in layouts, and [@metalsmith/in-place][core_plugin_in-place] is useful if you need to use a templating language within a file's contents (for example within markdown files).

There are also other rendering plugins like [metalsmith-twig][plugin_twig] or [metalsmith-handlebars-x][plugin_handlebarsx] that provide full integrations for specific templating languages.

{# WIP
{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith')
const layouts = require('@metalsmith/layouts')
const markdown = require('@metalsmith/markdown')
const permalinks = require('@metalsmith/permalinks')

Metalsmith(__dirname)
  .frontmatter({ excerpt: true })
  .metadata({
    sitename: "My Static Site & Blog",
    siteurl: "https://example.com/",
    description: "It's about saying »Hello« to the world."
  })
  .use(markdown())
  .use(inplace({ pattern: '**/*.html' }))
  .use(permalinks({ relative: false }))
  .use(layouts({ pattern: '**/*.html' }))
  .build(function(err, files) {
    if (err) throw err
    console.log('Build success!')
  })
```
{% endcodeblock %}
{% codeblock %}
```plaintext
---
title: 
layout: home.njk
---
This excerpt is enabled thanks to metalsmith.frontmatter({ excerpt: true })!
---


```
{% endcodeblock %}

{% codetabs ["layouts/home.njk","src/index.njk.md"] %}
{% codeblock %}
{% raw %}
```django
<h1>{{ title }}</h1>
<p>{{ description | safe }}</p>
<ul>
{% for post in collections.posts %}
  <li>
    <a href="/{{ post.permalink }}">{{ post.title }}</a>
    <p>{{ post.excerpt | safe }}</p>
  </li>
{% endfor %}
</ul>
```
{% endraw %}
{% endcodeblock %}
{% codeblock %}
{% raw %}
```erb
<h1><%= title %></h1>
```
{% endraw %}
{% endcodeblock %}
{% endcodetabs %}
#}

{# WIP #}
{#
### Handling URL's

## Optimizing performance
### Splitting the build

#}


## Using the Metalsmith environment

Since version 2.5.0, Metalsmith has its own [`Metalsmith.env`][api_method_env] method. Metalsmith plugins can read and use conventional variables to set more sensible defaults. A few notable conventions are `NODE_ENV`, `DEBUG` and `TZ`:

{% codetabs ["API","CLI"] %}
{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith')
Metalsmith(__dirname)
  .env({
    DEBUG: true,
    NODE_ENV: 'development',
    TZ: 'Europe/London',
  })
```
{% endcodeblock %}
{% codeblock "metalsmith.json" %}
```json
{
  "env": {
    "DEBUG": true,
    "NODE_ENV": "development",
    "TZ": "Europe/London",
  }
}
```
{% endcodeblock %}
{% endcodetabs %}

The [@metalsmith/sass plugin][core_plugin_sass] for example will output [source maps](https://css-tricks.com/should-i-use-source-maps-in-production/) and skip minifying the resulting CSS if `metalsmith.env('NODE_ENV') === 'development'` (to minimize build time and maximize ability to debug).

## Debugging

Most Metalsmith plugins use the [debug package][lib_debug] for logging and debugging.
You can enable targeted or global debugging to get a better idea of what your metalsmith plugin chain is doing.
Since version 2.5.0, debugging in metalsmith can be enabled by passing a debug value to [`metalsmith.env`][api_method_env] like so:

{% codetabs ["API","CLI"] %}
{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith')
Metalalsmith(__dirname)
  .env('DEBUG', true)
```
{% endcodeblock %}
{% codeblock "metalsmith.dev.json" %}
```json
{
  "env": {
    "DEBUG": true
  }
}
```
{% endcodeblock %}
{% endcodetabs %}

The previous example sets `DEBUG: true` which is the same as the globstar wildcard `*`, meaning _debug all_. If you wanted to debug a specific plugin, say `@metalsmith/markdown`, you would set `metalsmith.env('DEBUG', '@metalsmith/markdown')`.

### Using the DEBUG environment variable

Older plugins released prior to Metalsmith 2.5.0 often use the [debug][lib_debug] package directly: these can only be controlled by the `DEBUG` (operating system-level) environment variable. To get those logs to conform the best solution is to pass `process.env.DEBUG` to metalsmith:

{% codetabs ["API","CLI"] %}
{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith')
Metalalsmith(__dirname)
  .env('DEBUG', process.env.DEBUG)
```
{% endcodeblock %}
{% codeblock "metalsmith.json" %}
```json
{
  "env": {
    "DEBUG": "$DEBUG"
  }
}
```
{% endcodeblock %}
{% endcodetabs %}

You can choose the DEBUG value every time you run a metalsmith build, for example:

{% codetabs ["Mac/Linux","Windows"] %}
{% codeblock %}
```bash
DEBUG=* node metalsmith.js
```
{% endcodeblock %}
{% codeblock %}
```dos
set DEBUG=* node metalsmith.js
```
{% endcodeblock %}
{% endcodetabs %}

<p class="Note Note--tip">To avoid having to mess with Mac/Linux vs Windows syntax, use the <a href="https://github.com/kentcdodds/cross-env#readme">cross-env NPM package</a>: <code>cross-env DEBUG=* node metalsmith.js</code>
</p>

### Debug values

The list below shows the different types of values you could choose to pass to debug:

* `false`,`''`: debug off
* `true`,`*`: debug all (including dependencies used by metalsmith plugins!)
* `@metalsmith/*`: debug core plugins only
* `metalsmith-*`: debug third-party plugins only
* `metalsmith-<pluginName>`: debug a specific third-party plugin
* `@metalsmith/*,metalsmith-*`: debug all metalsmith plugins
* `@metalsmith/*:warn`: debug only the warnings channel of metalsmith core plugins

### Storing debug logs in a file

You can choose to store debug logs in a file instead of logging them to the console by specifying `metalsmith.env('DEBUG_LOG', 'path/relative/to/ms/dir.log')`. Note that this will affect only plugins using [`metalsmith.debug`][api_method_debug].

{% codetabs ["API","CLI"] %}
{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith')
Metalalsmith(__dirname)
  .env('DEBUG', process.env.DEBUG)
  .env('DEBUG_LOG', 'metalsmith.log')
```
{% endcodeblock %}
{% codeblock "metalsmith.json" %}
```json
{
  "env": {
    "DEBUG": "$DEBUG",
    "DEBUG_LOG": "metalsmith.log"
  }
}
```
{% endcodeblock %}
{% endcodetabs %}

<p class="Note Note--tip">The log can only be output <em>either to console, or a log file</em>. Therefore enabling <code>DEBUG_LOG</code> is more suitable for server environments with file system persistence, or if you want to git version the build log or store it as a <abbr title="Continuous integration">CI</abbr> artifact.</p>

### Adding your own debug logs

You can use [`metalsmith.debug`][api_method_debug] for your own build logs as well. The method returns a [debugger with 3 channels][api_member_debugger] with their own colors: info (cyan), warn (orange), and error (red). Make sure to enable `DEBUG` through [`metalsmith.env`][api_method_env] before logging your first log. Run the example below with `DEBUG=build* node metalsmith.js` (prefix with `SET` for Windows):

{% codeblock "metalsmith.js" %}
```js
const metalsmith = Metalsmith(__dirname)
const markdown = require('@metalsmith/markdown')
const layouts = require('@metalsmith/layouts')
const debug = metalsmith.debug('build')
const timeStart = performance.now()

function logFilesAfter(step) {
  return (files) => {
    debug.info('File list after %s: %O', step, Object.keys(files))
  }
}

metalsmith
  .env('DEBUG', process.env.DEBUG)
  .use(() => {
    debug('Starting')        // logs "build Starting" in gray

    debug.warn('An info')    // logs "build:info  An info" in cyan
    debug.info('A warning')  // logs "build:warn  A warning" in orange
    debug.error('An error')  // logs "build:error  An error" in red
  })
  .use(logFilesAfter('start'))
  .use(markdown())
  .use(logFilesAfter('markdown'))
  .use(layouts())
  .use(logFilesAfter('layouts'))
  .build(err => {
    if (err) throw err
    const timeEnd = performance.now()
    debug.info('Build successful after %s seconds', (timeEnd - timeStart) / 1000)
  })
```
{% endcodeblock %}

Placeholders like `%O` (object, multi-line) and `%s` (string) can be used as in the example, see [debug formatters](https://github.com/debug-js/debug#formatters). The metalsmith debugger also adds a `%b` formatter for Node buffers, which is ideal for logging file `contents`: it will log the first 250 characters of text files followed by `...` not to clutter your console.
Happy debugging!


<p class="Note Note--tip">You can enable the metalsmith debugger to log outside the metalsmith build by running <code>metalsmith.debug.enable('*')</code> first.</p>