const defaultNamespace = "PostoFacil.DataAcces";

module.exports = function () {
    return (process.argv.find(arg => {
        return arg.startsWith('namespace=');
    }) || defaultNamespace).replace('namespace=', '');
}