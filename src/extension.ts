import * as vscode from 'vscode';
import { createCleanStructure } from './architecture/architecture';
import { createCleanModelandEntity } from './entities_and_models/entities_and_models';
import { createCleanUsecase } from './usecases/usecases';



export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.createCleanStructure', createCleanStructure));
  context.subscriptions.push(vscode.commands.registerCommand('extension.createCleanModelandEntity', createCleanModelandEntity));
  context.subscriptions.push(vscode.commands.registerCommand('extension.createCleanUsecase', createCleanUsecase));
}
