#!/usr/bin/env node

const Handlebars = require('handlebars')
const fs = require('fs-extra')
const marked = require('marked')


async function main() {
    await fs.remove('public')
    await fs.copy('static', 'public')

    const templateFile = fs.readFileSync('source/template.html', {
        encoding: 'utf8'
    })
    const template = Handlebars.compile(templateFile)

    let articleFilenames = fs.readdirSync('pages/', {
            withFileTypes: true
        })
        .map(a => a.name)
        .filter(a => a.endsWith('.md'))

    const constantsFile = fs.readFileSync('source/constants.json', {
        encoding: 'utf8'
    })
    const constants = JSON.parse(constantsFile)

    for (let articleFileNumber in articleFilenames) {
        const articleFilename = articleFilenames[articleFileNumber]
        let articleLines = fs.readFileSync('pages/' + articleFilename, {
            encoding: 'utf8'
        }).split('\n')
        const articleTitle = articleLines.shift()
        const articleFile = articleLines.join('\n')
        const article = marked(articleFile)

        const result = template({
            article: article,
            title: articleTitle,
            constants: constants
        })

        if (articleFilename === 'index.md') {
            fs.writeFileSync('public/index.html', result)
        } else {
            const folder = 'public/' + articleFilename.split('.md')[0]
            fs.mkdirSync(folder)
            fs.writeFileSync(folder + '/index.html', result)
        }
    }
}

main()
