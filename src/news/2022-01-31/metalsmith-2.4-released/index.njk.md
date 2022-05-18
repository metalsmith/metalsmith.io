---
title: Metalsmith 2.4 released
description: A new metalsmith.match pattern-matching method, awaitable builds, advanced front-matter option and lots of bugfixes
pubdate: 2022-01-31
layout: default.njk
---

Metalsmith 2.4 is out!

[Github release](https://github.com/metalsmith/metalsmith/releases/tag/v2.4.1) |
[Github Roadmap 2.4 issue](https://github.com/metalsmith/metalsmith/issues/352) |
[NPM package](https://www.npmjs.com/package/metalsmith/v/2.4.1) | Node >= 8

## Highlights

* Plugins can now rely on a **new `Metalsmith#match` method** to match files by pattern. This implementation uses [micromatch](https://www.npmjs.com/package/micromatch) which came out as most performant in [a benchmark](https://github.com/metalsmith/metalsmith/issues/338#issuecomment-790111326)
  ```js
  // example plugin
  function MyPlugin(files, metalsmith) {
    // when no input is specified, matches against Object.keys(files)
    const img = metalsmith.match('**/*.{jpg,png}')
    // do not match dot files
    const  = metalsmith.match('**/*', Object.keys(files), { dot: false })
    // run on custom input
    const custom = metalsmith.match('**/*.{jpg,png}', ['.htaccess', 'img.jpg'], { dot: false })
  }
  ```
  See the new [API docs](/api/#Metalsmith+match) for detailed method signature information. 

* `Metalsmith#frontmatter` now accepts a **[gray-matter options](https://github.com/jonschlinkert/gray-matter#options) object** in addition to `true` or `false`:
  ```js
  Metalsmith(__dirname)
    .frontmatter({
      engines: {
        toml: toml.parse.bind(require('toml'))
      },
      language: 'toml',
      excerpt_separator: '~~~',
      delimiters: '~~~',
      excerpt: true
    })
  ```
  This means metalsmith now has native support for defining excerpts without a plugin, as an extra section below front-matter and for other front-matter languages like TOML. The config above would parse this as valid front-matter:

  ```md
  ~~~
  title = "Hello"
  ~~~
  This is my first post
  ~~~
  ```
  See also the [API docs](/api/#Metalsmith+frontmatter) for detailed method signature information. 
* **`Metalsmith#build`** can now be `await`'ed:
    ```js
    try {
      const files = await metalsmith.build()
    } catch (err) {
      console.error(err)
    }
    ```
    Furthermore build() silently fails if an error is thrown. Given the ability to `.then` the build and the impossibility to know whether a `.then` is actually attached, throwing an error or logging a warning in a default callback would cause more frustration to the promise-based build users than add value to the few users who forget to specify a callback.
    
    The signature `build(callback)` does not return a promise. Metalsmith users have to opt for one of the 2 build flows (callback or promise-based)

* [Important bugfix](https://github.com/metalsmith/metalsmith/issues/206#issuecomment-1005254540) for `Metalsmith#ignore` that ensures ignored paths will not accidentally be matched as absolute paths


## Full Release notes

### Added

- [#338] Added `Metalsmith#match` method. Plugins no longer need to require a matching library [`705c4bb`](https://github.com/metalsmith/metalsmith/commit/705c4bb), [`f01c724`](https://github.com/metalsmith/metalsmith/commit/f01c724)
- [#358] Added TS-style JSdocs [`828b17e`](https://github.com/metalsmith/metalsmith/commit/828b17e)
- Use native `fs.rm` instead of `rimraf` when available (Node 14.4+) [`fcbb76e`](https://github.com/metalsmith/metalsmith/commit/fcbb76e), [`66e4376`](https://github.com/metalsmith/metalsmith/commit/66e4376)
- [#226] Allow passing a gray-matter options object to `Metalsmith#frontmatter` [`a6438d2`](https://github.com/metalsmith/metalsmith/commit/a6438d2)
- Modernized dev setup [`ef7b781`](https://github.com/metalsmith/metalsmith/commit/ef7b781)
- Added 8 new tests (match method, front-matter options, path & symbolic link handling)
- Files object file paths are now guaranteed to be sorted aphabetically. [`4eb1184`](https://github.com/metalsmith/metalsmith/commit/4eb1184)
- [#211] `Metalsmith#build` now returns a promise which you can attach a `then/catch` to or `await`. The build callback model is still available. [`6d5a42d`](https://github.com/metalsmith/metalsmith/commit/6d5a42d)

### Removed

- [#231] Dropped support for Node < 8 [`2db47f5`](https://github.com/metalsmith/metalsmith/commit/75e6878), [`75e6878`](https://github.com/metalsmith/metalsmith/commit/75e6878)
- **Dependencies:**
  - `has-generators`: obsolete in supported Node versions [`2db47f5`](https://github.com/metalsmith/metalsmith/commit/2db47f5)
  - `absolute` replaced with native Node `path.isAbsolute` [`c05f9e2`](https://github.com/metalsmith/metalsmith/commit/c05f9e2) (@Zearin)
  - `is` replaced with own implementation [`7eaac9e2`](https://github.com/metalsmith/metalsmith/commit/7eaac9e2), [`54dba0c1`](https://github.com/metalsmith/metalsmith/commit/54dba0c1) (@Zearin)
  - `recursive-readdir`: replaced with own implementation [`4eb1184`](https://github.com/metalsmith/metalsmith/commit/4eb1184)

### Updated

- **Dependencies:** [`75e6878`](https://github.com/metalsmith/metalsmith/commit/75e6878)
  - `chalk`: 1.1.3 ⇒ 3.0.0
  - `gray-matter`: 2.0.0 ⇒ 4.0.3
  - `stat-mode`: 0.2.0 ⇒ 1.0.0
  - `rimraf`: 2.2.8 ⇒ 3.0.2
  - `ware`: 1.2.0 ⇒ 1.3.0
  - `commander` (used in CLI): 2.15.1 ⇒ 6.2.1
  - `win-fork` (used in CLI): replaced with `cross-spawn`:7.0.3

- Updated `CHANGELOG.md` format to follow “[Keep A Changelog](http://keepachangelog.com)” (#266) (@Zearin)

### Fixed

- [#206] `Metalsmith#ignore` now only matches paths relative to `Metalsmith#source` (as it should). See linked issue for details [`4eb1184`](https://github.com/metalsmith/metalsmith/commit/4eb1184)
- [#226] Metalsmith will no longer 'swallow' errors on invalid front-matter, they will be passed to `Metalsmith#build` [`a6438d2`](https://github.com/metalsmith/metalsmith/commit/a6438d2)
- Fix test error on Windows [#158] (@moozzyk)
- [#281] Metalsmith now properly handles symbolic links (will throw an ENOENT error or they can be `Metalsmith#ignore`'d) [`4eb1184`](https://github.com/metalsmith/metalsmith/commit/4eb1184)
- [#178] `Metalsmith#ignore` now removes the matched files *before* they are `statted` for glob-based ignores (saving some perf & potential errors).
- [#295] Metalsmith now catches all FS errors and passes them to the build callback/ thenable appropriately.

### Security

- Replace all occurences of `new Buffer` with `Buffer.from`


[#158]: https://github.com/metalsmith/metalsmith/issues/158
[#178]: https://github.com/metalsmith/metalsmith/issues/178
[#206]: https://github.com/metalsmith/metalsmith/issues/206#issuecomment-1008289480
[#211]: https://github.com/metalsmith/metalsmith/issues/211
[#226]: https://github.com/metalsmith/metalsmith/issues/226
[#231]: https://github.com/metalsmith/metalsmith/issues/231
[#281]: https://github.com/metalsmith/metalsmith/issues/281
[#295]: https://github.com/metalsmith/metalsmith/issues/295
[#338]: https://github.com/metalsmith/metalsmith/issues/338
[#358]: https://github.com/metalsmith/metalsmith/issues/358