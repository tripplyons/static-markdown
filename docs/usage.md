# How to use static-markdown

## Installation

```shell
npm i -g static-markdown
```

## Basic Usage

1. Enter a project directory
2. Run `static-markdown` (the old `public` folder will be deleted)
3. Your site contents can be found in the `public` folder (a static site)

## Full CLI

- `static-markdown` runs static-markdown on the current directory
- `static-markdown path/to/folder` runs static-markdown on a given folder
- `static-markdown -v` and `static-markdown --version` tell you which version of `static-markdown` is in use
- `static-markdown -h` and `static-markdown --help` give a help message

## Example Site

Check the `example-site` directory for an example or continue reading for more on how to use `static-markdown`.

## Project Directory Layout

```
project
├── pages
│   ├── whatever-folder
│   │   ├── index.html
│   │   └── whatever-post.md
│   ├── index.md
│   └── whatever-post.html
├── source
│   ├── constants.json
│   ├── template.html
│   └── anotherTemplate.html
└── static
    ├── resource.png
    ├── favicon.ico
    ├── style.css
    └── folder
        └── ...
```

### Pages Directory

Markdown pages **can** contain HTML.

Markdown pages are in the form of:

```markdown
{ "title": "Title of page", "template": "template" }
# Markdown
**More** markdown
<i>HTML tags work</i>
...
```

And HTML pages are in the form of:

```html
{ "title": "Title of page", "template": "template" }
<h1>HTML</h1>
<b>More</b> HTML
<i>HTML tags work</i>
...
```

In this example, the `title` field is arbitrary.
You can use any name for your variables.
The one special metadata parameter is `template`.
This determines which HTML template is used to generate the HTML page.
Its default value is `template`, which refers to `source/template.html`.

`index.md` and `index.html` are special pages, and refer to the root of the folder it is in.

With our previous example:

```
pages
├── whatever-folder
│   ├── index.html
│   └── whatever-post.md
├── index.md
└── whatever-post.html
```

Makes the following URLs:

```
/
/whatever-post/
/whatever-folder/
/whatever-folder/whatever-post/
```

Notice that `folder/index.html` is equivalent to `folder.html`, and `index.md` is located at `/`.

### Source Directory

#### source/constants.json

Defines variables for `template.html` to use.

#### source/{templateName}.html

Here is an example HTML template taken from `example-site/source/template.html`:

```html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>{{ metadata.title }}</title>
	<meta name="description" content="{{ constants.description }}">

	<link rel="stylesheet" href="/normalize.css">
	<link rel="stylesheet" href="/github-markdown.css">
	<link rel="stylesheet" href="/github-markdown-fullscreen.css">
</head>

<body>
	<article class="markdown-body">
		<div>
			<div style="float:left;">
				<b><a href="/">{{ constants.siteName }}</a></b>
			</div>
			<div style="float:right">
				<a target="_blank" href="https://example.com">Example Link</a>
			</div>
		</div>
		<br>
		<hr>
		{{{ article }}}
	</article>
</body>

</html>
```

You can use [handlebars](https://handlebarsjs.com/guide/) for templating variables and other features supported by handlebars.

JSON Metadata from the first line of each article can me used with `metadata.nameOfVariable`:

```html
<title>{{ metadata.title }}</title>
```

You can also use constants defined in `source/constants.json`.

```html
<meta name="description" content="{{ constants.description }}">
```

There is one special variable that can be used in templating:
- `article` refers to the HTML output of the markdown (remember to use `{{{ article }}}` to get the HTML output instead of text)

### Static Directory

Example Layout:

```
static
├── style.css
├── standard-html-page.html
└── logo.png
```

This folder's contents are copied to the public folder so other files can reference them.

It can also be used to store pages that do not get converted by `static-markdown`.

You can reference assets as if they were at the root of your site:

```html
<link rel="stylesheet" href="/style.css">
```

If you want a different root, you can take advantage of constants.

```html
<link rel="stylesheet" href="{{ root }}/style.css">
```

---

**That's it!**
