const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');

const compiledTemplates = new Map();

function initTemplates () {
    registerPartials();
    compileTemplates();
}

function parseTemplateName(fileName) {
    return fileName.toString().slice(0, fileName.length - '.hbs'.length);
}

function registerPartials () {
    const partialsPath = path.join(__dirname, 'templates/partials');
    const fileNames = fs.readdirSync(partialsPath, 'utf8');

    fileNames.forEach(fileName => {
        const filePath = path.join(partialsPath, fileName);
        const stats = fs.statSync(filePath);
        if (stats.isFile() && /\.hbs$/i.test(fileName)) {
            const templateContents = fs.readFileSync(filePath, 'utf8');
            hbs.registerPartial(parseTemplateName(fileName), templateContents);
        }
    })
}

function compileTemplates () {
    const templatesPath = path.join(__dirname, 'templates');
    const fileNames = fs.readdirSync(templatesPath, 'utf8');

    fileNames.forEach(fileName => {
        const filePath = path.join(templatesPath, fileName);
        const stats = fs.statSync(filePath);
        if (stats.isFile() && /\.hbs$/i.test(fileName)) {
            const templateContents = fs.readFileSync(filePath, 'utf8');
            compiledTemplates.set(parseTemplateName(fileName), hbs.compile(templateContents));
        }
    })
}

function getTemplate (templateName) {
    return compiledTemplates.has(templateName)
        ? compiledTemplates.get(templateName)
        : hbs.compile(`Failed to resolve template '${templateName}'`);
}

module.exports = {
    initSync: initTemplates,
    get: getTemplate
};