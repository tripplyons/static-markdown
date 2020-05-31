#!/usr/bin/env node

const Handlebars = require('handlebars')
const fs = require('fs-extra')
const marked = require('marked')
// for `static-markdown -v`
const package = require('../package.json')
const version = package.version

// Red error messages
function error(message) {
    console.error(`\x1b[31mERROR: ${message}\x1b[0m`)
}

async function renderArticle(articlePath, template, constants) {
    // each line
    let articleLines = fs.readFileSync(articlePath, {
        encoding: 'utf8'
    }).split('\n')

    // first line becomes metadata
    let articleMetadata = JSON.parse(articleLines.shift())

    // others are the content
    let articleFile = articleLines.join('\n')

    let extentionParts = articlePath.split('.')
    let extension = extentionParts[extentionParts.length - 1]

    // the HTML version of the article before templating
    let article = ''
    if(extension === 'html') {
        article = articleFile
    } else {
        article = marked(articleFile)
    }

    // the final article
    let result = template({
        article: article,
        metadata: articleMetadata,
        constants: constants
    })

    // find where to output it
    let folder = articlePath.split('.' + extension)[0].split('pages/')[1]
    if (articlePath.endsWith('index.' + extension)) {
        await fs.outputFile('public/'+folder+'.html', result)
    } else {
        await fs.outputFile('public/'+folder + '/index.html', result)
    }
}

async function findSubdirs(path) {
    let contents = await fs.readdir(path)
    let dirs = contents.filter(content => !content.includes('.'))

    let paths = []

    paths.push.apply(paths, dirs)
    for(let dir in dirs) {
        paths.push.apply(paths, await findSubdirs(path + '/' + dirs[dir]))
    }

    return paths
}

async function findFiles(path) {
    let contents = await fs.readdir(path)
    let dirs = contents.filter(content => !content.includes('.'))
    let files = contents.filter(content => content.endsWith('.md') || content.endsWith('.html'))

    let paths = []

    paths.push.apply(paths, files.map(file => path + '/' + file))

    for(let dir in dirs) {
        paths.push.apply(paths, await findFiles(path + '/' + dirs[dir]))
    }

    return paths
}

// async for fs
async function main() {
    // make space for a new rendering
    await fs.remove('public')

    // add static files
    try {
        await fs.copy('static', 'public')
    } catch (e) {
        error('Could not find static/')
        return
    }

    // load template
    let templateFile
    try {
        templateFile = await fs.readFile('source/template.html', {
            encoding: 'utf8'
        })
    } catch (e) {
        error('Could not find source/template.html')
        return
    }
    let template = Handlebars.compile(templateFile)

    let articlePaths
    // find all articles
    try {
        articlePaths = await findFiles('pages')
        // console.log(articlePaths)
    } catch(e) {
        error('Could not find pages/')
        return
    }

    // load constants and parse JSON
    let constantsFile
    try {
        constantsFile = fs.readFileSync('source/constants.json', {
            encoding: 'utf8'
        })
    } catch (e) {
        error('Could not find source/constants.json')
        return
    }
    let constants
    try {
        constants = JSON.parse(constantsFile)
    } catch {
        error('source/constants.json is not valid JSON')
        return
    }

    // go through each article
    for (let articleFileNumber in articlePaths) {
        renderArticle(articlePaths[articleFileNumber], template, constants)
    }
}

// arguments past `node path/to/index.js`
let args = process.argv.slice(2)

if (args.includes('-h') || args.includes('--help')) {
    console.log(fs.readFileSync(__dirname + '/help.txt', {
        encoding: 'utf8'
    }))
} else if (args.includes('-v') || args.includes('--version')) {
    console.log(`static-markdown - verison ${version}`)
} else {
    main()
}
