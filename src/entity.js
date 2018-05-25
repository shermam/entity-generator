const util = require('./util.js');
const render = require('./render');

module.exports = class Entity {
    constructor(schema, info) {
        this.tableName = schema.tableName;
        this.info = info && info[schema.tableName] ? info[schema.tableName] : null;
        this.className = this.getClassName(schema.tableName);
        this.Properties = this.getProperties(schema.columns);
        this.inRelations = (schema.inRelations || []).map(r => new Relation(r, info));
        this.outRelations = (schema.outRelations || []).map(r => new Relation(r, info));
    }

    render() {
        return render(this);
    }

    getClassName(tableName) {
        if (this.info) {
            return this.info.name;
        }

        return util.toPascalCase(tableName);
    }

    getProperties(columns) {
        const properties = [];

        for (let key in columns) {
            properties.push(new Property(columns[key], this.info));
        }

        return properties;
    }
}

class Property {
    constructor(columnSchema, info) {
        this.columnName = columnSchema.COLUMN_NAME;
        this.info = this.getInfo(info);
        this.propertyName = this.getPropertyName(columnSchema.COLUMN_NAME);
        this.type = util.sqlTypeToCSharpType(columnSchema.DATA_TYPE);
        this.isIdentity = !!columnSchema.IS_IDENTITY;
        this.size = columnSchema.CHARACTER_MAXIMUM_LENGTH;
        this.isNullable = columnSchema.IS_NULLABLE === 'YES';
        this.isPrimaryKey = !!columnSchema.IS_PRIMARY_KEY;
    }

    getPropertyName(columnName) {
        if (this.info) {
            return this.info.name;
        }
        return util.toPascalCase(columnName);
    }

    getInfo(info) {
        if (info) {
            return info.columns.find(i => {
                return i.code === this.columnName;
            });
        }
    }
}

class Relation {
    constructor(r, info) {
        this.info = info;
        this.class = this.getClassName(r.table);
        this.column = this.getColumnName(r.table, r.column);
        this.refClass = this.getClassName(r.referenced_table);
        this.refColumn = this.getColumnName(r.referenced_table, r.referenced_column);
    }

    getClassName(tableName) {
        if (this.info && this.info[tableName]) {
            return this.info[tableName].name;
        }
        return util.toPascalCase(tableName);
    }

    getColumnName(tableName, columnName) {
        let name = null;

        if (this.info && this.info[tableName]) {
            const cols = this.info[tableName].columns;

            for (let c of cols) {
                if (c.code === columnName) {
                    name = c.name;
                    break;
                }
            }
        }

        return name || util.toPascalCase(columnName);
    }
}