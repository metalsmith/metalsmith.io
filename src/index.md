---
template: index.html
---


![]()


# Everything is a Plugin

All of the logic in Metalsmith is handled by plugins. You simply chain them together. Here's what the simplest blog looks like...

```js
Metalsmith(__dirname)
  .use(markdown())
  .use(templates('handlebars'))
  .build();
```

...but say you want to get a little fancier by hiding your unfinished drafts and using custom permalinks? Just add plugins...

```js
Metalsmith(__dirname)
  .use(drafts())
  .use(markdown())
  .use(permalinks('posts/:title'))
  .use(templates('handlebars'))
  .build();
```

...it's as easy as that.


![]()


# How does it work?

Metalsmith works in three simple steps:

  1. Read all the files in a source directory.
  2. Invoke a series of plugins that manipulate the files.
  3. Write the results to a destination directory.

Each plugin is invoked with a map of the entire source directory. And every file is parsed for optional YAML front-matter, like so...

```
---
title: A Catchy Article Title
draft: true
---

An unfinished article...
```
```js
{
  'path/to/my-file.md': {
    title: 'A Catchy Article Title',
    draft: true,
    contents: new Buffer('An unfinished article...')
  }
}
```

The plugins themselves can manipulate the files however they want, and writing them is super easy. Here's the code for the drafts plugin from above:

```js
function drafts(){
  return function(files, metalsmith, done){
    for (var file in files) {
      if (files[file].draft) delete files[file];
    }
    done();
  };
}
```

Of course they can get a lot more complicated too. That's what makes Metalsmith powerful--the plugins can do anything you want.


![]()


# A Little Secret
We keep referring to Metalsmith as a "static site generator", but really it's a lot more than that. Since everything is a plugin, the core library is really just an abstraction for manipulating a source directory.

Which means you could just as easily use it to make...

<ul class="Example-list">
{% for example in examples %}
  <li class="Example">
    <h1 class="Example-title">{{ example.name }}</h1>
    <ol class="Example-step-list">
    {% for step in example.steps %}
      <li class="Example-step ss-{{ step.icon }}">{{ step.text }}</li>
    {% endfor %}
    </ol>
  </li>
{% endfor %}
</ul>

And you can use the same plugins for all of them. That PDF generator plugin in the eBook Generator? Use it to generate PDFs for each of your blog posts!

Check out [the examples](https://github.com/segmentio/metalsmith/tree/master/examples) to get an idea for what's possible.


![]()


# Plugins
Metalsmith core doesn't have any plugins bundled with it by default, you just require plugins as needed. If you make your own plugin, submit a pull request and it will show up here.

<ul class="Plugin-list">
{% for plugin in plugins %}
  <li class="Plugin">
    <a class="Plugin-link" href="{{ plugin.repository }}">
      <h1 class="Plugin-title">{{ plugin.name }}<i class="Plugin-icon ss-{{ plugin.icon }}"></i></h1>
      <span class="Plugin-repository">{{ plugin.repository | replace('https://github.com/', '') }}</span>
      <p class="Plugin-description">{{ plugin.description }}</p>
    </a>
  </li>
{% endfor %}
</ul>


![]()