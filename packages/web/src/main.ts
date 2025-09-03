// Import actual conversion logic from @keymapgen/core
import { KeymapConverter } from '@keymapgen/core/src/core/keymap-converter.ts';
// Import actions data
import actionsData from '@keymapgen/core/actions.json';

// Example YAML configuration
const EXAMPLE_CONFIG = `name: "My Custom Keymap"
description: "Personal keymap configuration for cross-editor compatibility"

keymaps:
  file.new: "Ctrl+N"
  file.open: "Ctrl+O"
  file.save: "Ctrl+S"
  file.saveAs: "Ctrl+Shift+S"
  file.close: "Ctrl+W"
  
  edit.undo: "Ctrl+Z"
  edit.redo: "Ctrl+Y"
  edit.cut: "Ctrl+X"
  edit.copy: "Ctrl+C"
  edit.paste: "Ctrl+V"
  edit.selectAll: "Ctrl+A"
  edit.find: "Ctrl+F"
  edit.replace: "Ctrl+H"
  
  navigation.goToLine: "Ctrl+G"
  navigation.goToDefinition: "F12"
  navigation.goBack: "Alt+Left"
  navigation.goForward: "Alt+Right"
  
  code.format: "Shift+Alt+F"
  code.comment: "Ctrl+/"
  code.rename: "F2"
  
  debug.start: "F5"
  debug.stepOver: "F10"
  debug.stepInto: "F11"
  debug.toggleBreakpoint: "F9"`;

// DOM elements
const inputTextarea = document.getElementById('input-yaml') as HTMLTextAreaElement;
const outputSection = document.getElementById('output-section') as HTMLElement;
const outputTextarea = document.getElementById('output-config') as HTMLTextAreaElement;
const loadExampleBtn = document.getElementById('load-example') as HTMLButtonElement;
const editorSelect = document.getElementById('editor-select') as HTMLSelectElement;
const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;

// Mode toggle elements
const modeToggle = document.getElementById('mode-toggle') as HTMLInputElement;
const rawYamlMode = document.getElementById('raw-yaml-mode') as HTMLElement;
const richUiMode = document.getElementById('rich-ui-mode') as HTMLElement;

// Main tab elements
const mainTabButtons = document.querySelectorAll('.main-tab-button') as NodeListOf<HTMLButtonElement>;
const mainTabPanes = document.querySelectorAll('.main-tab-pane') as NodeListOf<HTMLElement>;

// State
let currentFilename = '';
let currentContent = '';
let currentKeymap: Record<string, string> = {};

// Mode switching functionality
function switchMode() {
    if (modeToggle.checked) {
        // Rich UI mode
        rawYamlMode.classList.remove('active');
        richUiMode.classList.add('active');
        // Sync from Raw YAML to Rich UI when switching to Rich mode
        loadKeymapFromYAML();
    } else {
        // Raw YAML mode
        richUiMode.classList.remove('active');
        rawYamlMode.classList.add('active');
    }
}

// Main tab switching functionality
function switchMainTab(targetTab: string) {
    // Remove active class from all buttons and panes
    mainTabButtons.forEach(button => button.classList.remove('active'));
    mainTabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Add active class to clicked button and corresponding pane
    const activeButton = document.querySelector(`[data-main-tab="${targetTab}"]`) as HTMLButtonElement;
    const activePane = document.getElementById(`${targetTab}-main-tab`) as HTMLElement;
    
    if (activeButton && activePane) {
        activeButton.classList.add('active');
        activePane.classList.add('active');
    }
    
    // Auto-convert when switching to Output tab
    if (targetTab === 'output') {
        performConversion();
    }
}

// Rich UI functionality
function initializeRichUI() {
    populateAllActions();
    initializeSearchFunctionality();
    loadKeymapFromYAML();
}

