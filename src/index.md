---
title: "Metalsmith"
description: "An extremely simple, pluggable static site generator."
layout: index.html
---

---

# Install it

Metalsmith and its plugins can be installed with npm:

<pre><code>$ <b>npm</b> install <i>metalsmith</i></code></pre>

The package exposes both a [JavaScript API](https://github.com/segmentio/metalsmith#api), and [CLI](https://github.com/segmentio/metalsmith#cli) in case you're used to that type of workflow from other static site generators. To see how they're used check out the [examples](https://github.com/segmentio/metalsmith/tree/master/examples).


---


# Introduction

Metalsmith is an extremely simple, pluggable static site generator. So let us explain why:

## Why is Metalsmith a pluggable static site generator?

The task of a static site generator is to produce static build files that can be deployed to a web server. These files are built from source files. Basically for a static site generator this means:

1. from a source directory read the source files and extract their information
2. manipulate the information
3. write the manipulated information to files into a destination directory

Metalsmith is build on this reasoning. It takes the information from the source files from a source directory and it writes the manipulated information to files into a destination directory. All manipulations, however, it exclusively leaves to plugins.

Manipulations can be anything: translating templates, transpiling code, replacing variables, wrapping layouts around content, grouping files, moving files and so on. This is why we say *»Everything is a Plugin«*. And of course, several manipulations can be applied one after another. Obviously, in this case the sequence matters.


## Why is Metalsmith *extremely simple*?

1. When all manipulations are performed by plugins, the only thing Metalsmith has to do in its core is to provide for an underlying logic of actually how manipulations are dealt with and for a defined interface for the plugins. To achieve this, we only needed around 400 lines of code --- have a [look at the source yourself](https://github.com/metalsmith/metalsmith/blob/master/lib/index.js). We believe this is rather simple.

2. For manipulations Metalsmith uses a very clever, but extremely simple idea. All source files are initially converted into JavaScript objects with the usual **`{property: property value}`** pairs. These **`{property: property value}`** pairs contain information on the original file itself (such as its **`birthtime`** or **`path`**) and on its **`content`**. The JavaScript object for each file is then supplemented with all variables either specified in the front-matter of the file or elsewhere. The manipulations performed by the plugins are now nothing else then modifications applied to the JavaScript objects either by changing the properties or the property values.

3. Breaking down Metalsmith into a core and many plugins has several advantages. It reduces complexity. It gives the user the freedom to use exactly only those plugins he or she needs. Furthermore, it distributes the honor and the burdon of maintaining the Metalsmith core and its plugins onto the Metalsmith community. With this approach we hope to keep the Metalsmith environment pretty up-to-date.

4. Writing plugins itself is also rather simple. The plugin-interface is easy to understand and most plugins are also rather short.

5. Every site needs JavaScript anyway. Just like the popular task runners [gulp](http://gulpjs.com/) or [grunt](http://gruntjs.com/) Metalsmith is programmed in JavaScript. So, you do not have to rely on a further language such as Ruby, Python or Go. This also helps to keep your workflow simple.

---

# Everything is a Plugin --- A first example

All of the logic in Metalsmith is handled by plugins. You simply chain them together. Here's what the simplest blog looks like. It uses only two plugins, **`markdown()`** and **`layouts()`**...

<pre><code><b>Metalsmith</b>(__dirname)            // instantiate Metalsmith in the cwd
  .source('sourcepath')          // specify source directory
  .destination('destpath')       // specify destination directory
  .use(<b>markdown()</b>)               // transpile markdown into html
  .use(<b>layouts</b>({<i>engine: 'handlebars'</i>}))    
                                 // wrap a handlebars-layout
                                 // around transpiled html
  .build(function(err) {         // this is the actual build process
    if (err) throw err;          // throwing errors is required
  });
</code></pre>

... and by the way, if you do not want your destination directory to be cleaned before a new build, just add <b>`.clean(false)`</b>. But what if you want to get fancier by hiding your unfinished drafts and using permalinks? Just add plugins...


<pre><code><b>Metalsmith</b>(__dirname)
  .source('sourcepath')      
  .destination('destpath')
  <b>.clean(false)</b>                  // clean destination directory
                                 // before new build   
  .use(<b>drafts()</b>)                 // only files that are NOT drafts
  .use(markdown())
  .use(<b>permalinks()</b>)             // make a permalink output path
  .use(layouts({<i>engine: 'handlebars'</i>}))
  .build(function(err) {    
    if (err) throw err;
  });
</code></pre>

...it's as easy as that!

A small comment. Instead of [Handlebars](http://handlebarsjs.com/) you can also use other templating languages such as [Jade/Pug](http://jade-lang.com/).



---


# How does it work in more detail?

Metalsmith works in three simple steps:

  1. Read all the files in a source directory and transform them into a JavaScript object of JavaScript objects.
  2. Invoke a series of plugins that manipulate these objects.
  3. According to the information contained in the resulting objects write them as files into a destination directory

Every file in the source directory is transformed into a JavaScript Object. For instance,

`my-file.md:`
<pre><code>---
<b>title</b>: A Catchy Title
<b>draft</b>: false
---

An unfinished article...
</code></pre>

becomes

<pre><code>{
  <i>'sourcepath/to/my-file.md'</i>: {
    title: <i>'A Catchy Title'</i>,
    draft: <b>false</b>,
    contents: <i>'An unfinished article...'</i>
  }
}
</code></pre>

where the content of the file is always put into the property value of **`contents`** and with every file parsed for optional YAML front-matter. Thus, we finally have an JavaScript object of JavaScript objects. This encompassing JavaScript object is usally called **`files`** since it contains all the JavaScript objects that represent the files.

```
{
  "sourcepath/to/file1.md": {
    title: 'A Catchy Title',
    contents: 'An unfinished article...'
  },
  "sourcepath/to/file2.md": {
    title: 'An Even Better Title',
    contents: 'One more unfinished article...'
  }
}
```

The plugins can manipulate the JavaScript objects representing the original files however they want, and writing one is super simple. Here's the code for the **`drafts()`** plugin from above. The code just runs through the JS object **`files`** and deletes all contained JavaScript objects that have a property value of **`true`** for the property **`draft`**:

<pre><code><b>function</b>(){
  <b>return function</b> <i>drafts</i>(files, metalsmith, done){
    <b>for</b> (<b>var</b> file <b>in</b> files) {
      <b>if</b> (files[file].draft) <b>delete</b> files[file];
    }
    done();
  };
}
</code></pre>

Of course plugins can get a lot more complicated too. That's what makes Metalsmith powerful; the plugins can do anything you want and the community has written a large amount of plugins already.

<i><b>Note:</b> The order the plugins are invoked is the order they are in the build script or the metalsmith.json file for cli implementations.  This is important for using a plugin that requires a plugins output to work.</i>

If you are still struggling with the concept we like to recommend you the [**`writemetadata()`**](https://github.com/Waxolunist/metalsmith-writemetadata) plugin. It is a metalsmith plugin that writes the **`{property: property value}`** pairs excerpted from the JavaScript objects representing the files to the filesystem as json files. You can then view the json files to find out how files are represented internally in Metalsmith.

<pre><code>Metalsmith(__dirname)            
  .source('sourcepath')      
  .destination('destpath')   
  .use(markdown())          
  .use(layouts({engine: 'handlebars'}))
  .use(<b>writemetadata</b>({   // writes the file's JS objects into .json
    pattern: ['**/*'],
    ignorekeys: ['next', 'previous'],
    bufferencoding: 'utf8'
  }))
  .build(function(err) {         
    if (err) throw err;          
  });
</code></pre>

We believe, that understanding the internal representation of files as JavaScript objects is really key to fully grasp the concept of Metalsmith. To see this, we look at what happens in the second example chain above:

So, within the Markdown chain above after applying **`.use(markdown())`** the initial representation of the `my-file.md` becomes `my-file.html`...

```
{
  'sourcepath/to/my-file.html': {
    title: 'A Catchy Title',
    draft: false,
    contents: '<p>An unfinished article...</p>'
  }
}

```

end after applying **`.use(permalinks())`** it becomes:

```
{
  'sourcepath/to/my-file/index.html': {
    title: 'A Catchy Title',
    draft: false,
    contents: '<p>An unfinished article...</p>'
  }
}

```

Assuming somewhere amongst the source files we have defined a very simple standard handlebars layout file...

`layout.html`

{% raw %}
```
<!doctype html>
<html>
<head>
  <title>{{title}}</title>
</head>
<body>
  {{contents}}
</body>
</html>
```
{% endraw %}

... after applying **`.use(layouts())`** in our Metalsmith chain our JavaScript object becomes:

```
{
  'sourcepath/to/my-file/index.html': {
    title: 'A Catchy Title',
    draft: false,
    contents: '<!doctype html><html><head>
               <title>A Catchy Title</title></head><body>
               <p>An unfinished article...</p>
               </body></html>'
  }
}

```

Finally when the **`.build(function(err))`** is performed our JavaScript object is written to `destpath/to/myfile/index.html`. So you see, how the chain works. It's rather straight forward, isn't it?

---

# Metadata

For Metalsmith we have stated that everything is a plugin. That is true, but in addition the Metalsmith core also provides for a **`metadata()`** function. You can specify arbitrary **`{property: property value}`** pairs and these information will be globally accessible from each plugin.

<pre><code><b>Metalsmith</b>(__dirname)            
  .source('sourcepath')      
  .destination('destpath')   
  .clean(false)             // clean destination before new build
  <b>.metadata</b>({<i>
      author: 'John Doe',
      site: 'http://example.com'</i>
  })
  .use(markdown())          // transpile markdown into html
  .use(layouts({engine: 'handlebars'}))
  .use(<b>writemetadata</b>())     // writes the file's JS objects into .json
  .build(function(err) {         
    if (err) throw err;          
  });
</code></pre>





---

# Further information

Yes, we know. The documentation can be improved. If you want to help, give us a shout. But in the meantime have a look at the [Awesome Metalsmith list](https://github.com/metalsmith/awesome-metalsmith). There you will find references to a number of excellent tutorials, examples and use cases.



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
The core Metalsmith library doesn't bundle any plugins by default.

Here's a list of plugins that are provided by the awesome Metalsmith community. But mind you, this list is by no means complete, because not every author PRs his or her plugin. So you might want to search for further plugins:

<label class="Plugin-filter">
  <i class="Plugin-filter-icon ss-search"></i>
  <input class="Plugin-filter-input" placeholder="Filter plugins…" />
</label>

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
