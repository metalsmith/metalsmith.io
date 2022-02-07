---
title: Documentation
description: Metalsmith.js documentation
slug: docs
draft: true
toc: true
layout: default.njk
config:
  anchors: true
---

[api_file]: /api/#File
[api_files]: /api/#Files
[api_metalsmith]: /api/#Metalsmith
[nodejs_buffer]: https://nodejs.org/api/buffer.html
[file_mode]: https://en.wikipedia.org/wiki/File-system_permissions#Numeric_notation
[plugin_debug-ui]: https://github.com/leviwheatcroft/metalsmith-debug-ui
[plugin_if]: https://github.com/deltamualpha/metalsmith-if
[plugin_html-minifier]: https://github.com/whymarrh/metalsmith-html-minifier
[plugin_branch]: https://github.com/ericgj/metalsmith-branch
[plugin_env]: https://github.com/kalamuna/metalsmith-env
[plugin_wordcount]: https://github.com/majodev/metalsmith-word-count
[plugin_brokenlinks]: https://github.com/davidxmoody/metalsmith-broken-link-checker
[plugin_writemetadata]: https://github.com/Waxolunist/metalsmith-writemetadata
[plugin_injectmetadata]: https://github.com/davidtimmons/metalsmith-inject-metadata
[plugin_filemetadata]: https://github.com/dpobel/metalsmith-filemetadata
[plugin_dirmetadata]: https://github.com/fephil/metalsmith-metadata-directory
[core_plugin_default-values]: https://github.com/metalsmith/default-values
[core_plugin_layouts]: https://github.com/metalsmith/layouts
[core_plugin_in-place]: https://github.com/metalsmith/in-place
[core_plugin_collections]: https://github.com/metalsmith/collections
[core_plugin_markdown]: https://github.com/metalsmith/markdown
[core_plugin_permalinks]: https://github.com/metalsmith/permalinks
[core_plugin_excerpts]: https://github.com/metalsmith/excerpts
[core_plugin_drafts]: https://github.com/metalsmith/drafts
[core_plugin_remove]: https://github.com/metalsmith/remove
[core_plugin_sass]: https://github.com/metalsmith/sass
[nvm]: /TODO
[nvs]: /TODO

## Introduction

### What is Metalsmith?

Metalsmith is an extremely simple, pluggable static-site generator for NodeJS. 
Let's break that down:

#### Metalsmith is a static site generator

The task of a static site generator is to produce static files that can be deployed to a web server. Usually the format of the files we want to publish or serve (output) doesn't match the format that is pleasant and efficient to work with (input). Case in point: markdown vs HTML. For a static site generator this means:

1. from a source directory, read the source files and extract their information
2. manipulate the information
3. write the manipulated information to files into a destination directory

Metalsmith is built on this reasoning. It takes the information from the source files from a source directory and it writes the manipulated information to files into a destination directory.

#### Metalsmith is pluggable

Metalsmith leaves all manipulations exclusively to plugins.

Manipulations could be anything: translating templates, transpiling code, replacing variables, wrapping layouts around content, grouping files, moving and removing files and so on. This is why we say *Everything is a Plugin*. And of course, several manipulations can be applied one after another, or *chained* or *piped*, if you prefer. Obviously, in a chain [plugin order matters]().

#### Metalsmith is extremely simple

