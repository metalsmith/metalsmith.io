---
title: Core plugin updates, new docs and a homepage revamp
description: Dual ESM/CJS bundling, Typescript support and centralized metalsmith.debug logging for core plugins. New and more extensive docs are being written and the homepage body got a full revamp featuring a starters and showcase section.
pubdate: 2022-11-05
layout: default.njk
sitemap:
  lastmod: 2022-11-05
---

I have been busy keeping up metalsmith and its core plugins with the Javascript ecosystem, so not many new domain-specific features but hopefully a gradually better developer experience for old and new metalsmith users.

## Dual ESM/CJS support for core plugins

Dual ESM/CJS support is underway for core plugins with the help of the [microbundle](https://github.com/developit/microbundle) package, and already implemented in most of the core plugins. Only [`@metalsmith/in-place`][core_plugin_in-place], [`@metalsmith/permalinks`][core_plugin_permalinks], [`@metalsmith/remove`][core_plugin_remove] and some smaller plugins remain.

Due to how NodeJS handles CJS `module.exports = defaultExport`, metalsmith is already ESM-compatible!
Pitfalls remain for core plugins with multiple exports or mixing default & named exports. Some of them will eventually require major version changes, but thanks to [conditional exports](https://nodejs.org/api/packages.html#conditional-exports) being patched into Node >= 12 versions, the Node version support will remain for Node 12.17.0+.

## Core plugins use metalsmith.debug

Usage of metalsmith 2.5.0's metalsmith.debug is being rolled out gradually to all plugins. Amongst others this enables logging the output to a centralized `metalsmith.log` file and controlling the debug namespaces from the metalsmith build programmatically through `metalsmith.env`. To know more about what this means have a look at the
[highlights from the Metalsmith 2.5.0 release news](/news/2022-06-10/metalsmith-2.5-released/#highlights).
## Core plugin Typescript support

Core plugins are also in the process of getting Typescript support: types will be bundled and distributed as part of the NPM packages they belong to.

## Website updates
### New homepage contents

The homepage has been revamped! It now better presents an overview of Metalsmith, features a [showcase](/#showcase) and [starter](/#use-a-starter) section.

### New documentation

The new documentation under [/docs](/docs) has been online now for a while. It's still incomplete but already provides a lot more information than the old homepage docs and is much more user-friendly. 

## Third-party integrations

[@wernerglinka](https://github.com/wernerglinka) and I have been working at testing third-party integrations with metalsmith. His work centers around SSG-compatible headless CMS'es like [Sanity.io](https://www.sanity.io/), [NetlifyCMS](https://www.netlifycms.org/) and [Forestry.io](https://forestry.io/).  My endeavors are focused on custom app development: combining an [express.js](https://expressjs.com) server with a decoupled API on one hand, and a Metalsmith build as base for <abbr title="Single Page App">SPA</abbr>'s on the other. I hope to get time to write docs about it soon or at least a news post.