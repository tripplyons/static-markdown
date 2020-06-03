const Handlebars = require('handlebars')
const fs = require('fs-extra')
const marked = require('marked')
const path = require('path')

// Red error messages
function error(message) {
    console.error(`\x1b[31mERROR: ${message}\x1b[0m`)
    return message
}

async function renderArticle(dir, articlePath, constants) {
    // each line
    let articleLines = fs.readFileSync(articlePath, {
        encoding: 'utf8'
    }).split('\n')

    // first line becomes metadata
    let articleMetadata = JSON.parse(articleLines.shift())

    // {"template": "template"} by default
    let templateToUse = articleMetadata.template || 'template'
    // load template
    let templateFile
    try {
        templateFile = await fs.readFile(path.join(dir, `source/${templateToUse}.html`), {
            encoding: 'utf8'
        })
    } catch (e) {
        return error(`Could not find source/${templateToUse}.html`)
    }
    let template = Handlebars.compile(templateFile)

    // most lines are the content
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

    // find where to output it (the part after `pages/` without the extension)
    let folder = articlePath.split('.' + extension)[0].split('pages/').slice(-1)[0]
    if (articlePath.endsWith('index.' + extension)) {
        await fs.outputFile(path.join(dir, 'public', folder + '.html'), result)
    } else {
        await fs.outputFile(path.join(dir, 'public', folder, 'index.html'), result)
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
async function main(dir) {
    // make space for a new rendering
    await fs.remove(path.join(dir, 'public'))

    // add static files
    try {
        await fs.copy(path.join(dir, 'static'), path.join(dir, 'public'))
    } catch (e) {
        return error('Could not find static/')
    }

    let articlePaths
    // find all articles
    try {
        articlePaths = await findFiles(path.join(dir, 'pages'))
        // console.log(articlePaths)
    } catch(e) {
        return error('Could not find pages/')
    }

    // load constants and parse JSON
    let constantsFile
    try {
        constantsFile = fs.readFileSync(path.join(dir, 'source/constants.json'), {
            encoding: 'utf8'
        })
    } catch (e) {
        return error('Could not find source/constants.json')
    }
    let constants
    try {
        constants = JSON.parse(constantsFile)
    } catch {
        return error('source/constants.json is not valid JSON')
    }

    // go through each article
    for (let articleFileNumber in articlePaths) {
        renderArticle(dir, articlePaths[articleFileNumber], constants)
    }
}

module.exports = main
