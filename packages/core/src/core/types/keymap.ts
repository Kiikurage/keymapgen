export interface KeymapConfig {
  name: string;
  description?: string;
  keymaps: Record<string, string>;
}

export interface KeymapEntry {
  actionId: string;
  keystroke: string;
}

export type EditorType = 'vscode' | 'intellij' | 'visualstudio';

export interface ConversionResult {
  editorType: EditorType;
  content: string;
  filename: string;
}

export interface ConversionOptions {
  outputDir?: string;
  overwrite?: boolean;
  validate?: boolean;
}