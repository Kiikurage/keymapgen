import { KeymapConfig, ConversionResult, ConversionOptions } from '../core/types/keymap';
import { VisualStudioKeybinding, VisualStudioKeymapFile } from './types';
import { BaseConverter } from '../core/converters/base';
import { VisualStudioMappingLoader } from './mapping-loader';

export class VisualStudioConverter extends BaseConverter {
  private mappingLoader: VisualStudioMappingLoader;

  constructor() {
    super('visualstudio');
    this.mappingLoader = VisualStudioMappingLoader.getInstance();
  }

  async convert(keymap: KeymapConfig, options?: ConversionOptions): Promise<ConversionResult> {
    const keybindings: VisualStudioKeybinding[] = [];
    
    for (const [actionId, keystroke] of Object.entries(keymap.keymaps)) {
      const command = this.mappingLoader.getCommand(actionId);
      const scope = this.mappingLoader.getScope(actionId);
      
      if (!command || !scope) {
        continue;
      }
      
      keybindings.push({
        command,
        scope,
        key: this.convertKeystroke(keystroke)
      });
    }
    
    const vssettingsContent = this.generateVSSettings(keymap.name, keybindings);
    
    return {
      editorType: 'visualstudio',
      content: vssettingsContent,
      filename: this.getDefaultFilename()
    };
  }

  getDefaultFilename(): string {
    return 'keybindings.vssettings';
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
        errors.push(`No Visual Studio command mapping for action: ${actionId}`);
      }
    }
    
    return errors;
  }

  private convertKeystroke(keystroke: string): string {
    // Convert to Visual Studio key format, with Windows-specific handling
    return keystroke
      .replace(/Ctrl\+/gi, 'Ctrl+')
      .replace(/Shift\+/gi, 'Shift+')
      .replace(/Alt\+/gi, 'Alt+')
      .replace(/Cmd\+/gi, 'Ctrl+')  // Map Cmd to Ctrl on Windows
      .replace(/Meta\+/gi, 'Win+')  // Map Meta to Win key on Windows
      .replace(/\+([a-zA-Z0-9])$/, '+$1') // Ensure proper case
      .replace(/F(\d+)/gi, 'F$1'); // Function keys
  }

  private generateVSSettings(keymapName: string, keybindings: VisualStudioKeybinding[]): string {
    const escapedName = this.escapeXml(keymapName);
    const timestamp = new Date().toISOString();
    
    let vssettings = `<?xml version="1.0" encoding="utf-8"?>\n`;
    vssettings += `<UserSettings>\n`;
    vssettings += `  <ApplicationIdentity version="17.0"/>\n`;
    vssettings += `  <ToolsOptions>\n`;
    vssettings += `    <ToolsOptionsCategory name="Environment" RegisteredName="Environment">\n`;
    vssettings += `      <ToolsOptionsSubCategory name="Keyboard" RegisteredName="Keyboard" PackageName="Microsoft Visual Studio">\n`;
    vssettings += `        <PropertyValue name="SchemeName">Custom</PropertyValue>\n`;
    vssettings += `        <PropertyValue name="SearchIncrementally">false</PropertyValue>\n`;
    vssettings += `        <PropertyValue name="ShowExistingFirstInIncrementalSearch">false</PropertyValue>\n`;
    vssettings += `        <PropertyValue name="PressAndHoldToRepeat">true</PropertyValue>\n`;
    vssettings += `        <PropertyValue name="KeyboardMappingScheme">Custom</PropertyValue>\n`;
    vssettings += `        <PropertyValue name="ApplicationDefinedShortcuts">\n`;
    vssettings += `          <ShortcutsScheme>\n`;
    
    for (const binding of keybindings) {
      const escapedCommand = this.escapeXml(binding.command);
      const escapedScope = this.escapeXml(binding.scope);
      const escapedKey = this.escapeXml(binding.key);
      
      vssettings += `            <Shortcut Command="${escapedCommand}" Scope="${escapedScope}">${escapedKey}</Shortcut>\n`;
    }
    
    vssettings += `          </ShortcutsScheme>\n`;
    vssettings += `        </PropertyValue>\n`;
    vssettings += `      </ToolsOptionsSubCategory>\n`;
    vssettings += `    </ToolsOptionsCategory>\n`;
    vssettings += `  </ToolsOptions>\n`;
    vssettings += `</UserSettings>\n`;
    
    return vssettings;
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