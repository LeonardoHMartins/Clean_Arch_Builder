import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
/* -------------------------------------------------------------------------- */
/*                  Criar a base do Clean Architecture                        */
/* -------------------------------------------------------------------------- */
export async function createCleanStructure(uri: vscode.Uri) {
    const folderPath = uri.fsPath;
  
    // Solicitar ao usuário um nome para as pastas
    const folderName = await vscode.window.showInputBox({
      prompt: 'Digite o nome da estrutura:',
      placeHolder: 'Nome da estrutura'
  });
  
  if (!folderName) {
      vscode.window.showInformationMessage('Operação cancelada pelo usuário.');
      return;
  }
  
  const folderNameClean = folderName.toLowerCase();
  const name = folderName.charAt(0).toUpperCase() + folderName.slice(1, folderName.length).replace(/_/g, '');
  
    /* -------------------------------------------------------------------------- */
    /*               Crie as pastas e subpastas personalizadas DATA               */
    /* -------------------------------------------------------------------------- */
    const dataPath = path.join(folderPath, 'data');
    const modelsPath = path.join(dataPath, 'models');
    const repositoriesDataPath = path.join(dataPath, 'repositories');
    const datasourcePath = path.join(dataPath, 'datasource');
  
    fs.mkdirSync(dataPath, { recursive: true });
    fs.mkdirSync(modelsPath);
    fs.mkdirSync(repositoriesDataPath);
    fs.mkdirSync(datasourcePath);
  
    /* -------------------------------------------------------------------------- */
    /*              Crie as pastas e subpastas personalizadas DOMAIN              */
    /* -------------------------------------------------------------------------- */
    const domainPath = path.join(folderPath, 'domain');
    const entitiesPath = path.join(domainPath, 'entities');
    const repositoriesDomainPath = path.join(domainPath, 'repositories');
    const usecasePath = path.join(domainPath, 'usecases');
  
    fs.mkdirSync(domainPath, { recursive: true });
    fs.mkdirSync(entitiesPath);
    fs.mkdirSync(repositoriesDomainPath);
    fs.mkdirSync(usecasePath);
  
    /* -------------------------------------------------------------------------- */
    /*                     Crie os arquivos dentro das pastas                     */
    /* -------------------------------------------------------------------------- */
    //DATA
    fs.writeFileSync(path.join(repositoriesDataPath, `${folderNameClean}_repository_impl.dart`), `import 'package:${repositoriesDomainPath}/${folderNameClean}_repository.dart';\n\nclass ${name}RepositoryImpl extends ${name}Repository {\nfinal ${name}Datasource datasource;\n\n${name}RepositoryImpl({required this.datasource});\n}`);
    fs.writeFileSync(path.join(datasourcePath, `${folderNameClean}_datasource.dart`), `abstract class ${name}Datasource {\n}`);
    fs.writeFileSync(path.join(datasourcePath, `${folderNameClean}_datasource_impl.dart`), `import 'package:${datasourcePath}/${folderNameClean}_datasource.dart}';\n\nclass ${name}DatasourceImpl implements ${name}Datasource {\n}`);
  
    //DOMAIN
    fs.writeFileSync(path.join(repositoriesDomainPath, `${folderNameClean}_repository.dart`), `abstract class ${name}Repository {\n}`);
  
  
  
    vscode.window.showInformationMessage('Estrutura de pastas personalizadas criada com sucesso.');
  }