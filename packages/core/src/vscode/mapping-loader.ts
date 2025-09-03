import mappings from './mappings.json'

export interface VSCodeActionMapping {
    command: string;
    when?: string;
}

export interface VSCodeMappingConfig {
    mappings: Record<string, VSCodeActionMapping>;
}

export class VSCodeMappingLoader {
    private static instance: VSCodeMappingLoader;
    private mappingConfig: VSCodeMappingConfig = mappings;

    private constructor() {
    }

    static getInstance(): VSCodeMappingLoader {
        if (!VSCodeMappingLoader.instance) {
            VSCodeMappingLoader.instance = new VSCodeMappingLoader();
        }
        return VSCodeMappingLoader.instance;
    }

    getCommand(actionId: string): string | undefined {
        return this.mappingConfig?.mappings[actionId]?.command;
    }

    getContext(actionId: string): string | undefined {
        return this.mappingConfig?.mappings[actionId]?.when;
    }

    getMapping(actionId: string): VSCodeActionMapping | undefined {
        return this.mappingConfig?.mappings[actionId];
    }
}