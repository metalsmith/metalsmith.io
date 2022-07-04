---
title: Usage guide
description: 'Using metalsmith.js: basics, using plugins, rendering content, '
toc: true
order: 2
layout: default.njk
sitemap:
  priority: 0.7
  lastmod: 2022-05-17
config:
  anchors: true
---
{% include "./lib/views/partials/doc-mdlinks.njk" %}
{% from "./lib/views/partials/replit.njk" import "replit" %}

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

There is no official plugin type classification, but plugins can be broadly divided into a few categories:

* **Development plugins**: plugins that provide a better developer experience or debug information. Examples are: [metalsmith-express][plugin_express], [metalsmith-writemetadata][plugin_writemetadata], [metalsmith-debug-ui][plugin_debug-ui]
* **Metadata plugins**: plugins that add or modify file and global metadata. Examples are: [core_plugin_excerpts][@metalsmith/excerpts], [@metalsmith/table-of-contents][core_plugin_table-of-contents], [@metalsmith/default-values][core_plugin_default-values]
* **Rendering plugins**: plugins that render or alter a file's `contents`. Examples are: @metalsmith/layouts, [@metalsmith/in-place][core_plugin_in-place], [@metalsmith/markdown][core_plugin_markdown]
* **Files-tree manipulating plugins**: plugins that add, move or remove files from the files object. Examples are: [@metalsmith/permalinks][core_plugin_permalinks], [@metalsmith/remove][core_plugin_remove], [@metalsmith/drafts][core_plugin_drafts], metalsmith-sitemap
* **Third-party integrations**: plugins that hook third-party tools into the metalsmith build. Examples are [@metalsmith/sass][core_plugin_sass], [@metalsmith/postcss][core_plugin_postcss] metalsmith-uglify

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
    { "@metalsmith/markdown": { } },
    { "@metalsmith/drafts": { } },
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

{# WIP #}
{#
## Rendering content

There are a multitude of plugins which can be used to render content. For rendering markdown contents and file metadata keys, there is [@metalsmith/markdown][core_plugin_markdown]. [@metalsmith/layouts][core_plugin_layouts] combined with a [jstransformer](https://github.com/jstransformers/) wraps content in layouts, and [@metalsmith/in-place][core_plugin_in-place] is useful if you need to use a templating language within a file's contents (for example in-between markdown). Below is a basic example of a full setup using all of these together:

{% codeblock "metalsmith.js" %}
```js
const Metalsmith = require('metalsmith')
const layouts = require('@metalsmith/layouts')
const markdown = require('@metalsmith/markdown')

Metalsmith(__dirname)
  .use(markdown())
  .use(inplace())
  .use(layouts())
  .build(function(err, files) {
    if (err) throw err
    console.log('Build success!')
  })
```
{% endcodeblock %}

There are also other rendering plugins like [metalsmith-twig][plugin_twig] or [metalsmith-handlebars-x][plugin_handlebarsx] that provide full integrations for specific templating languages.
#}

{# WIP #}
{#
### Handling URL's

## Optimizing performance
### Splitting the build
#}