#!/usr/bin/env node

const staticMarkdown = require('..')

// for `static-markdown -v`
const package = require('../package.json')
const version = package.version

// arguments past `node path/to/index.js`
let args = process.argv.slice(2)

if (args.includes('-h') || args.includes('--help')) {
    console.log(fs.readFileSync(__dirname + '/help.txt', {
        encoding: 'utf8'
    }))
} else if (args.includes('-v') || args.includes('--version')) {
    console.log(`static-markdown - verison ${version}`)
} else {
    if(args.length === 0) {
        staticMarkdown(process.cwd())
    } else {
        staticMarkdown(args[0])
    }
}
