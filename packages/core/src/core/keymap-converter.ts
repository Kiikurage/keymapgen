import { ConversionOptions, ConversionResult, EditorType } from './types/keymap';
import { loadKeymapConfig } from './parsers/loadKeymapConfig';
import { converterRegistry } from './converters/registry';

export class KeymapConverter {
    async convert(
        input: string,
        editorType: EditorType,
        options?: ConversionOptions
    ): Promise<ConversionResult> {
        const keymap = await loadKeymapConfig(input);

        if (!converterRegistry.isSupported(editorType)) {
            throw new Error(`Unsupported editor type: ${editorType}`);
        }

        const converter = converterRegistry.createConverter(editorType);

        if (options?.validate !== false) {
            const errors = await converter.validate(keymap);
            if (errors.length > 0) {
                throw new Error(`Validation failed:\n${errors.join('\n')}`);
            }
        }

        return converter.convert(keymap, options);
    }

    getSupportedEditors(): EditorType[] {
        return converterRegistry.getSupportedEditors();
    }
}