function populateAllActions() {
    const actions = actionsData.actions;
    const container = document.getElementById('all-actions');
    
    if (!container) return;

    const actionList = Object.entries(actions).map(([actionId, actionData]) => {
        const currentBinding = currentKeymap[actionId] || '';
        return `
            <div class="action-item" data-action-id="${actionId}">
                <div class="action-info">
                    <div class="action-name">${actionId}</div>
                    <div class="action-description">${actionData.description}</div>
                </div>
                <div class="action-binding">
                    <span class="binding-display ${currentBinding ? 'has-binding' : 'no-binding'}">${currentBinding || 'Click to assign'}</span>
                    <input 
                        type="text" 
                        class="binding-input" 
                        placeholder="e.g. Ctrl+S, F12, Alt+Shift+F"
                        value="${currentBinding}"
                        data-action-id="${actionId}"
                        style="display: none;"
                    />
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = actionList;

    // Add click handlers for each action item
    container.querySelectorAll('.action-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const actionId = item.getAttribute('data-action-id');
            if (actionId) {
                toggleInlineEdit(actionId, e.target as HTMLElement);
            }
        });
    });
}

function toggleInlineEdit(actionId: string, target: HTMLElement) {
    const actionItem = document.querySelector(`[data-action-id="${actionId}"]`);
    if (!actionItem) return;

    const bindingDisplay = actionItem.querySelector('.binding-display') as HTMLElement;

    if (!bindingDisplay) return;

    // Start key capture mode
    startKeyCapture(actionId, bindingDisplay);
}

function startKeyCapture(actionId: string, bindingDisplay: HTMLElement) {
    // Set visual feedback for key capture mode
    bindingDisplay.textContent = 'Press any key combination...';
    bindingDisplay.className = 'binding-display key-capture-mode';
    
    let isCapturing = true;
    
    const handleKeyCapture = (e: KeyboardEvent) => {
        if (!isCapturing) return;
        
        // Prevent default browser behavior
        e.preventDefault();
        e.stopPropagation();
        
        // Handle escape to cancel
        if (e.key === 'Escape') {
            cancelKeyCapture();
            return;
        }
        
        // Capture the key combination
        const keyBinding = formatKeyBinding(e);
        if (keyBinding) {
            completeKeyCapture(keyBinding);
        }
    };
    
    const handleBlur = (e: FocusEvent) => {
        // Only cancel if we're still capturing and the focus didn't move to another element we control
        if (isCapturing) {
            cancelKeyCapture();
        }
    };
    
    const cancelKeyCapture = () => {
        isCapturing = false;
        document.removeEventListener('keydown', handleKeyCapture, true);
        document.removeEventListener('blur', handleBlur, true);
        
        const currentBinding = currentKeymap[actionId] || '';
        bindingDisplay.textContent = currentBinding || 'Click to assign';
        bindingDisplay.className = `binding-display ${currentBinding ? 'has-binding' : 'no-binding'}`;
    };
    
    const completeKeyCapture = (keyBinding: string) => {
        isCapturing = false;
        document.removeEventListener('keydown', handleKeyCapture, true);
        document.removeEventListener('blur', handleBlur, true);
        
        currentKeymap[actionId] = keyBinding;
        bindingDisplay.textContent = keyBinding;
        bindingDisplay.className = 'binding-display has-binding';
        updateYAMLFromKeymap();
    };
    
    // Add event listeners with capture phase to intercept before other handlers
    document.addEventListener('keydown', handleKeyCapture, true);
    document.addEventListener('blur', handleBlur, true);
    
    // Make the binding display focusable and focus it
    bindingDisplay.setAttribute('tabindex', '0');
    bindingDisplay.focus();
}

function formatKeyBinding(e: KeyboardEvent): string {
    const parts: string[] = [];
    
    // Add modifier keys in a consistent order
    if (e.ctrlKey || e.metaKey) {
        // Use Ctrl for Windows/Linux, Cmd for Mac
        parts.push(e.metaKey && !e.ctrlKey ? 'Cmd' : 'Ctrl');
    }
    if (e.altKey) {
        parts.push('Alt');
    }
    if (e.shiftKey) {
        parts.push('Shift');
    }
    
    // Handle special keys
    let key = '';
    switch (e.key) {
        case ' ':
            key = 'Space';
            break;
        case 'ArrowUp':
            key = 'Up';
            break;
        case 'ArrowDown':
            key = 'Down';
            break;
        case 'ArrowLeft':
            key = 'Left';
            break;
        case 'ArrowRight':
            key = 'Right';
            break;
        case 'Delete':
            key = 'Delete';
            break;
        case 'Backspace':
            key = 'Backspace';
            break;
        case 'Tab':
            key = 'Tab';
            break;
        case 'Enter':
            key = 'Enter';
            break;
        default:
            // For regular keys, use the key value but handle special cases
            if (e.key.startsWith('F') && e.key.length <= 3 && /^F\d+$/.test(e.key)) {
                // Function keys (F1, F2, etc.)
                key = e.key;
            } else if (e.key.length === 1) {
                // Single character keys - convert to uppercase for consistency
                key = e.key.toUpperCase();
            } else {
                // Other special keys
                key = e.key;
            }
            break;
    }
    
    // Don't capture just modifier keys alone
    if (!key || key === 'Control' || key === 'Alt' || key === 'Shift' || key === 'Meta') {
        return '';
    }
    
    parts.push(key);
    return parts.join('+');
}


function initializeSearchFunctionality() {
    const searchInput = document.getElementById('action-search') as HTMLInputElement;
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
        filterActions(searchTerm);
    });
}

function filterActions(searchTerm: string) {
    const actionItems = document.querySelectorAll('.action-item');

    actionItems.forEach(item => {
        const actionName = item.querySelector('.action-name')?.textContent?.toLowerCase() || '';
        const actionDescription = item.querySelector('.action-description')?.textContent?.toLowerCase() || '';
        
        const matches = actionName.includes(searchTerm) || actionDescription.includes(searchTerm);
        
        if (matches) {
            (item as HTMLElement).style.display = 'flex';
        } else {
            (item as HTMLElement).style.display = 'none';
        }
    });
}

// Synchronization functions
function loadKeymapFromYAML() {
    try {
        const yamlContent = inputTextarea.value.trim();
        if (!yamlContent) {
            currentKeymap = {};
            populateAllActions(); // Refresh the action list to show empty bindings
            return;
        }

        // Simple YAML parsing for keymaps section
        const lines = yamlContent.split('\n');
        let inKeymaps = false;
        const newKeymap: Record<string, string> = {};

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === 'keymaps:') {
                inKeymaps = true;
                continue;
            }
            
            if (inKeymaps) {
                if (trimmedLine === '' || !trimmedLine.startsWith(' ')) {
                    if (trimmedLine !== '' && !trimmedLine.startsWith('#')) {
                        inKeymaps = false;
                    }
                    continue;
                }
                
                const match = trimmedLine.match(/^\s*([^:]+):\s*(.+)$/);
                if (match) {
                    const actionId = match[1].trim();
                    const keyBinding = match[2].trim().replace(/^["']|["']$/g, '');
                    newKeymap[actionId] = keyBinding;
                }
            }
        }

        currentKeymap = newKeymap;
        populateAllActions(); // Refresh the action list to show updated bindings
    } catch (error) {
        console.error('Error parsing YAML:', error);
    }
}

function updateYAMLFromKeymap() {
    try {
        const yamlContent = inputTextarea.value.trim();
        let baseYaml = '';
        
        if (yamlContent) {
            // Extract everything before keymaps section
            const lines = yamlContent.split('\n');
            let beforeKeymaps: string[] = [];
            
            for (const line of lines) {
                if (line.trim() === 'keymaps:') {
                    break;
                }
                beforeKeymaps.push(line);
            }
            
            baseYaml = beforeKeymaps.join('\n');
            if (baseYaml && !baseYaml.endsWith('\n')) {
                baseYaml += '\n';
            }
        } else {
            baseYaml = `name: "My Custom Keymap"\ndescription: "Personal keymap configuration for cross-editor compatibility"\n`;
        }

        // Add keymaps section
        let newYaml = baseYaml + '\nkeymaps:\n';
        
        const keymapEntries = Object.entries(currentKeymap);
        if (keymapEntries.length > 0) {
            for (const [actionId, keyBinding] of keymapEntries) {
                if (keyBinding.trim()) {
                    newYaml += `  ${actionId}: ${keyBinding}\n`;
                }
            }
        }

        inputTextarea.value = newYaml;
    } catch (error) {
        console.error('Error updating YAML:', error);
    }
}

// Event listeners
modeToggle.addEventListener('change', switchMode);

// Main tab event listeners
mainTabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.mainTab;
        if (targetTab) {
            switchMainTab(targetTab);
        }
    });
});

loadExampleBtn.addEventListener('click', () => {
    inputTextarea.value = EXAMPLE_CONFIG;
    loadKeymapFromYAML(); // Sync with Rich UI
});

// Add YAML textarea change listener for synchronization
inputTextarea.addEventListener('input', () => {
    loadKeymapFromYAML();
});

// Automatic conversion function
async function performConversion() {
    const yamlInput = inputTextarea.value.trim();
    const selectedEditor = editorSelect.value;
    
    if (!yamlInput) {
        outputTextarea.value = 'No keymap configuration to convert. Please add some key bindings in the Input tab.';
        return;
    }
    
    try {
        const result = await convertKeymap(yamlInput, selectedEditor);
        
        currentContent = result.content;
        currentFilename = result.filename;
        
        outputTextarea.value = currentContent;
        
    } catch (error) {
        console.error('Conversion error:', error);
        outputTextarea.value = `Conversion failed: ${error instanceof Error ? error.message : String(error)}`;
    }
}

// Auto-convert when editor selection changes
editorSelect.addEventListener('change', performConversion);

downloadBtn.addEventListener('click', () => {
    if (!currentContent || !currentFilename) return;
    
    const blob = new Blob([currentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

copyBtn.addEventListener('click', async () => {
    if (!currentContent) return;
    
    try {
        await navigator.clipboard.writeText(currentContent);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        alert('Failed to copy to clipboard');
    }
});

// Actual conversion function using @keymapgen/core
async function convertKeymap(yamlInput: string, editorType: string) {
    try {
        // Create converter and convert
        const converter = new KeymapConverter();
        const result = await converter.convert(yamlInput, editorType as any);
        
        return {
            content: result.content,
            filename: result.filename
        };
    } catch (error) {
        throw new Error(`Conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeRichUI();
    switchMode(); // Set the correct initial mode based on toggle state
});