import * as yaml from 'yaml';
import Ajv from 'ajv';
import { KeymapConfig } from '../types/keymap';
import keymapConfigSchema from '../schemas/keymap-config.json';

const ajv = new Ajv();
const validateKeymapConfig = ajv.compile(keymapConfigSchema);

export async function loadKeymapConfig(content: string): Promise<KeymapConfig> {
  try {
    const parsed = yaml.parse(content);
    
    if (!validateKeymapConfig(parsed)) {
      const errors = validateKeymapConfig.errors
        ?.map(error => `${error.instancePath || 'root'}: ${error.message}`)
        .join(', ') || 'Unknown validation error';
      throw new Error(`Invalid keymap configuration: ${errors}`);
    }

    return parsed as unknown as KeymapConfig;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to load keymap config: ${String(error)}`);
  }
}