module.exports = function () {
    return Promise.resolve({
        "source": "Password=ihm@123;Persist Security Info=True;User ID=sa;Initial Catalog=PF_PRD;Data Source=LOCALHOST\\SQLEXPRESS",
        "namespace": "PostoFacil.DataAcces",
        "entitiesFolder": "Entidades",
        "pdmFile": "Posto Fácil V6.pdm",
        "projectFile": "PostoFacil.DataAcces.csproj"
    });
}