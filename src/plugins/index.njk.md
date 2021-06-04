---
title: Plugins
description: registered plugins
layout: plugins.njk
---

<label class="PluginFilter">
  <i class="PluginFilter-icon ss-search"></i>
  <input class="PluginFilter-input" placeholder="Filter plugins…" />
</label>

<ul class="PluginList">
  {% for plugin in plugins %}
    <li class="Plugin">
      <a class="Plugin-link" href="{{ plugin.repository }}">
        <h1 class="Plugin-title">
          {{ plugin.name }}<i class="Plugin-icon ss-{{ plugin.icon }}"></i>
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
        <a class="Plugin-badge" href="{{ plugin.repository }}">
          <img
            class="b-lazy"
            src="{{placeholderBadgeUrl}}"
            data-src="{{ plugin.githubStars }}"
            alt="GitHub stars"
          />
        </a>
      </div>
    </li>
  {% endfor %}
</ul>

<hr>

<h2 id="submit-your-plugin">Submit your plugin</h2>

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