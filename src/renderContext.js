module.exports = function (sourceName, namespace) {
    return function (entities) {
        return `namespace ${namespace}
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Context : DbContext
    {
        public Context(bool lazy = false)
            : base("name=${sourceName}")
        {
            this.Configuration.ProxyCreationEnabled = lazy;
            this.Configuration.LazyLoadingEnabled = lazy;
        }

${renderDbSet(entities)}

    }
}`;
    }
}

function renderDbSet(entities) {
    return entities
        .map(e => e.className)
        .sort()
        .map(e => `\t\tpublic virtual DbSet<${e}> ${e} { get; set; }\n`)
        .join('')
}