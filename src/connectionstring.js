const defaultConnectionString = "Password=ihm@123;Persist Security Info=True;User ID=sa;Initial Catalog=PF_PRD;Data Source=LOCALHOST\\SQLEXPRESS";

module.exports = function () {
    return convertConnectionString((process.argv.find(arg => {
        return arg.startsWith('source=');
    }) || defaultConnectionString).replace('source=', ''));
}

//"server=LOCALHOST\\SQLEXPRESS;Database=PF_PRD;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}"

function convertConnectionString(connectionString) {
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