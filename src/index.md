---
title: "Metalsmith"
description: "An extremely simple, pluggable static site generator for NodeJS."
slug: "home"
layout: "home.njk"
sitemap:
  priority: 1.0
  lastmod: 2023-03-01
config:
  anchors: false
  
highlights:
  - trait: Convenient
    icon: pointright
    description: 'Metalsmith works with all the tools and data formats you already know and use: NodeJS, npm, markdown, json, yaml and the templating language of your choice.'

  - trait: Simple
    icon: lightbulb
    description: Metalsmith translates a directory tree to plain Javascript objects that you can manipulate effortlessly with your selection of plugins.

  - trait: Pluggable
    icon: gridlines
    description: You shouldn't have to bend your project needs to a specific framework or tool. Metalsmith gives you full control of how you want to conceptualize, structure and build your project.

  - trait: Versatile
    icon: expand
    description: 'Use Metalsmith to generate anything from a static site, to a scaffolder, backup, command-line, or deploy tool. Configuration over code or code over configuration: Metalsmith supports both.'

---
{% include "./lib/views/partials/doc-mdlinks.njk" %}

<section class="Highlight-wrapper">
{% for item in highlights %}
  <div class="Highlight-item Highlight">
    <div class="Highlight-content">
      <i class="Highlight-icon ss-{{item.icon}}"></i>
      <h2 class="Highlight-title">{{ item.trait }}</h2>
      <p class="Highlight-desc">{{ item.description }}</p>
    </div>
  </div>
{% endfor %}
</section>

---------

## Install it


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

### Or use [a starter](#use-a-starter)

--------

## Get the feel of it

### You want to build a website or blog with a static site generator. Well, here is our elevator pitch. It's as easy as that:

{% codetabs ["ESM","CJS","CLI"] %}
{% codeblock "metalsmith.mjs" %}
```js
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
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
  .use(permalinks())          // change URLs to permalink URLs
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
  .use(permalinks())          // change URLs to permalink URLs
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
    { "@metalsmith/permalinks": { "relative": false }},
    { "@metalsmith/layouts": {}},
  ]
}
```
{% endcodeblock %}
{% endcodetabs %}

The package exposes both a [JavaScript API](/api), and a [CLI](https://github.com/metalsmith/metalsmith#cli) if you prefer. To see how they're used check out the [examples](https://github.com/metalsmith/metalsmith/tree/master/examples) or [the walkthrough](./step-by-step).

[You can follow along with a detailed walkthrough](./step-by-step) or have a go with a very minimal example:

```bash
git clone https://github.com/metalsmith/metalsmith.git
cd metalsmith/examples/static-site
npm install
npm start
```

---------

## Build anything

We mainly refer to Metalsmith as a "static site generator", but it's a lot more than that. Since everything is a plugin, the core library is just an abstraction for manipulating a directory of files.

Which means you could just as easily use it to make...

<ul class="ExampleList">
{% for example in examples %}
<li class="Example">
  <h1 class="Example-title">{{ example.name }}</h1>
  <ol class="Example-steps">
  {% for step in example.steps %}
  <li class="Example-step ss-{{ step.icon }}">{{ step.text }}</li>
  {% endfor %}
  </ol>
</li>
{% endfor %}
</ul>

--------

## Deploy anywhere

### Metalsmith builds are static folders. They can be compressed, archived, deployed to a CDN, Netlify, Github Pages, Gitlab Pages, SFTP'd to a shared host, or SSH'd to a custom server.

----------

{% include "./lib/views/partials/showcase.njk" %}

----------

## Use a starter

<ul class="Starter-list">
{% for starter in starters %}
  <li class="Starter-item Starter">
    <img class="Starter-image" src="/img/starter/{{ starter.image }}" alt="{{ starter.name }}" width="128" height="96">
    <p class="Starter-title">{{ starter.name }}<br>
      <a class="Starter-link--source" href="{{ starter.url }}">Code</a>|
      <a class="Starter-link--demo" href="{{ starter.demo }}">Demo</a>
    </p>
    <pre class="hljs language-plaintext"><code>git clone {{ starter.url }}
cd {{ starter.url|split('/')|last }} && npm install</code></pre>
  </li>
{% endfor %} 
</ul>

----