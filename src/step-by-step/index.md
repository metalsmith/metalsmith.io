---
title: "Metalsmith: Step by step"
description: "A step-by-step walkthrough of how to Metalsmith"
layout: index.html
---

---

# What we're going to accomplish

_(Note that this includes a lot of explanation and exposition. You can skip down to [the TL;DR version](#tl-dr) if you'd rather just see the results.)_

In this example, we're going to run through a very common use case and convert Markdown into HTML. The process to make a basic static site builder is pretty straightforward: We read markdown files from a source directory, convert them from markdown onto HTML fragments, put those fragments into a page template, and then save the compiled HTML page(s) into a destination directory.

Keep in mind that the exact same process we're going to create here could be altered to run nearly any file-by-file transformation we'd like. We could be converting LESS into CSS or taking SVG source files and running a few transformations to create slightly different SVG files. The Markdown to HTML example is just that: A single example.

Also note that there are _two ways to run Metalsmith_: with the API by creating a node script or through the CLI by creating a metalsmith.json configuration file. The end results are _the same either way_ and it's really a matter of preference. What we're going to do here is run through the API approach first. Then, at the end, we'll convert it into a CLI example that accomplishes the exact same thing. Normally, you just do whichever happens to work best with your comfort level and workflow.

The only requirement to follow along and run your own copy is that you have [a reasonably current version of Node installed](https://nodejs.org/). Aside from Node itself, our project is going to be be completely self-contained and there's nothing to uninstall or clean up afterward except the single directory with all our working files, dependencies, and the compiled results.

---

# Setup
## The files and folders that make up a project

First, we'll need a project folder, which we'll just call __project__. This will contain everything we need to run Metalsmith and create our HTML. In this folder, we're going to make the following files:

1. a __source directory__, _./src/_ by default, with our source Markdown-formatted content;
2. a __layouts__ folder with our single Handlebars template; and
3. our __node script__ to configure and run Metalsmith itself.

We'll be using NPM (Node's built-in package manager) to install [Metalsmith](https://github.com/segmentio/metalsmith) and two plugins to accomplish our two tasks: [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown) will convert our markdown files into HTML fragments while [metalsmith-layouts](https://github.com/superwolff/metalsmith-layouts) will put our HTML fragments into that Handlebars template.

The installation and build processes will create a few more items in our project folder, automatically adding them for us. In addition to those we've created above, we'll eventually also have:

1. a __package.json__ file which NPM uses to keep track of our project information;
2. a __node_modules__ folder where NPM installs Metalsmith and its plugins; and
3. a __destination folder__, called _./build/_, where Metalsmith generates the results.

We'll never actually touch or change any of those generated files directly. NPM will create and update package.json and node_modules for us during the initial setup while the entire purpose of this example is to get Metalsmith to generate the build folder.

## Getting started

Let's open a command prompt and dive in. We'll make a directory, `cd` into that directory, and tell NPM to create a package.json file for us so we can install Metalsmith and its plugins.

```bash
$ mkdir project
$ cd project
$ npm init -y
```

`npm init` will normally ask you a few questions about what to call your project, versioning, licensing, etc. In this case, we're using the `-y` flag, which just accepts all the defaults. You'll end up with a package.json file that defines a project called "project" whose main file is "index.js", which is the relevant info for this example. Now that we've initialized NPM, we can use it to install Metalsmith and the plugins which we need for our project. Additionally, metalsmith-layouts lets you define and install your choice of templating engine, so we'll also install Handlebars as well.

```bash
$ npm install --save-dev metalsmith metalsmith-markdown metalsmith-layouts handlebars
```

That line tells NPM to go fetch the current stable versions of our requirements, place them in the node_modules directory, and `--save-dev` saves references to these modules as development dependencies in the package.json file.

When initializing our project folder, `npm init` creates an entry point and the default is __index.js__. That'll be our node script, so let's create a blank file for now. We'll also do the same for our template (which we'll call __./layouts/default.hbs__) and we'll need to set up our source directory with at least one markdown file in it (let's use the default _src_ folder and add our single page as __./src/index.md__).

```bash
$ touch index.js
$ mkdir layouts
$ touch layouts/default.hbs
$ mkdir src
$ touch src/index.md
```

Ok, that's our setup and we have now:

1. installed our requirements with NPM using package.json and node_modules,
2. set up our script as index.js,
3. created our layouts/default.hbs template, and
4. made our first source file at src/index.md.

Keep in mind that this could all be prepared for you in advance with a little bit of project scaffolding - we're just starting from scratch for the sake of this example. All we have to do now is create some content, create a template, and write the script itself.

---

# The content
## Creating HTML fragments using metalsmith-markdown

Open up _src/index.md_ in your editor of choice and let's add some content. There are two parts to each source file: its __YAML Frontmatter__ and its __Markdown content__. Frontmatter is used by Metalsmith by default. While you could override or replace it with plugins, if desired, we're going to make use of it to set three properties of each page:

1. Setting the title of the page as `title`
2. Setting the description of the page, called `description`.
3. Telling metalsmith-layouts to use our default.hbs template file, which metalsmith-layouts calls `layout`.

Keep in mind that using markdown for your source files, while a popular use case and the point of our example, is just one of many options. The exact same series of steps could work for preprocessing different file types with a few different plugins. Additionally, note that, while the plugin we're using for templating requires a property called `layout` to know which template to use, the `title` and `description` properties are _completely arbitrary_. We're choosing to use those in our template, but they're in no way required or defined by Metalsmith itself.

Here's what that source file looks like as a result, with some _lorem ipsum_ content and a sprinkling of markdown to see the conversion in action.

### src/index.md

```markdown
---
title: Example
description: This page is just an example.
layout: default.hbs
---

## Lorem ipsum

Dolor sit amet, consectetur __strong__ adipiscing elit. Morbi faucibus, _em_ purus at gravida dictum, libero arcu convallis lacus, in commodo libero metus eu nisi. Nullam commodo, neque nec porta placerat, nisi est fermentum augue, [link](https://metalsmith.io) vitae gravida tellus sapien sit amet tellus. Aenean non diam orci. Proin quis elit turpis. Suspendisse non diam ipsum.

### Suspendisse nec ullamcorper odio.

- Vestibulum arcu mi, sodales non suscipit id, ultrices ut massa.
- Sed ac sem sit amet arcu malesuada fermentum.
- Nunc sed.

```

That gives us the metadata properties and the content we'll use in our template and some markdown to convert into an HTML fragment, leaving us ready to apply the layout. We've also got the `layout` property, which tells metalsmith-layouts which template to apply from our layouts directory.

---

# The template
## Turning HTML fragments and metadata into complete HTML files

We're not going to create anything particularly fancy with our layout. We will, however, be using a few variables in our template. These variables are the same metadata properties we created in our frontmatter, above. Here's the code for a basic template:

### layouts/default.hbs

{% raw %}
```handlebars
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>{{ title }}</title>
	<meta name="description" content="{{ description }}" />
</head>
<body>

	<h1>{{{ title }}}</h1>
	{{{ contents }}}

</body>
</html>
```
{% endraw %}

Note that we're using 3 variables: title, description, and contents. While we defined title and description ourselves in our frontmatter, __contents__ is where Metalsmith puts the contents of our source file.

Also note the double and triple braces. Double braces escape any HTML and result in plain text. The `<title>` element in the `<head>` can't have other elements nested inside of it, so we're just using double braces around `title`. By the time the `contents` variable gets to our template, on the other hand, it is a fragment of perfectly valid, usable HTML, so we drop it into our template as-is, using triple braces.

---

# The script
## Configuring Metalsmith to use our plugins

Metalsmith API usage generally follows a common pattern:

1. You `require()` Metalsmith and your plugins.
2. Start up Metalsmith and tell it where to run (which is almost always just `__dirname`, meaning the current directory).
3. You then `.use()` each the plugins you need for your project, in order. This is where the proverbial magic happens.
4. Use Metalsmith's `.build()` method to fire it all off and report any errors.

There are additional configuration options we could use and opportunities to add site-wide, global metadata if desired. For our purposes, we're using default directory names and putting our metadata in our single source file, so our script is quite straightforward:

### index.js

```javascript
// Get our requirements, installed by NPM
var Metalsmith  = require('metalsmith'),
	markdown    = require('metalsmith-markdown'),
	layouts     = require('metalsmith-layouts');

// Run Metalsmith in the current directory.
// When the .build() method runs, this reads
// and strips the frontmatter from each of our
// source files and passes it on to the plugins.
Metalsmith(__dirname)

	// Use metalsmith-markdown to convert
	// our source files' content from markdown
	// to HTML fragments.
	.use(markdown())

	// Put the HTML fragments from the step above
	// into our template, using the Frontmatter
	// properties as template variables.
	.use(layouts({

		// metalsmith-layouts requires that you 
		// tell it what templating engine to use.
		engine: 'handlebars',

	}))

	// And tell Metalsmith to fire it all off.
	.build(function(err, files) {
		if (err) { throw err; }
	});
```

There is a wide range of plugins that you could choose to `.use()` for any given project. For this example, however, that's all we need. If you needed further processing done on the source files, you could just continue to chain further `.use()` methods to add additional plugins, in order, and ultimately ending with `.build()`. 

Save it and you can now tell Node to run your new script.

```bash
$ node index
```

With that, each markdown file in `src` is used to generate a corresponding html file in `build` using our content, metadata, and template. Do you hear that noise? That's the sweet, sweet sound of success.

---

# CLI usage
## An alternate way to get the same results

The node script created above is an example of using the Metalsmith API and creating a _code-based_ implementation. There's a second example which works based upon _configuration and convention_. When you use the CLI approach, you create a configuration file, called __metalsmith.json__ which contains all the configuration options for Metalsmith and identifies the plugins, the order in which they run, and any plugin configuration (like the layouts' `engine` property in our example above).

