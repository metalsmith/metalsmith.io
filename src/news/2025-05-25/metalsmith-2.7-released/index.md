---
title: Metalsmith 2.7 released
description: metalsmith init, metalsmith.imports & metalsmith.statik 
pubdate: 2025-05-30
layout: default.njk
sitemap:
  lastmod: 2025-05-30
---
{% include "./lib/views/partials/doc-mdlinks.njk" %}

Metalsmith 2.7 is out!

[Github release](https://github.com/metalsmith/metalsmith/releases/tag/v2.7.0) |
[Github Roadmap 2.7 issue](https://github.com/metalsmith/metalsmith/issues/405) |
[NPM package](https://www.npmjs.com/package/metalsmith/v/2.7.0) | Node >= 14.18.0

## Highlights

* **NodeJS < 14.18 support dropped**: In line with the [compatibility & support policy](https://github.com/metalsmith/metalsmith#compatibility--support-policy) Node < 14.18.0 support was dropped (4 minor versions), in order to support `node:`-prefixed imports.

* **metalsmith init**. Metalsmith 2.7 adds the `init` CLI command and adds 3 command-line options: `--env varname=varvalue`, `--debug` (= `--env debug=true`), and `--dry-run`. These options overwrite those defined in a metalsmith build or config file allowing you to do faster test runs with different configurations.

* **Metalsmith CLI** now supports reading from **metalsmith.yml** in addition to `metalsmith.js` (or `.cjs` or `.mjs`) or `metalsmith.json`.

{% codeblock "metalsmith.mjs" %}
```js
import { readFileSync } from 'node:fs'
import markdown from '@metalsmith/markdown'
import dotenv from 'dotenv'

const env = dotenv.config()
const metadata = JSON.parse(readFileSync('./metadata.json'))

const build = {
  clean: true,
  env: env,
  metadata: metadata,
  plugins: [
    { '@metalsmith/markdown': {}}
  ]
}

export default build
```
{% endcodeblock %}

Alternatively you can also run a full metalsmith build with the CLI now if the build is exported without actual `build()` or `process()` call:

{% codeblock "metalsmith.mjs" %}
```js
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { readFileSync } from 'node:fs'
import Metalsmith from 'metalsmith'
import markdown from '@metalsmith/markdown'
import dotenv from 'dotenv'

const workingDir = dirname(fileURLToPath(import.meta.url))
const env = dotenv.config()
const metadata = JSON.parse(readFileSync('./metadata.json'))

const build = Metalsmith(workingDir)
  .clean(true)
  .env(env)
  .metadata(metadata)
  .use(markdown())

export default build
```
{% endcodeblock %}


* **New `metalsmith init` command**.
* **New [`Metalsmith#statik`][api_method_statik] method
```js
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import Metalsmith from 'metalsmith'

const __dirname = dirname(fileURLToPath(import.meta.url))
Metalsmith(__dirname)
  // watches metalsmith.source() by default
  .watch(true)
  // watch custom dirs, override chokidar options
  .watch(['layouts', 'src'], { interval: 2000 })
  // clean: true for full rebuild, false for partial
  .clean(false)
  // output files...
  .build(funtion onEachRebuild(err, files) {
    // if clean:false, files will only be the changed files!
    console.log('Rebuild finished!')
  })
  // or only do a 'dry-run' (no writes)
  .process(funtion onEachReprocess(err, files) {
    // if clean:false, files will only be the changed files!
    console.log('Reprocessed!')
  })
```

* **New [`Metalsmith#matter`][api_member_matter] member** available. Every Metalsmith instance now comes with a `matter` member that exposes the [parse][api_matter_parse], [stringify][api_matter_stringify], [wrap][api_matter_wrap] and [options][api_matter_options] methods. The primary goal is to allow plugins to use these methods instead of having to require [js-yaml][lib_js-yaml] or other parsing libraries separately, with clashing versions, or different parsing configs.

The snippet below demonstrates usage of these methods:

  ```js
  // syncs with metalsmith.frontmatter() options
  metalsmith.matter.options({ excerpt: true })
  metalsmith.matter.parse(`---\ntitle: Hello world\n---\nExcerpt\n---`)
  // returns { title: 'Hello World', excerpt: 'Excerpt' }
  metalsmith.matter.stringify({ title: 'Hello World', excerpt: 'Excerpt' })
  // returns '---\ntitle: Hello world\nexcerpt: Excerpt---'
  metalsmith.matter.wrap('title: Hello world\nexcerpt: Excerpt')
  // returns '---\ntitle: Hello world\nexcerpt: Excerpt---'
  ```
### Metalsmith#statik

[metalsmith.statik][api_method_statik] was added after many deliberations weighing its benefits, and is the built-in option to designate static files with the guarantee that the files' contents will not be altered by plugins during the build.

The method is named with a stati**k** instead of stati**c** to avoid naming collision with the reserved class keyword *static*.

Metalsmith.statik has a function signature similar to [metalsmith.ignore][api_method_ignore], takes one or more more globs/paths:
```js
metalsmith.statik(['assets','CNAME'])
```
Inside plugins `metalsmith.statik()` will return a files object just like the non-static files object, with the key difference that its' **files' contents, stats and mode are read-only**. The file contents are never actually read, but contain the original path of the file relative to `metalsmith.source()`. Static files will be copied to `metalsmith.destination()` *before* processed files. If a file path is in both processed and static files, the static file will be overwritten.

Plugins or users can still designate extra files as static, remove or overwrite them during the build:
```js
function makeHtaccessStatic(files, metalsmith) {
  const statik = metalsmith.statik()

  const htaccess = '.htaccess'

  // designate a regular file static
  statik[htaccess] = files[htaccess]
  // if you don't remove the original, it will overwrite the static one
  delete statik[htaccess]

  // 'clone' a static file to another destination
  statik[htaccess] = statik['dotfiles/.htaccess']
  // 'clone' + remove original = move
  delete statik['dotfiles/.htaccess']

  // overwrite the static file without removing it (not very useful)
  files[htaccess] = htaccess
}
```

With this addition, the plugins [metalsmith-assets](https://github.com/treygriffith/metalsmith-assets) and [metalsmith-static](https://github.com/TheHydroImpulse/metalsmith-static) are completely obsolete and have been removed from the [plugin registry](/plugins)

### Metalsmith#imports

[metalsmith.imports()][api_method_imports] is a utility for the metalsmith CLI and plugins (like [@metalsmith/layouts][core_plugin_layouts]' `transform` option) to load (C/M)JS & JSON modules specified as string.  
It also has support for loading a named export via the second parameter:

```js
await metalsmith.imports('metalsmith') // Metalsmith
await metalsmith.imports('data.json')  // object
await metalsmith.imports('./helpers/index.js', 'formatDate')  // function
```

### CLI: metalsmith init

Starting from v2.7.0 the `metalsmith init` command can be used to start a new metalsmith project, provided that `git` is installed and available in `$PATH`. The default command will pull the content from [starters/bare in the metalsmith/resources repo](https://github.com/metalsmith/resources/blob/main/starters/bare) into the current directory.

In the future, other starters or examples or minimal repro's can be loaded from the default repo, so that you could do for ex `metalsmith init starters/express` or `metalsmith init examples/using-plugins`.

```sh
# default
metalsmith init
# explicit default
metalsmith init starters/bare . --origin=https://github.com/metalsmith/resources
```

However, you can use `metalsmith init` to pull *any* git repository's subfolder contents without git history - ideal for usage as template/starter/etc (also local!). For example, the command below would pull all "solid"-style SVG source files from the FontAwesome repository into the `fa-solid` directory:

```sh
metalsmith init svgs/solid fa-solid --origin=https://github.com/FortAwesome/Font-Awesome 
```
The `--force` option can be used to force writing to a non-empty directory.

For reference, these are the `--help` contents of `metalsmith init`:

```plaintext
metalsmith init --help
Usage: metalsmith init [options] [source] [destination]

Initialize a new metalsmith project from a git repo (subpath). Runs a sequence of git and filesystem commands.
Assumes a working git executable in $PATH and properly configured git/ssh configs.

Arguments:
  source                 Source directory (default: "starters/bare")
  destination            Destination directory, defaults to current directory (default: ".")

Options:
  -f, --force            Force overwriting a non-empty directory (default: false)
  -o, --origin <origin>  Origin repository (https or ssh url, or a directory path). Defaults to https://github.com/metalsmith/resources if omitted (default:
                         "https://github.com/metalsmith/resources")
  -h, --help             display help for command
```

## Full Release notes

### Added


### Removed


### Updated


### Fixed

