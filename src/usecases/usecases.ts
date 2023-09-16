import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
/* -------------------------------------------------------------------------- */
/*            Criar usecases e implementar ela na arvore de pastas            */
/* -------------------------------------------------------------------------- */

export async function createCleanUsecase(uri: vscode.Uri) {
    const folderPath = uri.fsPath;
  
    /* -------------------------------------------------------------------------- */
    /*                    Pegar o nome dos arquivo model/entity                   */
    /* -------------------------------------------------------------------------- */
      const folderName = await vscode.window.showInputBox({
          prompt: 'Digite o nome da Usecase:',
          placeHolder: 'Nome da Usecase'
      })
      const entity = await vscode.window.showInputBox({
        prompt: 'Digite o nome da Entity Esperada:',
        placeHolder: 'Nome da Entity'
    })
    const repository = await vscode.window.showInputBox({
        prompt: 'Digite o nome do Repositorio:',
        placeHolder: 'Nome da Repositorio'
    })
    let paramsName = await vscode.window.showInputBox({
        prompt: 'Digite o nome do Params(se não houver deixe vazio):',
        placeHolder: 'Nome do Params'
    })
  
  if (!folderName || !entity) {
      vscode.window.showInformationMessage('Operação cancelada pelo usuário.');
      return;
  }
  if(folderName.includes(' ')){
    vscode.window.showWarningMessage('Digite sem espaços entre as palavras.');
    return;
  }


  const dataPath = path.join(folderPath, 'data');
  const domainPath = path.join(folderPath, 'domain');
  const usecasePath = path.join(domainPath, 'usecases');
  const repositoriesDomainPath = path.join(domainPath, 'repositories');
  const repositoriesDataPath = path.join(dataPath, 'repositories');


  const folderNameFile = folderName.toLowerCase();
  const name = folderName.charAt(0).toUpperCase() + folderName.slice(1, folderName.length).replace(/_/g, '');
  const entityName = entity.charAt(0).toUpperCase() + entity.slice(1, entity.length);
  const repositoryName = repository?.charAt(0).toUpperCase() + repository!.slice(1, repository?.length).replace(/_/g, '');
  const repositoryfile = repository?.toLowerCase();


  /* -------------------------------------------------------------------------- */
  /*                           Criar Usecase e params                           */
  /* -------------------------------------------------------------------------- */
  const entityNameRepository = entity.charAt(0).toLowerCase() + entity.slice(1, entity.length);
  let params = '';
  if( paramsName != ''){
    paramsName = paramsName!.charAt(0).toUpperCase() + paramsName!.slice(1, paramsName?.length);
      params = `\n\nclass ${paramsName} {\n${paramsName}({\n})}`;
  } else {
    paramsName = 'NoParams';
     params = '';
  }
  const usecaseContent = `
  class ${name} extends Usecase<${entityName}, ${paramsName}> {
    final ${repositoryName}Repository repository;
    ${name}({required this.repository});
  
    Future<${entityName}> call(${paramsName} params) async {
      return repository.${entityNameRepository}();
    }
    ${params}
  }`;

  
  if(fs.existsSync(usecasePath)){
    // fs.writeFileSync(path.join(usecasePath, `${folderNameFile}.dart`), `class ${name} extends Usecase<${entityName}, ${paramsName}> {\nfinal ${repositoryName}Repository repository;\n${name}({required this.repository});\n
    // Future<${entityName}> call(${paramsName} params) async {\n}
    // ${params}\n}`);
    fs.writeFileSync(path.join(usecasePath, `${folderNameFile}.dart`), usecaseContent);
    
  } else {
    vscode.window.showWarningMessage('Crie primeiro uma estrutura Clean.');
    return;
  }

  /* -------------------------------------------------------------------------- */
  /*               Criar o texto dentro dos arquivos repositories               */
  /* -------------------------------------------------------------------------- */

  //Domain
  const filePathDomain = repositoriesDomainPath + `/${repositoryfile}_repository.dart`;
  let fileContentDomain = fs.readFileSync(filePathDomain, 'utf-8');

  const newContentDomain = `Future<${entityName}> ${entityNameRepository}();\n`;

    // Encontre a posição do último }
    const lastIndexDomain = fileContentDomain.lastIndexOf('}');

    if (lastIndexDomain !== -1) {
        // Insira o novo conteúdo após o último }
        fileContentDomain = fileContentDomain.slice(0, lastIndexDomain) + newContentDomain + fileContentDomain.slice(lastIndexDomain);
        
        // Use fs.writeFileSync() para escrever o conteúdo atualizado no arquivo
        fs.writeFileSync(filePathDomain, fileContentDomain);
    } else {
    vscode.window.showWarningMessage('Repository Domain não encontrado, verifique o arquivo, e tente novamente.');
        return;
    }

  //Data
  const filePathData = repositoriesDataPath + `/${repositoryfile}_repository_impl.dart`;
  let fileContentData = fs.readFileSync(filePathData, 'utf-8');
  const entityNameRepositoryImpl = entity.charAt(0).toLowerCase() + entity.slice(1, entity.length);

  const newContentData = `Future<${entityName}> ${entityNameRepositoryImpl}();\n`;

    // Encontre a posição do último }
    const lastIndexData = fileContentData.lastIndexOf('}');

    if (lastIndexData !== -1) {
        // Insira o novo conteúdo após o último }
        fileContentData = fileContentData.slice(0, lastIndexData) + newContentData + fileContentData.slice(lastIndexData);
        
        // Use fs.writeFileSync() para escrever o conteúdo atualizado no arquivo
        fs.writeFileSync(filePathData, fileContentData);
    } else {
    vscode.window.showWarningMessage('Repository Domain não encontrado, verifique o arquivo, e tente novamente.');
        return;
    }

    /* -------------------------------------------------------------------------- */
    /*                 Criar texto dentro dos arquivos datasources                */
    /* -------------------------------------------------------------------------- */

    const datasourcePath = path.join(dataPath, 'datasource');
    const entityNameDatasource = entity.charAt(0).toLowerCase() + entity.slice(1, entity.length);
    const filePathDatasource = datasourcePath + `/${repositoryfile}_datasource.dart`;
    let fileContentDatasource = fs.readFileSync(filePathDatasource, 'utf-8');
    
    const newContentDatasource = `Future<${entityName}> ${entityNameDatasource}();\n`;

    // Encontre a posição do último }
    const lastIndexDatasource = fileContentDatasource.lastIndexOf('}');

    if (lastIndexDatasource !== -1) {
        // Insira o novo conteúdo após o último }
        fileContentDatasource = fileContentDatasource.slice(0, lastIndexDatasource) + newContentDatasource + fileContentDatasource.slice(lastIndexDatasource);
        
        // Use fs.writeFileSync() para escrever o conteúdo atualizado no arquivo
        fs.writeFileSync(filePathDatasource, fileContentDatasource);
    } else {
    vscode.window.showWarningMessage('Repository Domain não encontrado, verifique o arquivo, e tente novamente.');
        return;
    }

    // const entityNameDatasourceImpl = entity.charAt(0).toLowerCase() + entity.slice(1, entity.length);
    const filePathDatasourceImpl = datasourcePath + `/${repositoryfile}_datasource_impl.dart`;
    let fileContentDatasourceImpl = fs.readFileSync(filePathDatasourceImpl, 'utf-8');
    
    const newContentDatasourceImpl = `@override\nFuture<${entityName}> ${entityNameDatasource}() async {\n}`;

    // Encontre a posição do último }
    const lastIndexDatasourceImpl = fileContentDatasourceImpl.lastIndexOf('}');

    if (lastIndexDatasourceImpl !== -1) {
        // Insira o novo conteúdo após o último }
        fileContentDatasourceImpl = fileContentDatasourceImpl.slice(0, lastIndexDatasourceImpl) + newContentDatasourceImpl + fileContentDatasourceImpl.slice(lastIndexDatasourceImpl);
        
        // Use fs.writeFileSync() para escrever o conteúdo atualizado no arquivo
        fs.writeFileSync(filePathDatasourceImpl, fileContentDatasourceImpl);
    } else {
    vscode.window.showWarningMessage('Repository Domain não encontrado, verifique o arquivo, e tente novamente.');
        return;
    }
  
  vscode.window.showInformationMessage('Estrutura de pastas personalizadas criada com sucesso.');
  }