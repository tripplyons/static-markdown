# static-markdown API

For the CLI and how to set up a project, check out [usage.md](usage.md) in the `docs` folder,

## Running Example Using the static-markdown API

See [example-program](../example-program) for a simple program that automatically builds the example site.

## Example Program

Add it to a project:

```shell
npm i -s static-markdown
```

Use it in your code:

```javascript
const staticMarkdown = require('static-markdown')

// Run static-markdown on the given path
staticMarkdown('path/to/folder')
```
