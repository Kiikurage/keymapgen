import { KeymapConfig, ConversionResult, ConversionOptions } from '../core/types/keymap';
import { VSCodeKeybinding, VSCodeKeybindingsFile } from './types';
import { BaseConverter } from '../core/converters/base';
import { VSCodeMappingLoader } from './mapping-loader';

export class VSCodeConverter extends BaseConverter {
  private mappingLoader: VSCodeMappingLoader;

  constructor() {
    super('vscode');
    this.mappingLoader = VSCodeMappingLoader.getInstance();
  }

  async convert(keymap: KeymapConfig, options?: ConversionOptions): Promise<ConversionResult> {
    const keybindings: VSCodeKeybindingsFile = [];
    
    for (const [actionId, keystroke] of Object.entries(keymap.keymaps)) {
      const command = this.mappingLoader.getCommand(actionId);
      if (!command) {
        continue;
      }
      
      const vscodeKeybinding: VSCodeKeybinding = {
        key: this.convertKeystroke(keystroke),
        command: command
      };
      
      const whenClause = this.mappingLoader.getContext(actionId);
      if (whenClause) {
        vscodeKeybinding.when = whenClause;
      }
      
      keybindings.push(vscodeKeybinding);
    }
    
    const content = JSON.stringify(keybindings, null, 2);
    
    return {
      editorType: 'vscode',
      content,
      filename: this.getDefaultFilename()
    };
  }

  getDefaultFilename(): string {
    return 'keybindings.json';
  }

  async validate(keymap: KeymapConfig): Promise<string[]> {
    const errors: string[] = [];
    
    for (const [actionId, keystroke] of Object.entries(keymap.keymaps)) {
      if (!this.validateActionId(actionId)) {
        errors.push(`Invalid action ID: ${actionId}`);
      }
      
      if (!this.validateKeystroke(keystroke)) {
        errors.push(`Invalid keystroke: ${keystroke} for action ${actionId}`);
      }
      
      if (!this.mappingLoader.getCommand(actionId)) {
        errors.push(`No VSCode command mapping for action: ${actionId}`);
      }
    }
    
    return errors;
  }

  private convertKeystroke(keystroke: string): string {
    return keystroke
      .toLowerCase()
      .replace(/ctrl/g, 'ctrl')
      .replace(/shift/g, 'shift')
      .replace(/alt/g, 'alt')
      .replace(/cmd/g, 'cmd')
      .replace(/meta/g, 'cmd');
  }

}