---
title: Metalsmith is back!
description: >
  After 5 years in maintenance-mode, Metalsmith.js has changed hands and is actively developed again.
  Core plugins moved to the Github & NPM metalsmith orgs, and a lot more changes.
pubdate: 2022-01-27
layout: default.njk
---

After a 5-year maintenance-mode break, Metalsmith.js is *back*. In a nutshell: the Metalsmith maintainers agreed to a transfer by Intellectual Property Assignment with [Segment][], &mdash; the previous owners & developers of Metalsmith. The software is now owned, maintained, and developed by [Kevin VL][webketje_gh] (me) doing business as [webketje][kbo], with periodic feedback from earlier maintainers [ismay][] and [Ajedi32][]. You can find more details about how Metalsmith got here on the [About page][].

## Who is the maintainer of metalsmith?

Hi! I am a Belgium-based IT-consultant specializing in front-end and Javascript/NodeJS, professionally active since late 2015 and active in open-source software development since 2014. I have a lot of experience with Node, NPM, SPA frameworks (React/Vue), DevOps, <abbr title="User Experience">UX</abbr> and <abbr title="Developer Experience">DX</abbr> and stay current with the latest trends in the Javascript ecosystem. I am especially interested in the Headless CMS and static site generator trends.

I firmly believe in the value of open-source and free software, as it has enabled my current career path. I believe Metalsmith is a valuable piece of software that has a role to play in the future, and have been using it since 2018. I've contributed to or supported [Gitter][], [KnockoutJS][], [jstransformers][], [GetSimpleCMS][], [VLC media player][], [Linux Mint][], and many others by way of financial, code or support contributions, for example [on Stackoverflow][webketje_so].

## Metalsmith updates

* **Metalsmith org on Github & NPM** &mdash; We've decided to consolidate the previously fragmented *core plugins* in the GitHub [metalsmith org][metalsmith_gh] and [NPM @metalsmith org][metalsmith_npm] to increase the appeal and ease of introduction to the tool.
* **New core plugins** &mdash; [`@metalsmith/sass`](https://github.com/metalsmith/sass) - a dart-sass implementation, and [`@metalsmith/table-of-contents`](https://github.com/metalsmith/table-of-contents), adopted from the former community plugin [`metalsmith-autotoc`](https://github.com/anatoo/metalsmith-autotoc).
* **TS-style JSdocs** &mdash; All core plugings now have more informative TS-style JSdocs, which will be understood as typehints in editors like VS Code. [@types/metalsmith](https://npmjs.com/package/@types/metalsmith) got a final update for v2.3.0 and an issue has been set up to track demand for TS support. [Add a thumbs up](https://github.com/metalsmith/metalsmith/issues/356) if you would like to see more support for TS in the future.
* **Metalsmith website redesign** &mdash; A responsive, multi-page website with a news, API, docs, and about section, all completely in metalsmith.
* **Added [contribution guidelines](https://github.com/metalsmith/metalsmith/CONTRIBUTING.md)**

## Going forward

First, as a lot of issues noted, the documentation is lacking and will be significantly improved with links to interactive examples on [replit.com](https://replit.com).
A lot has happened in the Node & JS ecosystems and in a first time the goal is to get Metalsmith on par with current alternatives.
This includes:

- Providing a dual CommonJS & ES module build for Node
- Adding utility methods to Metalsmith to make pugin development easier and more aligned
- Replacing the generator approach with a promise-based approach
- Exploring how NodeJS worker threads could potentially improve build times
- Exploring new vital core plugins (eg cache, js-bundlers, multilanguage)

A careful approach will be taken for Node support: the first 2 upcoming versions will drop support for Node <= 8, then Node <= 12, then following Node LTS releases <abbr title="End of Life">EOL</abbr>. 

I have a full-time job and other duties, but care a lot about Metalsmith and at the very least it and its core plugins will get frequent patch updates.
If you want to help out, be it with a starter template, idea, plugin, dev chore, please join [our Gitter channel](https://gitter.im/metalsmith/community) (also supports Matrix accounts), all help is welcome!

Looking forward to it.


[@webketje](https://github.com/webketje)

[Segment]: https://segment.com
[About page]: /about
[webketje_gh]: https://github.com/webketje
[webketje_so]: https://stackoverflow.com/users/1938203/webketje
[Gitter]: https://gitter.im
[KnockoutJS]: https://knockoutjs.com
[jstransformers]: https://github.com/jstransformers
[VLC media player]: https://www.videolan.org/vlc/
[Linux Mint]: https://linuxmint.com
[GetSimpleCMS]: https://get-simple.info
[metalsmith_gh]: https://github.com/metalsmith
[metalsmith_npm]: https://npmjs.com/org/metalsmith
[ismay]: https://github.com/ismay
[Ajedi32]: https://github.com/Ajedi32
[kbo]: https://kbopub.economie.fgov.be/kbopub/toonondernemingps.html?lang=en&ondernemingsnummer=759463478