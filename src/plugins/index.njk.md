---
title: Plugin registry
description: Metalsmith.js plugin registry
slug: plugins
layout: default.njk
sitemap:
  priority: 1.0
  lastmod: 2022-05-05
---

<p class="PluginList-subtitle">
  <span class="PluginHeader">{{ description | safe }}</span>
  <a href="#submit-your-plugin" class="PluginsSubmit">Submit yours</a>
</p>

<label class="PluginFilter">
  <i class="PluginFilter-icon ss-search"></i>
  <input class="PluginFilter-input" placeholder="Filter plugins…" />
</label>

<ul class="PluginList">
  {% for plugin in plugins %}
    <li class="Plugin {% if plugin.user == 'metalsmith' %}Plugin--core{% endif %}{% if plugin.status =='unmaintained' %} Plugin--unmaintained{% endif %}">
      {% if plugin.status =='unmaintained' %}
      <span class="Plugin-notice"><i class="Plugin-noticeIcon ss-alert"></i> This plugin hasn't been updated in <abbr title="5 years">a while</abbr>.</span>
      {% endif %}
      <a class="Plugin-link" href="{{ plugin.repository }}">
        <span class="Plugin-user">{{ plugin.user }}</span>
        <h1 class="Plugin-title">
          <i class="Plugin-icon ss-{{ plugin.icon }}"></i>{{ plugin.name }}
        </h1>
        <i class="Plugin-arrow ss-right"></i>
        <p class="Plugin-description">{{ plugin.description }}</p>
      </a>
      <div class="Plugin-badgeContainer">
        <a class="Plugin-badge" href="{{ plugin.npmUrl }}">
          <img
            class="b-lazy"
            src="{{placeholderBadgeUrl}}"
            data-src="{{ plugin.npmVersion }}"
            alt="npm version"
          />
        </a>
        <a class="Plugin-badge" href="{{ plugin.npmUrl }}">
          <img
            class="b-lazy"
            src="{{placeholderBadgeUrl}}"
            data-src="{{ plugin.npmDownloads }}"
            alt="npm downloads per year"
          />
        </a>
        {% if plugin.githubStars %}
        {# this badge will not work for plugins not hosted on Github #}
        <a class="Plugin-badge" href="{{ plugin.repository }}">
          <img
            class="b-lazy"
            src="{{placeholderBadgeUrl}}"
            data-src="{{ plugin.githubStars }}"
            alt="GitHub stars"
          />
        </a>
        {% endif %}
        {% if plugin.isCorePlugin %}
        <span class="Plugin-badge">
          <img src="https://img.shields.io/badge/metalsmith-core_plugin-green.svg" alt="core plugin">
        </span>
        {% endif %} 
      </div>
      <code class="Plugin-snippet desktop-only">npm i {{ plugin.npmName }}</code>
    </li>
  {% endfor %}
</ul>

<hr>

<h2 id="submit-your-plugin">Submit your plugin</h2>

Plugins in the official registry get higher visibility than those only published on Github or NPM, and they must pass a brief quality review. Guidelines for plugins to be accepted in the registry are:
* The package is published in the NPM registry
* The package includes at least 1 test
* The package provides functionality that is different from already registered plugins. Why? &mdash; because we want to encourage collaboration and reduce the amount of confusion for new metalsmith users.

Edit the [plugins.json](https://github.com/metalsmith/metalsmith.io/edit/master/lib/data/plugins.json) file and create a pull request to get your plugin listed.
Plugins need to be added at the correct alphabetical position by `name`: if your plugin's name is "b", it should come right after the plugin named "a".

Add a plugin object to the list with the following properties:

```js
{
  "name": "My plugin",
  "icon": "icon-name",
  "repository": "https://github.com/username/metalsmith-myplugin",
  "description": "Metalsmith plugin for doing something.",
  "npm": "@myscope/metalsmith-myplugin"
},
```
where:

* `name` - should match the NPM package or repository name, but can be in title case & with spaces
* `icon` - one of the [Metalsmith icons](https://jsfiddle.net/kevinvanlierde/csdbnto0/), preferably matching what the plugin does
* `repository` - url to the repository of the plugin, e.g. `https://github.com/username/metalsmith-myplugin`
* `description` - a short description for the plugin, ideally matching `package.json` or Github repository description
* `npm` - optional, to specify a name different than `name`, e.g. for scoped NPM packages (@&lt;myscope&gt;/&lt;metalsmith-myplugin&gt;)