#! /usr/bin/env node

const util = require('util');
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile);
const Entity = require('./entity');
const connectionString = require('./connectionstring')();
const Schema = require('./schema');
const schema = new Schema(connectionString);
const pdmInfo = require('./pdmInfo');

console.log('Conectando ao banco de dados...');

schema
    .getSchemas()
    .then(generate)
    .then(r => console.log('Arquivos gerados!'));

function generate(result) {

    return pdmInfo().then(info => {
        const retorno = result
            .map(t => new Entity(t, info))
            .map(e => {
                console.log(`Gerando arquivo ${e.className}.cs`);
                return writeFile(`${e.className}.cs`, e.render());
            });

        return Promise.all(retorno);
    });

}