If using the CLI approach, you no longer need our index.js file in your project. Instead, you need to create a metalsmith.json file to provide the same information to Metalsmith. In our example, here's what it would look like:

### metalsmith.json

```json
{
	"plugins": {
		"metalsmith-markdown": {},
		"metalsmith-layouts": {
			"engine": "handlebars"
		}
	}
}
```

Note that we don't have to set up our requirements or use `.build()`. For our simple example, we just tell Metalsmith to use metalsmith-markdown and then run metalsmith-layouts with our configuration options. With this one-time setup, we can run Metalsmith at any time from the command line using the `metalsmith` command.

If you'd like to use the local copy we've already installed, we just have to specify exactly where to find the library's `bin` folder and the executable command. With a little digging, you'll find that you can use a command like this, with no additional installation steps required:

```bash
$ ./node_modules/metalsmith/bin/metalsmith
```

Once that runs, you will get the exact same results in the build directory. In fact, it helps to completely delete the entire build directory, just so you can see and confirm that it ran.

If you'd rather use the simpler, configuration-based CLI approach, you can safely discard index.js. It's no longer in use and the CLI approach always reads metalsmith.json instead. Similarly, if you prefer the more expressive, code-based API approach, then you can discard metalsmith.json, as it has no purpose. Either method builds the exact same files in the `build` directory and you can run it however you'd prefer.

