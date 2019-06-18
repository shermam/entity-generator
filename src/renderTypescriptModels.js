module.exports = function(entity) {
  return `export class ${entity.className}Model {
${entity.Properties.map(renderProperty).join("\n")}
${entity.inRelations.map(renderInRelation).join("\n")}
${entity.outRelations.map(renderOutRelation).join("\n")}
}`;
};

function renderProperty(c) {
  return `  ${c.propertyName}: ${c.type.tsType};`;
}

function renderInRelation(r) {
  return `  ${r.refColumnName}Navigation: ${r.refTableName};`;
}

function renderOutRelation(r) {
  return `  ${r.tableName}: ${r.tableName}[]`;
}
