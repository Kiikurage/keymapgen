#!/usr/bin/env node

import { Command } from 'commander';
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { KeymapConverter } from '@keymapgen/core/src/core/keymap-converter';
import { EditorType } from '@keymapgen/core/src/core/types/keymap';

const program = new Command();

program
    .name('keymapgen')
    .description('Cross-editor keymap synchronization tool')
    .version('1.0.0');

program
    .option('--editor <editor>', 'Target editor (vscode, intellij, visualstudio)')
    .argument('<input>', 'Input YAML keymap file path')
    .argument('<output>', 'Output file path')
    .action(async (inputPath: string, outputPath: string, options: { editor: string }) => {
        try {
            const {editor} = options;

            if (!editor) {
                console.error('Error: --editor option is required');
                process.exit(1);
            }

            const converter = new KeymapConverter();
            const supportedEditors = converter.getSupportedEditors();

            if (!supportedEditors.includes(editor as EditorType)) {
                console.error(`Error: Unsupported editor "${editor}". Supported editors: ${supportedEditors.join(', ')}`);
                process.exit(1);
            }

            // Check if input file exists
            try {
                await fs.access(inputPath);
            } catch {
                console.error(`Error: Input file not found: ${inputPath}`);
                process.exit(1);
            }

            // Ensure output directory exists
            const outputDir = dirname(outputPath);
            try {
                await fs.mkdir(outputDir, {recursive: true});
            } catch (error) {
                console.error(`Error: Cannot create output directory: ${outputDir}`);
                process.exit(1);
            }

            // Convert keymap
            const input = await fs.readFile(inputPath, 'utf8');
            const result = await converter.convert(input, editor as EditorType, {
                validate: true
            });

            // Write output file
            await fs.writeFile(outputPath, result.content, 'utf8');

            console.log(`✅ Successfully converted keymap to ${editor} format`);
            console.log(`📁 Input:  ${inputPath}`);
            console.log(`📄 Output: ${outputPath}`);

        } catch (error) {
            console.error('❌ Conversion failed:', error instanceof Error ? error.message : String(error));
            process.exit(1);
        }
    });

// Add help command for supported editors
program
    .command('list-editors')
    .description('List supported editors')
    .action(() => {
        const converter = new KeymapConverter();
        const supportedEditors = converter.getSupportedEditors();

        console.log('Supported editors:');
        supportedEditors.forEach(editor => {
            console.log(`  - ${editor}`);
        });
    });

program.parse();