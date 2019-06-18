const Database = new require("./database");

module.exports = class Schema {
  constructor(connectionString) {
    this.db = new Database(connectionString);
    this.getSchemasQuery = `
            select
            T.TABLE_NAME,
            C.COLUMN_NAME,
            C.DATA_TYPE,
            COLUMNPROPERTY(object_id(C.TABLE_SCHEMA+'.'+C.TABLE_NAME), C.COLUMN_NAME, 'IsIdentity') as IS_IDENTITY,
            C.CHARACTER_MAXIMUM_LENGTH,
            C.IS_NULLABLE,
            ISNULL(OBJECTPROPERTY(OBJECT_ID(U.CONSTRAINT_SCHEMA + '.' + QUOTENAME(U.CONSTRAINT_NAME)), 'IsPrimaryKey'),0) as IS_PRIMARY_KEY,
            U.ORDINAL_POSITION,
            T.TABLE_SCHEMA
            from information_schema.COLUMNS C
            INNER JOIN INFORMATION_SCHEMA.TABLES T ON T.TABLE_NAME = C.TABLE_NAME
            LEFT OUTER JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS TC ON (TC.CONSTRAINT_TYPE = 'PRIMARY KEY' AND TC.TABLE_NAME = T.TABLE_NAME)
            LEFT OUTER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE U ON (U.COLUMN_NAME = C.COLUMN_NAME AND U.TABLE_NAME = C.TABLE_NAME AND U.CONSTRAINT_NAME = TC.CONSTRAINT_NAME)
            where T.TABLE_TYPE = 'BASE TABLE'
        `;

    this.getRelationsQuery = `
            SELECT distinct
            tab1.name AS [table],
            col1.name AS [column], 
            tab2.name AS [referenced_table], 
            col2.name AS [referenced_column] 
        FROM sys.foreign_key_columns fkc 
        INNER JOIN sys.objects obj 
            ON obj.object_id = fkc.constraint_object_id 
        INNER JOIN sys.tables tab1 
            ON tab1.object_id = fkc.parent_object_id 
        INNER JOIN sys.schemas sch 
            ON tab1.schema_id = sch.schema_id 
        INNER JOIN sys.columns col1 
            ON col1.column_id = parent_column_id AND col1.object_id = tab1.object_id 
        INNER JOIN sys.tables tab2 
            ON tab2.object_id = fkc.referenced_object_id 
        INNER JOIN sys.columns col2 
            ON col2.column_id = referenced_column_id AND col2.object_id = tab2.object_id 
        `;
  }

  getSchemas() {
    console.log("Getting schema information...");

    return Promise.all([this.getColumns(), this.getRelations()])
      .then(this.mapRelations)
      .then(mapToArray)
      .catch(console.log);
  }

  getRelations() {
    return this.db.query(this.getRelationsQuery);
  }

  getColumns() {
    return this.db.query(this.getSchemasQuery).then(resultToMap);
  }

  mapRelations([tables, relations]) {
    if (!relations) return tables;
    console.log("Mapping relations...");

    relations.forEach(r => {
      if (tables[r.table]) {
        tables[r.table].inRelations = tables[r.table].inRelations || [];
        tables[r.table].inRelations.push(r);
      }

      if (tables[r.referenced_table]) {
        tables[r.referenced_table].outRelations =
          tables[r.referenced_table].outRelations || [];
        tables[r.referenced_table].outRelations.push(r);
      }
    });
    return tables;
  }
};

function resultToMap(array) {
  console.log("Mapping result...");

  return array.reduce((p, c) => {
    p[c.TABLE_NAME] = p[c.TABLE_NAME] || {
      tableName: c.TABLE_NAME,
      tableSchema: c.TABLE_SCHEMA,
      columns: {}
    };
    p[c.TABLE_NAME].columns[c.COLUMN_NAME] = c;
    return p;
  }, {});
}

function mapToArray(map) {
  const array = [];
  for (const key in map) {
    const element = map[key];
    array.push(element);
  }
  return array;
}