1. When all manipulations are performed by plugins, the only thing Metalsmith has to do in its core is to provide for an underlying logic of how manipulations are dealt with and a defined interface for the plugins. To achieve this, we only needed a single file &mdash; have a [look at the source yourself](https://github.com/metalsmith/metalsmith/blob/master/lib/index.js). 
2. For manipulations Metalsmith uses a clever, but extremely simple idea. All source files are initially converted into JavaScript objects with the usual `{property: property value}` pairs. These `{property: property value}` pairs contain information on the original file (such as its `mode` or `stats`) and on its `content`. Th)e Javascript object for each file is then supplemented with all variables specified in the front-matter of the file or supplied via plugins. Manipulations performed by the plugins are just modifications applied to the Javascript objects either by changing the properties or the property values.
3. Breaking down Metalsmith into a core and many plugins has several advantages. It reduces complexity. It gives the user the freedom to use *exactly and only* those plugins he or she needs. Furthermore, it distributes the honor and the burden of maintaining the Metalsmith core and its plugins onto the Metalsmith community. This Linux-inspired approach keeps the Metalsmith ecosystem self-sustained.
4. Writing plugins in itself is also dead simple. The plugin interface is easy to understand. A plugin can literally be a function with a single line of code.
5. Every site needs JavaScript anyway. Just like the popular task runners [gulp](http://gulpjs.com/) or [grunt](http://gruntjs.com/) Metalsmith is programmed in javascript. No need to rely on an extra language such as Ruby, Python or Go. You only need a single binary, Node.

#### Metalsmith is more

Since all manipulations are done by plugins, Metalsmith is actually *much more* than a static site generator. It is a lightweight filesystem abstraction, which could come in handy for all kinds of CLI tools and generators. And last but not least:  Metalsmith works on all OS'es, and is battle &mdash;and thoroughly unit&mdash; tested.

### Philosophy

Metalsmith borrows heavily from the Linux philosophy.

## Getting started

### Prerequisites

You need to [download NodeJs](https://nodejs.org/en/download/) and install it first. That's the only dependency. 
If you plan to publish plugins, it is recommended that you use [nvm][nvm] or [nvs][nvs] (for Windows)

Don't forget to add `node_modules/.bin` to the `PATH` variable:

* on Windows, hit the Windows key and search for *Edit environment variables*, then add a `node_modules\\.bin` line to the `PATH` variable
* on Linux/Mac, add `PATH=node_modules/.bin;$PATH` to your `~/.bashrc` or `~/.bash_profile` file, then `source` it.

Metalsmith builds are tested on both Linux & Windows systems. 

### Installation

Metalsmith and its plugins can be installed with npm or Yarn: 

{% codetabs ["npm","Yarn","pnpm"] %}
{% codeblock %}
```bash
npm install metalsmith
```
{% endcodeblock %}
{% codeblock %}
```bash
yarn add metalsmith
```
{% endcodeblock %}
{% codeblock %}
```bash
pnpm add metalsmith
```
{% endcodeblock %}
{% endcodetabs %}

If you would like to use Typescript in your build file, be sure to install [`@types/metalsmith`](https://npmjs.com/package/@types/metalsmith) as well.

### Quickstart

 
{% codetabs ["API","CLI"] %}
{% codeblock "metalsmith.js" %}
```js
const Metalsmith  = require('metalsmith')
const collections = require('@metalsmith/collections')
const layouts     = require('@metalsmith/layouts')
const markdown    = require('@metalsmith/markdown')
const permalinks  = require('@metalsmith/permalinks')

const isDev = process.env.NODE_ENV === 'development'
const siteUrl = isDev ? 'http://localhost:3000' : 'https://johndoe.com'

Metalsmith(__dirname)         // __dirname defined by node.js:
                              // name of the directory of this file
  .metadata({                 // add any variable you want
                              // use them in layout-files
    sitename: "My Static Site & Blog",
    siteurl: "http://example.com/",
    description: "It's about saying »Hello« to the world.",
    generatorname: "Metalsmith",
    generatorurl: "http://metalsmith.io/"
  })
  .source('./src')            // source directory
  .destination('./build')     // destination directory
  .clean(true)                // empty the destination before
  .use(collections({          // group all blog posts by internally
    posts: 'posts/*.md'       // adding key 'collections':'posts'
  }))                         // use `collections.posts` in layouts
  .use(markdown())            // transpile all md into html
  .use(permalinks({           // change URLs to permalink URLs
    relative: false           // put css only in /css
  }))
  .use(layouts())             // wrap layouts around html
  .build(function(err) {      // do something when the build finishes
    if (err) throw err;       // error handling is required
  });
```
{% endcodeblock %}
{% codeblock "metalsmith.json" %}
```json
{
  "metadata": {
    "sitename": "My Static Site & Blog",
    "siteurl": "http://example.com/",
    "description": "It's about saying »Hello« to the world.",
    "generatorname": "Metalsmith",
    "generatorurl": "http://metalsmith.io/"
  },
  "source": "./src",
  "destination": "./build",
  "clean": true,
  "plugins": [
    { "@metalsmith/collections": { "posts": "posts/*.md" } },
    { "@metalsmith/markdown": {} },
    { "@metalsmith/permalinks": { "relative": false } },
    { "@metalsmith/layouts": {} }
  ]
}
```
{% endcodeblock %}
{% endcodetabs %}



### Directory structure

The typical directory structure for a metalsmith (static-site) project looks more or less like this:

```txt
repo
├── metalsmith.js
├── package.json
├── node_modules
├── build
├── layouts
│   ├── default.hbs
│   └── post.hbs
├── lib
│   └── sass
│   │   └── style.scss
│   ├── data
│   │   └── nav.json
│   └── plugins
│       └── local-metalsmith-plugin.js
└── src
    ├── about.md
    ├── index.md
    └── posts
        ├── first-post.md
        └── second-post.md
```

where:

* `repo` is your `metalsmith.directory()` &mdash; the root of the project, with all dependencies, config files, etc.
* `src` is your `metalsmith.source()` &mdash; it contains the *contents* that metalsmith needs to process and output to `build`
* `build` is your `metalsmith.destination()` &mdash; it is created dynamically when you first run `metalsmith.build`
* `lib` is for all the rest (for example local metalsmith plugins, Sass styles that are processed outside of metalsmith and added to the build, or metadata that is manually `require()`'d)

...but Metalsmith gives you total freedom about how you want to structure your project, so feel free to restructure things as you see fit.
Check out the [nodejs.org website](https://github.com/nodejs/nodejs.org) that is built with metalsmith for inspiration.

## Concepts

There are only a few core concepts you need to be familiar with to understand how to work with Metalsmith, and if you've worked with another static site generator or run some commands in a terminal like `git add` or `ls -la`, you are probably already familiar with most of them.

### Files

Everyone has worked with files before. They have a name, a path, an extension, contents and metadata (like the last modified date).  Metalsmith represents every file in the source directory as a javascript [File][api_file] object. For instance,

`src/post/my-file.md:`

```markdown
---
title: A Catchy Title
draft: false
---

An unfinished article...
```

...becomes

```javascript
{
  'post/my-file.md': {
    title: 'A Catchy Title',
    draft: false,
    contents: 'An unfinished article...',
    mode: '0664',
    stats: {
      /* keys with information on the file */
    }    
  }
}
```

...where the content of the file is always mapped to the property value of `contents`. For illustration purposes only we display the value of `contents` as a string. Technically, the property value of `contents` is mapped as a [NodeJS `Buffer`][nodejs_buffer] , which can also handle binary data (for images, PDF's, etc). `mode` contains the file [permission bit][file_mode] and `stats` has more technical information on the file such as `size` or `birthtime`. The file is also parsed for [YAML front matter](#front-matter), which is merged into the [File][api_file] object. Thus, we finally have a javascript [Files][api_files] object of objects. 

```javascript
{
  'relative_to_sourcepath/file1.md': {
    title: 'A Catchy Title',
    draft: false,
    contents: 'An unfinished article...',
    mode: '0664',
    stats: {
      /* keys with information on the file */
    }    
  },
  'relative_to_sourcepath/file2.md': {
    title: 'An Even Better Title',
    draft: false,
    contents: 'One more unfinished article...',
    mode: '0664',
    stats: {
      /* keys with information on the file */
    }    
  }
}
```

Plugins can then manipulate the javascript [File][api_file] objects representing the original files however they want, and [writing a plugin](#writing-a-plugin) is super simple.

### Front matter

To attach metadata to a JS [File][api_file] object, metalsmith reads front matter. *Front matter* is a term borrowed from the publishing industry meaning metadata about a written work. In Metalsmith this is a [YAML](https://linuxhandbook.com/yaml-basics/) document section (delineated by `---`) containing metadata (*matter*) at the top (*front*) of a file (commonly, markdown). Metalsmith will recognize and read the front matter of a file and add it as metadata to the JS file representation when you run the build. Here is a typical example of an `index.md` file with YAML front-matter:

```md
---
title: Hello World
keywords:
  - hello
  - world
draft: false
---
Welcome to my blog
```

If you don't like the YAML syntax you can use JSON front matter as well:

```
---
{
  "title": "Hello World",
  "keywords": ["hello","world"],
  "draft": false
}
---
Welcome to my blog
```

The front-matter will be parsed by Metalsmith as:

```js
{
  title: 'Hello World',
  keywords: ['hello','world'],
  draft: false,
  contents: <Buffer>,
  mode: '0644',
  stats: { ... }
}
```

When the front matter is read into javascript, we refer to it as *file metadata*.

#### Multi-line strings

A common requirement is to write multi-line strings in YAML, either for readability or for output. There are a lot of ways to write [multiline strings in YAML](https://stackoverflow.com/questions/3790454/how-do-i-break-a-string-in-yaml-over-multiple-lines). Examples of the two most common ones are shown here:

* Using the greater than sign `>` (removing line breaks)

  ```yaml
  description: >
    This is a long text string,
    but we actually only want the line breaks for readability in the source.
    The line breaks will be removed in the output.
  ```

* Using the pipe sign `|` (preserving line breaks)

  ```yaml
  description: |
    This is a long text string.
    It should read like a poem
    So we want to preserve the line breaks.
  
  ```

### The plugin chain

We believe that understanding the internal representation of files as JavaScript objects is really key to fully grasp the concept of Metalsmith. To understand this better, we follow the evolution of a file at each step of the build process (between each `use` statement). We are also using the [`writemetadata()`](https://github.com/Waxolunist/metalsmith-writemetadata) plugin, which writes the `{key: value}` pairs excerpted from the [File][api_file] objects representing the files, to the filesystem as `.json` files. You can then view the `.json` files to find out how files are represented internally in Metalsmith.


{% codetabs ["API","CLI"] %}
{% codeblock "metalsmith.js" %}
```javascript
Metalsmith(__dirname)            
  .source('src')      
  .destination('build')   
  .use(markdown())          
  .use(layouts())
  .use(writemetadata({            // write the JS object
    pattern: ['**/*'],            // for each file into .json
    ignorekeys: ['next', 'previous'],
    bufferencoding: 'utf8'        // also put 'content' into .json
  }))
  .build(function(err) {         
    if (err) throw err;          
  });
```
{% endcodeblock %}
{% codeblock "metalsmith.json" %}
```json
{
  "source": "src",
  "destination": "build",
  "plugins": [
    { "markdown": true },
    { "layouts": true },
    { "writemetadata": {
      "pattern": ["**/*"],
      "ignorekeys": ["next", "previous"],
      "bufferencoding": "utf8"
    } }
  ]
}
```
{% endcodeblock %}
{% endcodetabs %}

In the example above, after applying `.use(markdown())` the initial representation of  `my-file.md` becomes `my-file.html`. The markdown plugin *changes the file extension* and *converts the contents to HTML*.

```javascript
{
  'relative_to_sourcepath/my-file.html': {
    title: 'A Catchy Title',
    draft: false,
    contents: '<p>An unfinished article...</p>',
    ...
  }
}
```

After applying `.use(permalinks())` the file is *renamed to `original-name/index.html`* and a `path` property is added to the file's metadata:

```javascript
{
  'relative_to_sourcepath/my-file/index.html': {
    title: 'A Catchy Title',
    draft: false,
    contents: '<p>An unfinished article...</p>',
    path: 'myfile',
    ...
  }
}
```

Assuming we have defined a very simple nunjucks layout file in a separate layouts folder...

{% codeblock "./layouts/layout.njk" %}
{% raw %}
```html
<!doctype html>
<html>
<head>
  <title>{{ title }}</title>
</head>
<body>
  {{ contents | safe }}
</body>
</html>
```
{% endraw %}
{% endcodeblock %}

... after applying `.use(layouts())` in our Metalsmith chain our JavaScript object becomes:

```javascript
{
  'relative_to_sourcepath/my-file/index.html': {
    title: 'A Catchy Title',
    draft: false,
    contents: `<!doctype html><html><head>
               <title>A Catchy Title</title></head><body>
               <p>An unfinished article...</p>
               </body></html>`,
    path: 'myfile',
    ...      
  }
}
```

Finally when the `.build(function(err))` is performed our JavaScript object is written to `relative_to_destpath/myfile/index.html`. 

### Glob patterns

Metalsmith and its plugins make extensive use of glob patterns to target specific files (usually through the `pattern` option, as in the writemetadata example above). A [glob]() is a type of string pattern syntax that is commonly and conveniently used to match files by path with support for *globstar* wildcards `*`. Chances are you are already using glob patterns in `.gitignore` files, with the Linux/Mac or `git` terminal commands. Here are a few examples of how you can match with glob patterns:

* Matching all files (the double globstar is *recursive*): see it [in action][globstar-all]

  ```txt
  **/*
  ```

* Matching all files at the root of a directory with a `.html` extension: see it [in action][globstar-single-dir]

  ```txt
  *.html
  ```

* Matching all markdown files starting with `post-` under the `blog/posts` folder: see it [in action][globstar-name]

  ```txt
  blog/posts/post-*.md
  ```

* Matching either ... or ...: see it [in action][globstar-either]

  ```txt
  {services/**,blog}/index.md
  ```

* Matching all except markdown files (negated match): see it [in action][glob-except]

  ```txt
  !**/*.md
  ```

You can always use DigitalOcean's handy [Glob tool](https://www.digitalocean.com/community/tools/glob) or [globster.xyz](https://globster.xyz) to test your glob patterns.

[globstar-all]: https://www.digitalocean.com/community/tools/glob?comments=false&glob=%2A%2A%2F%2A&tests=blog%2Findex.md&tests=blog%2Fposts%2Fpost-1.md&tests=blog%2Fposts%2Fpost-2.md&tests=blog%2Fpost-outside.md&tests=services%2Fwebdesign%2Findex.mdservices%2Femail%2Findex.html&tests=about.md&tests=css%2Fstyle.css&tests=js%2Fsite.js&tests=index.md&tests=404.md
[globstar-single-dir]: https://www.digitalocean.com/community/tools/glob?comments=false&glob=%2A.html&tests=blog%2Findex.md&tests=blog%2Fposts%2Fpost-1.md&tests=blog%2Fposts%2Fpost-2.md&tests=blog%2Fpost-outside.md&tests=services%2Fwebdesign%2Findex.mdservices%2Femail%2Findex.html&tests=about.md&tests=css%2Fstyle.css&tests=js%2Fsite.js&tests=index.md&tests=404.md
[globstar-name]: https://www.digitalocean.com/community/tools/glob?comments=false&glob=blog%2Fposts%2Fpost-%2A.md&tests=blog%2Findex.md&tests=blog%2Fposts%2Fpost-1.md&tests=blog%2Fposts%2Fpost-2.md&tests=blog%2Fpost-outside.md&tests=services%2Fwebdesign%2Findex.mdservices%2Femail%2Findex.html&tests=about.md&tests=css%2Fstyle.css&tests=js%2Fsite.js&tests=index.md&tests=404.md
[globstar-either]: https://www.digitalocean.com/community/tools/glob?comments=false&glob=**%2F*&matches=true&tests=blog%2Findex.md&tests=blog%2Fposts%2Fpost-1.md&tests=blog%2Fposts%2Fpost-2.md&tests=blog%2Fpost-outside.md&tests=services%2Fwebdesign%2Findex.mdservices%2Femail%2Findex.html&tests=about.md&tests=css%2Fstyle.css&tests=js%2Fsite.js&tests=index.md&tests=404.md
[glob-except]: https://www.digitalocean.com/community/tools/glob?comments=false&glob=**%2F*&matches=true&tests=blog%2Findex.md&tests=blog%2Fposts%2Fpost-1.md&tests=blog%2Fposts%2Fpost-2.md&tests=blog%2Fpost-outside.md&tests=services%2Fwebdesign%2Findex.mdservices%2Femail%2Findex.html&tests=about.md&tests=css%2Fstyle.css&tests=js%2Fsite.js&tests=index.md&tests=404.md



## Debugging



## Plugins

### Plugin types

There is no official plugin type classification, but plugins can be broady divided into a few categories:

* **Development plugins**: plugins which provide a better developer experience or debug information. Examples are: metalsmith-express, [metalsmith-writemetadata][plugin_writemetadata], [metalsmith-debug-ui][plugin_debug-ui]
* **Metadata plugins**: plugins which add or modify file and global metadata. Examples are: [core_plugin_excerpts][@metalsmith/excerpts], [@metalsmith/table-of-contents][core_plugin_table-of-contents], [@metalsmith/default-values][core_plugin_default-values]
* **Rendering plugins**: plugins which render or alter a file's `contents`. Examples are: @metalsmith/layouts, [@metalsmith/in-place][core_plugin_in-place], [@metalsmith/markdown][core_plugin_markdown]
* **Files-tree manipulating plugins**: plugins which add, move or remove files from the files object. Examples are: [@metalsmith/permalinks][core_plugin_permalinks], [@metalsmith/remove][core_plugin_remove], [@metalsmith/drafts][core_plugin_drafts], metalsmith-sitemap
* **Third-party integrations**: plugins which hook third-party tools into the metalsmith build. Examples are [@metalsmith/sass][core_plugin_sass], metalsmith-uglify

A plugin could fit into multiple categories: 

Plugins that start with the `@metalsmith/`  prefix are *core plugins*. They are officially supported by Metalsmith. You can recognize them in the Metalsmith plugin registry with their core-plugin badge.

### Using plugins

#### Plugin order

As previously noted, plugin order is very important in Metalsmith. As a rule of thumb,  metadata plugins should be `use`'d first in the plugin chain, and plugins that modify file paths should be `use`'d at the end of the chain. There can be many exceptions to this rule, depending on what you want to achieve.

#### Conditionally running plugins

If you're using the Metalsmith CLI, there's only one way to run plugins conditionally: create multiple `metalsmith.json` configs. The common use case is having a development config & a production config. For example we would like to remove *draft* files and *minify the HTML* only in production:

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
You can run a plugin conditionally by assigning the metalsmith build to a variable, and using native javascript `if` statements. The same example from above in a single file:

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
const isProduction = process.env.NODE_ENV !== 'development';

Metalsmith(__dirname)
  .use(when(isProduction, minifyHTML())
  .build(err => {
    if (err) throw err
    console.log('Build success!')
  })
```
{% endcodeblock %}


### Writing a plugin

Writing a plugin is super-simple! A metalsmith plugin is just a function that is passed the [Files][api_files] object and the [Metalsmith][api_metalsmith] instance. Let us have a quick look at what files are read from the `metalsmith.source`:

```js
function listFiles(files, metalsmith) {
  console.log('Files in the build: ', Object.keys(files))
}
// usage: metalsmith.use(listFiles)
```

_Notice that the plugin is a *named function*. The function name *is* the plugin's name. It is a good practice to use a named function for your plugin, so other plugins and debug tools (like [metalsmith-debug-ui][plugin_debug-ui] ) can read which plugins are used._

We can now use this mini-plugin to log the differences in the files list in between other plugins:

```js
const Metalsmith = require('metalsmith')
const markdown = require('@metalsmith/markdown')
const remove = require('@metalsmith/remove')

Metalsmith(__dirname)
  .use(listFiles)  // initial list of files
  .use(markdown())
  .use(listFiles)  // @metalsmith/markdown has changed all .md file paths .html!
  .use(remove('archived/**/*.html'))
  .use(listFiles)  // @metalsmith/remove has removed all .html file paths in the 'archived' directory!
  .build(err => {
     if (err) throw err
     console.log('Build success')
  })
```

Cool, cool. But the `listFiles` plugin is pretty limited. We can't tell it to only log certain types of files.

In the snippet above, you can observe the difference between our `listFiles` plugin which we just passed to `metalsmith.use`, and the `markdown`/`remove` plugins, which we called as functions first. 

#### Adding options to the plugin

#### Adding debug logs to the plugin