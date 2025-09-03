import { EditorType } from './keymap';
import { BaseConverter } from '../converters/base';

export interface ConverterFactory {
  createConverter(editorType: EditorType): BaseConverter;
  getSupportedEditors(): EditorType[];
}