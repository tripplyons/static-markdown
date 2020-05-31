# How to use static-markdown

## Installation

```
npm i -g static-markdown
```

## Basic Usage

1. Enter a project directory
2. Run `static-markdown` (the old `public` folder will be deleted)
3. Your site is usable in the `public` folder

## Full CLI

- `static-markdown` runs static-markdown on the current directory
- `static-markdown path/to/folder` runs static-markdown on a given folder
- `static-markdown -v` and `static-markdown --version` tell you which version of `static-markdown` is in use
- `static-markdown -h` and `static-markdown --help` give a help message

## Example Site

Check the `example-site` directory for an example or continue reading to see how to use `static-markdown`.

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
│   └── template.html
└── static
    ├── resource.png
    ├── favicon.ico
    ├── style.css
    └── folder
        └── ...
```

### Pages Directory

Markdown pages are in the form of:

```markdown
{ title: "Title of page", otherMetadata: "whatever" }
# Markdown
**More** markdown
...
```

And HTML pages are in the form of:

```html
{ title: "Title of page", otherMetadata: "whatever" }
<h1>HTML</h1>
<b>More</b> HTML
...
```

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

Notice that `folder/index.html` is equivalent to `folder.html`.

### Source Directory

#### source/constants.json

Defines variables for `template.html` to use.

#### source/template.html

Here is an example `template.html` taken from `example-site/source/template.html`:

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

It also can use constants defined in `source/constants.json` using [handlebars](https://handlebarsjs.com/guide/). Here is an example of using a constant called description in the above file:

```html
<meta name="description" content="{{ constants.description }}">
```

Similarly, JSON Metadata from the first line of each article can me used with `metadata.nameOfVariable`:

```html
<title>{{ metadata.title }}</title>
```

There is one special variable that can be used in templating:
- `article` refers to the HTML output of the markdown (remember to use `{{{ article }}}` to get the HTML output instead of text)

### Static Directory

Example Layout:

```
static
├── normalize.css
├── standard-html-page.html
└── logo.png
```

This folder's contents are copied to the public folder so other files can reference them.

It can also be used to have pages that do not go through `static-markdown`.

You can reference them as if they were at the root of your site:

```html
<link rel="stylesheet" href="/normalize.css">
```

---

**That's it!**
