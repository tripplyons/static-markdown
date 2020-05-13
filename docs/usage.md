# How to use static-markdown

## Installation

```
npm i -g static-markdown
```

## Usage

1. Enter a project directory
2. Run `static-markdown` (the old `public` folder will be deleted)
3. Use your site out of the `public` folder

## Example Site

Check the `example-site` directory for an example or continue reading to see how to lay out a folder for `static-markdown`.

## Project Directory Layout

```
project
├── pages
│   ├── whatever-folder
│   │   ├── index.md
│   │   └── whatever-post.md
│   ├── index.md
│   └── whatever-post.md
├── source
│   ├── constants.json
│   └── template.html
└── static
    └── *
```

### Pages Directory

Pages are in the form of:

```
Title of page
# Markdown
**More** markdown
...
```

`index.md` is a special page, and refers to the root of the folder it is in.

With our previous example:

```
└── pages
    ├── whatever-folder
    │   ├── index.md
    │   └── whatever-post.md
    ├── index.md
    └── whatever-post.md
```

Makes the following URLs

```
/
/whatever-post/
/whatever-folder/
/whatever-folder/whatever-post/
```

### Source Directory

#### source/constants.json

Defines variables for `template.html` to use.

#### source/template.html

Here is an example `template.html` taken from `example-site/source/template.html`.

```
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>{{ title }}</title>
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

The file can refer to local resources in the `static` folder just by using their path (not including `static/`).

It also can use constants defined in `source/constants.json` using [handlebars](https://handlebarsjs.com/guide/). Here is an example of using a constant called description in the above file.
```
<meta name="description" content="{{ constants.description }}">
```

There are two special variables that can be used in templating:
- `title` refers to the first line of the markdown page
- `article` refers to the HTML output of the markdown (remember to use `{{{ article }}}` to get HTML instead of text)


---

**That's it!**
