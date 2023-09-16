import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
/* -------------------------------------------------------------------------- */
/*                           Criar Entity e Model                             */
/* -------------------------------------------------------------------------- */

export async function createCleanModelandEntity(uri: vscode.Uri) {
    const folderPath = uri.fsPath;
  
    /* -------------------------------------------------------------------------- */
    /*                    Pegar o nome dos arquivo model/entity                   */
    /* -------------------------------------------------------------------------- */
      const folderName = await vscode.window.showInputBox({
          prompt: 'Digite o nome dos arquivos:',
          placeHolder: 'Nome do arquivo'
      })
  
  if (!folderName) {
      vscode.window.showInformationMessage('Operação cancelada pelo usuário.');
      return;
  }
  if(folderName.includes(' ')){
    vscode.window.showWarningMessage('Digite sem espaços entre as palavras.');
    return;
  }
  
  /* -------------------------------------------------------------------------- */
  /*                  Pegar os path das pastas models e entity                  */
  /* -------------------------------------------------------------------------- */
  const dataPath = path.join(folderPath, 'data');
  const modelsPath = path.join(dataPath, 'models');
  
  const domainPath = path.join(folderPath, 'domain');
  const entitiesPath = path.join(domainPath, 'entities');
    
  
  
    /* -------------------------------------------------------------------------- */
    /*              Verfificar se o path existe, e criar os arquivos              */
    /* -------------------------------------------------------------------------- */
    const folderNameFile = folderName.toLowerCase();
    const name = folderName.charAt(0).toUpperCase() + folderName.slice(1, folderName.length).replace(/_/g, '');
    
    //DATA
  if(fs.existsSync(dataPath)){
  } else {
    fs.mkdirSync(dataPath, { recursive: true });
  }
  
  if(fs.existsSync(modelsPath)){
    fs.writeFileSync(path.join(modelsPath, `${folderNameFile}_model.dart`), '// Conteúdo do arquivo modelo');
  } else {
    fs.mkdirSync(modelsPath, { recursive: true });
    fs.writeFileSync(path.join(modelsPath, `${folderNameFile}_model.dart`), '// Conteúdo do arquivo modelo');
  }
  //DOMAIN
  if(fs.existsSync(domainPath)){
  } else {
    fs.mkdirSync(domainPath, { recursive: true });
  }
  
  if(fs.existsSync(entitiesPath)){
    fs.writeFileSync(path.join(entitiesPath, `${folderNameFile}_entity.dart`), '// Conteúdo do arquivo modelo');
  } else {
    fs.mkdirSync(entitiesPath, { recursive: true });
    fs.writeFileSync(path.join(entitiesPath, `${folderNameFile}_entity.dart`), '// Conteúdo do arquivo modelo');
  }
  
  /* -------------------------------------------------------------------------- */
  /*                      Criar o texto dentro dos arquivos                     */
  /* -------------------------------------------------------------------------- */
  //DATA
  const modelPath = path.join(modelsPath, `${folderNameFile}_model.dart`);
  
  const modelFile = `import 'package:${entitiesPath}/${folderNameFile}_entity.dart';\n\nclass ${name}Model extends ${name}Entity {\n}`;
  fs.writeFileSync(modelPath, modelFile, { flag: 'w' }); // Use 'a' para anexar conteúdo, 'w' para substituir
  
  
  //DOMAIN
  const entityPath = path.join(entitiesPath, `${folderNameFile}_entity.dart`);
  const entityFile = `abstract class ${name}Entity {\n}`;
  fs.writeFileSync(entityPath, entityFile, { flag: 'w' }); // Use 'a' para anexar conteúdo, 'w' para substituir
  
  
  vscode.window.showInformationMessage('Estrutura de pastas personalizadas criada com sucesso.');
  }