import mappings from './mappings.json'

export interface VisualStudioActionMapping {
    command: string;
    scope: string;
}

export interface VisualStudioMappingConfig {
    mappings: Record<string, VisualStudioActionMapping>;
}

export class VisualStudioMappingLoader {
    private static instance: VisualStudioMappingLoader;
    private mappingConfig: VisualStudioMappingConfig = mappings;

    private constructor() {
    }

    static getInstance(): VisualStudioMappingLoader {
        if (!VisualStudioMappingLoader.instance) {
            VisualStudioMappingLoader.instance = new VisualStudioMappingLoader();
        }
        return VisualStudioMappingLoader.instance;
    }

    getCommand(actionId: string): string | undefined {
        return this.mappingConfig?.mappings[actionId]?.command;
    }

    getScope(actionId: string): string | undefined {
        return this.mappingConfig?.mappings[actionId]?.scope;
    }

    getMapping(actionId: string): VisualStudioActionMapping | undefined {
        return this.mappingConfig?.mappings[actionId];
    }
}