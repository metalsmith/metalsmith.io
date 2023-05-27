---
title: Metalsmith 2.6 released
description: Power to the metalsmith CLI, new metalsmith.watch method & metalsmith.matter member.
pubdate: 2023-05-27
layout: default.njk
sitemap:
  lastmod: 2023-05-27
---
{% include "./lib/views/partials/doc-mdlinks.njk" %}

Metalsmith 2.6 is out!

[Github release](https://github.com/metalsmith/metalsmith/releases/tag/v2.6.0) |
[Github Roadmap 2.6 issue](https://github.com/metalsmith/metalsmith/issues/386) |
[NPM package](https://www.npmjs.com/package/metalsmith/v/2.6.0) | Node >= 14.14.0

## Highlights

* **Typescript support included**. No need to install the extra [@metalsmith/types](https://www.npmjs.com/package/@types/metalsmith) package anymore.

* **NodeJS < 14.14 support dropped**: In line with the [compatibility & support policy](https://github.com/metalsmith/metalsmith#compatibility--support-policy) Node 14 support was dropped (EOL 2023-04-30). To be able to make use of Node's recursive fs.rm method and remove the rimraf dependency support for the first 14 minor Node 14 versions was also dropped.

* **Power to the metalsmith CLI**. Metalsmith 2.6 modernizes the CLI and adds 3 command-line options: `--env varname=varvalue`, `--debug` (= `--env debug=true`), and `--dry-run`. These options overwrite those defined in a metalsmith build or config file allowing you to do faster test runs with different configurations.

* **Metalsmith CLI now supports reading JS configs.** That's right, now you can use a `metalsmith.js` (or `.cjs` or `.mjs`) file instead of `metalsmith.json`, which allows you to preprocess input more easily. The examples below can be run with `metalsmith` or `metalsmith build` or `metalsmith -c metalsmith.mjs`:

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


* **New [Metalsmith.watch][api_method_watch] method**. Metalsmith includes a watch method based on [chokidar][lib_chokidar]. The method is an options setter similar to [Metalsmith.ignore][api_method_ignore] and can be used both with [Metalsmith.build][api_method_build] (output to filesystem) and [Metalsmith.process][api_method_process] (only process in-memory).

It supports **full rebuilds** and **partial rebuilds** by setting `metalsmith.clean()` to `true` or `false`, respectively. A side-effect of using watching is that the `build` and `process` methods can not be awaited. Instead pass a callback to them that will be executed on each rebuild/ reprocess. In **partial rebuild mode**, the files parameter passed to the callback will only contain changed files!

Have a look at the snippet below to get a better idea of how it works:

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

## Full Release notes

### Added

- [#356] Added Typescript support [`58d22a3`](https://github.com/metalsmith/metalsmith/commit/58d22a3)
- Added --debug and --dry-run options to metalsmith (build) command [`2d84fbe`](https://github.com/metalsmith/metalsmith/commit/2d84fbe)
- Added --env option to metalsmith (build) command [`9661ddc`](https://github.com/metalsmith/metalsmith/commit/9661ddc)
- Added Metalsmith CLI support for loading a .(c)js config. Reads from metalsmith.js as second default after metalsmith.json [`45a4afe`](https://github.com/metalsmith/metalsmith/commit/45a4afe)
- Added support for running (C/M)JS config files from CLI [`424e6ec`](https://github.com/metalsmith/metalsmith/commit/424e6ec)

### Removed

- [#231] Dropped support for Node < 14.14.0 [`80d8508`](https://github.com/metalsmith/metalsmith/commit/80d8508)
- **Dependencies:**
  - `rimraf`: replaced with native Node.js methods [`ae05945`](https://github.com/metalsmith/metalsmith/commit/ae05945)

### Updated

- Modernized Metalsmith CLI, prepared transition to imports instead of require [`24fcffb`](https://github.com/metalsmith/metalsmith/commit/24fcffb) [`4929bc2`](https://github.com/metalsmith/metalsmith/commit/4929bc2)
- **Dependencies:**
  - `commander`: 6.2.1 -> 10.0.1 [`24fcffb`](https://github.com/metalsmith/metalsmith/commit/24fcffb) [`0810728`](https://github.com/metalsmith/metalsmith/commit/0810728)

### Fixed

- Fixes a duplicate empty input check in metalsmith.match [`60e173a`](https://github.com/metalsmith/metalsmith/commit/60e173a)
- Gray-matter excerpts are removed from contents instead of being duplicated to the `excerpt` property [`2bfe800`](https://github.com/metalsmith/metalsmith/commit/2bfe800)
- Gray-matter excerpts are trimmed [`acb363e`](https://github.com/metalsmith/metalsmith/commit/acb363e)

[#231]: https://github.com/metalsmith/metalsmith/issues/231
[#356]: https://github.com/metalsmith/metalsmith/issues/356
