#!/usr/bin/env node

const Handlebars = require('handlebars')
const fs = require('fs-extra')
const marked = require('marked')
const package = require('../package.json')
const version = package.version

function error(message) {
    console.error(`\x1b[31mERROR: ${message}\x1b[0m`)
}

async function main() {
    await fs.remove('public')

    try {
        await fs.copy('static', 'public')
    } catch (e) {
        error('Could not find static/')
        return
    }

    let templateFile
    try {
        templateFile = fs.readFileSync('source/template.html', {
            encoding: 'utf8'
        })
    } catch (e) {
        error('Could not find source/template.html')
        return
    }

    let template = Handlebars.compile(templateFile)

    let articleFilenames
    try {
        articleFilenames = fs.readdirSync('pages/', {
                withFileTypes: true
            })
            .map(a => a.name)
            .filter(a => a.endsWith('.md'))
    } catch (e) {
        error('Could not find pages/')
        return
    }

    let constantsFile
    try {
        constantsFile = fs.readFileSync('source/constants.json', {
            encoding: 'utf8'
        })
    } catch(e) {
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

    for (let articleFileNumber in articleFilenames) {
        let articleFilename = articleFilenames[articleFileNumber]
        let articleLines = fs.readFileSync('pages/' + articleFilename, {
            encoding: 'utf8'
        }).split('\n')
        let articleTitle = articleLines.shift()
        let articleFile = articleLines.join('\n')
        let article = marked(articleFile)

        let result = template({
            article: article,
            title: articleTitle,
            constants: constants
        })

        if (articleFilename === 'index.md') {
            fs.writeFileSync('public/index.html', result)
        } else {
            let folder = 'public/' + articleFilename.split('.md')[0]
            fs.mkdirSync(folder)
            fs.writeFileSync(folder + '/index.html', result)
        }
    }
}

let args = process.argv.slice(2)

if (args.includes('-v') || args.includes('--version')) {
    console.log(`static-markdown - verison ${version}`)
} else {
    main()
}
