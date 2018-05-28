# entity-generator

Generator for C# .NET Entity Framework classes from SQL Server Database and (optionally) PowerDesigner PDM file. 

It generates classes mapping the table and column names to the class and property names in the PascalCase version. For exemple a table `MY_TABLE` will generate a class `MyClass` with the table annotation.

Optionally you can provide a [PowerDesigner](http://powerdesigner.de/en/) .pdm file from where the generator will get the name mapping instead of generating the PascalCase version.

## Instalation

```
npm install -g entity-generator
```

## Usage

1. Go to your project folder on the command line: (this is the folder where your `project.csproj` file is located)

2. Run the entity-generator command:
```
egen
```

3. On the first run the command line will ask you some things:

    The connectionString `Password=YOUR_PASSWORD;Persist Security Info=True;User ID=YOUR_DB_USER;Initial Catalog=YOUR_DATABASE;Data Source=YOUR_SERVER\YOUR_NAMED_INSTANCE`

    The C# namespace for the generated classes

    The folder name for the entity classes

    The PDM file name (The pdm should be moved/copied to the project folder)

    The .csproj file name

    The name of the connectionString on the app.config file

4. After that the generator will save this this information in a `egen-config.json` file:

```json
{
    "source": "Password=YOUR_PASSWORD;Persist Security Info=True;User ID=YOUR_DB_USER;Initial Catalog=YOUR_DATABASE;Data Source=YOUR_SERVER\\YOUR_NAMED_INSTANCE",
    "namespace": "YourNamespace",
    "entitiesFolder": "YouEntitiesFolder",
    "pdmFile": "YourPdmFile.pdm",
    "projectFile": "YouProject.csproj",
    "sourceName": "YouConnectionStringName"
}
```

5. The classes will then be generated and on subsequent uses the config info will be read directly from the json file.

# Notes

This generator does not create the folder for the entities. You have to create the folder manually and then add the folder name to config file.

Node version 8.11.2 or higher is required.

Running this generator will not add Entity Framework to your project. You will have add it your self and then run the generator just to create the classes


Suggestions and help are welcome.

Shermam Miranda (shermam.miranda@hotmail.com)