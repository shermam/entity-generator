const util = require('./util.js');
const render = require('./render');

module.exports = class Entity {
    constructor(schema) {
        this.tableName = schema.tableName;
        this.className = util.toPascalCase(schema.tableName);
        this.Properties = schema.columns.map(c => new Property(c));
        this.inRelations = (schema.inRelations || []).map(r => new Relation(r));
        this.outRelations = (schema.outRelations || []).map(r => new Relation(r));
    }

    render() {
        return render(this);
    }
}

class Property {
    constructor(columnSchema) {
        this.columnName = columnSchema.COLUMN_NAME;
        this.propertyName = util.toPascalCase(columnSchema.COLUMN_NAME);
        this.type = util.sqlTypeToCSharpType(columnSchema.DATA_TYPE);
        this.isIdentity = !!columnSchema.IS_IDENTITY;
        this.size = columnSchema.CHARACTER_MAXIMUM_LENGTH;
        this.isNullable = columnSchema.IS_NULLABLE === 'YES';
        this.isPrimaryKey = !!columnSchema.IS_PRIMARY_KEY;
    }
}

class Relation {
    constructor(r) {
        this.class = util.toPascalCase(r.table);
        this.column = util.toPascalCase(r.column);
        this.refClass = util.toPascalCase(r.referenced_table);
        this.refColumn = util.toPascalCase(r.referenced_column);
    }
}