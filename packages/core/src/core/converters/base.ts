import { KeymapConfig, EditorType, ConversionResult, ConversionOptions } from '../types/keymap';

export abstract class BaseConverter {
  protected readonly editorType: EditorType;

  constructor(editorType: EditorType) {
    this.editorType = editorType;
  }

  abstract convert(keymap: KeymapConfig, options?: ConversionOptions): Promise<ConversionResult>;
  
  abstract getDefaultFilename(): string;
  
  abstract validate(keymap: KeymapConfig): Promise<string[]>;

  protected validateKeystroke(keystroke: string): boolean {
    return keystroke.trim().length > 0;
  }

  protected validateActionId(actionId: string): boolean {
    return /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)*$/.test(actionId);
  }
}