### Optionally installing Metalsmith globally

The command above is a bit unwieldy. Most often people regularly using the CLI approach will install Metalsmith _globally_. That means you can use the `metalsmith` command wherever you'd like and it'll look for a metalsmith.json file in the current directory and use that. If you would like to install it globally, you can do so with NPM.  Note that this _will_ remain installed even if you delete the project folder.

```bash
$ npm install -g metalsmith
```

If installed globally, then running metalsmith in your current directory—or any current directory with its own metalsmith.json file—is quite a bit simpler:

```bash
$ metalsmith
```

---

# Wrapping up
## If you've made it this far, congratulations.

You've accomplished everything we've set out to do. You have successfully…

1. Set up your project folder and all the necessary files.
2. Installed your requirements
3. Created some source content.
4. Created a page template.
5. Created a node script using the Metalsmith API to run your content through the two required steps we identified at the outset.
6. Run your script in Node and founds the results in the `build` folder.
7. Created a `metalsmith.json` file that runs through the exact same Metalsmith plugins and settings.
8. Run the CLI version of Metalsmith, reading your configuration from metalsmith.json and doing the exact same task.

You'll find that you can continue to add content, if so desired, to the src folder. Each and every source markdown file that you add will create yet another HTML file in the build directory with the same path (aside from having a .html extension instead of .md).

