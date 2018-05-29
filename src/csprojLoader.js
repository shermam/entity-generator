const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

module.exports = function (fileName, entities, folderName) {

    const rearrange = rearrangeEntries(entities, folderName);
    const writeNewFile = write(fileName);

    return readFile(fileName, 'utf8')
        .then(text => text.split('\n'))
        .then(splitPreffixAndSuffix)
        .then(rearrange)
        .then(joinArray)
        .then(writeNewFile);
}

function renderCompileLine(array, folderName) {
    return array.map(el => `    <Compile Include="${folderName}\\${el.className}.cs" />\r`);
}

function write(fileName) {
    return str => writeFile(fileName, str);
}

function joinArray(array) {
    return array
        .map(arr => arr.join('\n'))
        .join('\n');
}

function splitPreffixAndSuffix(array) {
    let preffixIndex = 0;
    let suffixIndex = 0;

    for (let i = 0; i < array.length; i++) {
        if (checkCompileLine(array[i])) {
            if (!preffixIndex) {
                preffixIndex = i;
            }
            continue;
        }

        if (preffixIndex) {
            suffixIndex = i;
            break;
        }
    }

    return [
        array.slice(0, preffixIndex),
        array.slice(preffixIndex, suffixIndex),
        array.slice(suffixIndex, array.length)
    ];
}

function rearrangeEntries(entities, folderName) {
    return (array) => {
        return [
            array[0],
            organizeNewLines(entities, folderName, array[1]),
            array[2]
        ];
    }
}

function organizeNewLines(entities, folderName, oldLines) {
    return renderCompileLine(entities, folderName)
        .concat(filterEntities(oldLines, folderName))
        .sort();
}

function checkCompileLine(srtElement) {
    return /<Compile Include=".*" \/>/.test(srtElement);
}

function filterEntities(array, folderName) {
    const regex = new RegExp(`"${folderName}\\\\`);
    return array.filter(el => !regex.test(el));
}