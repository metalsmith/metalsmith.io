---
template: index.html
---


---


# Everything is a Plugin

All of the logic in Metalsmith is handled by plugins. You simply chain them together. Here's what the simplest blog looks like...

<pre><code><b>Metalsmith</b>(__dirname)
  .use(<b>markdown()</b>)
  .use(<b>templates</b>(<i>'handlebars'</i>))
  .build();
</code></pre>

...but what if you want to get fancier by hiding your unfinished drafts and using custom permalinks? Just add plugins...

<pre><code><b>Metalsmith</b>(__dirname)
  .use(<b>drafts()</b>)
  .use(markdown())
  .use(<b>permalinks</b>(<i>'posts/:title'</i>))
  .use(templates(<i>'handlebars'</i>))
  .build();
</code></pre>

...it's as easy as that!


---


# How does it work?

Metalsmith works in three simple steps:

  1. Read all the files in a source directory.
  2. Invoke a series of plugins that manipulate the files.
  3. Write the results to a destination directory!

Each plugin is invoked with the contents of the source directory, with every file parsed for optional YAML front-matter, like so...

<pre><code>---
<b>title</b>: A Catchy Title
<b>draft</b>: true
---

An unfinished article...
</code></pre>

<pre><code>{
  <i>'path/to/my-file.md'</i>: {
    title: <i>'A Catchy Title'</i>,
    draft: <b>true</b>,
    contents: <b>new</b> Buffer(<i>'An unfinished article...'</i>)
  }
}
</code></pre>

The plugins can manipulate the files however they want, and writing one is super simple. Here's the code for the drafts plugin from above:

<pre><code><b>function</b>(){
  <b>return function</b> <i>drafts</i>(files, metalsmith, done){
    <b>for</b> (<b>var</b> file <b>in</b> files) {
      <b>if</b> (files[file].draft) <b>delete</b> files[file];
    }
    done();
  };
}
</code></pre>

Of course they can get a lot more complicated too. That's what makes Metalsmith powerful; the plugins can do anything you want.


---


# Install it

Metalsmith and its plugins can be installed with npm:

<pre><code>$ <b>npm</b> install <i>metalsmith</i></code></pre>

The package exposes both a [Javascript API](https://github.com/segmentio/metalsmith#api), and [CLI](https://github.com/segmentio/metalsmith#cli) in case you're used to that type of workflow from other static site generators. To see how they're used check out the [examples](https://github.com/segmentio/metalsmith/tree/master/examples).


---


# A Little Secret

We keep referring to Metalsmith as a "static site generator", but it's a lot more than that. Since everything is a plugin, the core library is actually just an abstraction for manipulating a directory of files.

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

The plugins are all reusable. That PDF generator plugin for eBooks? Use it to generate PDFs for each of your blog posts too!

Check out [the code examples](https://github.com/segmentio/metalsmith/tree/master/examples) to get an idea for what's possible.


---


# The Plugins
The core Metalsmith library doesn't bundle any plugins by default. You just require new ones as needed, or make your own! 

Here's a list of the current plugins:

<ul class="Plugin-list">
{% for plugin in plugins %}
  <li class="Plugin">
    <a class="Plugin-link" href="{{ plugin.repository }}">
      <h1 class="Plugin-title">{{ plugin.name }}<i class="Plugin-icon ss-{{ plugin.icon }}"></i></h1>
      <i class="Plugin-arrow ss-right"></i>
      <p class="Plugin-description">{{ plugin.description }}</p>
    </a>
  </li>
{% endfor %}
</ul>

If you write your own plugin, submit a pull request to the [metalsmith.io](https://github.com/segmentio/metalsmith.io/tree/master/src/plugins.json) repository and it will show up here!


---
