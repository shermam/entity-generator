const types = require('./types');

exports.toPascalCase = function (str) {
    return str.toLocaleLowerCase()
        .split('_')
        .map(capitalize)
        .join('');
}

exports.sqlTypeToCSharpType = function (type) {
    return types[type];
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}