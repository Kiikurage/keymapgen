import { EditorType } from '../types/keymap';
import { ConverterFactory } from '../types/converter';
import { BaseConverter } from './base';
import { VSCodeConverter } from '../../vscode/converter';
import { IntelliJConverter } from '../../intellij/converter';
import { VisualStudioConverter } from '../../visualstudio/converter';

export class ConverterRegistry implements ConverterFactory {
  private readonly converters = new Map<EditorType, new () => BaseConverter>();

  register(editorType: EditorType, converterClass: new () => BaseConverter): void {
    this.converters.set(editorType, converterClass);
  }

  createConverter(editorType: EditorType): BaseConverter {
    const ConverterClass = this.converters.get(editorType);
    if (!ConverterClass) {
      throw new Error(`No converter registered for editor type: ${editorType}`);
    }
    return new ConverterClass();
  }

  getSupportedEditors(): EditorType[] {
    return Array.from(this.converters.keys());
  }

  isSupported(editorType: EditorType): boolean {
    return this.converters.has(editorType);
  }
}

export const converterRegistry = new ConverterRegistry();

converterRegistry.register('vscode', VSCodeConverter);
converterRegistry.register('intellij', IntelliJConverter);
converterRegistry.register('visualstudio', VisualStudioConverter);