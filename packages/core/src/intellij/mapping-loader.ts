import mappings from './mappings.json'

export interface IntelliJActionMapping {
    command: string;
}

export interface IntelliJMappingConfig {
    mappings: Record<string, IntelliJActionMapping>;
}

export class IntelliJMappingLoader {
    private static instance: IntelliJMappingLoader;
    private mappingConfig: IntelliJMappingConfig = mappings;

    private constructor() {
    }

    static getInstance(): IntelliJMappingLoader {
        if (!IntelliJMappingLoader.instance) {
            IntelliJMappingLoader.instance = new IntelliJMappingLoader();
        }
        return IntelliJMappingLoader.instance;
    }

    getCommand(actionId: string): string | undefined {
        return this.mappingConfig?.mappings[actionId]?.command;
    }

    getMapping(actionId: string): IntelliJActionMapping | undefined {
        return this.mappingConfig?.mappings[actionId];
    }
}