---

# TL;DR
## Too long; didn't read

In the steps described above, we have set up the project and its dependencies in a folder called 'project' using the command line:

```bash
$ mkdir project
$ cd project
$ npm init -y
$ npm install --save-dev metalsmith metalsmith-markdown metalsmith-layouts handlebars
$ touch index.js
$ mkdir layouts
$ touch layouts/default.hbs
$ mkdir src
$ touch src/index.md
```

We created a single source file, with YAML frontmatter defining some metadata and which template to use, followed by the file's markdown-formatted content:

## src/index.md

```markdown
---
title: Example
description: This page is just an example.
layout: default.hbs
---

## Lorem ipsum

Dolor sit amet, consectetur __strong__ adipiscing elit. Morbi faucibus, _em_ purus at gravida dictum, libero arcu convallis lacus, in commodo libero metus eu nisi. Nullam commodo, neque nec porta placerat, nisi est fermentum augue, [link](https://metalsmith.io) vitae gravida tellus sapien sit amet tellus. Aenean non diam orci. Proin quis elit turpis. Suspendisse non diam ipsum.

### Suspendisse nec ullamcorper odio.

- Vestibulum arcu mi, sodales non suscipit id, ultrices ut massa.
- Sed ac sem sit amet arcu malesuada fermentum.
- Nunc sed.

```

We made our basic handlebars template to change our HTML fragment into a complete HTML page, with `contents` as the property Metalsmith uses to store the contents of the source file and our `title` and `description` metadata from the source file available as template variables:

## layouts/default.hbs
{% raw %}
```handlebars
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>{{ title }}</title>
	<meta name="description" content="{{ description }}" />
</head>
<body>

	<h1>{{{ title }}}</h1>
	{{{ contents }}}

</body>
</html>
```
{% endraw %}


We created the script to configure Metalsmith to assemble our source files using our metalsmith-markdown and metalsmith-layouts plugins:

## index.js

```javascript
// Get our requirements, installed by NPM
var Metalsmith  = require('metalsmith'),
	markdown    = require('metalsmith-markdown'),
	layouts     = require('metalsmith-layouts');

// Run Metalsmith in the current directory.
// When the .build() method runs, this reads
// and strips the frontmatter from each of our
// source files and passes it on to the plugins.
Metalsmith(__dirname)

	// Use metalsmith-markdown to convert
	// our source files' content from markdown
	// to HTML fragments.
	.use(markdown())

	// Put the HTML fragments from the step above
	// into our template, using the Frontmatter
	// properties as template variables.
	.use(layouts({

		// metalsmith-layouts requires that you 
		// tell it what templating engine to use.
		engine: 'handlebars',

	}))

	// And tell Metalsmith to fire it all off.
	.build(function(err, files) {
		if (err) { throw err; }
	});
```

With the script in place, we used __Node to run it__ with a single command:

```bash
$ node index
```

After doing so, our source file's content and metadata from `./src/index.md` generated the corresponding html file, found at `./build/index.html`. That's a working API implementation.

Then, to demonstrate a version using the CLI approach, we created a metalsmith.json file with the same configuration.

## metalsmith.json

```json
{
	"plugins": {
		"metalsmith-markdown": {},
		"metalsmith-layouts": {
			"engine": "handlebars"
		}
	}
}
```

And to run the CLI version using metalsmith.json as the configuration, we ran the Metalsmith command already installed by NPM.

```bash
$ ./node_modules/metalsmith/bin/metalsmith
```

… Which generates the exact same file in the build directory when you run it. If you prefer the CLI approach, read about [installing Metalsmith globally](#optionally-installing-metalsmith-globally), above, to make your life easier.