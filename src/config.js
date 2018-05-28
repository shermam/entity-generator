const readLine = require('./readLine');
const util = require('util');
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const configFileName = 'egen-config.json';

module.exports = function () {
    return readFile(configFileName, 'utf8')
        .then(JSON.parse)
        .catch(createConfig);
}

function createConfig() {
    const config = {};

    return readLine.question('Entre com a String de Conexão:')
        .then(res => config.source = res)
        .then(_ => readLine.question('Entre com o namespace das classes de entidades:'))
        .then(res => config.namespace = res)
        .then(_ => readLine.question('Entre com o nome da pasta das classes de entidades:'))
        .then(res => config.entitiesFolder = res)
        .then(_ => readLine.question('Entre com o nome do arquivo pdm:'))
        .then(res => config.pdmFile = res)
        .then(_ => readLine.question('Entre com o nome do arquivo de projeto:'))
        .then(res => config.projectFile = res)
        .then(_ => readLine.question('Entre com o nome da connectionString no app.config:'))
        .then(res => config.sourceName = res)
        .then(_ => console.log(JSON.stringify(config, null, '  ')))
        .then(_ => readLine.close())
        .then(_ => writeConfigFile(config))
        .then(_ => config);
}

function writeConfigFile(config) {
    return writeFile(configFileName, JSON.stringify(config, null, '  '));
}