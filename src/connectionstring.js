// module.exports = function () {
//     return convertConnectionString(process.argv.find(arg => {
//         return arg.startsWith('source=');
//     }).replace('source=', ''));
// }

module.exports = function convertConnectionString(connectionString) {
    const config = getConfig(connectionString);
    return `server=${config.server};Database=${config.database};Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}`;
}

function getConfig(connectionString) {
    const props = extractProperties(connectionString);
    const config = {
        user: extractPropertie(props, 'User ID'),
        password: extractPropertie(props, 'Password'),
        server: extractPropertie(props, 'Data Source'),
        database: extractPropertie(props, 'Initial Catalog'),
        options: {
            encrypt: false
        }
    };
    return config;
}

function extractProperties(connectionString) {
    return connectionString
        .split(';')
        .map(p => p.split('='));
}

function extractPropertie(props, propName) {
    return props.find(p => p[0] === propName)[1];
}