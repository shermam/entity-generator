#! /usr/bin/env node

const util = require("util");
const fs = require("fs");
const pdmInfo = require("pdm-to-json");
const writeFile = util.promisify(fs.writeFile);
const Entity = require("./entity");
const Schema = require("./schema");
const convertConnectionString = require("./connectionstring");
const renderFactory = require("./render");
const getConfig = require("./config");
const renderContextFactory = require("./renderContext");
const csprojLoader = require("./csprojLoader");
const renderTypeScript = require("./renderTypescriptModels");

getConfig()
  .then(config => {
    const renderContext = renderContextFactory(
      config.sourceName,
      config.namespace
    );
    const render = renderFactory(config.namespace);
    const entitiesFolder = config.entitiesFolder;
    const connectionstring = convertConnectionString(config.source);
    const schema = new Schema(connectionstring);

    console.log("Conectando ao banco de dados...");

    schema
      .getSchemas()
      .then(generate)
      .then(r => console.log("Arquivos gerados!"))
      .catch(console.log);

    function generate(result) {
      console.log("Generating...");

      return pdmInfo(config.pdmFile).then(info => {
        const entities = result.map(t => new Entity(t, info));

        //writeFile("pdm.json", JSON.stringify(info, null, '  '));

        // console.log("Gerando arquivo Context...");
        // const retornoContext = writeFile("Context.cs", renderContext(entities));

        const retornoEntidades = [];
        // const retornoEntidades = entities.map(e => {
        //   console.log(`Gerando arquivo ${e.className}.cs`);
        //   return writeFile(
        //     `${entitiesFolder || "."}/${e.className}.cs`,
        //     render(e)
        //   );
        // });

        const retornoModels = entities.map(e => {
          console.log(`Gerando arquivo ${e.className}.model.ts`);

          return writeFile(
            `./${e.schema.tableSchema || ""}/${camelCaseToDash(
              e.className
            )}.model.ts`,
            renderTypeScript(e)
          );
        });

        // console.log("Reescrevendo project file");
        // const retornoProj = csprojLoader(
        //   config.projectFile,
        //   entities,
        //   config.entitiesFolder
        // );

        return Promise.all([...retornoModels]);
      });
    }
  })
  .catch(console.log);

function camelCaseToDash(myStr) {
  return myStr.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
