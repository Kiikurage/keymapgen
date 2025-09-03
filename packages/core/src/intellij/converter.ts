import { KeymapConfig, ConversionResult, ConversionOptions } from '../core/types/keymap';
import { IntelliJKeybinding, IntelliJKeymapFile } from './types';
import { BaseConverter } from '../core/converters/base';
import { IntelliJMappingLoader } from './mapping-loader';

export class IntelliJConverter extends BaseConverter {
  private mappingLoader: IntelliJMappingLoader;

  constructor() {
    super('intellij');
    this.mappingLoader = IntelliJMappingLoader.getInstance();
  }

  async convert(keymap: KeymapConfig, options?: ConversionOptions): Promise<ConversionResult> {
    const keybindings: IntelliJKeybinding[] = [];
    
    for (const [actionId, keystroke] of Object.entries(keymap.keymaps)) {
      const command = this.mappingLoader.getCommand(actionId);
      if (!command) {
        continue;
      }
      
      keybindings.push({
        actionId: command,
        keystrokes: [this.convertKeystroke(keystroke)]
      });
    }
    
    const xmlContent = this.generateXML(keymap.name, keybindings);
    
    return {
      editorType: 'intellij',
      content: xmlContent,
      filename: this.getDefaultFilename()
    };
  }

  getDefaultFilename(): string {
    return 'keymap.xml';
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
        errors.push(`No IntelliJ command mapping for action: ${actionId}`);
      }
    }
    
    return errors;
  }

  private convertKeystroke(keystroke: string): string {
    return keystroke
      .toLowerCase()
      .replace(/ctrl\+/g, 'ctrl ')
      .replace(/shift\+/g, 'shift ')
      .replace(/alt\+/g, 'alt ')
      .replace(/cmd\+/g, 'meta ')
      .replace(/meta\+/g, 'meta ')
      .replace(/\+/g, ' ')
      .trim();
  }

  private generateXML(keymapName: string, keybindings: IntelliJKeybinding[]): string {
    const escapedName = this.escapeXml(keymapName);
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<keymap version="1" name="${escapedName}" parent="$default">\n`;
    
    for (const binding of keybindings) {
      const escapedActionId = this.escapeXml(binding.actionId);
      xml += `  <action id="${escapedActionId}">\n`;
      
      for (const keystroke of binding.keystrokes) {
        const escapedKeystroke = this.escapeXml(keystroke);
        xml += `    <keyboard-shortcut first-keystroke="${escapedKeystroke}" />\n`;
      }
      
      xml += `  </action>\n`;
    }
    
    xml += `</keymap>\n`;
    return xml;
  }

  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}