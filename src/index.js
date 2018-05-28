#! /usr/bin/env node

const util = require('util');
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile);
const Entity = require('./entity');
const Schema = require('./schema');
const pdmInfo = require('./pdmInfo');
const convertConnectionString = require('./connectionstring');
const renderFactory = require('./render');
const getConfig = require('./config');

getConfig().then(config => {

    const render = renderFactory(config.namespace);
    const entitiesFolder = config.entitiesFolder;
    const connectionstring = convertConnectionString(config.source);
    const schema = new Schema(connectionstring);

    console.log('Conectando ao banco de dados...');

    schema
        .getSchemas()
        .then(generate)
        .then(r => console.log('Arquivos gerados!'));

    function generate(result) {

        return pdmInfo(config.pdmFile).then(info => {
            const retorno = result
                .map(t => new Entity(t, info))
                .map(e => {
                    console.log(`Gerando arquivo ${e.className}.cs`);
                    return writeFile(`${entitiesFolder || '.'}/${e.className}.cs`, render(e));
                });

            return Promise.all(retorno);
        });

    }

}).catch(console.log);