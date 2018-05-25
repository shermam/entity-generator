const namespace = require('./namespace')();

module.exports = function (entity) {
    return `namespace ${namespace}
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("${entity.tableName}")]
    public partial class ${entity.className}
    {
        public ${entity.className}()
        {
${entity.outRelations.map(renderOutRelationInit).join('\n')}
        }

${entity.Properties.map(renderProperty).join('\n\n')}

${entity.inRelations.map(renderInRelation).join('\n\n')}

${entity.outRelations.map(renderOutRelation).join('\n\n')}
    }
}
    `;
}

function renderProperty(c) {
    return [
        `${c.isPrimaryKey ? '[Key]' : ''}`,
        `${c.isIdentity ? '[DatabaseGenerated(DatabaseGeneratedOption.Identity)]' : ''}`,
        `${!c.isNullable && c.type.nullability === 'annotation' ? '[Required]' : ''}`,
        `${c.type.lengthInfo && c.size ? `[${c.type.lengthInfo}(${c.size})]` : ''}`,
        `[Column("${c.columnName}"${c.type.typeName ? `, TypeName = "${c.type.typeName}"` : ''})]`,
        `public ${c.type.csharpType}${c.isNullable && c.type.nullability === 'questionMark' ? '?' : ''} ${c.propertyName} { get; set; }`
    ].filter(line => line)
        .map(line => '\t\t' + line)
        .join('\n');
}

function renderInRelation(r) {
    return [
        `[ForeignKey("${r.refColumn}")]`,
        `public virtual ${r.refClass} ${r.refClass} { get; set; }`
    ].map(line => '\t\t' + line)
        .join('\n');
}

function renderOutRelation(r) {
    return [
        `[ForeignKey("${r.column}")]`,
        `public virtual ICollection<${r.class}> List${r.class} { get; set; }`
    ].map(line => '\t\t' + line)
        .join('\n');
}

function renderOutRelationInit(r) {
    return `\t\t\tList${r.class} = new HashSet<${r.class}>();`;
}