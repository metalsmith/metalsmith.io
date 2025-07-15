---
title: Metalsmith 2.7 released
description: metalsmith init, metalsmith.imports & metalsmith.statik 
pubdate: 2026-02-06
layout: default.njk
sitemap:
  lastmod: 2026-02-06
---
{% include "./lib/views/partials/doc-mdlinks.njk" %}

Metalsmith 2.7 is out!
It's long overdue, but the Ukraine war, ensuing energy crisis, rising cost of living, home renovations and the explosion of AI have all taken their toll on my ability to spend time on Metalsmith, but it's here at last. And it is quite a substantial semver-minor release.

[Github release](https://github.com/metalsmith/metalsmith/releases/tag/v2.7.0) |
[Github Roadmap 2.7 issue](https://github.com/metalsmith/metalsmith/issues/405) |
[NPM package](https://www.npmjs.com/package/metalsmith/v/2.7.0) | Node >= 16.0.0

## Highlights

* **NodeJS < 16.00 support dropped**: In line with the [compatibility & support policy](https://github.com/metalsmith/metalsmith#compatibility--support-policy) Node < 16.0.0 (EOL: 2022-10-18) support was dropped (2 major versions), in order to support updating the CLI commander dependency.

* CLI Support for **metalsmith.yml** configs in addition to `metalsmith.js` (or `.cjs` or `.mjs`) or `metalsmith.json`.

* **New [`Metalsmith#statik`][api_method_statik] method

* **metalsmith init**. Metalsmith 2.7.0 adds the `init` CLI command and adds 3 command-line options: `--env varname=varvalue`, `--debug` (= `--env debug=true`), and `--dry-run`. These options overwrite those defined in a metalsmith build or config file allowing you to do faster test runs with different configurations.


* **metalsmith clean**. Metalsmith 2.7.0 adds the `clean` CLI command and adds 3 command-line options: `--env varname=varvalue`, `--debug` (= `--env debug=true`), and `--dry-run`. These options overwrite those defined in a metalsmith build or config file allowing you to do faster test runs with different configurations.

### Metalsmith#statik

[metalsmith.statik][api_method_statik] was added after many deliberations weighing its benefits, and is the built-in option to designate static files with the **guarantee that the files' contents will not be altered by plugins during the build.**

The method is named with a stati**k** instead of stati**c** to avoid naming collision with the reserved class keyword *static*.

Metalsmith.statik has a function signature similar to [metalsmith.ignore][api_method_ignore], takes one or more more globs/paths:
```js
metalsmith.statik(['assets/**','CNAME'])
```
Inside plugins the `metalsmith.statik()` getter returns a files object just like the non-static files object, with the key difference that its' **files' contents, stats and mode are read-only**. The `file.contents` are _never actually read_, but contain the original path of the file relative to `metalsmith.source()`. Only files inside 

Static files are copied to `metalsmith.destination()` *before* processed files. If a file path is in both processed and static files, the static file will be overwritten. This is an edge case that could arise when files are added dynamically.

Plugins or users can still designate extra files as static, remove or overwrite them during the build. This is useful for example to avoid plugins from further modifying the file after a certain point.
```js
function makeHtaccessStatic(files, metalsmith) {
  const statik = metalsmith.statik()

  const htaccess = '.htaccess'

  // designate a regular file static
  statik[htaccess] = { ...files[htaccess], contents: Buffer.from('.htaccess') }
  // if you don't remove the original, it will overwrite the static one
  delete statik[htaccess]

  // 'clone' a static file to another destination
  statik[htaccess] = statik['dotfiles/.htaccess']
  // 'clone' + remove original = move
  delete statik['dotfiles/.htaccess']

  // convert a static file to a non-static one (unusual use case)
  files[htaccess] = {
    ... statik[htaccess],
    contents: fs.readFileSync(metalsmith.path(metalsmith.source(), htaccess))
  }
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

### CLI: metalsmith clean

Metalsmith 2.7.0 CLI bundles a `clean` utility command that can be used to recursively clean [api_metalsmith_destination] from the command-line. This is useful (a.o) when altering between watch/build modes with partial rebuilds (`clean(false)`).

For reference, these are the `--help` contents of `metalsmith clean`:

```plaintext

Usage: metalsmith clean [options] [destination]

Clean a directory

Arguments:
  destination          Destination directory, defaults to metalsmith.destination()

Options:
  -c, --config [path]  configuration file location (default: "metalsmith.json")
  -h, --help           display help for command
```



## Full Release notes

### Added

- [#361] Added `Metalsmith#statik` getter/setter method for static files.
- [#403] Added `Metalsmith#imports` utility method
- [#380] Added `metalsmith init [options] [source] [destination]` CLI command to clone starters from subpaths in other git repo's
- [#409] Enabled `clean(true)` builds to overwrite Metalsmith#source.In the build method, the order of execution of metalsmith.read() and rm(metalsmith.destination()) is swapped logically [`fe0274b`](https://github.com/metalsmith/metalsmith/commit/fe0274b)
- Added `metalsmith clean [-c|--config] [destination]` CLI command to clean the build destination, or a specified directory [`08c0da7`](https://github.com/metalsmith/metalsmith/commit/08c0da7)
- Added `Metalsmith.version`, decoupled CLI --version command from package.json [`87edd34`](https://github.com/metalsmith/metalsmith/commit/87edd34)
- CLI --env parameter synchronizes to `process.env` [`5d99888`](https://github.com/metalsmith/metalsmith/commit/5d99888)
- [#397] Added support for `metalsmith.yml|toml` configs [`52347d4`](https://github.com/metalsmith/metalsmith/commit/52347d4)

### Removed

- Drops support for Node < 16.0.0 (EOL: 2022-10-18) to support commander update [`e4bf5cc`](https://github.com/metalsmith/metalsmith/commit/e4bf5cc)
- Removed snapcraft.yml/metalsmith-migrated-plugins.js and postinstall script from npm pkg [`e32098e`](https://github.com/metalsmith/metalsmith/commit/e32098e)

### Updated

- Reworked readdir helper used in Metalsmith#read. Allows file.stats to be preloaded in ms.readFile to avoid needing to read stats twice. [`d8bd616`](https://github.com/metalsmith/metalsmith/commit/d8bd616)
- **Dependencies:** [`d1fd7db`](https://github.com/metalsmith/metalsmith/commit/d1fd7db), [`e4bf5cc`](https://github.com/metalsmith/metalsmith/commit/e4bf5cc), , [`5635a94`](https://github.com/metalsmith/metalsmith/commit/5635a94)
  - `chokidar`: 3.6.0 ▶︎ 4.0.3
  - `commander`: 10.0.1 ▶︎ 11.1.0
  - `debug`: 4.3.4 ▶︎ 4.4.3
  - `js-yaml` (subdependency of gray-matter): 3.14.1 ▶︎ 3.14.2

### Fixed

- Catches errors when inexistant DEBUG_LOG directory is specified [`cd3c36e`](https://github.com/metalsmith/metalsmith/commit/cd3c36e)
- Fixes TS Chokidar.WatchOptions rename to ChokidarOptions [`5635a94`](https://github.com/metalsmith/metalsmith/commit/5635a94)

[#409]: https://github.com/metalsmith/metalsmith/issues/409
[#403]: https://github.com/metalsmith/metalsmith/issues/403
[#361]: https://github.com/metalsmith/metalsmith/issues/361
[#380]: https://github.com/metalsmith/metalsmith/issues/380
[#397]: https://github.com/metalsmith/metalsmith/issues/397