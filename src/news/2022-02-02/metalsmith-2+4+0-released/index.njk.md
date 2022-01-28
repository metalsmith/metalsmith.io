---
title: Metalsmith 2.4.0 released
description: Metalsmith 2.4.0 released
pubdate: 2022-02-02
layout: default.njk
draft: true
---

Metalsmith 2.4.0 is out! 

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
