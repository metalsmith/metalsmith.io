---
title: Getting started
description: 'Get started with metalsmith.js static site generator: installation, concepts, project folder and quickstart'
toc: true
layout: default.njk
order: 1
sitemap:
  priority: 0.8
  lastmod: 2023-03-01
config:
  anchors: true
---
{% include "./lib/views/partials/doc-mdlinks.njk" %}

## Introduction

### What is Metalsmith?

Metalsmith is an extremely simple, pluggable static-site generator for NodeJS. 
Let us break that down:

#### Metalsmith is a static site generator

The task of a static site generator is to produce static files that can be deployed to a web server. For a static site generator this means:

1. take a source directory, read the source files and extract their information
2. manipulate the information with plugins
3. write the manipulated information to files into a destination directory (NPM is )

Metalsmith is built on this reasoning. It takes the information from the files in a source directory and it writes the manipulated information to files into a destination directory.

#### Metalsmith is extremely simple

* **Plain old javascript objects**: the source directory is initially converted into a [Files object](/api/#Files) whose keys are file paths, and values are javascript objects with the usual `{key:value}` pairs. These `{key:value}` pairs contain information about the original file (such as its `mode` or `stats`) and its `content`.The [File](/api/#File) object for each file is then supplemented with all variables specified in the front-matter of the file or supplied via plugins.
* **Everything is a plugin**: all functionality is exclusively handled by plugins. Metalsmith itself only provides a streamlined interface that the plugins can use to apply those manipulations. And they can do most of it conveniently by altering the file objects' keys and values. A plugin is just a function that receives a [Files object](/api/#Files), applies its manipulations and calls [done()](/api/#DoneCallback), &mdash; you guessed it &mdash;, when they're done. Anyone who can write a javascript function can write a metalsmith plugin. 
* **Single dependency**: Metalsmith is completely in *plain* javascript and only requires Node. No need to install Ruby, Rust or Go. No need to be familiar with layers of opinionated abstractions like React or Vue. Start small and add extra plugins over time.

#### Metalsmith is pluggable

Metalsmith leaves all manipulations exclusively to plugins.

Manipulations could be anything: translating templates, transpiling code, replacing variables, wrapping layouts around content, grouping files, moving and removing files and so on. This is why we say *Everything is a Plugin*. Manipulations can be applied one after another, or *chained* or *piped*, if you prefer. Obviously, in a chain [plugin order](/docs/usage-guide/#plugin-order) matters.

Splitting metalsmith in a minimal, rock-solid core and multiple plugins reduces complexity. It gives you the freedom to use *exactly and only* those plugins you need and it distributes the honor and the burden of maintaining the Metalsmith ecosystem.

#### Metalsmith is more

Depending on your desired use-case, Metalsmith can be *much more* than a static site generator:

* a deploy, backup or build tool
* a file metadata extractor
* a boilerplate scaffolder
* a continuous integration pipeline
* a lightweight filesystem abstraction for everything else

Thanks to its simple in-memory abstraction, metalsmith builds and plugins are easy to unit-test without the need for extensive mocks.  
Have a look at [the Metalsmith tests](https://github.com/metalsmith/metalsmith/blob/master/test/index.js) to get an idea.

## Prerequisites

Metalsmith runs on all NodeJS Long-Term Support versions that are not end-of-life and some more. Download & install NodeJs and NPM (NPM comes pre-bundled with Node): https://nodejs.org/en/download/.  
If you plan to publish plugins, it is recommended that you use [nvm](https://github.com/nvm-sh/nvm#intro) or [nvs](https://github.com/jasongin/nvs#readme) (for Windows)

Add `node_modules/.bin` to the `PATH` environment variable if you'd like to use the Metalsmith CLI:

* on Windows, hit the Windows key and search for *Edit environment variables*, then add a `node_modules\\.bin` line to the `PATH` variable
* on Linux/Mac, add `export PATH=node_modules/.bin;$PATH` to your `~/.bashrc` or `~/.bash_profile` file, then `source` it.

Metalsmith builds are tested on both Linux & Windows systems and all [officially supported NodeJS LTS releases](https://nodejs.org/en/about/releases/). 

## Installation

First create a project folder somewhere and navigate to it:
{% codetabs ["Linux/Mac","Windows"] %}{% codeblock %}
```bash
mkdir ~/Documents/metalsmith-website && cd ~/Documents/metalsmith-website
```
{% endcodeblock %}{% codeblock %}
```bat
mkdir %userProfile%\Documents\metalsmith-website && cd %userProfile%\Documents\metalsmith-website
```
{% endcodeblock %}{% endcodetabs %}

Then install Metalsmith with any NodeJS package manager: 

{% codetabs ["npm","yarn","pnpm"] %}{% codeblock %}
```bash
npm install metalsmith
```
{% endcodeblock %}{% codeblock %}
```bash
yarn add metalsmith
```
{% endcodeblock %}{% codeblock %}
```bash
pnpm add metalsmith
```
{% endcodeblock %}{% endcodetabs %}

It is likely that you will want to install some plugins too:

{% codetabs ["npm","yarn","pnpm"] %}
{% codeblock %}
```bash
npm install @metalsmith/collections @metalsmith/markdown @metalsmith/permalinks @metalsmith/layouts
```
{% endcodeblock %}
{% codeblock %}
```bash
yarn add @metalsmith/collections @metalsmith/markdown @metalsmith/permalinks @metalsmith/layouts
```
{% endcodeblock %}
{% codeblock %}
```bash
pnpm add @metalsmith/collections @metalsmith/markdown @metalsmith/permalinks @metalsmith/layouts
```
{% endcodeblock %}
{% endcodetabs %}

If you would like to use Typescript in your build file, be sure to install [`@types/metalsmith`](https://npmjs.com/package/@types/metalsmith) as well.


## Concepts

There are only a few core concepts you need to be familiar with to understand how to work with Metalsmith, and if you've worked with another static site generator or run some commands in a terminal like `git add` or `ls -la`, you are probably already familiar with most of them.

### Files

Everyone has worked with files before. They have a name, a path, an extension, contents and metadata (like the last modified date).  Metalsmith represents every file in the source directory as a javascript [File][api_file] object. For instance,

`src/post/my-file.md:`

```md
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

Plugins can then manipulate the javascript [File][api_file] objects representing the original files however they want, and [writing a plugin](/docs/writing-plugins) is super simple.

### Front matter

To attach metadata to a JS [File][api_file] object, metalsmith reads front matter. *Front matter* is a term borrowed from the publishing industry meaning metadata about a written work. In Metalsmith this is a [YAML](https://linuxhandbook.com/yaml-basics/) document section (delineated by `---`) containing metadata (*matter*) at the top (*front*) of a file (commonly, markdown). Metalsmith will recognize and read the front matter of a file and add it as metadata to the JS file representation when you run the build. Here is a typical example of an `index.md` file with YAML front-matter. If you don't like the YAML syntax you can use JSON front matter as well

{% codetabs ["YAML matter","JSON matter"] %}
{% codeblock "index.md" %}
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
{% endcodeblock %}
{% codeblock "index.md" %}
```md
---
{
  "title": "Hello World",
  "keywords": ["hello","world"],
  "draft": false
}
---
Welcome to my blog
```
{% endcodeblock %}
{% endcodetabs %}

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

### Glob patterns

Metalsmith and its plugins make extensive use of glob patterns to target specific files (usually through the `pattern` option). A [glob][glob_pattern] is a type of string pattern syntax that is commonly and conveniently used to match files by path with support for *globstar* wildcards `*`. Chances are you are already using glob patterns in `.gitignore` files, with the Linux/Mac or `git` terminal commands. Here are a few examples of how you can match with glob patterns:

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
[globstar-either]: https://www.digitalocean.com/community/tools/glob?comments=false&glob={services%2F**,blog}%2Findex.md&tests=blog%2Findex.md&tests=blog%2Fposts%2Fpost-1.md&tests=blog%2Fposts%2Fpost-2.md&tests=blog%2Fpost-outside.md&tests=services%2Fwebdesign%2Findex.mdservices%2Femail%2Findex.html&tests=about.md&tests=css%2Fstyle.css&tests=js%2Fsite.js&tests=index.md&tests=404.md
[glob-except]: https://www.digitalocean.com/community/tools/glob?comments=false&glob=!**%2F*.md&tests=blog%2Findex.md&tests=blog%2Fposts%2Fpost-1.md&tests=blog%2Fposts%2Fpost-2.md&tests=blog%2Fpost-outside.md&tests=services%2Fwebdesign%2Findex.mdservices%2Femail%2Findex.html&tests=about.md&tests=css%2Fstyle.css&tests=js%2Fsite.js&tests=index.md&tests=404.md

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

## Quickstart
 
You want to build a website or blog with a static site generator. Well, here is our elevator pitch. It's as easy as that:

{% codetabs ["ESM","CJS","CLI"] %}
{% codeblock "metalsmith.mjs" %}
```js
import { fileURLToPath } from 'node:url'
import { dirname } from 'path'
import Metalsmith from 'metalsmith'
import collections from '@metalsmith/collections'
import layouts from '@metalsmith/layouts'
import markdown from '@metalsmith/markdown'
import permalinks from '@metalsmith/permalinks'

const __dirname = dirname(fileURLToPath(import.meta.url))
const t1 = performance.now()

Metalsmith(__dirname)         // parent directory of this file
  .source('./src')            // source directory
  .destination('./build')     // destination directory
  .clean(true)                // clean destination before
  .env({                      // pass NODE_ENV & other environment variables
    DEBUG: process.env.DEBUG,
    NODE_ENV: process.env.NODE_ENV
  })           
  .metadata({                 // add any variable you want & use them in layout-files
    sitename: "My Static Site & Blog",
    siteurl: "https://example.com/",
    description: "It's about saying »Hello« to the world.",
    generatorname: "Metalsmith",
    generatorurl: "https://metalsmith.io/"
  })
  .use(collections({          // group all blog posts by internally
    posts: 'posts/*.md'       // adding key 'collections':'posts'
  }))                         // use `collections.posts` in layouts
  .use(markdown())            // transpile all md into html
  .use(permalinks())          // change URLs to permalink URLs))
  .use(layouts({              // wrap layouts around html
    pattern: '**/*.html'
  }))
  .build((err) => {           // build process
    if (err) throw err        // error handling is required
    console.log(`Build success in ${((performance.now() - t1) / 1000).toFixed(1)}s`)
  });
```
{% endcodeblock %}
{% codeblock "metalsmith.cjs" %}
```js
const Metalsmith  = require('metalsmith')
const collections = require('@metalsmith/collections')
const layouts     = require('@metalsmith/layouts')
const markdown    = require('@metalsmith/markdown')
const permalinks  = require('@metalsmith/permalinks')

const t1 = performance.now()

Metalsmith(__dirname)         // parent directory of this file
  .source('./src')            // source directory
  .destination('./build')     // destination directory
  .clean(true)                // clean destination before
  .env({                      // pass NODE_ENV & other environment variables
    DEBUG: process.env.DEBUG,
    NODE_ENV: process.env.NODE_ENV
  })           
  .metadata({                 // add any variable you want & use them in layout-files
    sitename: "My Static Site & Blog",
    siteurl: "https://example.com/",
    description: "It's about saying »Hello« to the world.",
    generatorname: "Metalsmith",
    generatorurl: "https://metalsmith.io/"
  })
  .use(collections({          // group all blog posts by internally
    posts: 'posts/*.md'       // adding key 'collections':'posts'
  }))                         // use `collections.posts` in layouts
  .use(markdown())            // transpile all md into html
  .use(permalinks())          // change URLs to permalink URLs))
  .use(layouts({              // wrap layouts around html
    pattern: '**/*.html'
  }))
  .build((err) => {           // build process
    if (err) throw err        // error handling is required
    console.log(`Build success in ${((performance.now() - t1) / 1000).toFixed(1)}s`)
  })
```
{% endcodeblock %}
{% codeblock "metalsmith.json" %}
```json
{
  "source": "src",
  "destination": "build",
  "clean": true,
  "env": {
    "DEBUG": "$DEBUG",
    "NODE_ENV": "$NODE_ENV"
  },
  "metadata": {
    "sitename": "My Static Site & Blog",
    "siteurl": "https://example.com/",
    "description": "It's about saying »Hello« to the world.",
    "generatorname": "Metalsmith",
    "generatorurl": "https://metalsmith.io/"
  },
  "plugins": [
    { "@metalsmith/collections": { "posts": "posts/*.md" }},
    { "@metalsmith/markdown": {}},
    { "@metalsmith/permalinks": {}},
    { "@metalsmith/layouts": { "pattern": "**/*.html" }},
  ]
}
```
{% endcodeblock %}
{% endcodetabs %}

## Directory structure

A typical directory structure for a metalsmith (static-site) project looks more or less like this:

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

## Starter projects

The community has built a few interesting starter projects:

* **[metalsmith/startbootstrap-clean-blog](https://github.com/metalsmith/startbootstrap-clean-blog)**: a stylish, responsive blog theme for [Bootstrap](https://getbootstrap.com/) created by [Start Bootstrap](https://startbootstrap.com/), and made customizable with metalsmith. | **[Demo](https://startbootstrap.github.io/startbootstrap-clean-blog/)**
* **[wernerglinka/metalsmith-bare-bones-starter](https://github.com/wernerglinka/metalsmith-bare-bones-starter)**: Bare-bones metalsmith starter with markdown & Nunjucks templating | **[Demo](https://metalsmith-bare-bones-starter.netlify.app/)**
* **[wernerglinka/metalsmith-blog-starter](https://github.com/wernerglinka/metalsmith-blog-starter)**: Blog metalsmith starter with markdown & Nunjucks templating + a landing page & some sample articles | **[Demo](https://metalsmith-blog-starter.netlify.app/)**
* **[wernerglinka/metalsmith-company-starter](https://github.com/wernerglinka/metalsmith-company-starter)**: Company site starter with markdown & Nunjucks templating | **[Demo](https://metalsmith-company-starter.netlify.app/)**
* **[webketje/metalsmith-starter-resume](https://github.com/webketje/metalsmith-starter-resume)**: A professional, responsive Bootstrap4-themed resume / CV, made highly customizable with metalsmith, Handlebars & SCSS. Features print-friendly version, and twitter/ facebook/ linkedin share tags..

There is also a **[one-click Netlify CMS starter](https://www.netlifycms.org/docs/start-with-a-template/)**.

[Github search for other metalsmith starters](https://github.com/search?o=desc&q=metalsmith+starter&type=Repositories)