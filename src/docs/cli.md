---
title: CLI reference
description: 'An up-to-date list of available metalsmith commands: build, init, clean'
draft: false
toc: true
layout: default.njk
order: 6
sitemap:
  priority: 0.7
  lastmod: 2026-02-09
config:
  anchors: true
---


## Metalsmith 

{% codeblock "metalsmith --help" %}
```plaintext
Usage: metalsmith [options] [command]

Metalsmith CLI

Options:
  -V, --version                          output the version number
  -h, --help                             display help for command

Commands:
  build [options]                        Run a metalsmith build
  init [options] [source] [destination]  Initialize a new metalsmith project from a git repo (subpath). Runs a sequence of git and filesystem commands.
                                         Assumes a working git executable in $PATH and properly configured git/ssh configs.
  clean [options] [destination]          Clean a directory
  help [command]                         display help for command

  Examples:

  # build from metalsmith.json:
  metalsmith

  # build from lib/config.json:
  metalsmith --config lib/config.json

  # override env vars
  metalsmith --env NODE_ENV=production TZ=Europe/London

  # override DEBUG env var (shortcut)
  metalsmith --debug @metalsmith/*
  
```
{% endcodeblock %}

### metalsmith build

{% codeblock "metalsmith build --help" %}
```plaintext
Usage: metalsmith build [options]

Run a metalsmith build

Options:
  -c, --config <path>  configuration file location (default: "metalsmith.json")
  --env <setting...>   Set or override one or more metalsmith environment variables.
  --debug              Set or override debug namespaces
  --dry-run            Process metalsmith files without outputting to the file system
  -h, --help           display help for command
```
{% endcodeblock %}

### metalsmith init 

{% codeblock "metalsmith init --help" %}
```plaintext
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
{% endcodeblock %}

### metalsmith clean

{% codeblock "metalsmith clean --help" %}
```plaintext
Usage: metalsmith clean [options] [destination]

Clean a directory

Arguments:
  destination          Destination directory, defaults to metalsmith.destination()

Options:
  -c, --config [path]  configuration file location (default: "metalsmith.json")
  -h, --help           display help for command
```
{% endcodeblock %}